// API service for research module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface ResearchRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ResearchStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class ResearchAPI {
  async getRecords(): Promise<ResearchRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/research`);
      if (!response.ok) {
        throw new Error('Failed to fetch research records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching research records:', error);
      // Return mock data for now
      return [
        {
          id: 'R-001',
          name: 'Sample research Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<ResearchStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/research/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch research stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching research stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<ResearchRecord>): Promise<ResearchRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/research`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create research record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating research record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<ResearchRecord>): Promise<ResearchRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/research/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update research record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating research record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/research/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete research record');
      }
    } catch (error) {
      console.error('Error deleting research record:', error);
      throw error;
    }
  }
}

const api = new ResearchAPI();
export default api;

// Export types for use in components
export type {
  ResearchRecord,
  ResearchStats
};
