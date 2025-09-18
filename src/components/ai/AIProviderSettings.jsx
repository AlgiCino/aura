import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  WifiOff, 
  Cloud, 
  Monitor, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronRight,
  Play,
  Copy
} from 'lucide-react';
import { cn } from '../utils';
import { GlassCard } from '../GlassCard';
import { GlassButton } from '../GlassButton';
import { 
  AI_PROVIDERS,
  getLocalProviders,
  getCloudProviders,
  getModelCategories,
  getRecommendedModels,
  getSetupInstructions,
  isLocalProvider
} from '../../config/aiProviders';
import { AIClient, detectLocalProviders } from '../../lib/aiClient';
import { useToast } from '../ui/use-toast';

const CONNECTION_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  CHECKING: 'checking',
  ERROR: 'error'
};

const PROVIDER_ICONS = {
  openrouter: Cloud,
  ollama: Monitor,
  lmstudio: Monitor,
  openai: Cloud
};

const STATUS_COLORS = {
  [CONNECTION_STATUS.CONNECTED]: 'text-green-500',
  [CONNECTION_STATUS.DISCONNECTED]: 'text-red-500',
  [CONNECTION_STATUS.CHECKING]: 'text-yellow-500',
  [CONNECTION_STATUS.ERROR]: 'text-red-500'
};

const STATUS_ICONS = {
  [CONNECTION_STATUS.CONNECTED]: CheckCircle,
  [CONNECTION_STATUS.DISCONNECTED]: XCircle,
  [CONNECTION_STATUS.CHECKING]: RefreshCw,
  [CONNECTION_STATUS.ERROR]: AlertTriangle
};

