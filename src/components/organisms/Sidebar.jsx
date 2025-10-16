import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Communities from "@/components/pages/Communities";

const Sidebar = ({ className, isMobile = false, onItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

const navigationItems = [
    { path: "", label: "Home", icon: "Home" },
    { path: "popular", label: "Popular", icon: "TrendingUp" },
    { path: "saved", label: "Saved", icon: "Bookmark" },
    { path: "communities", label: "Communities", icon: "Users" },
    { path: "user/techEnthusiast", label: "Profile", icon: "User" }
  ];

  const handleNavigation = (path) => {
    navigate(`/${path}`);
    if (onItemClick) onItemClick();
  };

  const isActive = (path) => {
    if (path === "") {
      return location.pathname === "/";
    }
    return location.pathname === `/${path}`;
  };

  return (
    <aside className={cn(
      "bg-white border-r border-gray-200 h-full",
      isMobile ? "w-full" : "w-60",
      className
    )}>
      <div className="p-6">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg font-medium transition-all duration-200 group",
                isActive(item.path)
                  ? "bg-primary/10 text-primary border-l-4 border-primary"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent"
              )}
            >
              <ApperIcon 
                name={item.icon} 
                size={20} 
                className={cn(
                  "transition-colors duration-200",
                  isActive(item.path) ? "text-primary" : "text-gray-500 group-hover:text-gray-700"
                )} 
              />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="px-6 mt-8">
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Join Communities</h3>
          <p className="text-sm text-gray-600 mb-3">
            Discover and participate in discussions about your interests.
          </p>
          <button
            onClick={() => handleNavigation("communities")}
            className="w-full bg-primary text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors duration-200"
          >
            Explore Communities
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;