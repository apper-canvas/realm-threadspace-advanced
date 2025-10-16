import communitiesData from "@/services/mockData/communities.json";

export class CommunityService {
  static communities = [...communitiesData];

  static async search(query) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query || !query.trim()) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const results = [];

    for (const community of this.communities) {
      const nameMatch = community.name.toLowerCase().includes(searchTerm);
      const descMatch = community.description.toLowerCase().includes(searchTerm);
      const categoryMatch = community.category.toLowerCase().includes(searchTerm);

      if (nameMatch || descMatch || categoryMatch) {
        let snippet = '';
        
        if (descMatch) {
          const index = community.description.toLowerCase().indexOf(searchTerm);
          const start = Math.max(0, index - 40);
          const end = Math.min(community.description.length, index + searchTerm.length + 40);
          snippet = community.description.substring(start, end);
        } else if (categoryMatch) {
          snippet = `Category: ${community.category}`;
        }

        results.push({
          community,
          snippet: snippet.trim()
        });
      }
    }

    return results;
  }
  static delay = () => new Promise(resolve => setTimeout(resolve, 250));

  static async getAll() {
    await this.delay();
    return [...this.communities.map(community => ({ ...community }))];
  }

  static async getById(id) {
    await this.delay();
    const community = this.communities.find(c => c.Id === parseInt(id));
    return community ? { ...community } : null;
  }

  static async getByName(name) {
    await this.delay();
    const community = this.communities.find(c => c.name.toLowerCase() === name.toLowerCase());
    return community ? { ...community } : null;
  }

  static async create(communityData) {
    await this.delay();
    
    const maxId = Math.max(...this.communities.map(c => c.Id), 0);
    const newCommunity = {
      Id: maxId + 1,
      id: `community_${maxId + 1}`,
      name: communityData.name,
      description: communityData.description,
      memberCount: communityData.memberCount || 1,
      color: communityData.color || "#FF4500"
    };
    
    this.communities.push(newCommunity);
    return { ...newCommunity };
  }

  static async update(id, updateData) {
    await this.delay();
    
    const index = this.communities.findIndex(c => c.Id === parseInt(id));
    if (index === -1) return null;
    
    this.communities[index] = { ...this.communities[index], ...updateData };
    return { ...this.communities[index] };
  }

  static async delete(id) {
    await this.delay();
    
    const index = this.communities.findIndex(c => c.Id === parseInt(id));
    if (index === -1) return false;
    
    this.communities.splice(index, 1);
    return true;
}
}