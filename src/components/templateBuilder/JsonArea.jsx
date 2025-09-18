
export default function JsonArea({ value, onChange, readOnly=false, minRows=12 }) {
  const pretty = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  return (
    <textarea
      className="w-full font-mono text-xs leading-5 p-3 rounded-xl bg-white/70 border border-white/70 outline-none focus:ring-2 focus:ring-indigo-200 min-h-[240px]"
      style={{ minHeight: `${minRows * 18}px` }}
      value={pretty}
      onChange={(e) => onChange && onChange(e.target.value)}
      readOnly={readOnly}
    />
  );
}