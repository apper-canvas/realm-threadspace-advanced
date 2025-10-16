import usersData from '@/services/mockData/users.json';
import { PostService } from '@/services/api/postService';

let users = [...usersData];
let nextId = Math.max(...users.map(u => u.Id), 0) + 1;

const calculateUserKarma = (username) => {
  const allPosts = PostService.getAll();
  const userPosts = allPosts.filter(post => post.author === username);
  return userPosts.reduce((total, post) => total + (post.score || 0), 0);
};

export const UserService = {
  getAll() {
    return users.map(user => ({
      ...user,
      karma: calculateUserKarma(user.username)
    }));
  },

  getById(id) {
    if (!Number.isInteger(id)) {
      throw new Error('User ID must be an integer');
    }
    const user = users.find(u => u.Id === id);
    if (!user) {
      return null;
    }
    return {
      ...user,
      karma: calculateUserKarma(user.username)
    };
  },

  getByUsername(username) {
    if (!username || typeof username !== 'string') {
      return null;
    }
    const user = users.find(u => u.username === username);
    if (!user) {
      return null;
    }
    return {
      ...user,
      karma: calculateUserKarma(user.username)
    };
  },

  create(userData) {
    const newUser = {
      ...userData,
      Id: nextId++,
      joinDate: new Date().toISOString(),
      karma: 0
    };
    delete newUser.Id;
    newUser.Id = nextId - 1;
    users.push(newUser);
    return { ...newUser };
  },

  update(id, userData) {
    if (!Number.isInteger(id)) {
      throw new Error('User ID must be an integer');
    }
    const index = users.findIndex(u => u.Id === id);
    if (index === -1) {
      return null;
    }
    users[index] = {
      ...users[index],
      ...userData,
      Id: users[index].Id,
      joinDate: users[index].joinDate
    };
    return { ...users[index] };
  },

  delete(id) {
    if (!Number.isInteger(id)) {
      throw new Error('User ID must be an integer');
    }
    const index = users.findIndex(u => u.Id === id);
    if (index === -1) {
      return false;
    }
    users.splice(index, 1);
    return true;
  }
};