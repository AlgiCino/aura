
import { useMemo, useState } from "react";
import { Terminal, Loader2, Eye, EyeOff, Download, Trash2, Pause, Play } from "lucide-react";
import { cn } from "../utils";
import { motion, AnimatePresence } from 'framer-motion';

const getLineStyle = (line) => {
    if (line.includes("SYS")) return "text-cyan-400";
    if (line.includes("USER")) return "text-blue-400";
    if (line.includes("ASSISTANT")) return "text-green-400";
    if (line.includes(":: running") || line.includes(":: in_progress")) return "text-yellow-400";
    if (line.includes(":: failed") || line.includes(":: error")) return "text-red-400";
    if (line.includes(":: success") || line.includes(":: completed")) return "text-green-500";
    if (line.includes("tool_call")) return "text-purple-400";
    return "text-slate-300";
};

const getLineIcon = (line) => {
    if (line.includes(":: failed") || line.includes(":: error")) return "❌";
    if (line.includes(":: success") || line.includes(":: completed")) return "✅";
    if (line.includes(":: running") || line.includes(":: in_progress")) return "⏳";
    if (line.includes("tool_call")) return "🔧";
    if (line.includes("USER")) return "👤";
    if (line.includes("ASSISTANT")) return "🤖";
    if (line.includes("SYS")) return "⚙️";
    return "•";
};

export default function TerminalPanel({ conversation, uploading, sending }) {
    const [isPaused, setIsPaused] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [filter, setFilter] = useState('all'); // all, errors, success, tools

    const messages = useMemo(() => {
        return Array.isArray(conversation?.messages) ? conversation.messages : [];
    }, [conversation?.messages]);

    const lines = useMemo(() => {
        if (isPaused) return [];

        const out = [];
        for (const m of messages) {
            const ts = new Date(m.updated_date || m.created_date || Date.now()).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            });
            const role = (m.role || "").toUpperCase();
            const text = (m.content || "").split("\n")[0]?.slice(0, 120) || (m.tool_calls?.length ? "Executing tools..." : "...");
            
            if (m.role) {
                const line = `[${ts}] ${role.padEnd(9)} > ${text}`;
                out.push(line);
            }

            const toolCalls = Array.isArray(m.tool_calls) ? m.tool_calls : [];
            for (const t of toolCalls) {
                const name = t?.name || "tool";
                const status = (t?.status || "pending").toLowerCase();
                const line = `  └─ [tool_call] :: ${name} :: ${status}`;
                out.push(line);
            }
        }
        
        if (uploading) out.push(`[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}] SYS         > Uploading files...`);
        if (sending && !uploading) out.push(`[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}] SYS         > Sending message...`);
        
        return out.slice(-200);
    }, [messages, uploading, sending, isPaused]);

    const filteredLines = useMemo(() => {
        if (filter === 'all') return lines;
        if (filter === 'errors') return lines.filter(line => line.includes('failed') || line.includes('error'));
        if (filter === 'success') return lines.filter(line => line.includes('success') || line.includes('completed'));
        if (filter === 'tools') return lines.filter(line => line.includes('tool_call'));
        return lines;
    }, [lines, filter]);

    const handleExportLogs = () => {
        const logData = lines.join('\n');
        const blob = new Blob([logData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `terminal-logs-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleClearLogs = () => {
        // في هذا السياق، لا يمكننا فعلاً مسح الرسائل، لكن يمكننا إعادة تعيين العرض
        setFilter('all');
    };

    return (
        <div className="rounded-xl border border-white/60 bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 overflow-hidden flex flex-col h-full">
            <div className="px-3 py-2 border-b border-white/20 flex items-center justify-between bg-slate-800/50">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
                        <Terminal className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                    <div className="text-xs font-semibold tracking-wide">Agent Terminal</div>
                    {(uploading || sending) && (
                        <div className="inline-flex items-center gap-1 text-[11px] text-cyan-400">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            live
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {/* Filter buttons */}
                    <div className="flex items-center gap-0.5 mr-2">
                        {[
                            { key: 'all', label: 'All', color: 'text-slate-400' },
                            { key: 'errors', label: 'Errors', color: 'text-red-400' },
                            { key: 'success', label: 'Success', color: 'text-green-400' },
                            { key: 'tools', label: 'Tools', color: 'text-purple-400' }
                        ].map(f => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded transition-colors",
                                    filter === f.key 
                                        ? "bg-white/20 text-white" 
                                        : `${f.color} hover:bg-white/10`
                                )}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                    
                    <button
                        onClick={() => setIsPaused(!isPaused)}
                        className="p-1 rounded hover:bg-white/10 transition-colors"
                        title={isPaused ? 'Resume' : 'Pause'}
                    >
                        {isPaused ? <Play className="w-3 h-3 text-slate-400" /> : <Pause className="w-3 h-3 text-slate-400" />}
                    </button>
                    
                    <button
                        onClick={handleExportLogs}
                        className="p-1 rounded hover:bg-white/10 transition-colors"
                        title="Export logs"
                    >
                        <Download className="w-3 h-3 text-slate-400" />
                    </button>
                    
                    <button
                        onClick={handleClearLogs}
                        className="p-1 rounded hover:bg-white/10 transition-colors"
                        title="Clear view"
                    >
                        <Trash2 className="w-3 h-3 text-slate-400" />
                    </button>
                    
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1 rounded hover:bg-white/10 transition-colors"
                        title={isCollapsed ? 'Expand' : 'Collapse'}
                    >
                        {isCollapsed ? <Eye className="w-3 h-3 text-slate-400" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
                    </button>
                </div>
            </div>
            
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex-1 overflow-hidden"
                    >
                        <div className="h-full p-3 text-xs leading-relaxed font-mono overflow-auto">
                            {isPaused ? (
                                <div className="flex items-center justify-center h-full text-slate-500">
                                    <div className="text-center">
                                        <Pause className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                                        <div>Terminal Paused</div>
                                        <div className="text-[10px] mt-1">Click play to resume</div>
                                    </div>
                                </div>
                            ) : filteredLines.length ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-0.5"
                                >
                                    {filteredLines.map((line, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.01 }}
                                            className={cn("whitespace-pre-wrap flex items-start gap-2", getLineStyle(line))}
                                        >
                                            <span className="text-slate-500 select-none">{getLineIcon(line)}</span>
                                            <span className="flex-1">{line}</span>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-500">
                                    <div className="text-center">
                                        <Terminal className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                                        <div>No {filter !== 'all' ? filter : ''} logs to display</div>
                                        <div className="text-[10px] mt-1">
                                            {filter !== 'all' ? 'Try changing the filter' : 'Waiting for agent activity...'}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
