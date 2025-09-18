import { createContext, useContext, useState } from "react";

const SidebarCtx = createContext({ open: true, toggle: () => {} });

export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(true);
  const toggle = () => setOpen((v) => !v);
  return (
    <SidebarCtx.Provider value={{ open, toggle }}>{children}</SidebarCtx.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarCtx);
}

export function Sidebar({ className = "", children }) {
  return (
    <aside className={`w-64 h-full overflow-hidden overflow-y-auto ${className}`}>
      {children}
    </aside>
  );
}

export function SidebarHeader({ className = "", children }) {
  return <div className={`shrink-0 ${className}`}>{children}</div>;
}

export function SidebarFooter({ className = "", children }) {
  return <div className={`mt-auto ${className}`}>{children}</div>;
}

export function SidebarContent({ className = "", children }) {
  return <div className={`flex-1 min-h-0 ${className}`}>{children}</div>;
}

export function SidebarGroup({ className = "", children }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function SidebarGroupLabel({ className = "", children }) {
  return <div className={`text-xs uppercase text-gray-500 ${className}`}>{children}</div>;
}

export function SidebarGroupContent({ className = "", children }) {
  return <div className={`${className}`}>{children}</div>;
}

export function SidebarMenu({ className = "", children }) {
  return <ul className={`list-none m-0 p-0 ${className}`}>{children}</ul>;
}

export function SidebarMenuItem({ className = "", children }) {
  return <li className={`${className}`}>{children}</li>;
}

// asChild is ignored; we simply render children
export function SidebarMenuButton({ className = "", children }) {
  return <div className={`${className}`}>{children}</div>;
}

export function SidebarTrigger({ className = "", children }) {
  const { toggle } = useSidebar();
  return (
    <button type="button" className={className} onClick={toggle}>
      {children || <span>☰</span>}
    </button>
  );
}
