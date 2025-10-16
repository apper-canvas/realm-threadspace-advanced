import { getApperClient } from "@/services/apperClient";

export class CommunityService {
  static async search(query) {
    if (!query || !query.trim()) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const apperClient = getApperClient();
    
    try {
      const response = await apperClient.fetchRecords('community_c', {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "name_c" }},
          { field: { Name: "description_c" }},
          { field: { Name: "category_c" }},
          { field: { Name: "member_count_c" }},
          { field: { Name: "color_c" }}
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                { fieldName: "name_c", operator: "Contains", values: [searchTerm] },
                { fieldName: "description_c", operator: "Contains", values: [searchTerm] },
                { fieldName: "category_c", operator: "Contains", values: [searchTerm] }
              ],
              operator: "OR"
            }
          ]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      const results = [];
      for (const community of response.data || []) {
        const nameMatch = community.name_c?.toLowerCase().includes(searchTerm);
        const descMatch = community.description_c?.toLowerCase().includes(searchTerm);
        const categoryMatch = community.category_c?.toLowerCase().includes(searchTerm);

        let snippet = '';
        if (descMatch && community.description_c) {
          const index = community.description_c.toLowerCase().indexOf(searchTerm);
          const start = Math.max(0, index - 40);
          const end = Math.min(community.description_c.length, index + searchTerm.length + 40);
          snippet = community.description_c.substring(start, end);
        } else if (categoryMatch && community.category_c) {
          snippet = `Category: ${community.category_c}`;
        }

        results.push({
          community: {
            Id: community.Id,
            name: community.name_c,
            description: community.description_c,
            category: community.category_c,
            memberCount: community.member_count_c || 0,
            color: community.color_c || "#FF4500"
          },
          snippet: snippet.trim()
        });
      }

      return results;
    } catch (error) {
      console.error("Error searching communities:", error);
      return [];
    }
  }

  static async getAll() {
    const apperClient = getApperClient();
    
    try {
      const response = await apperClient.fetchRecords('community_c', {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "name_c" }},
          { field: { Name: "description_c" }},
          { field: { Name: "category_c" }},
          { field: { Name: "member_count_c" }},
          { field: { Name: "color_c" }},
          { field: { Name: "post_count_c" }}
        ],
        pagingInfo: { limit: 100, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return (response.data || []).map(c => ({
        Id: c.Id,
        id: `community_${c.Id}`,
        name: c.name_c,
        description: c.description_c,
        category: c.category_c,
        memberCount: c.member_count_c || 0,
        color: c.color_c || "#FF4500",
        postCount: c.post_count_c || 0
      }));
    } catch (error) {
      console.error("Error fetching communities:", error);
      return [];
    }
  }

  static async getById(id) {
    const apperClient = getApperClient();
    
    try {
      const response = await apperClient.getRecordById('community_c', parseInt(id), {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "name_c" }},
          { field: { Name: "description_c" }},
          { field: { Name: "category_c" }},
          { field: { Name: "member_count_c" }},
          { field: { Name: "color_c" }},
          { field: { Name: "post_count_c" }}
        ]
      });

      if (!response.success || !response.data) {
        return null;
      }

      const c = response.data;
      return {
        Id: c.Id,
        id: `community_${c.Id}`,
        name: c.name_c,
        description: c.description_c,
        category: c.category_c,
        memberCount: c.member_count_c || 0,
        color: c.color_c || "#FF4500",
        postCount: c.post_count_c || 0
      };
    } catch (error) {
      console.error("Error fetching community by id:", error);
      return null;
    }
  }

  static async getByName(name) {
    const apperClient = getApperClient();
    
    try {
      const response = await apperClient.fetchRecords('community_c', {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "name_c" }},
          { field: { Name: "description_c" }},
          { field: { Name: "category_c" }},
          { field: { Name: "member_count_c" }},
          { field: { Name: "color_c" }},
          { field: { Name: "post_count_c" }}
        ],
        where: [
          { FieldName: "name_c", Operator: "EqualTo", Values: [name] }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      });

      if (!response.success || !response.data || response.data.length === 0) {
        return null;
      }

      const c = response.data[0];
      return {
        Id: c.Id,
        id: `community_${c.Id}`,
        name: c.name_c,
        description: c.description_c,
        category: c.category_c,
        memberCount: c.member_count_c || 0,
        color: c.color_c || "#FF4500",
        postCount: c.post_count_c || 0
      };
    } catch (error) {
      console.error("Error fetching community by name:", error);
      return null;
    }
  }

  static async create(communityData) {
    const apperClient = getApperClient();
    
    try {
      const response = await apperClient.createRecord('community_c', {
        records: [{
          name_c: communityData.name,
          description_c: communityData.description,
          member_count_c: communityData.memberCount || 1,
          color_c: communityData.color || "#FF4500",
          category_c: communityData.category || "General"
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success && result.data) {
          const c = result.data;
          return {
            Id: c.Id,
            id: `community_${c.Id}`,
            name: c.name_c,
            description: c.description_c,
            category: c.category_c,
            memberCount: c.member_count_c || 1,
            color: c.color_c || "#FF4500"
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating community:", error);
      return null;
    }
  }

  static async update(id, updateData) {
    const apperClient = getApperClient();
    
    try {
      const updateRecord = { Id: parseInt(id) };
      if (updateData.name) updateRecord.name_c = updateData.name;
      if (updateData.description) updateRecord.description_c = updateData.description;
      if (updateData.memberCount !== undefined) updateRecord.member_count_c = updateData.memberCount;
      if (updateData.color) updateRecord.color_c = updateData.color;
      if (updateData.category) updateRecord.category_c = updateData.category;

      const response = await apperClient.updateRecord('community_c', {
        records: [updateRecord]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success && result.data) {
          const c = result.data;
          return {
            Id: c.Id,
            id: `community_${c.Id}`,
            name: c.name_c,
            description: c.description_c,
            category: c.category_c,
            memberCount: c.member_count_c || 0,
            color: c.color_c || "#FF4500"
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating community:", error);
      return null;
    }
  }

  static async delete(id) {
    const apperClient = getApperClient();
    
    try {
      const response = await apperClient.deleteRecord('community_c', {
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
      console.error("Error deleting community:", error);
      return false;
    }
  }
}