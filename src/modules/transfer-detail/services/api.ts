// API service for transfer-detail module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface TransferDetailRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface TransferDetailStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class TransferDetailAPI {
  async getRecords(): Promise<TransferDetailRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/transfer-detail`);
      if (!response.ok) {
        throw new Error('Failed to fetch transfer-detail records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching transfer-detail records:', error);
      // Return mock data for now
      return [
        {
          id: 'TD-001',
          name: 'Sample transfer-detail Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<TransferDetailStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/transfer-detail/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch transfer-detail stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching transfer-detail stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<TransferDetailRecord>): Promise<TransferDetailRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/transfer-detail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create transfer-detail record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating transfer-detail record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<TransferDetailRecord>): Promise<TransferDetailRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/transfer-detail/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update transfer-detail record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating transfer-detail record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/transfer-detail/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete transfer-detail record');
      }
    } catch (error) {
      console.error('Error deleting transfer-detail record:', error);
      throw error;
    }
  }
}

const api = new TransferDetailAPI();
export default api;

// Export types for use in components
export type {
  TransferDetailRecord,
  TransferDetailStats
};
