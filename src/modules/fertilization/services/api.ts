// API service for fertilization module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface FertilizationRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface FertilizationStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class FertilizationAPI {
  async getRecords(): Promise<FertilizationRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/fertilization`);
      if (!response.ok) {
        throw new Error('Failed to fetch fertilization records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching fertilization records:', error);
      // Return mock data for now
      return [
        {
          id: 'F-001',
          name: 'Sample fertilization Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<FertilizationStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/fertilization/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch fertilization stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching fertilization stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<FertilizationRecord>): Promise<FertilizationRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/fertilization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create fertilization record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating fertilization record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<FertilizationRecord>): Promise<FertilizationRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/fertilization/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update fertilization record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating fertilization record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/fertilization/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete fertilization record');
      }
    } catch (error) {
      console.error('Error deleting fertilization record:', error);
      throw error;
    }
  }
}

const api = new FertilizationAPI();
export default api;

// Export types for use in components
export type {
  FertilizationRecord,
  FertilizationStats
};
