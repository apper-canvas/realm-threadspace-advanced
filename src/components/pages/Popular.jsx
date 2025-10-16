import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import PostFeed from "@/components/organisms/PostFeed";
import CreatePostModal from "@/components/organisms/CreatePostModal";

const Popular = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const { searchQuery } = useOutletContext() || { searchQuery: "" };

  const handleCreatePost = () => {
    setIsCreatePostOpen(true);
  };

  return (
    <div className="pb-20 lg:pb-6">
      <PostFeed 
        filter="popular"
        searchQuery={searchQuery}
        onCreatePost={handleCreatePost}
      />
      
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
    </div>
  );
};

export default Popular;