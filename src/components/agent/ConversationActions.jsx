import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Download, Share2, Archive, Copy } from 'lucide-react';
import { cn } from '../utils';
import { useToast } from '@/components/ui/use-toast';

export default function ConversationActions({ conversation, onArchive }) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleExportConversation = async () => {
    try {
      const exportData = {
        name: conversation.metadata?.name || 'Conversation',
        agent: conversation.agent_name,
        created_at: conversation.created_date,
        updated_at: conversation.updated_date,
        messages: conversation.messages || []
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversation-${conversation.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Conversation exported",
        description: "The conversation has been downloaded as JSON file.",
        duration: 3000
      });
    } catch {
      toast({
        title: "Export failed",
        description: "There was an error exporting the conversation.",
        variant: "destructive",
        duration: 3000
      });
    }
    setIsOpen(false);
  };

  const handleShareConversation = async () => {
    try {
      const shareData = {
        title: conversation.metadata?.name || 'Agent Conversation',
        text: `Check out this conversation with ${conversation.agent_name}`,
        url: window.location.href
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Conversation link has been copied to clipboard.",
          duration: 3000
        });
      }
    } catch {
      // User cancelled or error occurred
    }
    setIsOpen(false);
  };

  const handleCopyMessages = () => {
    const messages = conversation.messages?.map(m => 
      `${m.role}: ${m.content}`
    ).join('\n\n') || '';
    navigator.clipboard.writeText(messages);
    toast({
      title: "Messages copied",
      description: "All messages have been copied to clipboard.",
      duration: 3000
    });
    setIsOpen(false);
  };

  const actions = [
    {
      icon: Download,
      label: 'Export Conversation',
      onClick: handleExportConversation,
      color: 'text-blue-600'
    },
    {
      icon: Share2,
      label: 'Share Conversation',
      onClick: handleShareConversation,
      color: 'text-green-600'
    },
    {
      icon: Copy,
      label: 'Copy Messages',
      onClick: handleCopyMessages,
      color: 'text-purple-600'
    },
    {
      icon: Archive,
      label: 'Archive',
      onClick: () => {
        onArchive && onArchive(conversation.id);
        setIsOpen(false);
      },
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-md hover:bg-gray-100 transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-gray-500" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={cn(
                "absolute z-20 bg-white border border-white/60 rounded-lg shadow-lg backdrop-blur-xl",
                // موبايل - قائمة أوسع وأوضح
                "w-56 right-0 top-full mt-1",
                // كمبيوتر - حجم طبيعي
                "md:w-48"
              )}
            >
              <div className="p-2">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={cn(
                      "w-full flex items-center gap-3 text-sm text-left transition-colors rounded-md",
                      // موبايل - أزرار أكبر للسهولة
                      "px-3 py-3",
                      // كمبيوتر - حجم عادي
                      "md:py-2",
                      "hover:bg-gray-50"
                    )}
                  >
                    <action.icon className={cn("w-4 h-4", action.color)} />
                    <span className="text-gray-700 font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
