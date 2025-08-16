// API service for data-integration module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface DataIntegrationRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface DataIntegrationStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class DataIntegrationAPI {
  async getRecords(): Promise<DataIntegrationRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/data-integration`);
      if (!response.ok) {
        throw new Error('Failed to fetch data-integration records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching data-integration records:', error);
      // Return mock data for now
      return [
        {
          id: 'DI-001',
          name: 'Sample data-integration Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<DataIntegrationStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/data-integration/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch data-integration stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching data-integration stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<DataIntegrationRecord>): Promise<DataIntegrationRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/data-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create data-integration record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating data-integration record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<DataIntegrationRecord>): Promise<DataIntegrationRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/data-integration/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update data-integration record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating data-integration record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/data-integration/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete data-integration record');
      }
    } catch (error) {
      console.error('Error deleting data-integration record:', error);
      throw error;
    }
  }
}

const api = new DataIntegrationAPI();
export default api;

// Export types for use in components
export type {
  DataIntegrationRecord,
  DataIntegrationStats
};
