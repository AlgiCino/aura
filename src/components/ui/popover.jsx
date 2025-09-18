import React, { useState, useRef, useEffect } from "react";
import { cn } from "../utils";

const PopoverContext = React.createContext();

const Popover = ({ children }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      {children}
    </PopoverContext.Provider>
  );
};

const PopoverTrigger = React.forwardRef(({ children, className, asChild = false, ...props }, ref) => {
  const { setOpen } = React.useContext(PopoverContext);
  const onClick = (e) => {
    props.onClick?.(e);
    setOpen(prev => !prev);
  };
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      onClick,
      className: cn(children.props.className, className),
      ...props,
    });
  }
  return (
    <button ref={ref} className={cn("cursor-pointer", className)} onClick={onClick} {...props}>
      {children}
    </button>
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = React.forwardRef(({ children, className, ...props }, ref) => {
  const { open, setOpen } = React.useContext(PopoverContext);
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
        "absolute z-50 w-72 rounded-md border bg-white p-4 text-gray-900 shadow-lg",
        "animate-in fade-in-0 zoom-in-95 duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };
