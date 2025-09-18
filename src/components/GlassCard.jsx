export function GlassCard({ className = "", children, ...props }) {
  return (
    <div
      className={[
        // Unified Liquid Glass card
        "relative rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl",
        "shadow-[0_10px_30px_rgba(0,0,0,0.08)]",
        // inner highlight via before-layer
        "before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none",
        "before:bg-[radial-gradient(120%_80%_at_0%_0%,rgba(255,255,255,0.35),transparent_40%)]",
        className
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}