import { getApperClient } from "@/services/apperClient";
import { CommunityService } from "@/services/api/communityService";

export class PostService {
  static savedPostIds = new Set();

  static async search(query) {
    if (!query || !query.trim()) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const apperClient = getApperClient();
    
    try {
      const response = await apperClient.fetchRecords('post_c', {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "title_c" }},
          { field: { Name: "content_c" }},
          { field: { Name: "author_c" }},
          { field: { Name: "community_c" }},
          { field: { Name: "score_c" }},
          { field: { Name: "user_vote_c" }},
          { field: { Name: "timestamp_c" }},
          { field: { Name: "comment_count_c" }},
          { field: { Name: "tags_c" }},
          { field: { Name: "post_type_c" }},
          { field: { Name: "image_url_c" }},
          { field: { Name: "link_url_c" }},
          { field: { Name: "poll_options_c" }},
          { field: { Name: "user_poll_vote_c" }}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                { fieldName: "title_c", operator: "Contains", values: [searchTerm] },
                { fieldName: "content_c", operator: "Contains", values: [searchTerm] },
                { fieldName: "author_c", operator: "Contains", values: [searchTerm] },
                { fieldName: "tags_c", operator: "Contains", values: [searchTerm] }
              ],
              operator: "OR"
            }
          ]
        }],
        pagingInfo: { limit: 100, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      const results = [];
      for (const post of response.data || []) {
        const titleMatch = post.title_c?.toLowerCase().includes(searchTerm);
        const contentMatch = post.content_c && post.content_c.toLowerCase().includes(searchTerm);
        const authorMatch = post.author_c?.toLowerCase().includes(searchTerm);
        const tags = post.tags_c?.split(',') || [];
        const tagMatch = tags.some(tag => tag.toLowerCase().includes(searchTerm));

        let snippet = '';
        if (titleMatch && post.title_c) {
          const index = post.title_c.toLowerCase().indexOf(searchTerm);
          const start = Math.max(0, index - 30);
          const end = Math.min(post.title_c.length, index + searchTerm.length + 30);
          snippet = post.title_c.substring(start, end);
        } else if (contentMatch && post.content_c) {
          const index = post.content_c.toLowerCase().indexOf(searchTerm);
          const start = Math.max(0, index - 40);
          const end = Math.min(post.content_c.length, index + searchTerm.length + 40);
          snippet = post.content_c.substring(start, end);
        } else if (tagMatch) {
          const matchedTag = tags.find(tag => tag.toLowerCase().includes(searchTerm));
          snippet = `Tagged with: ${matchedTag}`;
        } else if (authorMatch) {
          snippet = `Posted by u/${post.author_c}`;
        }

        let pollOptions = null;
        if (post.poll_options_c) {
          try {
            pollOptions = JSON.parse(post.poll_options_c);
          } catch (e) {
            console.error("Error parsing poll options:", e);
          }
        }

        results.push({
          post: {
            Id: post.Id,
            id: `post_${post.Id}`,
            title: post.title_c,
            content: post.content_c,
            author: post.author_c,
            community: post.community_c?.name_c || 'Unknown',
            score: post.score_c || 0,
            userVote: post.user_vote_c || 0,
            timestamp: post.timestamp_c,
            commentCount: post.comment_count_c || 0,
            tags: tags,
            postType: post.post_type_c || 'text',
            imageUrl: post.image_url_c,
            linkUrl: post.link_url_c,
            pollOptions: pollOptions,
            userPollVote: post.user_poll_vote_c
          },
          snippet: snippet.trim()
        });
      }

      return results;
    } catch (error) {
      console.error("Error searching posts:", error);
      return [];
    }
  }

  static async getAll() {
    const apperClient = getApperClient();
    
    try {
      const response = await apperClient.fetchRecords('post_c', {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "title_c" }},
          { field: { Name: "content_c" }},
          { field: { Name: "author_c" }},
          { field: { Name: "community_c" }, referenceField: { field: { Name: "name_c" }}},
          { field: { Name: "score_c" }},
          { field: { Name: "user_vote_c" }},
          { field: { Name: "timestamp_c" }},
          { field: { Name: "comment_count_c" }},
          { field: { Name: "tags_c" }},
          { field: { Name: "post_type_c" }},
          { field: { Name: "image_url_c" }},
          { field: { Name: "link_url_c" }},
          { field: { Name: "poll_options_c" }},
          { field: { Name: "user_poll_vote_c" }}
        ],
        orderBy: [{ fieldName: "timestamp_c", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(p => {
        let pollOptions = null;
        if (p.poll_options_c) {
          try {
            pollOptions = JSON.parse(p.poll_options_c);
          } catch (e) {
            console.error("Error parsing poll options:", e);
          }
        }

        const tags = p.tags_c ? p.tags_c.split(',') : [];

        return {
          Id: p.Id,
          id: `post_${p.Id}`,
          title: p.title_c,
          content: p.content_c,
          author: p.author_c,
          community: p.community_c?.name_c || 'Unknown',
          score: p.score_c || 0,
          userVote: p.user_vote_c || 0,
          timestamp: p.timestamp_c,
          commentCount: p.comment_count_c || 0,
          tags: tags,
          postType: p.post_type_c || 'text',
          imageUrl: p.image_url_c,
          linkUrl: p.link_url_c,
          pollOptions: pollOptions,
          userPollVote: p.user_poll_vote_c
        };
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  }

  static async getById(id) {
    const apperClient = getApperClient();
    
    try {
      const response = await apperClient.getRecordById('post_c', parseInt(id), {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "title_c" }},
          { field: { Name: "content_c" }},
          { field: { Name: "author_c" }},
          { field: { Name: "community_c" }, referenceField: { field: { Name: "name_c" }}},
          { field: { Name: "score_c" }},
          { field: { Name: "user_vote_c" }},
          { field: { Name: "timestamp_c" }},
          { field: { Name: "comment_count_c" }},
          { field: { Name: "tags_c" }},
          { field: { Name: "post_type_c" }},
          { field: { Name: "image_url_c" }},
          { field: { Name: "link_url_c" }},
          { field: { Name: "poll_options_c" }},
          { field: { Name: "user_poll_vote_c" }}
        ]
      });

      if (!response.success || !response.data) {
        return null;
      }

      const p = response.data;
      let pollOptions = null;
      if (p.poll_options_c) {
        try {
          pollOptions = JSON.parse(p.poll_options_c);
        } catch (e) {
          console.error("Error parsing poll options:", e);
        }
      }

      const tags = p.tags_c ? p.tags_c.split(',') : [];

      return {
        Id: p.Id,
        id: `post_${p.Id}`,
        title: p.title_c,
        content: p.content_c,
        author: p.author_c,
        community: p.community_c?.name_c || 'Unknown',
        score: p.score_c || 0,
        userVote: p.user_vote_c || 0,
        timestamp: p.timestamp_c,
        commentCount: p.comment_count_c || 0,
        tags: tags,
        postType: p.post_type_c || 'text',
        imageUrl: p.image_url_c,
        linkUrl: p.link_url_c,
        pollOptions: pollOptions,
        userPollVote: p.user_poll_vote_c
      };
    } catch (error) {
      console.error("Error fetching post by id:", error);
      return null;
    }
  }

  static async getPopular() {
    const apperClient = getApperClient();
    
    try {
      const response = await apperClient.fetchRecords('post_c', {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "title_c" }},
          { field: { Name: "content_c" }},
          { field: { Name: "author_c" }},
          { field: { Name: "community_c" }, referenceField: { field: { Name: "name_c" }}},
          { field: { Name: "score_c" }},
          { field: { Name: "user_vote_c" }},
          { field: { Name: "timestamp_c" }},
          { field: { Name: "comment_count_c" }},
          { field: { Name: "tags_c" }},
          { field: { Name: "post_type_c" }},
          { field: { Name: "image_url_c" }},
          { field: { Name: "link_url_c" }},
          { field: { Name: "poll_options_c" }},
          { field: { Name: "user_poll_vote_c" }}
        ],
        where: [
          { FieldName: "score_c", Operator: "GreaterThanOrEqualTo", Values: ["50"] }
        ],
        orderBy: [{ fieldName: "score_c", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(p => {
        let pollOptions = null;
        if (p.poll_options_c) {
          try {
            pollOptions = JSON.parse(p.poll_options_c);
          } catch (e) {
            console.error("Error parsing poll options:", e);
          }
        }

        const tags = p.tags_c ? p.tags_c.split(',') : [];

        return {
          Id: p.Id,
          id: `post_${p.Id}`,
          title: p.title_c,
          content: p.content_c,
          author: p.author_c,
          community: p.community_c?.name_c || 'Unknown',
          score: p.score_c || 0,
          userVote: p.user_vote_c || 0,
          timestamp: p.timestamp_c,
          commentCount: p.comment_count_c || 0,
          tags: tags,
          postType: p.post_type_c || 'text',
          imageUrl: p.image_url_c,
          linkUrl: p.link_url_c,
          pollOptions: pollOptions,
          userPollVote: p.user_poll_vote_c
        };
      });
    } catch (error) {
      console.error("Error fetching popular posts:", error);
      return [];
    }
  }

  static async getByCommunity(communityName) {
    const apperClient = getApperClient();
    
    try {
      // First get the community to get its ID
      const community = await CommunityService.getByName(communityName);
      if (!community) {
        return [];
      }

      const response = await apperClient.fetchRecords('post_c', {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "title_c" }},
          { field: { Name: "content_c" }},
          { field: { Name: "author_c" }},
          { field: { Name: "community_c" }, referenceField: { field: { Name: "name_c" }}},
          { field: { Name: "score_c" }},
          { field: { Name: "user_vote_c" }},
          { field: { Name: "timestamp_c" }},
          { field: { Name: "comment_count_c" }},
          { field: { Name: "tags_c" }},
          { field: { Name: "post_type_c" }},
          { field: { Name: "image_url_c" }},
          { field: { Name: "link_url_c" }},
          { field: { Name: "poll_options_c" }},
          { field: { Name: "user_poll_vote_c" }}
        ],
        where: [
          { FieldName: "community_c", Operator: "EqualTo", Values: [community.Id] }
        ],
        orderBy: [{ fieldName: "timestamp_c", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(p => {
        let pollOptions = null;
        if (p.poll_options_c) {
          try {
            pollOptions = JSON.parse(p.poll_options_c);
          } catch (e) {
            console.error("Error parsing poll options:", e);
          }
        }

        const tags = p.tags_c ? p.tags_c.split(',') : [];

        return {
          Id: p.Id,
          id: `post_${p.Id}`,
          title: p.title_c,
          content: p.content_c,
          author: p.author_c,
          community: p.community_c?.name_c || communityName,
          score: p.score_c || 0,
          userVote: p.user_vote_c || 0,
          timestamp: p.timestamp_c,
          commentCount: p.comment_count_c || 0,
          tags: tags,
          postType: p.post_type_c || 'text',
          imageUrl: p.image_url_c,
          linkUrl: p.link_url_c,
          pollOptions: pollOptions,
          userPollVote: p.user_poll_vote_c
        };
      });
    } catch (error) {
      console.error("Error fetching posts by community:", error);
      return [];
    }
  }

  static async addComment(postId, commentId) {
    const apperClient = getApperClient();
    
    try {
      const post = await this.getById(postId);
      if (!post) return false;

      const response = await apperClient.updateRecord('post_c', {
        records: [{
          Id: parseInt(postId),
          comment_count_c: (post.commentCount || 0) + 1
        }]
      });

      return response.success;
    } catch (error) {
      console.error("Error adding comment to post:", error);
      return false;
    }
  }

  static async create(postData) {
    const apperClient = getApperClient();
    
    try {
      // Get community ID
      const community = await CommunityService.getByName(postData.community);
      if (!community) {
        throw new Error("Community not found");
      }

      let pollOptionsJson = null;
      if (postData.pollOptions && Array.isArray(postData.pollOptions)) {
        pollOptionsJson = JSON.stringify(postData.pollOptions);
      }

      const response = await apperClient.createRecord('post_c', {
        records: [{
          title_c: postData.title,
          content_c: postData.content || '',
          author_c: postData.author,
          community_c: community.Id,
          score_c: postData.score || 1,
          user_vote_c: postData.userVote || 1,
          timestamp_c: postData.timestamp,
          comment_count_c: 0,
          tags_c: Array.isArray(postData.tags) ? postData.tags.join(',') : '',
          post_type_c: postData.postType || 'text',
          image_url_c: postData.imageUrl || null,
          link_url_c: postData.linkUrl || null,
          poll_options_c: pollOptionsJson,
          user_poll_vote_c: null
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success && result.data) {
          const p = result.data;
          let pollOptions = null;
          if (p.poll_options_c) {
            try {
              pollOptions = JSON.parse(p.poll_options_c);
            } catch (e) {
              console.error("Error parsing poll options:", e);
            }
          }

          const tags = p.tags_c ? p.tags_c.split(',') : [];

          return {
            Id: p.Id,
            id: `post_${p.Id}`,
            title: p.title_c,
            content: p.content_c,
            author: p.author_c,
            community: postData.community,
            score: p.score_c || 1,
            userVote: p.user_vote_c || 1,
            timestamp: p.timestamp_c,
            commentCount: 0,
            tags: tags,
            postType: p.post_type_c || 'text',
            imageUrl: p.image_url_c,
            linkUrl: p.link_url_c,
            pollOptions: pollOptions,
            userPollVote: null
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating post:", error);
      return null;
    }
  }

  static async update(id, updateData) {
    const apperClient = getApperClient();
    
    try {
      const updateRecord = { Id: parseInt(id) };
      
      if (updateData.title) updateRecord.title_c = updateData.title;
      if (updateData.content !== undefined) updateRecord.content_c = updateData.content;
      if (updateData.score !== undefined) updateRecord.score_c = updateData.score;
      if (updateData.userVote !== undefined) updateRecord.user_vote_c = updateData.userVote;
      if (updateData.commentCount !== undefined) updateRecord.comment_count_c = updateData.commentCount;
      if (updateData.tags) updateRecord.tags_c = Array.isArray(updateData.tags) ? updateData.tags.join(',') : updateData.tags;
      if (updateData.pollOptions) updateRecord.poll_options_c = JSON.stringify(updateData.pollOptions);
      if (updateData.userPollVote !== undefined) updateRecord.user_poll_vote_c = updateData.userPollVote;

      const response = await apperClient.updateRecord('post_c', {
        records: [updateRecord]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return await this.getById(id);
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating post:", error);
      return null;
    }
  }

  static async delete(id) {
    const apperClient = getApperClient();
    
    try {
      const response = await apperClient.deleteRecord('post_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results && response.results.length > 0) {
        return response.results[0].success;
      }

      return false;
    } catch (error) {
      console.error("Error deleting post:", error);
      return false;
    }
  }

  static async vote(postId, voteValue) {
    const post = await this.getById(postId.replace('post_', ''));
    if (!post) return null;

    const oldVote = post.userVote || 0;
    const newVote = oldVote === voteValue ? 0 : voteValue;
    const scoreDiff = newVote - oldVote;

    const updatedPost = await this.update(post.Id, {
      score: post.score + scoreDiff,
      userVote: newVote
    });

    return updatedPost;
  }

  static async pollVote(postId, optionId) {
    const post = await this.getById(postId.replace('post_', ''));
    if (!post || post.postType !== 'poll' || !post.pollOptions) return null;

    const pollOptions = [...post.pollOptions];
    const option = pollOptions.find(opt => opt.Id === optionId);
    if (!option) return null;

    // Remove previous vote if exists
    if (post.userPollVote !== null) {
      const prevOption = pollOptions.find(opt => opt.Id === post.userPollVote);
      if (prevOption) {
        prevOption.voteCount = Math.max(0, prevOption.voteCount - 1);
      }
    }

    // Add new vote or remove if voting for same option
    let newUserPollVote;
    if (post.userPollVote === optionId) {
      newUserPollVote = null;
    } else {
      option.voteCount += 1;
      newUserPollVote = optionId;
    }

    const updatedPost = await this.update(post.Id, {
      pollOptions: pollOptions,
      userPollVote: newUserPollVote
    });

    return updatedPost;
  }

  static async toggleSave(postId) {
    if (this.savedPostIds.has(postId)) {
      this.savedPostIds.delete(postId);
      return { saved: false };
    } else {
      this.savedPostIds.add(postId);
      return { saved: true };
    }
  }

  static async isSaved(postId) {
    return this.savedPostIds.has(postId);
  }

  static async getSaved() {
    const allPosts = await this.getAll();
    return allPosts.filter(post => this.savedPostIds.has(post.id));
  }
}