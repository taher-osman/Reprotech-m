// API service for biobank-integration module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface BiobankIntegrationRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface BiobankIntegrationStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class BiobankIntegrationAPI {
  async getRecords(): Promise<BiobankIntegrationRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/biobank-integration`);
      if (!response.ok) {
        throw new Error('Failed to fetch biobank-integration records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching biobank-integration records:', error);
      // Return mock data for now
      return [
        {
          id: 'BI-001',
          name: 'Sample biobank-integration Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<BiobankIntegrationStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/biobank-integration/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch biobank-integration stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching biobank-integration stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<BiobankIntegrationRecord>): Promise<BiobankIntegrationRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/biobank-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create biobank-integration record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating biobank-integration record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<BiobankIntegrationRecord>): Promise<BiobankIntegrationRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/biobank-integration/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update biobank-integration record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating biobank-integration record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/biobank-integration/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete biobank-integration record');
      }
    } catch (error) {
      console.error('Error deleting biobank-integration record:', error);
      throw error;
    }
  }
}

const api = new BiobankIntegrationAPI();
export default api;

// Export types for use in components
export type {
  BiobankIntegrationRecord,
  BiobankIntegrationStats
};
