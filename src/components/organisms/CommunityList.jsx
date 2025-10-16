import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CommunityService } from "@/services/api/communityService";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Communities from "@/components/pages/Communities";
import Button from "@/components/atoms/Button";
const CommunityList = () => {
const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = async () => {
    try {
      setLoading(true);
      setError("");
      const fetchedCommunities = await CommunityService.getAll();
      setCommunities(fetchedCommunities);
    } catch (err) {
      setError("Failed to load communities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

const handleCommunityClick = (communityName) => {
    navigate(`/community/${communityName}`);
  };

  const handleJoinCommunity = (e, communityName) => {
    e.stopPropagation();
    toast.success(`Joined r/${communityName}! Welcome to the community.`);
  };

  if (loading) return <Loading />;
  
  if (error) return <Error message={error} onRetry={loadCommunities} />;
  
  if (communities.length === 0) {
    return (
      <Empty
        title="No communities found"
        description="Communities will appear here as they're created. Check back soon!"
        actionLabel="Refresh"
        onAction={loadCommunities}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Communities</h2>
        <div className="text-sm text-gray-500">
          {communities.length} communities
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {communities.map(community => (
<div
            key={community.id}
            onClick={() => handleCommunityClick(community.name)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md hover:border-gray-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: community.color }}
              >
                {community.name.charAt(0).toUpperCase()}
              </div>
<Button
                variant="secondary"
                size="sm"
                onClick={(e) => handleJoinCommunity(e, community.name)}
                className="flex items-center gap-1"
              >
                <ApperIcon name="Plus" size={14} />
                Join
              </Button>
            </div>
            
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              r/{community.name}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {community.description}
            </p>
            
<div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <ApperIcon name="Users" size={14} />
                <span>{community.memberCount || 0} members</span>
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="MessageSquare" size={14} />
                <span>{community.postCount || 0} posts</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityList;