import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message, onRetry, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-6", className)}>
      <div className="bg-red-50 rounded-full p-4 mb-4">
        <ApperIcon name="AlertCircle" size={48} className="text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message || "We encountered an error while loading your content. Please try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-all duration-200 flex items-center gap-2"
        >
          <ApperIcon name="RefreshCw" size={16} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;