/**
 * AI Client - Unified interface for different AI providers
 * Supports OpenRouter, Ollama, LM Studio, and other OpenAI-compatible APIs
 * Features: Auto-detection, connection monitoring, performance tracking
 */

import { AI_PROVIDERS } from '../config/aiProviders.js';

const isCloudEnv = () =>
  typeof window !== 'undefined' &&
  (window.location.hostname.includes('replit') ||
   window.location.hostname.includes('repl.co'));

export async function detectLocalProviders({ enabled } = { enabled: false }) {
  if (!enabled || isCloudEnv()) return { ollama: false, lmstudio: false };
  try {
    const response = await fetch('http://127.0.0.1:11434/api/tags');
    return { ollama: response.ok, lmstudio: false };
  } catch {
    console.debug('Local provider not available, skipping check.');
    return { ollama: false, lmstudio: false };
  }
}

// Comprehensive global handler for expected localhost connection failures
if (typeof window !== 'undefined') {
  const originalHandler = window.onunhandledrejection;
  window.addEventListener('unhandledrejection', (event) => {
    // Suppress all expected localhost connection failures
    if (event.reason) {
      const stack = event.reason.stack || '';
      const message = event.reason.message || '';
      
      // Check if this is a localhost/AI provider related error
      if ((message === 'Failed to fetch' || message.includes('fetch')) && 
          (stack.includes('localhost') || 
           stack.includes('127.0.0.1') ||
           stack.includes('11434') ||
           stack.includes('1234') ||
           stack.includes('checkLocalProvider') ||
           stack.includes('detectLocalProviders') ||
           stack.includes('getOllamaModels') ||
           stack.includes('aiClient.js'))) {
        console.debug('Suppressed expected localhost connection failure:', message);
        event.preventDefault();
        return false;
      }
      
      // Also suppress AbortError from local provider checks
      if (message.includes('AbortError') || message.includes('aborted')) {
        console.debug('Suppressed abort error from local provider check:', message);
        event.preventDefault();
        return false;
      }
    }
    
    // Call original handler if exists for other errors
    if (originalHandler) {
      originalHandler.call(window, event);
    }
  });
}

class AIClientError extends Error {
  constructor(message, provider, status, response) {
    super(message);
    this.name = 'AIClientError';
    this.provider = provider;
    this.status = status;
    this.response = response;
  }
}

export class AIClient {
  constructor(options = {}) {
    this.provider = options.provider || import.meta.env.VITE_AI_PROVIDER || 'openrouter';
    this.model = options.model || import.meta.env.VITE_AI_MODEL || AI_PROVIDERS[this.provider]?.defaultModel;
    this.apiKey = options.apiKey || this.getApiKey();
    this.baseURL = options.baseURL || AI_PROVIDERS[this.provider]?.baseURL;
  }

  getApiKey() {
    const provider = this.provider;
    switch (provider) {
      case 'openrouter':
        return import.meta.env.VITE_OPENROUTER_API_KEY;
      case 'ollama':
        return import.meta.env.VITE_OLLAMA_API_KEY; // Usually not needed for Ollama
      case 'lmstudio':
        return import.meta.env.VITE_LMSTUDIO_API_KEY; // Usually not needed for LM Studio
      default:
        return null;
    }
  }

  async chat({ messages, model, temperature = 0.7, maxTokens = 1000, stream = false }) {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new AIClientError('Messages array is required and cannot be empty', this.provider);
    }

    const providerConfig = AI_PROVIDERS[this.provider];
    if (!providerConfig) {
      throw new AIClientError(`Unsupported provider: ${this.provider}`, this.provider);
    }

    const selectedModel = model || this.model || providerConfig.defaultModel;
    if (!selectedModel) {
      throw new AIClientError(`No model specified for provider: ${this.provider}`, this.provider);
    }

    const headers = {
      'Content-Type': 'application/json',
      ...providerConfig.headers,
    };

    // Add authorization header if API key is available
    if (this.apiKey && providerConfig.requiresAuth !== false) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const body = {
      model: selectedModel,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature,
      max_tokens: maxTokens,
      stream
    };

