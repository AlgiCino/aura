import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Database, Rocket, Zap } from 'lucide-react';

const COMMAND_CATEGORIES = {
  project_management: {
    icon: Rocket,
    label: 'Project Management',
    color: 'bg-blue-100 text-blue-700',
    commands: [
      { text: "Create a new project called 'Mobile App'", description: "Create a new project" },
      { text: "Show me all active projects", description: "List active projects" },
      { text: "Update project status to completed", description: "Change project status" },
      { text: "Add a new phase to the current project", description: "Create project phase" },
    ]
  },
  data_operations: {
    icon: Database,
    label: 'Data Operations',
    color: 'bg-green-100 text-green-700',
    commands: [
      { text: "Show me the latest tasks", description: "List recent tasks" },
      { text: "Create 5 sample tasks for testing", description: "Generate sample data" },
      { text: "Export all project data", description: "Export project information" },
      { text: "Delete completed tasks older than 30 days", description: "Clean up old data" },
    ]
  },
  analysis: {
    icon: Lightbulb,
    label: 'Analysis & Reports',
    color: 'bg-purple-100 text-purple-700',
    commands: [
      { text: "Analyze project progress and show insights", description: "Generate progress report" },
      { text: "Show task completion statistics", description: "Task analytics" },
      { text: "Compare project performance metrics", description: "Performance comparison" },
      { text: "Identify bottlenecks in current projects", description: "Bottleneck analysis" },
    ]
  },
  automation: {
    icon: Zap,
    label: 'Automation',
    color: 'bg-orange-100 text-orange-700',
    commands: [
      { text: "Set up automated task assignments", description: "Automate task distribution" },
      { text: "Create recurring project templates", description: "Template automation" },
      { text: "Schedule weekly progress reports", description: "Report automation" },
      { text: "Auto-organize tasks by priority", description: "Task organization" },
    ]
  }
};

export default function CommandSuggestions({ agent, onSelectCommand, inputValue, isVisible }) {
  const relevantCommands = useMemo(() => {
    if (!inputValue.trim()) return [];
    
    const searchTerm = inputValue.toLowerCase();
    const matches = [];
    
    Object.entries(COMMAND_CATEGORIES).forEach(([key, category]) => {
      category.commands.forEach(command => {
        if (command.text.toLowerCase().includes(searchTerm) || 
            command.description.toLowerCase().includes(searchTerm)) {
          matches.push({
            ...command,
            category: key,
            categoryInfo: category
          });
        }
      });
    });
    
    return matches.slice(0, 6); // أقصى 6 اقتراحات
  }, [inputValue]);

  const suggestedCommands = useMemo(() => {
    if (inputValue.trim()) return relevantCommands;
    
    // إذا لم يكن هناك إدخال، أظهر اقتراحات عامة بناءً على الوكيل
    const agentCommands = agent === 'aura_builder' ? 
      COMMAND_CATEGORIES.data_operations.commands.slice(0, 3) :
      COMMAND_CATEGORIES.project_management.commands.slice(0, 3);
    
    return agentCommands.map(cmd => ({
      ...cmd,
      category: agent === 'aura_builder' ? 'data_operations' : 'project_management',
      categoryInfo: agent === 'aura_builder' ? COMMAND_CATEGORIES.data_operations : COMMAND_CATEGORIES.project_management
    }));
  }, [inputValue, agent, relevantCommands]);

  if (!isVisible || suggestedCommands.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-white/60 rounded-xl shadow-lg backdrop-blur-xl z-10"
      >
        <div className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold text-gray-700">Command Suggestions</span>
          </div>
          <div className="space-y-1">
            {suggestedCommands.map((command, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectCommand(command.text)}
                className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start gap-2">
                  <command.categoryInfo.icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 group-hover:text-gray-900 truncate">
                      {command.text}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${command.categoryInfo.color}`}>
                        {command.categoryInfo.label}
                      </span>
                      <span className="text-xs text-gray-500">{command.description}</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}