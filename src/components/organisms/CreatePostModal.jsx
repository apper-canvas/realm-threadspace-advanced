import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CommunityService } from "@/services/api/communityService";
import { PostService } from "@/services/api/postService";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import TagInput from "@/components/atoms/TagInput";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";

const CreatePostModal = ({ isOpen, onClose }) => {
const [formData, setFormData] = useState({
    title: "",
    content: "",
    community: "",
    tags: [],
    postType: "text",
imageUrl: null,
    linkUrl: "",
    pollOptions: [
      { Id: 1, text: "", voteCount: 0 },
      { Id: 2, text: "", voteCount: 0 }
    ]
  });
  const [communities, setCommunities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadCommunities();
      // Reset form when modal opens
setFormData({ 
      title: "", 
      content: "", 
      community: "", 
      tags: [], 
      postType: "text", 
      imageUrl: null, 
      linkUrl: "",
      pollOptions: [
        { Id: 1, text: "", voteCount: 0 },
        { Id: 2, text: "", voteCount: 0 }
      ]
    });
      setErrors({});
    }
  }, [isOpen]);

  const loadCommunities = async () => {
    try {
      const fetchedCommunities = await CommunityService.getAll();
      setCommunities(fetchedCommunities);
      if (fetchedCommunities.length > 0) {
        setFormData(prev => ({ ...prev, community: fetchedCommunities[0].name }));
      }
    } catch (err) {
      toast.error("Failed to load communities");
    }
  };

  const validateForm = () => {
const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 300) {
      newErrors.title = "Title must be less than 300 characters";
    }
    
    if (formData.postType === 'text') {
      if (!formData.content.trim()) {
        newErrors.content = "Content is required";
      } else if (formData.content.length > 10000) {
        newErrors.content = "Content must be less than 10,000 characters";
      }
    } else if (formData.postType === 'image') {
      if (!formData.imageUrl) {
        newErrors.imageUrl = "Please upload an image";
      }
    } else if (formData.postType === 'link') {
      if (!formData.linkUrl.trim()) {
        newErrors.linkUrl = "URL is required";
      } else {
        try {
          new URL(formData.linkUrl);
        } catch {
          newErrors.linkUrl = "Please enter a valid URL";
        }
      }
}

if (formData.postType === 'poll') {
      const validOptions = formData.pollOptions.filter(opt => opt.text.trim());
      if (validOptions.length < 2) {
        newErrors.pollOptions = "At least 2 poll options are required";
      }
    }
    
    if (!formData.community) {
      newErrors.community = "Please select a community";
    }
    
setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
const newPost = {
        title: formData.title.trim(),
        content: formData.postType === 'text' ? formData.content.trim() : '',
        community: formData.community,
        author: "currentUser",
        timestamp: new Date().toISOString(),
        score: 1,
        userVote: 1,
        commentCount: 0,
        tags: formData.tags,
        postType: formData.postType,
        imageUrl: formData.postType === 'image' ? formData.imageUrl : null,
linkUrl: formData.postType === 'link' ? formData.linkUrl.trim() : null,
        pollOptions: formData.postType === 'poll' 
          ? formData.pollOptions.filter(opt => opt.text.trim()).map((opt, idx) => ({
              Id: idx + 1,
              text: opt.text.trim(),
              voteCount: 0
            }))
          : null
      };
      
      await PostService.create(newPost);
      toast.success("Post created successfully!");
      onClose();
      
      // Refresh the page to show the new post
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (err) {
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, imageUrl: "Image must be less than 5MB" }));
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('imageUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handlePostTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      postType: type,
      content: "",
      imageUrl: null,
linkUrl: "",
      pollOptions: [
        { Id: 1, text: "", voteCount: 0 },
        { Id: 2, text: "", voteCount: 0 }
      ]
    }));
    setErrors({});
  };

  const handleAddPollOption = () => {
    if (formData.pollOptions.length >= 10) {
      toast.error("Maximum 10 poll options allowed");
      return;
    }
    const newId = Math.max(...formData.pollOptions.map(opt => opt.Id), 0) + 1;
    setFormData(prev => ({
      ...prev,
      pollOptions: [...prev.pollOptions, { Id: newId, text: "", voteCount: 0 }]
    }));
  };

  const handleRemovePollOption = (optionId) => {
    if (formData.pollOptions.length <= 2) {
      toast.error("Minimum 2 poll options required");
      return;
    }
    setFormData(prev => ({
      ...prev,
      pollOptions: prev.pollOptions.filter(opt => opt.Id !== optionId)
    }));
  };

  const handlePollOptionChange = (optionId, value) => {
    setFormData(prev => ({
      ...prev,
      pollOptions: prev.pollOptions.map(opt =>
        opt.Id === optionId ? { ...opt, text: value } : opt
      )
    }));
  };

  if (!isOpen) return null;

