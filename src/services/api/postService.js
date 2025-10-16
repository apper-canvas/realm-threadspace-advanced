import postsData from "@/services/mockData/posts.json";
import { CommunityService } from "@/services/api/communityService";

export class PostService {
  static posts = [...postsData];
  static comments = [];
  static savedPostIds = new Set();

static async search(query) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query || !query.trim()) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const results = [];

    for (const post of this.posts) {
      const titleMatch = post.title.toLowerCase().includes(searchTerm);
      const contentMatch = post.content && post.content.toLowerCase().includes(searchTerm);
      const authorMatch = post.author.toLowerCase().includes(searchTerm);
      const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(searchTerm));

      if (titleMatch || contentMatch || authorMatch || tagMatch) {
        let snippet = '';
        
        if (titleMatch) {
          const index = post.title.toLowerCase().indexOf(searchTerm);
          const start = Math.max(0, index - 30);
          const end = Math.min(post.title.length, index + searchTerm.length + 30);
          snippet = post.title.substring(start, end);
        } else if (contentMatch) {
          const index = post.content.toLowerCase().indexOf(searchTerm);
          const start = Math.max(0, index - 40);
          const end = Math.min(post.content.length, index + searchTerm.length + 40);
          snippet = post.content.substring(start, end);
        } else if (tagMatch) {
          const matchedTag = post.tags.find(tag => tag.toLowerCase().includes(searchTerm));
          snippet = `Tagged with: ${matchedTag}`;
        } else if (authorMatch) {
          snippet = `Posted by u/${post.author}`;
        }

        results.push({
          post,
          snippet: snippet.trim()
        });
      }
    }

    return results;
  }

  static delay = () => new Promise(resolve => setTimeout(resolve, 300));

  static async getAll() {
    await this.delay();
    return [...this.posts.map(post => ({ 
      ...post,
      commentCount: this.comments.filter(c => c.postId === post.Id).length 
    }))];
  }

  static async getById(id) {
    await this.delay();
    const post = this.posts.find(p => p.Id === parseInt(id));
    if (!post) return null;
    
    const commentCount = this.comments.filter(c => c.postId === parseInt(id)).length;
    return { ...post, commentCount };
  }

  static async getPopular() {
    await this.delay();
    return [...this.posts]
      .filter(post => post.score >= 50)
      .sort((a, b) => b.score - a.score)
      .map(post => ({ ...post }));
  }

  static async getByCommunity(communityName) {
    await this.delay();
    return [...this.posts]
      .filter(post => post.community.toLowerCase() === communityName.toLowerCase())
      .map(post => ({ ...post }));
  }

  static async addComment(postId, commentId) {
    await this.delay();
    this.comments.push({ postId: parseInt(postId), commentId: parseInt(commentId) });
    return true;
  }

static async create(postData) {
    await this.delay();
    
    const maxId = Math.max(...this.posts.map(p => p.Id), 0);
    const newPost = {
      Id: maxId + 1,
      id: `post_${maxId + 1}`,
      title: postData.title,
      content: postData.content || null,
      author: postData.author,
      community: postData.community,
      score: postData.score || 1,
      userVote: postData.userVote || 1,
      timestamp: postData.timestamp,
      commentCount: postData.commentCount || 0,
      tags: postData.tags || [],
      postType: postData.postType || 'text',
      imageUrl: postData.imageUrl || null,
      linkUrl: postData.linkUrl || null,
      pollOptions: postData.pollOptions || null,
      userPollVote: null
    };
    
    this.posts.unshift(newPost);
    return { ...newPost };
  }

static async update(id, updateData) {
    await this.delay();
    
    const index = this.posts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) return null;
    
    this.posts[index] = { 
      ...this.posts[index], 
      ...updateData, 
      tags: updateData.tags || this.posts[index].tags,
      pollOptions: updateData.pollOptions || this.posts[index].pollOptions
    };
    return { ...this.posts[index] };
  }

  static async delete(id) {
    await this.delay();
    
    const index = this.posts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) return false;
    
    this.posts.splice(index, 1);
    return true;
  }

static async vote(postId, voteValue) {
    await this.delay();
    
    const post = this.posts.find(p => p.id === postId);
    if (!post) return null;
    
    const oldVote = post.userVote || 0;
    const newVote = oldVote === voteValue ? 0 : voteValue;
    const scoreDiff = newVote - oldVote;
    
    post.userVote = newVote;
    post.score += scoreDiff;
    
    return { ...post };
  }

  static async pollVote(postId, optionId) {
    await this.delay();
    
    const post = this.posts.find(p => p.id === postId);
    if (!post || post.postType !== 'poll' || !post.pollOptions) return null;
    
    const option = post.pollOptions.find(opt => opt.Id === optionId);
    if (!option) return null;
    
    // Remove previous vote if exists
    if (post.userPollVote !== null) {
      const prevOption = post.pollOptions.find(opt => opt.Id === post.userPollVote);
      if (prevOption) {
        prevOption.voteCount = Math.max(0, prevOption.voteCount - 1);
      }
    }
    
    // Add new vote or remove if voting for same option
    if (post.userPollVote === optionId) {
      post.userPollVote = null;
    } else {
      option.voteCount += 1;
      post.userPollVote = optionId;
    }
    
    return { ...post };
  }

  static async toggleSave(postId) {
    await this.delay();
    
    if (this.savedPostIds.has(postId)) {
      this.savedPostIds.delete(postId);
      return { saved: false };
    } else {
      this.savedPostIds.add(postId);
      return { saved: true };
    }
  }

  static async isSaved(postId) {
    await this.delay();
    return this.savedPostIds.has(postId);
  }

  static async getSaved() {
    await this.delay();
    const savedPosts = this.posts.filter(post => this.savedPostIds.has(post.id));
    return savedPosts.map(post => ({ 
      ...post,
      commentCount: this.comments.filter(c => c.postId === post.Id).length 
    }));
  }
}