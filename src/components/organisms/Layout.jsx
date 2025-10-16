import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import CreatePostModal from "@/components/organisms/CreatePostModal";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Layout = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileSidebarOpen]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCreatePost = () => {
    setIsCreatePostOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} onCreatePost={handleCreatePost} />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="fixed left-0 top-16 bottom-0 z-50 lg:hidden transform transition-transform duration-200">
              <Sidebar 
                isMobile 
                onItemClick={() => setIsMobileSidebarOpen(false)}
                className="h-full shadow-xl"
              />
            </div>
          </>
        )}

        <main className="flex-1 min-h-[calc(100vh-73px)]">
          <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6">
            <Outlet context={{ searchQuery }} />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex flex-col items-center p-2"
          >
            <ApperIcon name="Menu" size={20} className="text-gray-600" />
            <span className="text-xs text-gray-600 mt-1">Menu</span>
          </button>
          <button
            onClick={handleCreatePost}
            className="flex flex-col items-center p-2"
          >
            <ApperIcon name="Plus" size={20} className="text-primary" />
            <span className="text-xs text-primary mt-1">Post</span>
          </button>
        </div>
      </div>

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
    </div>
  );
};

export default Layout;