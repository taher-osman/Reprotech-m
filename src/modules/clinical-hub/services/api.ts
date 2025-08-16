// API service for clinical-hub module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface ClinicalHubRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ClinicalHubStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class ClinicalHubAPI {
  async getRecords(): Promise<ClinicalHubRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/clinical-hub`);
      if (!response.ok) {
        throw new Error('Failed to fetch clinical-hub records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching clinical-hub records:', error);
      // Return mock data for now
      return [
        {
          id: 'CH-001',
          name: 'Sample clinical-hub Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<ClinicalHubStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/clinical-hub/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch clinical-hub stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching clinical-hub stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<ClinicalHubRecord>): Promise<ClinicalHubRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/clinical-hub`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create clinical-hub record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating clinical-hub record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<ClinicalHubRecord>): Promise<ClinicalHubRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/clinical-hub/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update clinical-hub record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating clinical-hub record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/clinical-hub/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete clinical-hub record');
      }
    } catch (error) {
      console.error('Error deleting clinical-hub record:', error);
      throw error;
    }
  }
}

const api = new ClinicalHubAPI();
export default api;

// Export types for use in components
export type {
  ClinicalHubRecord,
  ClinicalHubStats
};
