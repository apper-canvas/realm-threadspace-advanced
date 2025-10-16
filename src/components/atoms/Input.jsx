import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  label,
error,
  errorMessage,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
<input
        type={type}
        className={cn(
          "flex w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && errorMessage && (
        <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;