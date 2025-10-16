import { useState, useEffect } from "react";
import PostCard from "@/components/organisms/PostCard";
import SortSelector from "@/components/molecules/SortSelector";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { PostService } from "@/services/api/postService";
import { toast } from "react-toastify";

const PostFeed = ({ filter = "all", searchQuery = "", onCreatePost, communityName }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("hot");

  useEffect(() => {
    loadPosts();
  }, [filter, sortBy]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");
      
let fetchedPosts;
      if (filter === "popular") {
        fetchedPosts = await PostService.getPopular();
      } else if (filter && filter !== "all") {
        fetchedPosts = await PostService.getByCommunity(filter);
      } else {
        fetchedPosts = await PostService.getAll();
      }
      
      // Sort posts based on selected criteria
      const sortedPosts = sortPosts(fetchedPosts, sortBy);
      setPosts(sortedPosts);
    } catch (err) {
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sortPosts = (postsToSort, criteria) => {
    const sorted = [...postsToSort];
    
    switch (criteria) {
      case "new":
        return sorted.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      case "top":
        return sorted.sort((a, b) => b.score - a.score);
      case "hot":
      default:
        // Hot algorithm: considers both score and recency
        return sorted.sort((a, b) => {
          const aHotScore = calculateHotScore(a);
          const bHotScore = calculateHotScore(b);
          return bHotScore - aHotScore;
        });
    }
  };

  const calculateHotScore = (post) => {
    const now = new Date();
    const postTime = new Date(post.timestamp);
    const ageInHours = (now - postTime) / (1000 * 60 * 60);
    
    // Hot score: higher score and more recent posts get higher values
    return (post.score + 1) / Math.pow(ageInHours + 2, 1.8);
  };

  const handleVote = async (postId, voteValue) => {
    try {
      // Optimistic update
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const oldVote = post.userVote || 0;
            const newVote = oldVote === voteValue ? 0 : voteValue;
            const scoreDiff = newVote - oldVote;
            
            return {
              ...post,
              userVote: newVote,
              score: post.score + scoreDiff
            };
          }
          return post;
        })
      );

      await PostService.vote(postId, voteValue);
    } catch (err) {
      // Revert optimistic update on error
      await loadPosts();
      toast.error("Failed to register vote. Please try again.");
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  // Filter posts based on search query
const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.community.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  });

  if (loading) return <Loading />;
  
  if (error) return <Error message={error} onRetry={loadPosts} />;
  
  if (filteredPosts.length === 0) {
    if (searchQuery) {
      return (
        <Empty
          title="No posts found"
          description={`No posts match your search for "${searchQuery}". Try different keywords or browse all posts.`}
          actionLabel="Clear Search"
          onAction={() => window.location.reload()}
        />
      );
    }
    
    return (
      <Empty
        title="No posts yet"
        description="Be the first to share something interesting with the community!"
        actionLabel="Create First Post"
        onAction={onCreatePost}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
<h2 className="text-2xl font-bold text-gray-900 capitalize">
          {filter === "all" ? "Home Feed" : filter === "popular" ? "Popular" : `r/${filter}`}
          {searchQuery && (
            <span className="text-lg font-normal text-gray-600 ml-2">
              • Results for "{searchQuery}"
            </span>
          )}
        </h2>
        
        <SortSelector
          currentSort={sortBy}
          onSortChange={handleSortChange}
        />
      </div>

      <div className="space-y-4">
        {filteredPosts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onVote={handleVote}
          />
        ))}
      </div>
    </div>
  );
};

export default PostFeed;