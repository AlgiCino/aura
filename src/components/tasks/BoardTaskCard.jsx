import { GripVertical, Clock } from "lucide-react";

export default function BoardTaskCard({ task }) {
  return (
    <div className="rounded-xl bg-white/60 backdrop-blur-xl border-[0.5px] border-white/60 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.8),0_6px_18px_rgba(0,0,0,.06)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_10px_24px_rgba(0,0,0,.10)] transition-all duration-200">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-gray-900">{task.title}</h4>
        <GripVertical className="w-4 h-4 text-gray-400 shrink-0" />
      </div>
      {task.description && (
        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
          {task.description}
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-2">
        {task.category && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/70 border border-white/70 text-gray-700">
            {task.category}
          </span>
        )}
        {task.estimated_hours ? (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/70 border border-white/70 text-gray-700 inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {task.estimated_hours}h
          </span>
        ) : null}
      </div>
    </div>
  );
}