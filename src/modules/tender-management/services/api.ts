// API service for tender-management module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface TenderManagementRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface TenderManagementStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class TenderManagementAPI {
  async getRecords(): Promise<TenderManagementRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/tender-management`);
      if (!response.ok) {
        throw new Error('Failed to fetch tender-management records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching tender-management records:', error);
      // Return mock data for now
      return [
        {
          id: 'TM-001',
          name: 'Sample tender-management Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<TenderManagementStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/tender-management/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch tender-management stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching tender-management stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<TenderManagementRecord>): Promise<TenderManagementRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/tender-management`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create tender-management record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating tender-management record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<TenderManagementRecord>): Promise<TenderManagementRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/tender-management/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update tender-management record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating tender-management record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/tender-management/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete tender-management record');
      }
    } catch (error) {
      console.error('Error deleting tender-management record:', error);
      throw error;
    }
  }
}

const api = new TenderManagementAPI();
export default api;

// Export types for use in components
export type {
  TenderManagementRecord,
  TenderManagementStats
};
