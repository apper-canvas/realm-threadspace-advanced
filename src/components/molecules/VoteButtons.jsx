import { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const VoteButtons = ({ score, userVote, onVote, postId }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleVote = (voteValue) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    onVote(postId, voteValue);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => handleVote(userVote === 1 ? 0 : 1)}
        className={cn(
          "p-2 rounded-full transition-all duration-150 vote-animation",
          userVote === 1 
            ? "text-primary bg-primary/10 vote-button-active" 
            : "text-gray-400 hover:text-primary hover:bg-primary/5"
        )}
      >
        <ApperIcon name="ChevronUp" size={20} />
      </button>
      
      <span className={cn(
        "text-sm font-semibold min-w-[2rem] text-center transition-all duration-200",
        userVote === 1 ? "text-primary" : userVote === -1 ? "text-accent" : "text-gray-700",
        isAnimating && "score-bounce"
      )}>
        {score}
      </span>
      
      <button
        onClick={() => handleVote(userVote === -1 ? 0 : -1)}
        className={cn(
          "p-2 rounded-full transition-all duration-150 vote-animation",
          userVote === -1 
            ? "text-accent bg-accent/10 vote-button-active" 
            : "text-gray-400 hover:text-accent hover:bg-accent/5"
        )}
      >
        <ApperIcon name="ChevronDown" size={20} />
      </button>
    </div>
  );
};

export default VoteButtons;