// API service for semen-management module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface SemenManagementRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface SemenManagementStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class SemenManagementAPI {
  async getRecords(): Promise<SemenManagementRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/semen-management`);
      if (!response.ok) {
        throw new Error('Failed to fetch semen-management records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching semen-management records:', error);
      // Return mock data for now
      return [
        {
          id: 'SM-001',
          name: 'Sample semen-management Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<SemenManagementStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/semen-management/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch semen-management stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching semen-management stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<SemenManagementRecord>): Promise<SemenManagementRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/semen-management`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create semen-management record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating semen-management record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<SemenManagementRecord>): Promise<SemenManagementRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/semen-management/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update semen-management record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating semen-management record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/semen-management/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete semen-management record');
      }
    } catch (error) {
      console.error('Error deleting semen-management record:', error);
      throw error;
    }
  }
}

const api = new SemenManagementAPI();
export default api;

// Export types for use in components
export type {
  SemenManagementRecord,
  SemenManagementStats
};
