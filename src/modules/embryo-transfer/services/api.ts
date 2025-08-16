// API service for embryo-transfer module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface EmbryoTransferRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface EmbryoTransferStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class EmbryoTransferAPI {
  async getRecords(): Promise<EmbryoTransferRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/embryo-transfer`);
      if (!response.ok) {
        throw new Error('Failed to fetch embryo-transfer records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching embryo-transfer records:', error);
      // Return mock data for now
      return [
        {
          id: 'ET-001',
          name: 'Sample embryo-transfer Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<EmbryoTransferStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/embryo-transfer/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch embryo-transfer stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching embryo-transfer stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<EmbryoTransferRecord>): Promise<EmbryoTransferRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/embryo-transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create embryo-transfer record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating embryo-transfer record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<EmbryoTransferRecord>): Promise<EmbryoTransferRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/embryo-transfer/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update embryo-transfer record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating embryo-transfer record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/embryo-transfer/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete embryo-transfer record');
      }
    } catch (error) {
      console.error('Error deleting embryo-transfer record:', error);
      throw error;
    }
  }
}

const api = new EmbryoTransferAPI();
export default api;

// Export types for use in components
export type {
  EmbryoTransferRecord,
  EmbryoTransferStats
};
