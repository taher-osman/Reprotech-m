// API service for biobank module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface BiobankRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface BiobankStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class BiobankAPI {
  async getRecords(): Promise<BiobankRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/biobank`);
      if (!response.ok) {
        throw new Error('Failed to fetch biobank records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching biobank records:', error);
      // Return mock data for now
      return [
        {
          id: 'B-001',
          name: 'Sample biobank Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<BiobankStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/biobank/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch biobank stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching biobank stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<BiobankRecord>): Promise<BiobankRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/biobank`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create biobank record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating biobank record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<BiobankRecord>): Promise<BiobankRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/biobank/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update biobank record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating biobank record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/biobank/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete biobank record');
      }
    } catch (error) {
      console.error('Error deleting biobank record:', error);
      throw error;
    }
  }
}

const api = new BiobankAPI();
export default api;

// Export types for use in components
export type {
  BiobankRecord,
  BiobankStats
};
