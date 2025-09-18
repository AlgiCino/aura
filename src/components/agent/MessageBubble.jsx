import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { Copy, AlertCircle, Bot, Loader2 } from 'lucide-react';
import { cn } from "../utils";
import { useToast } from "@/components/ui/use-toast";
import FunctionDisplay from './FunctionDisplay';

function MarkdownBlock({ content, isError, onCopy }) {
  return (
    <div
      className={cn(
        'prose prose-sm max-w-none text-gray-800 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
        isError ? 'prose-red' : 'prose-slate'
      )}
    >
      <ReactMarkdown
        components={{
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="relative group/code my-2">
                <pre className="bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto text-xs leading-relaxed">
                  <code {...props}>{children}</code>
                </pre>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover/code:opacity-100 bg-slate-800 hover:bg-slate-700"
                  onClick={() => {
                    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                    onCopy?.();
                  }}
                >
                  <Copy className="h-3 w-3 text-slate-400" />
                </Button>
              </div>
            ) : (
              <code className="px-1 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-mono">
                {children}
              </code>
            );
          },
          a: ({ children, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className={cn('hover:underline', isError ? 'text-red-600' : 'text-indigo-600')}
            >
              {children}
            </a>
          ),
          p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="my-1 ml-4 list-disc space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="my-1 ml-4 list-decimal space-y-1">{children}</ol>,
          li: ({ children }) => <li className="my-0.5">{children}</li>,
          h1: ({ children }) => <h1 className="text-lg font-semibold my-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-semibold my-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-semibold my-2">{children}</h3>,
          blockquote: ({ children }) => (
            <blockquote
              className={cn(
                'border-l-2 pl-3 my-2',
                isError ? 'border-red-300 text-red-600' : 'border-slate-300 text-slate-600'
              )}
            >
              {children}
            </blockquote>
          ),
        }}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  );
}

export default function MessageBubble({ message }) {
    const { toast } = useToast();
    const isUser = message.role === 'user';
    const isTyping = message.isTyping;
    const isError = message.isError;
    
    // Typing indicator component
    if (isTyping) {
        return (
            <div className="flex gap-3 my-2 justify-start">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200">
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                </div>
                <div className="max-w-[90%]">
                    <div className="rounded-2xl px-4 py-2.5 bg-blue-50 border border-blue-200">
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                            <span>AI is thinking</span>
                            <div className="flex gap-1">
                                <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className={cn("flex gap-3 my-2", isUser ? "justify-end" : "justify-start")}>
            {!isUser && (
                <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border",
                    isError 
                        ? "bg-red-100 border-red-200" 
                        : "bg-slate-100 border-slate-200"
                )}>
                    {isError ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : (
                        <Bot className="h-4 w-4 text-slate-500" />
                    )}
                </div>
            )}
            <div className={cn("max-w-[90%]", isUser && "flex flex-col items-end")}>
                {message.content && (
                    <div className={cn(
                        "rounded-2xl px-4 py-2.5",
                        isUser ? "bg-slate-800 text-white" : 
                        isError ? "bg-red-50 border border-red-200" : 
                        "bg-white border border-slate-200"
                    )}>
                        {isUser ? (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        ) : (
                            <MarkdownBlock
                                content={message.content}
                                isError={isError}
                                onCopy={() => toast({ title: "Code copied!", duration: 2000 })}
                            />
                        )}
                    </div>
                )}
                
                {/* Model/Provider info for assistant messages */}
                {!isUser && (message.model || message.provider) && !isError && (
                    <div className="text-xs text-slate-500 mt-1 px-1">
                        {message.provider && message.model ? `${message.provider} • ${message.model}` : 
                         message.provider || message.model}
                    </div>
                )}
                
                {message.tool_calls?.length > 0 && (
                    <div className="space-y-1 w-full max-w-md">
                        {message.tool_calls.map((toolCall, idx) => (
                            <FunctionDisplay key={toolCall.id || idx} toolCall={toolCall} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
