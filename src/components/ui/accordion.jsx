import React, { useState, createContext, useContext } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../utils";

const AccordionContext = createContext();

const Accordion = React.forwardRef(({ type = "single", className, children, ...props }, ref) => {
  const [openItems, setOpenItems] = useState(new Set());
  
  const toggleItem = (value) => {
    if (type === "single") {
      // في الوضع المفرد، إما فتح عنصر واحد أو إغلاق الكل
      setOpenItems(prev => 
        prev.has(value) ? new Set() : new Set([value])
      );
    } else {
      // في الوضع المتعدد، يمكن فتح عدة عناصر
      setOpenItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(value)) {
          newSet.delete(value);
        } else {
          newSet.add(value);
        }
        return newSet;
      });
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
});

Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef(({ className, value, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("border-b border-gray-200", className)} {...props}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { value })
      )}
    </div>
  );
});

AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef(({ className, children, value, ...props }, ref) => {
  const { openItems, toggleItem } = useContext(AccordionContext);
  const isOpen = openItems.has(value);

  return (
    <button
      ref={ref}
      onClick={() => toggleItem(value)}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline text-left w-full",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown 
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200",
          isOpen && "rotate-180"
        )} 
      />
    </button>
  );
});

AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef(({ className, children, value, ...props }, ref) => {
  const { openItems } = useContext(AccordionContext);
  const isOpen = openItems.has(value);

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden text-sm transition-all",
        isOpen ? "animate-accordion-down" : "animate-accordion-up"
      )}
      style={{
        height: isOpen ? 'auto' : 0,
        opacity: isOpen ? 1 : 0
      }}
      {...props}
    >
      <div className={cn("pb-4 pt-0", className)}>
        {children}
      </div>
    </div>
  );
});

AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };