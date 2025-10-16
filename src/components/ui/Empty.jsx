import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ title, description, actionLabel, onAction, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6", className)}>
      <div className="bg-gray-50 rounded-full p-6 mb-6">
        <ApperIcon name="MessageSquare" size={64} className="text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {title || "No posts yet"}
      </h3>
      <p className="text-gray-600 text-center mb-8 max-w-md text-lg">
        {description || "Be the first to share something interesting with the community!"}
      </p>
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 text-lg"
        >
          <ApperIcon name="Plus" size={20} />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;