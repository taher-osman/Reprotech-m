// API service for human-resources module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface HumanResourcesRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface HumanResourcesStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class HumanResourcesAPI {
  async getRecords(): Promise<HumanResourcesRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/human-resources`);
      if (!response.ok) {
        throw new Error('Failed to fetch human-resources records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching human-resources records:', error);
      // Return mock data for now
      return [
        {
          id: 'HR-001',
          name: 'Sample human-resources Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<HumanResourcesStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/human-resources/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch human-resources stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching human-resources stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<HumanResourcesRecord>): Promise<HumanResourcesRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/human-resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create human-resources record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating human-resources record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<HumanResourcesRecord>): Promise<HumanResourcesRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/human-resources/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update human-resources record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating human-resources record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/human-resources/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete human-resources record');
      }
    } catch (error) {
      console.error('Error deleting human-resources record:', error);
      throw error;
    }
  }
}

const api = new HumanResourcesAPI();
export default api;

// Export types for use in components
export type {
  HumanResourcesRecord,
  HumanResourcesStats
};
