// API service for clinical-management module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface ClinicalManagementRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ClinicalManagementStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class ClinicalManagementAPI {
  async getRecords(): Promise<ClinicalManagementRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/clinical-management`);
      if (!response.ok) {
        throw new Error('Failed to fetch clinical-management records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching clinical-management records:', error);
      // Return mock data for now
      return [
        {
          id: 'CM-001',
          name: 'Sample clinical-management Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<ClinicalManagementStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/clinical-management/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch clinical-management stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching clinical-management stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<ClinicalManagementRecord>): Promise<ClinicalManagementRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/clinical-management`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create clinical-management record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating clinical-management record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<ClinicalManagementRecord>): Promise<ClinicalManagementRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/clinical-management/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update clinical-management record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating clinical-management record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/clinical-management/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete clinical-management record');
      }
    } catch (error) {
      console.error('Error deleting clinical-management record:', error);
      throw error;
    }
  }
}

const api = new ClinicalManagementAPI();
export default api;

// Export types for use in components
export type {
  ClinicalManagementRecord,
  ClinicalManagementStats
};
