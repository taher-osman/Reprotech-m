// API service for reproduction-hub module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface ReproductionHubRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ReproductionHubStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class ReproductionHubAPI {
  async getRecords(): Promise<ReproductionHubRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/reproduction-hub`);
      if (!response.ok) {
        throw new Error('Failed to fetch reproduction-hub records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching reproduction-hub records:', error);
      // Return mock data for now
      return [
        {
          id: 'RH-001',
          name: 'Sample reproduction-hub Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<ReproductionHubStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/reproduction-hub/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch reproduction-hub stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching reproduction-hub stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<ReproductionHubRecord>): Promise<ReproductionHubRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/reproduction-hub`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create reproduction-hub record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating reproduction-hub record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<ReproductionHubRecord>): Promise<ReproductionHubRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/reproduction-hub/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update reproduction-hub record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating reproduction-hub record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/reproduction-hub/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete reproduction-hub record');
      }
    } catch (error) {
      console.error('Error deleting reproduction-hub record:', error);
      throw error;
    }
  }
}

const api = new ReproductionHubAPI();
export default api;

// Export types for use in components
export type {
  ReproductionHubRecord,
  ReproductionHubStats
};
