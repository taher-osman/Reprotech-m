// API service for beadchip-mappings module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface BeadchipMappingsRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface BeadchipMappingsStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class BeadchipMappingsAPI {
  async getRecords(): Promise<BeadchipMappingsRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/beadchip-mappings`);
      if (!response.ok) {
        throw new Error('Failed to fetch beadchip-mappings records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching beadchip-mappings records:', error);
      // Return mock data for now
      return [
        {
          id: 'BM-001',
          name: 'Sample beadchip-mappings Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<BeadchipMappingsStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/beadchip-mappings/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch beadchip-mappings stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching beadchip-mappings stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<BeadchipMappingsRecord>): Promise<BeadchipMappingsRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/beadchip-mappings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create beadchip-mappings record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating beadchip-mappings record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<BeadchipMappingsRecord>): Promise<BeadchipMappingsRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/beadchip-mappings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update beadchip-mappings record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating beadchip-mappings record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/beadchip-mappings/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete beadchip-mappings record');
      }
    } catch (error) {
      console.error('Error deleting beadchip-mappings record:', error);
      throw error;
    }
  }
}

const api = new BeadchipMappingsAPI();
export default api;

// Export types for use in components
export type {
  BeadchipMappingsRecord,
  BeadchipMappingsStats
};
