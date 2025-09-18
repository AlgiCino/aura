import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { cn } from "../utils";

const Ctx = createContext({ open: false, setOpen: () => {} });

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false);
  return <Ctx.Provider value={{ open, setOpen }}>{children}</Ctx.Provider>;
}

export const DropdownMenuTrigger = ({ asChild, children, className = "", ...props }) => {
  const { setOpen } = useContext(Ctx);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => { children.props?.onClick?.(e); setOpen((v) => !v); },
      className: cn(children.props?.className, className),
      ...props,
    });
  }
  return (
    <button className={className} onClick={() => setOpen((v) => !v)} {...props}>
      {children}
    </button>
  );
};

export function DropdownMenuContent({ align = "end", className = "", children, ...props }) {
  const { open, setOpen } = useContext(Ctx);
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    if (open) {
      document.addEventListener('mousedown', onDoc);
      return () => document.removeEventListener('mousedown', onDoc);
    }
  }, [open, setOpen]);
  if (!open) return null;
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-2 min-w-[12rem] rounded-md border bg-white p-1 text-gray-900 shadow-lg",
        align === 'end' ? 'right-0' : 'left-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({ className = "", children }) {
  return <div className={cn("px-2 py-1.5 text-sm font-semibold", className)}>{children}</div>;
}

export function DropdownMenuSeparator({ className = "" }) {
  return <div className={cn("my-1 h-px bg-gray-100", className)} />;
}

