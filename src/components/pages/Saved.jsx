import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostService } from '@/services/api/postService';
import PostCard from '@/components/organisms/PostCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

function Saved() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSavedPosts();
  }, []);

  async function loadSavedPosts() {
    try {
      setLoading(true);
      setError(null);
      const savedPosts = await PostService.getSaved();
      setPosts(savedPosts);
    } catch (err) {
      console.error('Error loading saved posts:', err);
      setError('Failed to load saved posts. Please try again.');
      toast.error('Failed to load saved posts');
    } finally {
      setLoading(false);
    }
  }

  async function handleVote(postId, voteValue) {
    try {
      const updatedPost = await PostService.vote(postId, voteValue);
      if (updatedPost) {
        setPosts(prev => prev.map(post => 
          post.id === postId ? updatedPost : post
        ));
      }
    } catch (err) {
      console.error('Error voting on post:', err);
      toast.error('Failed to vote on post');
    }
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadSavedPosts} />;
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ApperIcon name="Bookmark" size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No saved posts yet</h2>
            <p className="text-gray-600 mb-6 max-w-md">
              Save posts you want to read later by clicking the bookmark icon on any post.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-medium"
            >
              Browse Posts
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Saved Posts</h1>
        <p className="text-gray-600">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} saved for later
        </p>
      </div>

      <div className="space-y-4">
        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onVote={handleVote}
          />
        ))}
      </div>
    </div>
  );
}

export default Saved;