import { cn } from "@/utils/cn";

const Loading = ({ className }) => {
  return (
    <div className={cn("space-y-4", className)}>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 items-center">
              <div className="w-6 h-6 bg-gray-200 rounded skeleton-pulse"></div>
              <div className="w-8 h-4 bg-gray-200 rounded skeleton-pulse"></div>
              <div className="w-6 h-6 bg-gray-200 rounded skeleton-pulse"></div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded skeleton-pulse w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded skeleton-pulse"></div>
                <div className="h-4 bg-gray-200 rounded skeleton-pulse w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded skeleton-pulse w-4/5"></div>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="h-4 bg-gray-200 rounded skeleton-pulse w-20"></div>
                <div className="h-4 bg-gray-200 rounded skeleton-pulse w-24"></div>
                <div className="h-4 bg-gray-200 rounded skeleton-pulse w-16"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;