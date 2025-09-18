import { cn } from "../utils";

export function Switch({ checked = false, onCheckedChange, className = "", ...props }) {
  const toggle = () => onCheckedChange && onCheckedChange(!checked);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={toggle}
      className={cn(
        "inline-flex h-5 w-9 items-center rounded-full transition-colors",
        checked ? "bg-indigo-600" : "bg-gray-300",
        className
      )}
      {...props}
    >
      <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform", checked ? "translate-x-4" : "translate-x-1")} />
    </button>
  );
}

