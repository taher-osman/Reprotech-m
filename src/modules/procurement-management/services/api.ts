// API service for procurement-management module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface ProcurementManagementRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ProcurementManagementStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class ProcurementManagementAPI {
  async getRecords(): Promise<ProcurementManagementRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/procurement-management`);
      if (!response.ok) {
        throw new Error('Failed to fetch procurement-management records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching procurement-management records:', error);
      // Return mock data for now
      return [
        {
          id: 'PM-001',
          name: 'Sample procurement-management Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<ProcurementManagementStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/procurement-management/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch procurement-management stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching procurement-management stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<ProcurementManagementRecord>): Promise<ProcurementManagementRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/procurement-management`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create procurement-management record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating procurement-management record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<ProcurementManagementRecord>): Promise<ProcurementManagementRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/procurement-management/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update procurement-management record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating procurement-management record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/procurement-management/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete procurement-management record');
      }
    } catch (error) {
      console.error('Error deleting procurement-management record:', error);
      throw error;
    }
  }
}

const api = new ProcurementManagementAPI();
export default api;

// Export types for use in components
export type {
  ProcurementManagementRecord,
  ProcurementManagementStats
};
