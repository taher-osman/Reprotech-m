// API service for clinical-scheduling module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface ClinicalSchedulingRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ClinicalSchedulingStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class ClinicalSchedulingAPI {
  async getRecords(): Promise<ClinicalSchedulingRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/clinical-scheduling`);
      if (!response.ok) {
        throw new Error('Failed to fetch clinical-scheduling records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching clinical-scheduling records:', error);
      // Return mock data for now
      return [
        {
          id: 'CS-001',
          name: 'Sample clinical-scheduling Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<ClinicalSchedulingStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/clinical-scheduling/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch clinical-scheduling stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching clinical-scheduling stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<ClinicalSchedulingRecord>): Promise<ClinicalSchedulingRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/clinical-scheduling`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create clinical-scheduling record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating clinical-scheduling record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<ClinicalSchedulingRecord>): Promise<ClinicalSchedulingRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/clinical-scheduling/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update clinical-scheduling record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating clinical-scheduling record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/clinical-scheduling/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete clinical-scheduling record');
      }
    } catch (error) {
      console.error('Error deleting clinical-scheduling record:', error);
      throw error;
    }
  }
}

const api = new ClinicalSchedulingAPI();
export default api;

// Export types for use in components
export type {
  ClinicalSchedulingRecord,
  ClinicalSchedulingStats
};
