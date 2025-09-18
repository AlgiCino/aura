import { cn } from "../utils";

export function Checkbox({ id, checked = false, onCheckedChange, className = "", ...props }) {
  return (
    <input
      id={id}
      type="checkbox"
      checked={!!checked}
      onChange={(e) => onCheckedChange ? onCheckedChange(e.target.checked) : undefined}
      className={cn(
        "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500",
        className
      )}
      {...props}
    />
  );
}

