import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = React.forwardRef(({ 
  className, 
  children,
  label,
  error,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            "flex w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm appearance-none pr-10",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;