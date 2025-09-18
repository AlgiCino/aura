import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../utils";

const SelectContext = React.createContext();

const Select = ({ value, onValueChange, children }) => {
  const [open, setOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || "");
  
  const handleValueChange = (newValue) => {
    setCurrentValue(newValue);
    if (onValueChange) onValueChange(newValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ open, setOpen, value: currentValue, onValueChange: handleValueChange }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(SelectContext);
  
  return (
    <button
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
      <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", open && "rotate-180")} />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({ placeholder }) => {
  const { value } = React.useContext(SelectContext);
  return <span>{value || placeholder}</span>;
};

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(SelectContext);
  const contentRef = useRef(null);
  const assignRef = React.useCallback((node) => {
    contentRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={assignRef}
      className={cn(
        "absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-white shadow-lg",
        "animate-in fade-in-0 zoom-in-95 duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => {
  const { onValueChange, value: currentValue } = React.useContext(SelectContext);
  const isSelected = currentValue === value;
  
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-pointer items-center rounded-sm py-2 px-3 text-sm outline-none",
        "hover:bg-gray-100 focus:bg-gray-100",
        isSelected && "bg-indigo-50 text-indigo-600",
        className
      )}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {isSelected && <Check className="mr-2 h-4 w-4" />}
      <span className={!isSelected ? "ml-6" : ""}>{children}</span>
    </div>
  );
});
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
