import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";

const Header = ({ onCreatePost }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="MessageSquare" size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">ThreadSpace</h1>
          </div>
          
<div className="hidden md:block w-96">
            <SearchBar />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <ApperIcon name="Search" size={20} />
            </Button>
          </div>
          
          <Button onClick={onCreatePost} size="md" className="flex items-center gap-2">
            <ApperIcon name="Plus" size={16} />
            <span className="hidden sm:inline">Create Post</span>
          </Button>
        </div>
      </div>
      
<div className="md:hidden px-6 pb-4">
        <SearchBar />
      </div>
    </header>
);
};

export default Header;