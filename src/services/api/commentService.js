import { getApperClient } from "@/services/apperClient";

export class CommentService {
  static async getAll() {
    const apperClient = getApperClient();
    
    try {
      const response = await apperClient.fetchRecords('comment_c', {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "author_c" }},
          { field: { Name: "content_c" }},
          { field: { Name: "timestamp_c" }},
          { field: { Name: "score_c" }},
          { field: { Name: "post_id_c" }},
          { field: { Name: "parent_id_c" }}
        ],
        pagingInfo: { limit: 500, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(c => ({
        Id: c.Id,
        author: c.author_c,
        content: c.content_c,
        timestamp: c.timestamp_c,
        score: c.score_c || 0,
        postId: c.post_id_c?.Id || null,
        parentId: c.parent_id_c?.Id || null
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  }

  static async getByPostId(postId) {
    const apperClient = getApperClient();
    
    try {
      const response = await apperClient.fetchRecords('comment_c', {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "author_c" }},
          { field: { Name: "content_c" }},
          { field: { Name: "timestamp_c" }},
          { field: { Name: "score_c" }},
          { field: { Name: "post_id_c" }},
          { field: { Name: "parent_id_c" }}
        ],
        where: [
          { FieldName: "post_id_c", Operator: "EqualTo", Values: [parseInt(postId)] }
        ],
        pagingInfo: { limit: 500, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(c => ({
        Id: c.Id,
        author: c.author_c,
        content: c.content_c,
        timestamp: c.timestamp_c,
        score: c.score_c || 0,
        postId: c.post_id_c?.Id || parseInt(postId),
        parentId: c.parent_id_c?.Id || null
      }));
    } catch (error) {
      console.error("Error fetching comments by post:", error);
      return [];
    }
  }

  static async getById(id) {
    const apperClient = getApperClient();
    
    try {
      const response = await apperClient.getRecordById('comment_c', parseInt(id), {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "author_c" }},
          { field: { Name: "content_c" }},
          { field: { Name: "timestamp_c" }},
          { field: { Name: "score_c" }},
          { field: { Name: "post_id_c" }},
          { field: { Name: "parent_id_c" }}
        ]
      });

      if (!response.success || !response.data) {
        return null;
      }

      const c = response.data;
      return {
        Id: c.Id,
        author: c.author_c,
        content: c.content_c,
        timestamp: c.timestamp_c,
        score: c.score_c || 0,
        postId: c.post_id_c?.Id || null,
        parentId: c.parent_id_c?.Id || null
      };
    } catch (error) {
      console.error("Error fetching comment by id:", error);
      return null;
    }
  }

  static async create(commentData) {
    if (!commentData.content || !commentData.content.trim()) {
      throw new Error('Comment content is required');
    }

    const apperClient = getApperClient();
    
    try {
      const response = await apperClient.createRecord('comment_c', {
        records: [{
          author_c: commentData.author || 'Anonymous',
          content_c: commentData.content.trim(),
          timestamp_c: new Date().toISOString(),
          score_c: 0,
          post_id_c: parseInt(commentData.postId),
          parent_id_c: commentData.parentId ? parseInt(commentData.parentId) : null
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error('Failed to create comment');
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success && result.data) {
          const c = result.data;
          return {
            Id: c.Id,
            author: c.author_c,
            content: c.content_c,
            timestamp: c.timestamp_c,
            score: c.score_c || 0,
            postId: c.post_id_c?.Id || parseInt(commentData.postId),
            parentId: c.parent_id_c?.Id || null
          };
        }
      }

      throw new Error('Failed to create comment');
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  }

  static async delete(id) {
    const apperClient = getApperClient();
    
    try {
      // First get all child comments
      const allComments = await this.getAll();
      const childComments = allComments.filter(c => c.parentId === parseInt(id));
      
      // Delete all child comments first
      for (const child of childComments) {
        await this.delete(child.Id);
      }

      // Then delete the comment itself
      const response = await apperClient.deleteRecord('comment_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error('Comment not found');
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return { Id: parseInt(id) };
        }
      }

      throw new Error('Comment not found');
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  }

  static async updateScore(id, newScore) {
    const apperClient = getApperClient();
    
    try {
      const response = await apperClient.updateRecord('comment_c', {
        records: [{
          Id: parseInt(id),
          score_c: newScore
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error('Comment not found');
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success && result.data) {
          const c = result.data;
          return {
            Id: c.Id,
            author: c.author_c,
            content: c.content_c,
            timestamp: c.timestamp_c,
            score: c.score_c || 0,
            postId: c.post_id_c?.Id || null,
            parentId: c.parent_id_c?.Id || null
          };
        }
      }

      throw new Error('Comment not found');
    } catch (error) {
      console.error("Error updating comment score:", error);
      throw error;
    }
  }
}