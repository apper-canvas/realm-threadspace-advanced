import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SortSelector = ({ currentSort, onSortChange, className }) => {
  const sortOptions = [
    { value: "hot", label: "Hot", icon: "TrendingUp" },
    { value: "new", label: "New", icon: "Clock" },
    { value: "top", label: "Top", icon: "Award" }
  ];

  return (
    <div className={cn("flex gap-1 bg-gray-100 p-1 rounded-lg", className)}>
      {sortOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onSortChange(option.value)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
            currentSort === option.value
              ? "bg-white text-primary shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          )}
        >
          <ApperIcon name={option.icon} size={14} />
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SortSelector;