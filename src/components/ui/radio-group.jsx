import React from "react";
import { cn } from "../utils";

const RadioGroupContext = React.createContext({ value: "", onValueChange: () => {} });

export function RadioGroup({ value, onValueChange, className = "", children }) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </RadioGroupContext.Provider>
  );
}

export const RadioGroupItem = React.forwardRef(function RadioGroupItem(
  { id, value, className = "", ...props },
  ref
) {
  const ctx = React.useContext(RadioGroupContext);
  const checked = ctx.value === value;
  return (
    <input
      ref={ref}
      id={id}
      type="radio"
      value={value}
      checked={checked}
      onChange={() => ctx.onValueChange && ctx.onValueChange(value)}
      className={cn(
        "h-4 w-4 rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-500",
        className
      )}
      {...props}
    />
  );
});

