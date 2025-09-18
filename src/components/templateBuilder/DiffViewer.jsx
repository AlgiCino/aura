
function safeStringify(obj) {
  try { return JSON.stringify(obj, null, 2); } catch { return String(obj); }
}

export default function DiffViewer({ current={}, incoming={} }) {
  const entityNames = Array.from(new Set([
    ...Object.keys(current?.entities || {}),
    ...Object.keys(incoming?.entities || {}),
  ])).sort();

  return (
    <div className="space-y-4">
      {entityNames.length === 0 ? (
        <div className="text-sm text-gray-600">No entities to compare.</div>
      ) : entityNames.map((name) => {
        const cur = current?.entities?.[name];
        const inc = incoming?.entities?.[name];
        const status = !cur && inc ? "added" : cur && !inc ? "removed" : "changed";
        const equal = cur && inc && safeStringify(cur) === safeStringify(inc);

        return (
          <div key={name} className="rounded-xl border-[0.5px] border-white/60 bg-white/50 backdrop-blur-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-gray-900">{name}</div>
              <span className={[
                "text-xs px-2 py-0.5 rounded-full border",
                status === "added" ? "bg-green-100 text-green-700 border-green-200" :
                status === "removed" ? "bg-rose-100 text-rose-700 border-rose-200" :
                equal ? "bg-gray-100 text-gray-700 border-gray-200" :
                "bg-amber-100 text-amber-700 border-amber-200"
              ].join(" ")}>
                {status === "changed" ? (equal ? "unchanged" : "changed") : status}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <pre className="bg-white/70 border border-white/70 rounded-lg p-3 text-[11px] text-gray-800 overflow-auto max-h-64">
                {safeStringify(cur) || "// missing"}
              </pre>
              <pre className="bg-white/70 border border-white/70 rounded-lg p-3 text-[11px] text-gray-800 overflow-auto max-h-64">
                {safeStringify(inc) || "// missing"}
              </pre>
            </div>
          </div>
        );
      })}
    </div>
  );
}