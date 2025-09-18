// Agent SDK with AI integration
import { aiClient, AIClientError } from '../lib/aiClient.js';

let conversations = [];
let messageSubscriptions = new Map();

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export const agentSDK = {
  sendMessage: async (message) => {
    // Placeholder - real implementation will connect to AI services
    return {
      success: true,
      response: `Echo: ${message}`,
      timestamp: new Date().toISOString()
    };
  },

  getAvailableAgents: () => {
    return [
      {
        id: 'aura-builder',
        name: 'Aura Builder',
        description: 'Helps build and manage Aura applications',
        status: 'active'
      },
      {
        id: 'project-planner',
        name: 'Project Planner', 
        description: 'Plans and organizes project tasks and phases',
        status: 'active'
      }
    ];
  },

  getCurrentSession: () => {
    return {
      id: 'session-1',
      agent: 'aura-builder',
      startTime: new Date().toISOString(),
      messages: []
    };
  },

  listConversations: async ({ agent_name } = {}) => {
    // Filter by agent_name if provided
    return conversations.filter(conv => 
      !agent_name || conv.agent_name === agent_name
    );
  },

  createConversation: async ({ agent_name, metadata = {} }) => {
    const conversation = {
      id: generateId(),
      agent_name,
      metadata,
      messages: [],
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    };
    conversations.unshift(conversation);
    return conversation;
  },

  updateConversation: async (conversationId, updates) => {
    const index = conversations.findIndex(c => c.id === conversationId);
    if (index !== -1) {
      conversations[index] = {
        ...conversations[index],
        ...updates,
        updated_date: new Date().toISOString()
      };
      return conversations[index];
    }
    return null;
  },

  addMessage: async (conversation, messageData) => {
    if (!conversation) return null;
    
    const message = {
      id: generateId(),
      role: messageData.role || 'user',
      content: messageData.content || '',
      file_urls: messageData.file_urls || [],
      timestamp: new Date().toISOString(),
      tool_calls: messageData.tool_calls || []
    };

    // Find conversation and add message
    const convIndex = conversations.findIndex(c => c.id === conversation.id);
    if (convIndex === -1) return null;

    if (!conversations[convIndex].messages) {
      conversations[convIndex].messages = [];
    }
    conversations[convIndex].messages.push(message);
    conversations[convIndex].updated_date = new Date().toISOString();

    // Notify subscribers
    const subscribers = messageSubscriptions.get(conversation.id) || [];
    subscribers.forEach(callback => {
      callback(conversations[convIndex]);
    });

    // Generate AI response for user messages
    if (message.role === 'user') {
      try {
        // Add typing indicator
        const typingMessage = {
          id: generateId(),
          role: 'assistant',
          content: '',
          isTyping: true,
          timestamp: new Date().toISOString(),
          tool_calls: []
        };
        
        conversations[convIndex].messages.push(typingMessage);
        conversations[convIndex].updated_date = new Date().toISOString();
        subscribers.forEach(callback => {
          callback(conversations[convIndex]);
        });

        // Build conversation history for AI context
        const conversationHistory = conversations[convIndex].messages
          .filter(m => !m.isTyping)
          .map(m => ({
            role: m.role,
            content: m.content
          }))
          .slice(-10); // Keep last 10 messages for context

        // Get AI response
        const aiResponse = await aiClient.chat({
          messages: conversationHistory,
          temperature: 0.7,
          maxTokens: 1000
        });

        // Remove typing indicator
        const typingIndex = conversations[convIndex].messages.findIndex(m => m.isTyping);
        if (typingIndex !== -1) {
          conversations[convIndex].messages.splice(typingIndex, 1);
        }

        // Add actual AI response
        const response = {
          id: generateId(),
          role: 'assistant',
          content: aiResponse.content,
          timestamp: new Date().toISOString(),
          tool_calls: [],
          model: aiResponse.model,
          provider: aiResponse.provider
        };
        
        conversations[convIndex].messages.push(response);
        conversations[convIndex].updated_date = new Date().toISOString();
        
        // Notify subscribers
        subscribers.forEach(callback => {
          callback(conversations[convIndex]);
        });

      } catch (error) {
        console.error('AI Response Error:', error);

        // Remove typing indicator if it exists
        const typingIndex = conversations[convIndex].messages.findIndex(m => m.isTyping);
        if (typingIndex !== -1) {
          conversations[convIndex].messages.splice(typingIndex, 1);
        }

        // Add error message
        const errorResponse = {
          id: generateId(),
          role: 'assistant',
          content: error instanceof AIClientError 
            ? `Sorry, I encountered an error: ${error.message}` 
            : 'Sorry, I\'m having trouble connecting to the AI service. Please try again.',
          timestamp: new Date().toISOString(),
          tool_calls: [],
          isError: true
        };
        
        conversations[convIndex].messages.push(errorResponse);
        conversations[convIndex].updated_date = new Date().toISOString();
        
        // Notify subscribers
        subscribers.forEach(callback => {
          callback(conversations[convIndex]);
        });
      }
    }

    return message;
  },

  subscribeToConversation: (conversationId, callback) => {
    if (!messageSubscriptions.has(conversationId)) {
      messageSubscriptions.set(conversationId, []);
    }
    messageSubscriptions.get(conversationId).push(callback);

    // Return unsubscribe function
    return () => {
      const subscribers = messageSubscriptions.get(conversationId) || [];
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    };
  }
};