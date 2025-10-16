import commentsData from '@/services/mockData/comments.json';

export class CommentService {
  static comments = [...commentsData];

  static delay() {
    return new Promise(resolve => setTimeout(resolve, 500));
  }

  static async getAll() {
    await this.delay();
    return [...this.comments.map(comment => ({ ...comment }))];
  }

  static async getByPostId(postId) {
    await this.delay();
    const postComments = this.comments.filter(c => c.postId === parseInt(postId));
    return postComments.map(comment => ({ ...comment }));
  }

  static async getById(id) {
    await this.delay();
    const comment = this.comments.find(c => c.Id === parseInt(id));
    return comment ? { ...comment } : null;
  }

  static async create(commentData) {
    await this.delay();
    
    if (!commentData.content || !commentData.content.trim()) {
      throw new Error('Comment content is required');
    }

const newComment = {
      Id: Math.max(0, ...this.comments.map(c => c.Id)) + 1,
      postId: parseInt(commentData.postId),
      parentId: commentData.parentId ? parseInt(commentData.parentId) : null,
      author: commentData.author || 'Anonymous',
      content: commentData.content.trim(),
timestamp: new Date().toISOString(),
      score: 0
    };

    this.comments.push(newComment);
    return { ...newComment };
  }

  static async delete(id) {
    await this.delay();
    const index = this.comments.findIndex(c => c.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Comment not found');
    }

    const deletedComment = this.comments[index];
    this.comments.splice(index, 1);
    
    // Delete child comments
    this.comments = this.comments.filter(c => c.parentId !== parseInt(id));
    
    return { ...deletedComment };
  }

  static async updateScore(id, newScore) {
    await this.delay();
    const comment = this.comments.find(c => c.Id === parseInt(id));
    
    if (!comment) {
      throw new Error('Comment not found');
    }

    comment.score = newScore;
    return { ...comment };
  }
}