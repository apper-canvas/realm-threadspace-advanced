import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md", 
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 shadow-sm",
    secondary: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-accent/50 shadow-sm",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray/50",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50 shadow-sm"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      ref={ref}
      className={cn(baseClasses, variants[variant], sizes[size], disabledClasses, className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;