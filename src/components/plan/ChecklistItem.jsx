import { CheckCircle2, Circle } from "lucide-react";

export default function ChecklistItem({ done = false, children }) {
  return (
    <div className="flex items-start gap-2.5 py-1">
      {done ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" /> : <Circle className="w-4 h-4 text-slate-400 mt-0.5" />}
      <div className={`text-sm ${done ? "text-slate-700" : "text-slate-600"}`}>{children}</div>
    </div>
  );
}