export default function AIProviderSettings({ 
  isOpen, 
  onClose, 
  currentProvider, 
  currentModel, 
  onProviderChange,
  onModelChange 
}) {
  const [activeProvider, setActiveProvider] = useState(currentProvider);
  const [activeModel, setActiveModel] = useState(currentModel);
  const [connectionStatus, setConnectionStatus] = useState(new Map());
  const [expandedSections, setExpandedSections] = useState(new Set(['providers']));
  const performanceData = useMemo(() => new Map(), []);
  const { toast } = useToast();

  const localProviders = getLocalProviders();
  const cloudProviders = getCloudProviders();
  const activeProviderEnvKey = activeProvider
    ? import.meta.env[`VITE_${activeProvider.toUpperCase()}_API_KEY`]
    : undefined;

  // Initialize with OpenRouter as default in cloud environment
  useEffect(() => {
    // Set OpenRouter as default provider in cloud environments
    if (AIClient.isCloudEnvironment() && !activeProvider) {
      setActiveProvider('openrouter');
      if (!activeModel) {
        setActiveModel('mistralai/mistral-tiny');
      }
    }
  }, [activeProvider, activeModel]);

  useEffect(() => {
    if (!activeProvider || !isLocalProvider(activeProvider)) return;
    let cancelled = false;

    setConnectionStatus(prev => {
      const next = new Map(prev);
      next.set(activeProvider, {
        ...(prev.get(activeProvider) || {}),
        status: CONNECTION_STATUS.CHECKING,
      });
      return next;
    });

    detectLocalProviders({ enabled: true }).then((result) => {
      if (cancelled) return;
      const available = Boolean(result[activeProvider]);
      setConnectionStatus(prev => new Map(prev).set(activeProvider, {
        status: available ? CONNECTION_STATUS.CONNECTED : CONNECTION_STATUS.DISCONNECTED,
        lastCheck: new Date().toISOString(),
        error: available ? null : 'Local provider not available',
      }));
    });

    return () => {
      cancelled = true;
    };
  }, [activeProvider]);

  const testLocalProvider = useCallback(async (provider) => {
    // Only allow manual testing of local providers
    if (AIClient.isCloudEnvironment()) {
      toast({
        title: 'Local providers not available',
        description: 'Local AI providers are not available in cloud environments like Replit.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const result = await AIClient.checkLocalProvider(provider, AI_PROVIDERS[provider].baseURL);
      
      setConnectionStatus(prev => new Map(prev).set(provider, {
        status: result.available ? CONNECTION_STATUS.CONNECTED : CONNECTION_STATUS.DISCONNECTED,
        lastCheck: new Date().toISOString(),
        error: result.error,
        models: result.models || []
      }));

      toast({
        title: result.available ? 'Connected successfully' : 'Connection failed',
        description: result.available ? `${provider} is available` : result.error,
        variant: result.available ? 'default' : 'destructive'
      });
    } catch (error) {
      toast({
        title: 'Connection failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  }, [toast]);

  const toggleSection = (section) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const applySettings = () => {
    onProviderChange(activeProvider);
    onModelChange(activeModel);
    toast({
      title: 'Settings applied',
      description: `Now using ${AI_PROVIDERS[activeProvider]?.name} with ${activeModel}`,
    });
    onClose();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard', duration: 2000 });
  };

  const ProviderCard = ({ provider, config }) => {
    const Icon = PROVIDER_ICONS[provider] || Monitor;
    const status = connectionStatus.get(provider);
    const StatusIcon = STATUS_ICONS[status?.status] || WifiOff;
    const isLocal = isLocalProvider(provider);
    const isActive = activeProvider === provider;
    const performance = performanceData.get(provider);

    return (
      <motion.div
        layout
        className={cn(
          "relative p-4 rounded-xl border transition-all duration-200 cursor-pointer",
          isActive 
            ? "bg-white/80 border-indigo-200 shadow-lg" 
            : "bg-white/50 border-white/60 hover:bg-white/70"
        )}
        onClick={() => setActiveProvider(provider)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              isLocal ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{config.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <StatusIcon className={cn("w-4 h-4", STATUS_COLORS[status?.status] || 'text-gray-400')} />
                {status?.status === CONNECTION_STATUS.CHECKING && (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                )}
                <span>
                  {status?.status === CONNECTION_STATUS.CONNECTED && 'Connected'}
                  {status?.status === CONNECTION_STATUS.DISCONNECTED && 'Disconnected'}
                  {status?.status === CONNECTION_STATUS.CHECKING && 'Checking...'}
                  {status?.status === CONNECTION_STATUS.ERROR && 'Error'}
                  {!status && 'Unknown'}
                </span>
                {performance?.responseTime && (
                  <span className="text-xs text-gray-500">
                    ({performance.responseTime}ms)
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLocal && (
              <GlassButton
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  testLocalProvider(provider);
                }}
                disabled={status?.status === CONNECTION_STATUS.CHECKING}
              >
                {status?.status === CONNECTION_STATUS.CHECKING ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </GlassButton>
            )}
          </div>
        </div>

        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <ModelSelector 
              provider={provider} 
              selectedModel={activeModel}
              onModelSelect={setActiveModel}
            />
          </motion.div>
        )}
      </motion.div>
    );
  };

  const ModelSelector = ({ provider, selectedModel, onModelSelect }) => {
    const categories = getModelCategories(provider);
    const recommended = getRecommendedModels(provider);
    return (
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Select Model</h4>
        
        {/* Show recommended models first */}
        {recommended.length > 0 && (
          <div>
            <h5 className="text-xs font-medium text-gray-600 mb-2">Recommended</h5>
            <div className="grid grid-cols-1 gap-2">
              {recommended.map(model => (
                <ModelOption
                  key={model.id}
                  model={model}
                  isSelected={selectedModel === model.id}
                  onSelect={() => onModelSelect(model.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Show models by category */}
        {categories.map(category => (
          <div key={category.id}>
            <button
              onClick={() => toggleSection(`category-${category.id}`)}
              className="flex items-center justify-between w-full text-left"
            >
              <h5 className="text-xs font-medium text-gray-600">
                {category.name} ({category.count})
              </h5>
              {expandedSections.has(`category-${category.id}`) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            
            <AnimatePresence>
              {expandedSections.has(`category-${category.id}`) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 space-y-2"
                >
                  {category.models.filter(m => !recommended.find(r => r.id === m.id)).map(model => (
                    <ModelOption
                      key={model.id}
                      model={model}
                      isSelected={selectedModel === model.id}
                      onSelect={() => onModelSelect(model.id)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    );
  };

  const ModelOption = ({ model, isSelected, onSelect }) => (
    <motion.button
      onClick={onSelect}
      className={cn(
        "w-full text-left p-3 rounded-lg border transition-all",
        isSelected 
          ? "bg-indigo-50 border-indigo-200 text-indigo-900" 
          : "bg-white/70 border-gray-200 hover:bg-white/90"
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h6 className="font-medium">{model.name}</h6>
          <p className="text-sm text-gray-600">{model.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
            <span>Context: {model.contextLength?.toLocaleString()}</span>
            {model.pricing?.input === 0 ? (
              <span className="text-green-600 font-medium">Free</span>
            ) : (
              <span>${model.pricing?.input}/M tokens</span>
            )}
          </div>
        </div>
        {model.recommended && (
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
            Recommended
          </span>
        )}
      </div>
    </motion.button>
  );

  const SetupInstructions = ({ provider }) => {
    const instructions = getSetupInstructions(provider);
    if (!instructions || Object.keys(instructions).length === 0) return null;

    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h5 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
          <Info className="w-4 h-4" />
          Setup Instructions
        </h5>
        <div className="space-y-2 text-sm">
          {Object.entries(instructions).map(([step, command]) => (
            <div key={step} className="flex items-center justify-between">
              <span className="text-blue-800">
                <strong>{step}:</strong> {command}
              </span>
              <GlassButton
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(command)}
              >
                <Copy className="w-3 h-3" />
              </GlassButton>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <GlassCard className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">AI Provider Settings</h2>
                <p className="text-sm text-gray-600">Configure your AI providers and models</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GlassButton variant="ghost" onClick={onClose}>
                ×
              </GlassButton>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Cloud Providers - Primary Option */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-blue-600" />
                  Cloud AI Providers (Recommended)
                </h3>
                <div className="grid gap-4">
                  {cloudProviders.map(provider => (
                    <ProviderCard 
                      key={provider.id}
                      provider={provider.id}
                      config={provider}
                    />
                  ))}
                </div>
                {activeProvider && !isLocalProvider(activeProvider) && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      API Key Setup
                    </h5>
                    <p className="text-sm text-blue-800 mb-3">
                      Add your API key to environment variables to get started.
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-blue-100 px-2 py-1 rounded font-mono">
                        VITE_{activeProvider.toUpperCase()}_API_KEY
                      </code>
                      <GlassButton
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(`VITE_${activeProvider.toUpperCase()}_API_KEY`)}
                      >
                        <Copy className="w-3 h-3" />
                      </GlassButton>
                      {!activeProviderEnvKey && activeProvider === 'openrouter' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                          <AlertTriangle className="h-3 w-3" />
                          أضف المفتاح لاحقًا
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Local Providers - Manual Setup Only */}
              {!AIClient.isCloudEnvironment() && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-green-600" />
                    Local Providers (Free)
                  </h3>
                  <div className="grid gap-4">
                    {localProviders.map(provider => (
                      <ProviderCard 
                        key={provider.id}
                        provider={provider.id}
                        config={provider}
                      />
                    ))}
                  </div>
                  {activeProvider && isLocalProvider(activeProvider) && (
                    <SetupInstructions provider={activeProvider} />
                  )}
                </div>
              )}
              
              {/* Cloud Environment Notice */}
              {AIClient.isCloudEnvironment() && (
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Local Providers
                  </h5>
                  <p className="text-sm text-gray-600">
                    Local AI providers (Ollama, LM Studio) are not available in cloud environments like Replit. 
                    Use cloud providers like OpenRouter for the best experience.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-white/20">
            <div className="text-sm text-gray-600">
              Current: <strong>{AI_PROVIDERS[currentProvider]?.name}</strong> - {currentModel}
            </div>
            <div className="flex items-center gap-3">
              <GlassButton variant="ghost" onClick={onClose}>
                Cancel
              </GlassButton>
              <GlassButton
                onClick={applySettings}
                disabled={!activeProvider || !activeModel}
              >
                Apply Settings
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
