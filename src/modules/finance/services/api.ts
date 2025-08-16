// API service for finance module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface FinanceRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface FinanceStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class FinanceAPI {
  async getRecords(): Promise<FinanceRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/finance`);
      if (!response.ok) {
        throw new Error('Failed to fetch finance records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching finance records:', error);
      // Return mock data for now
      return [
        {
          id: 'F-001',
          name: 'Sample finance Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<FinanceStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/finance/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch finance stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching finance stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<FinanceRecord>): Promise<FinanceRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/finance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create finance record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating finance record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<FinanceRecord>): Promise<FinanceRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/finance/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update finance record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating finance record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/finance/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete finance record');
      }
    } catch (error) {
      console.error('Error deleting finance record:', error);
      throw error;
    }
  }
}

const api = new FinanceAPI();
export default api;

// Export types for use in components
export type {
  FinanceRecord,
  FinanceStats
};
