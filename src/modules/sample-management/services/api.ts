// API service for sample-management module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface SampleManagementRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface SampleManagementStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class SampleManagementAPI {
  async getRecords(): Promise<SampleManagementRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/sample-management`);
      if (!response.ok) {
        throw new Error('Failed to fetch sample-management records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching sample-management records:', error);
      // Return mock data for now
      return [
        {
          id: 'SM-001',
          name: 'Sample sample-management Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<SampleManagementStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/sample-management/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch sample-management stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching sample-management stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<SampleManagementRecord>): Promise<SampleManagementRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/sample-management`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create sample-management record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating sample-management record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<SampleManagementRecord>): Promise<SampleManagementRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/sample-management/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update sample-management record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating sample-management record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/sample-management/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete sample-management record');
      }
    } catch (error) {
      console.error('Error deleting sample-management record:', error);
      throw error;
    }
  }
}

const api = new SampleManagementAPI();
export default api;

// Export types for use in components
export type {
  SampleManagementRecord,
  SampleManagementStats
};
