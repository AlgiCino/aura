import React from "react";
import { cn } from "../utils";

const buttonVariants = {
  variant: {
    default: "bg-indigo-600 text-white hover:bg-indigo-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "hover:bg-gray-100",
    link: "text-indigo-600 underline-offset-4 hover:underline",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
    icon: "h-10 w-10",
  },
};

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  asChild = false,
  children,
  ...props 
}, ref) => {
  const variantClass = buttonVariants.variant[variant] || buttonVariants.variant.default;
  const sizeClass = buttonVariants.size[size] || buttonVariants.size.default;
  const baseClass = cn(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
    "disabled:pointer-events-none disabled:opacity-50",
    variantClass,
    sizeClass,
    className
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref,
      className: cn(children.props.className, baseClass),
      ...props,
    });
  }
  return (
    <button className={baseClass} ref={ref} {...props}>
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