    // Add provider-specific parameters
    if (providerConfig.additionalParams) {
      Object.assign(body, providerConfig.additionalParams);
    }

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || errorData.message || errorMessage;
        } catch {
          // If we can't parse the error response, use the default message
        }
        throw new AIClientError(
          `Request failed: ${errorMessage}`,
          this.provider,
          response.status,
          response
        );
      }

      const data = await response.json();
      
      // Extract content from response
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new AIClientError(
          'Invalid response format: missing content',
          this.provider,
          200,
          data
        );
      }

      return {
        content,
        model: selectedModel,
        provider: this.provider,
        usage: data.usage,
        raw: data
      };

    } catch (error) {
      if (error instanceof AIClientError) {
        throw error;
      }

      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new AIClientError(
          `Network error: Unable to connect to ${this.provider}. Check your internet connection and provider URL.`,
          this.provider
        );
      }

      // Handle other errors
      throw new AIClientError(
        `Unexpected error: ${error.message}`,
        this.provider
      );
    }
  }

  // Convenience method for simple text completion
  async complete(prompt, options = {}) {
    const messages = [{ role: 'user', content: prompt }];
    return this.chat({ messages, ...options });
  }

  // Method to test connection with performance metrics
  testConnection() {
    const startTime = Date.now();
    return new Promise((resolve) => {
      try {
        this.complete('Hello! Please respond with "OK" to confirm the connection.')
          .then(result => {
            const responseTime = Date.now() - startTime;
            resolve({
              success: true,
              provider: this.provider,
              model: this.model,
              response: result.content,
              responseTime,
              timestamp: new Date().toISOString()
            });
          })
          .catch(error => {
            const responseTime = Date.now() - startTime;
            resolve({
              success: false,
              provider: this.provider,
              model: this.model,
              error: error.message,
              responseTime,
              timestamp: new Date().toISOString()
            });
          });
      } catch (error) {
        const responseTime = Date.now() - startTime;
        resolve({
          success: false,
          provider: this.provider,
          model: this.model,
          error: error.message,
          responseTime,
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  // Check if a local provider is available with bulletproof error handling
  static async checkLocalProvider(provider, baseURL) {
    try {
      const result = {
        available: false,
        error: 'Connection failed',
        provider,
        baseURL,
        models: []
      };

      // Use different endpoints for different providers
      let checkURL;
      if (provider === 'ollama') {
        checkURL = baseURL.replace('/v1/chat/completions', '/api/tags');
      } else {
        checkURL = `${baseURL.replace('/chat/completions', '')}/models`;
      }

      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout')), 3000);
      });

      // Create fetch promise with immediate error handling
      const fetchPromise = fetch(checkURL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }).catch(error => {
        // Immediately handle fetch errors to prevent escape
        console.debug(`Localhost AI provider check failed (expected):`, error.message);
        throw error;
      });

      try {
        // Race between fetch and timeout
        const response = await Promise.race([fetchPromise, timeoutPromise]);
        
        if (!response.ok) {
          result.error = `HTTP ${response.status}`;
          return result;
        }
        
        const data = await response.json();
        
        // Parse response based on provider
        let models = [];
        if (provider === 'ollama' && data && data.models) {
          models = data.models.map(model => ({
            id: model.name,
            name: model.name,
            description: `${model.details?.family || 'Unknown'} - ${AIClient.formatSize(model.size)}`,
            size: model.size
          }));
        } else if (data) {
          models = data.data || data.models || [];
        }
        
        return {
          available: true,
          models,
          provider,
          baseURL
        };
        
      } catch (error) {
        result.error = error.message || 'Connection failed';
        console.debug(`Localhost AI provider check failed (expected):`, result.error);
        return result;
      }
      
    } catch (error) {
      console.debug(`Provider check error for ${provider}:`, error.message);
      return {
        available: false,
        error: error.message || 'Unexpected error',
        provider,
        baseURL,
        models: []
      };
    }
  }

  // Check if we're in a cloud environment (like Replit)
  static isCloudEnvironment() {
    return isCloudEnv();
  }

  static async detectLocalProviders(options) {
    return detectLocalProviders(options);
  }

  // Get available models for Ollama specifically
  static getOllamaModels(baseURL = 'http://localhost:11434') {
    return new Promise((resolve) => {
      const result = {
        success: false,
        error: 'Connection failed',
        models: []
      };

      try {
        const timeoutId = setTimeout(() => {
          result.error = 'Connection timeout';
          resolve(result);
        }, 3000);

        const fetchPromise = fetch(`${baseURL}/api/tags`, {
          method: 'GET'
        });

        fetchPromise
          .then(response => {
            clearTimeout(timeoutId);
            if (!response.ok) {
              result.error = `HTTP ${response.status}`;
              resolve(result);
              return null;
            }
            return response.json();
          })
          .then(data => {
            if (data === null) return;
            
            resolve({
              success: true,
              models: (data.models || []).map(model => ({
                id: model.name,
                name: model.name,
                description: `${model.details?.family || 'Unknown'} - ${AIClient.formatSize(model.size)}`,
                contextLength: model.details?.parameter_size ? parseInt(model.details.parameter_size) * 1000 : 4096,
                pricing: { input: 0, output: 0 },
                family: model.details?.family,
                size: model.size,
                modified: model.modified_at
              })),
              error: null
            });
          })
          .catch(error => {
            clearTimeout(timeoutId);
            result.error = error.message || 'Fetch failed';
            console.debug('Ollama models fetch failed (expected):', result.error);
            resolve(result);
          });
        
        // Safety catch for escaping promises
        fetchPromise.catch(() => {});

      } catch (error) {
        result.error = error.message || 'Unexpected error';
        console.debug('GetOllamaModels error:', result.error);
        resolve(result);
      }
    });
  }

  // Helper to format model size
  static formatSize(bytes) {
    if (!bytes) return 'Unknown size';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Monitor connection status with periodic checks
  static createConnectionMonitor(providers = ['ollama', 'lmstudio'], interval = 30000) {
    const monitor = {
      status: new Map(),
      listeners: new Set(),
      intervalId: null,

      async check() {
        const detection = await detectLocalProviders({ enabled: true });

        providers.forEach((provider) => {
          const available = Boolean(detection[provider]);
          this.status.set(provider, {
            available,
            lastCheck: new Date().toISOString(),
            details: { provider, available },
          });
        });

        // Notify listeners
        this.listeners.forEach(callback => {
          try {
            callback(Object.fromEntries(this.status));
          } catch (error) {
            console.error('Connection monitor callback error:', error);
          }
        });
      },

      start() {
        this.check(); // Initial check
        this.intervalId = setInterval(() => this.check(), interval);
        return this;
      },

      stop() {
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = null;
        }
        return this;
      },

      subscribe(callback) {
        this.listeners.add(callback);
        // Send current status immediately
        if (this.status.size > 0) {
          callback(Object.fromEntries(this.status));
        }
        return () => this.listeners.delete(callback);
      },

      getStatus(provider) {
        return this.status.get(provider);
      },

      getAllStatus() {
        return Object.fromEntries(this.status);
      }
    };

    return monitor;
  }

  // Static method to create client with specific provider
  static create(provider, options = {}) {
    return new AIClient({ provider, ...options });
  }
}

// Export default instance
export const aiClient = new AIClient();

// Export specific provider clients for convenience
export const openRouterClient = AIClient.create('openrouter');
export const ollamaClient = AIClient.create('ollama');
export const lmStudioClient = AIClient.create('lmstudio');

// Export error class for error handling
export { AIClientError };

// Legacy compatibility function (matches existing openrouter.ts interface)
export async function openRouterChat(messages, model, opts = {}) {
  const client = new AIClient({
    provider: 'openrouter',
    model: model || 'openai/gpt-4o-mini',
    apiKey: opts.apiKey
  });
  
  const result = await client.chat({ messages });
  return result.content;
}
