// API service for integration-hub module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface IntegrationHubRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface IntegrationHubStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class IntegrationHubAPI {
  async getRecords(): Promise<IntegrationHubRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/integration-hub`);
      if (!response.ok) {
        throw new Error('Failed to fetch integration-hub records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching integration-hub records:', error);
      // Return mock data for now
      return [
        {
          id: 'IH-001',
          name: 'Sample integration-hub Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<IntegrationHubStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/integration-hub/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch integration-hub stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching integration-hub stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<IntegrationHubRecord>): Promise<IntegrationHubRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/integration-hub`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create integration-hub record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating integration-hub record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<IntegrationHubRecord>): Promise<IntegrationHubRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/integration-hub/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update integration-hub record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating integration-hub record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/integration-hub/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete integration-hub record');
      }
    } catch (error) {
      console.error('Error deleting integration-hub record:', error);
      throw error;
    }
  }
}

const api = new IntegrationHubAPI();
export default api;

// Export types for use in components
export type {
  IntegrationHubRecord,
  IntegrationHubStats
};
