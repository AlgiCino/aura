import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle, Database, Target, Clock, Sparkles } from 'lucide-react';
import { cn } from '../utils';

const AGENT_DETAILS = {
  aura_builder: {
    icon: Database,
    gradient: 'from-indigo-500 via-purple-500 to-indigo-600',
    lightGradient: 'from-indigo-100 via-purple-100 to-indigo-200',
    capabilities: [
      'Entity management & CRUD',
      'Data validation & audit',
      'Real-time updates',
      'Auto-sync features'
    ],
    bestFor: 'Data operations',
    shortDesc: 'Handles all your data needs',
    complexity: 'Fast',
    responseTime: '< 1s',
    badge: 'CRUD',
    useCase: 'Perfect for managing entities, projects, and data operations'
  },
  project_planner: {
    icon: Target,
    gradient: 'from-emerald-500 via-teal-500 to-emerald-600',
    lightGradient: 'from-emerald-100 via-teal-100 to-emerald-200',
    capabilities: [
      'Project lifecycle planning',
      'Sprint & phase coordination',
      'Timeline management',
      'Resource allocation'
    ],
    bestFor: 'Project planning',
    shortDesc: 'Plans and organizes projects',
    complexity: 'Advanced',
    responseTime: '2-3s',
    badge: 'PLAN',
    useCase: 'Ideal for complex project management and strategic planning'
  }
};