return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Create a Post</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>
<div className="border-b border-gray-200">
          <div className="flex px-6 pt-4">
            <button
              type="button"
              onClick={() => handlePostTypeChange('text')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                formData.postType === 'text'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <ApperIcon name="FileText" size={18} />
                Text
              </div>
            </button>
            <button
              type="button"
              onClick={() => handlePostTypeChange('image')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                formData.postType === 'image'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <ApperIcon name="Image" size={18} />
                Image
              </div>
            </button>
            <button
              type="button"
              onClick={() => handlePostTypeChange('link')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                formData.postType === 'link'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <ApperIcon name="Link" size={18} />
                Link
              </div>
</button>
            <button
              type="button"
              onClick={() => handlePostTypeChange('poll')}
              className={cn(
                "flex-1 py-3 px-4 rounded-lg border-2 transition-all text-sm font-medium",
                formData.postType === 'poll'
                  ? "border-accent bg-accent/5 text-accent"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <ApperIcon name="BarChart3" size={18} />
                <span>Poll</span>
              </div>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <Select
            label="Community"
            value={formData.community}
            onChange={(e) => handleInputChange("community", e.target.value)}
            error={errors.community}
          >
            <option value="">Select a community</option>
            {communities.map(community => (
              <option key={community.id} value={community.name}>
                r/{community.name}
              </option>
            ))}
          </Select>
<Input
            label="Title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="An interesting title..."
            error={errors.title}
            maxLength={300}
          />
          
          {formData.postType === 'text' && (
            <div className="space-y-2">
              <Textarea
                label="Content"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="What are your thoughts?"
                rows={8}
                error={errors.content}
                maxLength={10000}
              />
              <div className="text-sm text-gray-500 text-right">
                {formData.content.length}/10,000 characters
              </div>
            </div>
          )}
          
          {formData.postType === 'image' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                {formData.imageUrl ? (
                  <div className="space-y-3">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="max-h-64 mx-auto rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleInputChange('imageUrl', null)}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <ApperIcon name="Upload" size={48} className="mx-auto text-gray-400" />
                    <div className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </div>
                    <div className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button type="button" variant="outline" onClick={() => document.getElementById('image-upload').click()}>
                        Choose File
                      </Button>
                    </label>
                  </div>
                )}
              </div>
              {errors.imageUrl && (
                <p className="text-sm text-red-500 mt-1">{errors.imageUrl}</p>
              )}
            </div>
          )}
          
{formData.postType === 'poll' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Poll Options
                </label>
                <span className="text-xs text-gray-500">
                  {formData.pollOptions.length}/10 options
                </span>
              </div>
              {formData.pollOptions.map((option, index) => (
                <div key={option.Id} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option.text}
                      onChange={(e) => handlePollOptionChange(option.Id, e.target.value)}
                      error={errors.pollOptions && !option.text.trim()}
                    />
                  </div>
                  {formData.pollOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePollOption(option.Id)}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <ApperIcon name="X" size={18} />
                    </button>
                  )}
                </div>
              ))}
              {errors.pollOptions && (
                <p className="text-xs text-red-500">{errors.pollOptions}</p>
              )}
              {formData.pollOptions.length < 10 && (
                <button
                  type="button"
                  onClick={handleAddPollOption}
                  className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-accent hover:text-accent transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <ApperIcon name="Plus" size={16} />
                    <span>Add Option</span>
                  </div>
                </button>
              )}
            </div>
          )}

          {formData.postType === 'link' && (
            <div className="space-y-2">
              <Input
                label="URL"
                value={formData.linkUrl}
                onChange={(e) => handleInputChange("linkUrl", e.target.value)}
                placeholder="https://example.com"
                error={errors.linkUrl}
                type="url"
              />
              {formData.linkUrl && !errors.linkUrl && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="Link" size={16} />
                    <span className="truncate">{formData.linkUrl}</span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <TagInput
            label="Tags"
            value={formData.tags}
            onChange={(tags) => handleInputChange("tags", tags)}
            placeholder="Add tags to improve discoverability..."
          />
        </form>
        
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleSubmit}
disabled={
              isSubmitting || 
              !formData.title.trim() || 
              (formData.postType === 'text' && !formData.content.trim()) ||
              (formData.postType === 'image' && !formData.imageUrl) ||
              (formData.postType === 'link' && !formData.linkUrl.trim()) ||
              (formData.postType === 'poll' && formData.pollOptions.filter(opt => opt.text.trim()).length < 2)
            }
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader2" size={16} className="animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <ApperIcon name="Send" size={16} />
                Post
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;