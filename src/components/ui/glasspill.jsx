export function GlassPill({ children, className = "" }) {
  return (
    <span
      className={[
        "inline-block rounded-full border border-white/30 bg-white/20 backdrop-blur-md",
        "px-3 py-1 text-xs font-semibold text-neutral-800",
        "shadow-[0_4px_12px_rgba(0,0,0,0.08)]",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}