export default function AgentSelector({ value, onChange, agents }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const selectedAgent = agents.find(a => a.value === value) || agents[0];
  const agentDetails = AGENT_DETAILS[value] || {};

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(event) {
      if (!isOpen) {
        if (event.key === 'Enter' || event.key === ' ') {
          if (document.activeElement === dropdownRef.current?.querySelector('button')) {
            event.preventDefault();
            setIsOpen(true);
            setFocusedIndex(agents.findIndex(a => a.value === value));
          }
        }
        return;
      }

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
        case 'ArrowDown':
          event.preventDefault();
          setFocusedIndex(prev => (prev + 1) % agents.length);
          break;
        case 'ArrowUp':
          event.preventDefault();
          setFocusedIndex(prev => prev <= 0 ? agents.length - 1 : prev - 1);
          break;
        case 'Enter':
        case ' ':
          if (focusedIndex >= 0 && focusedIndex < agents.length) {
            event.preventDefault();
            onChange(agents[focusedIndex].value);
            setIsOpen(false);
            setFocusedIndex(-1);
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          const index = parseInt(event.key) - 1;
          if (index < agents.length) {
            event.preventDefault();
            onChange(agents[index].value);
            setIsOpen(false);
            setFocusedIndex(-1);
          }
          break;
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, focusedIndex, agents, value, onChange]);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={cn(
          "w-full relative overflow-hidden rounded-xl border transition-all duration-300",
          "bg-white/40 backdrop-blur-md border-white/50",
          "hover:bg-white/60 hover:border-white/70 hover:shadow-lg",
          "active:scale-[0.98] active:transition-transform active:duration-100",
          isOpen && "bg-white/60 border-white/70 shadow-lg"
        )}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background Glass Effect */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br transition-opacity duration-300",
          agentDetails.lightGradient || 'from-gray-100 to-gray-200',
          isHovered || isOpen ? "opacity-30" : "opacity-10"
        )} />
        
        {/* Content */}
        <div className="relative px-3 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {/* Agent Icon */}
              <motion.div 
                className={cn(
                  "w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0 shadow-sm",
                  agentDetails.gradient || 'from-gray-400 to-gray-600'
                )}
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {agentDetails.icon && <agentDetails.icon className="w-3.5 h-3.5 text-white" />}
              </motion.div>
              
              {/* Agent Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-gray-900 text-sm truncate">
                    {selectedAgent.label?.replace('(CRUD Agent)', '').replace('Aura Builder', 'Aura Builder')}
                  </span>
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded-md font-medium shrink-0",
                    agentDetails.badge === 'CRUD' ? "bg-indigo-100 text-indigo-700" :
                    agentDetails.badge === 'PLAN' ? "bg-emerald-100 text-emerald-700" :
                    "bg-gray-100 text-gray-700"
                  )}>
                    {agentDetails.badge || 'AI'}
                  </span>
                </div>
                <div className="text-xs text-gray-600 truncate mt-0.5">
                  {agentDetails.shortDesc || agentDetails.bestFor}
                </div>
              </div>
            </div>
            
            {/* Dropdown Arrow */}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 ml-2"
            >
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </motion.div>
          </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.3, damping: 25, stiffness: 300 }}
            className="absolute top-full left-0 right-0 mt-2 z-30 mx-0 sm:mx-0"
          >
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-xl shadow-xl overflow-hidden">
              <div className="p-1 sm:p-1.5 max-h-56 sm:max-h-64 overflow-y-auto space-y-0.5 sm:space-y-1">
                {agents.map((agent, index) => {
                  const details = AGENT_DETAILS[agent.value] || {};
                  const isSelected = agent.value === value;
                  
                  return (
                    <motion.button
                      key={agent.value}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.2 }}
                      onClick={() => {
                        onChange(agent.value);
                        setIsOpen(false);
                        setFocusedIndex(-1);
                      }}
                      onMouseEnter={() => setFocusedIndex(index)}
                      className={cn(
                        "w-full text-left p-2 sm:p-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                        "touch-manipulation focus:outline-none", // Better touch interactions on mobile
                        isSelected 
                          ? "bg-white/90 border border-white/80 shadow-sm" 
                          : "hover:bg-white/50 hover:shadow-sm active:bg-white/70",
                        focusedIndex === index && "ring-2 ring-indigo-300 bg-white/60"
                      )}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {/* Background gradient effect */}
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-r transition-opacity duration-300",
                        details.lightGradient || 'from-gray-100 to-gray-200',
                        isSelected ? "opacity-20" : "opacity-0 group-hover:opacity-10"
                      )} />
                      
                      <div className="relative flex items-center gap-2.5">
                        {/* Agent Icon */}
                        <div className={cn(
                          "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0 shadow-sm",
                          details.gradient || 'from-gray-400 to-gray-600'
                        )}>
                          {details.icon && <details.icon className="w-4 h-4 text-white" />}
                        </div>
                        
                        {/* Agent Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-medium text-gray-900 text-sm truncate">
                              {agent.label?.replace('(CRUD Agent)', '').replace('Aura Builder', 'Aura Builder')}
                            </span>
                            {isSelected && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                            <span className={cn(
                              "text-xs px-1.5 py-0.5 rounded-md font-medium shrink-0",
                              details.badge === 'CRUD' ? "bg-indigo-100 text-indigo-700" :
                              details.badge === 'PLAN' ? "bg-emerald-100 text-emerald-700" :
                              "bg-gray-100 text-gray-700"
                            )}>
                              {details.badge || 'AI'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1.5 truncate">
                            {details.useCase || agent.description}
                          </p>
                          
                          {/* Compact capabilities - responsive layout */}
                          <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
                            <div className="flex items-center gap-1 text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span className="hidden xs:inline">{details.responseTime}</span>
                              <span className="xs:hidden">{details.responseTime.replace('< ', '<')}</span>
                            </div>
                            <div className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></div>
                            <div className="text-gray-500 hidden sm:block">
                              {details.complexity}
                            </div>
                            <div className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></div>
                            <div className="text-gray-500 truncate">
                              {details.capabilities?.[0] || 'AI Assistant'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              
              {/* Footer with tip */}
              <div className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white/50 border-t border-white/40">
                <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span className="hidden sm:inline">Choose the right agent for optimal results</span>
                    <span className="sm:hidden">Pick the best agent</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
                    <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">↑↓</kbd>
                    <span>navigate</span>
                    <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">⏎</kbd>
                    <span>select</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
