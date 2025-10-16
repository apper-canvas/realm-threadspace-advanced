import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <div className="bg-gray-50 rounded-full p-6 mb-6">
        <ApperIcon name="Search" size={64} className="text-gray-400" />
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
      
      <p className="text-lg text-gray-600 text-center mb-8 max-w-md">
        The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
      </p>
      
      <div className="flex gap-4">
        <Button onClick={() => navigate(-1)} variant="secondary">
          <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
          Go Back
        </Button>
        
        <Button onClick={() => navigate("/")}>
          <ApperIcon name="Home" size={16} className="mr-2" />
          Home Feed
        </Button>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500 mb-4">Popular sections:</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/popular")}
            className="text-primary hover:text-primary/80 font-medium"
          >
            Popular Posts
          </button>
          <button
            onClick={() => navigate("/communities")}
            className="text-primary hover:text-primary/80 font-medium"
          >
            Communities
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;