import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PostService } from "@/services/api/postService";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import VoteButtons from "@/components/molecules/VoteButtons";
const PostCard = ({ post, onVote }) => {
  const timeAgo = formatDistanceToNow(new Date(post.timestamp), { addSuffix: true });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkSaved = async () => {
      const saved = await PostService.isSaved(post.id);
      setIsSaved(saved);
    };
    checkSaved();
  }, [post.id]);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await PostService.toggleSave(post.id);
    setIsSaved(result.saved);
    toast.success(result.saved ? 'Post saved!' : 'Post unsaved');
  };

const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:post-card-hover group">
      <div className="flex gap-4">
        <div onClick={(e) => e.stopPropagation()}>
          <VoteButtons
            score={post.score}
            userVote={post.userVote}
            onVote={onVote}
            postId={post.id}
          />
        </div>
        
        <Link to={`/post/${post.Id}`} className="flex-1 min-w-0 cursor-pointer">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span className="bg-gradient-to-r from-primary/10 to-primary/20 text-primary px-2 py-1 rounded-full text-xs font-medium">
              r/{post.community}
            </span>
            <span>•</span>
            <span>Posted by u/{post.author}</span>
            <span>•</span>
            <span>{timeAgo}</span>
          </div>
          
          <h2 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-200">
            {post.title}
          </h2>
          
          {post.postType === 'text' && post.content && (
            <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
              {post.content}
            </p>
          )}
          
          {post.postType === 'image' && post.imageUrl && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full max-h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  window.open(post.imageUrl, '_blank');
                }}
              />
            </div>
          )}
          
          {post.postType === 'link' && post.linkUrl && (
            <div 
              className="mb-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                window.open(post.linkUrl, '_blank', 'noopener,noreferrer');
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="ExternalLink" size={20} className="text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-accent truncate">
                    {new URL(post.linkUrl).hostname}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {post.linkUrl}
                  </div>
                </div>
                <ApperIcon name="ArrowRight" size={16} className="text-gray-400 flex-shrink-0" />
              </div>
            </div>
          )}
{post.postType === 'poll' && post.pollOptions && (
            <div className="mt-3 space-y-2">
              {post.pollOptions.slice(0, 3).map((option, index) => (
                <div key={option.Id} className="flex items-center text-sm text-gray-600">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 text-xs font-medium mr-2">
                    {index + 1}
                  </span>
                  <span className="flex-1">{option.text}</span>
                  <span className="text-xs text-gray-500 ml-2">{option.voteCount}</span>
                </div>
              ))}
              {post.pollOptions.length > 3 && (
                <div className="text-xs text-gray-500 ml-7">
                  +{post.pollOptions.length - 3} more option{post.pollOptions.length - 3 !== 1 ? 's' : ''}
                </div>
              )}
              <div className="text-xs text-gray-500 mt-2 ml-7">
                {post.pollOptions.reduce((sum, opt) => sum + opt.voteCount, 0)} total votes
              </div>
            </div>
          )}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <ApperIcon name="MessageCircle" size={16} />
              <span>{post.commentCount || 0} comments</span>
            </div>
            
            <button 
              className="flex items-center gap-2 hover:text-gray-700 transition-colors duration-200 p-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <ApperIcon name="Share" size={16} />
              <span>Share</span>
            </button>
            
<button 
              className="flex items-center gap-2 hover:text-gray-700 transition-colors duration-200 p-1"
              onClick={handleSave}
>
              <ApperIcon name="Bookmark" size={16} fill={isSaved ? 'currentColor' : 'none'} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;