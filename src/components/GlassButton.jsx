
export function GlassButton({ 
  children, 
  variant = "neutral", 
  size = "md",
  className = "", 
  ...props 
}) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  // Revert to vibrant gradient variants with glow
  const variantClasses = {
    primary: [
      "bg-gradient-to-r from-indigo-500 to-purple-600",
      "text-white",
      "shadow-[0_8px_24px_rgba(99,102,241,0.35)]",
      "hover:shadow-[0_12px_28px_rgba(99,102,241,0.45)]"
    ].join(" "),
    success: [
      "bg-gradient-to-r from-emerald-500 to-teal-500",
      "text-white",
      "shadow-[0_8px_24px_rgba(16,185,129,0.35)]",
      "hover:shadow-[0_12px_28px_rgba(16,185,129,0.45)]"
    ].join(" "),
    danger: [
      "bg-gradient-to-r from-rose-500 to-orange-500",
      "text-white",
      "shadow-[0_8px_24px_rgba(244,63,94,0.35)]",
      "hover:shadow-[0_12px_28px_rgba(244,63,94,0.45)]"
    ].join(" "),
    neutral: [
      "bg-white/30 hover:bg-white/40",
      "text-neutral-900",
      "shadow-[0_6px_18px_rgba(0,0,0,0.10)]"
    ].join(" ")
  };

  return (
    <button
      className={[
        // Pill button spec
        "rounded-full border border-white/30 backdrop-blur-md",
        "font-medium transition", // text-neutral-900 moved to neutral variant, hover:shadow also moved to variants
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60",
        "relative overflow-hidden",
        "transition-transform hover:-translate-y-[1px] active:translate-y-0", // New subtle lift on hover
        sizeClasses[size],
        variantClasses[variant] || variantClasses.neutral,
        className
      ].join(" ")}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      {/* subtle inner edge highlight */}
      <span className="pointer-events-none absolute inset-0 rounded-full opacity-60 mix-blend-soft-light"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,.35)" }} />
      {/* shimmer */}
      <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity
                       bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,.35),transparent_70%)]
                       bg-[length:220%_100%] animate-[shimmer_6s_ease-in-out_infinite]" />
    </button>
  );
}
