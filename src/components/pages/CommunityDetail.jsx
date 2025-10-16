import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import PostFeed from "@/components/organisms/PostFeed";
import CreatePostModal from "@/components/organisms/CreatePostModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { CommunityService } from "@/services/api/communityService";

const CommunityDetail = () => {
  const { communityName } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await CommunityService.getByName(communityName);
        if (!data) {
          setError("Community not found");
        } else {
          setCommunity(data);
        }
      } catch (err) {
        setError("Failed to load community. Please try again.");
        console.error("Error fetching community:", err);
      } finally {
        setLoading(false);
      }
    };

    if (communityName) {
      fetchCommunity();
    }
  }, [communityName]);

  const handleJoin = () => {
    setJoined(!joined);
    toast.success(
      joined
        ? `Left r/${community.name}`
        : `Joined r/${community.name}! Welcome to the community.`
    );
  };

  const handleCreatePost = (postData) => {
    toast.success("Post created successfully!");
    setShowCreatePost(false);
  };

  if (loading) {
    return (
      <div className="pb-20 lg:pb-6">
        <Loading />
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="pb-20 lg:pb-6">
        <Error message={error || "Community not found"} />
        <div className="text-center mt-4">
          <Button onClick={() => navigate("/communities")} variant="primary">
            Back to Communities
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 lg:pb-6">
      {/* Community Banner */}
      <div className="bg-gradient-to-r from-primary to-orange-600 text-white rounded-xl shadow-lg p-8 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => navigate("/communities")}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Back to communities"
              >
                <ApperIcon name="ArrowLeft" size={20} />
              </button>
              <h1 className="text-3xl font-bold truncate">r/{community.name}</h1>
            </div>
            <p className="text-white/90 text-lg mb-4 leading-relaxed">
              {community.description}
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <ApperIcon name="Users" size={16} />
                <span className="font-semibold">
                  {community.memberCount?.toLocaleString() || 0}
                </span>
                <span className="text-white/80">members</span>
              </div>
            </div>
          </div>
          <Button
            onClick={handleJoin}
            variant={joined ? "secondary" : "primary"}
            className={`shrink-0 ${
              joined
                ? "bg-white text-primary hover:bg-gray-100"
                : "bg-white/20 hover:bg-white/30 text-white border-white/40"
            }`}
          >
            <ApperIcon
              name={joined ? "Check" : "Plus"}
              size={18}
              className="mr-2"
            />
            {joined ? "Joined" : "Join"}
          </Button>
        </div>
      </div>

      {/* Create Post Button */}
      <div className="mb-6">
        <Button
          onClick={() => setShowCreatePost(true)}
          variant="primary"
          className="w-full sm:w-auto"
        >
          <ApperIcon name="Plus" size={18} className="mr-2" />
          Create Post
        </Button>
      </div>

      {/* Posts Feed */}
      <PostFeed
        filter={communityName}
        onCreatePost={handleCreatePost}
      />

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePostModal
          isOpen={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          onSubmit={handleCreatePost}
          defaultCommunity={community.name}
        />
      )}
    </div>
  );
};

export default CommunityDetail;