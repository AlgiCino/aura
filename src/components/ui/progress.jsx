import React from "react";
import { cn } from "../utils";

const Progress = React.forwardRef(({ className, value = 0, max = 100, ...props }, ref) => {
  // تأكد من أن القيمة بين 0 و max
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const percentage = (normalizedValue / max) * 100;

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-gray-200",
        className
      )}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out"
        style={{
          transform: `translateX(-${100 - percentage}%)`
        }}
      />
      <style>{`
        .bg-primary {
          background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
        }
      `}</style>
    </div>
  );
});

Progress.displayName = "Progress";

export { Progress };
