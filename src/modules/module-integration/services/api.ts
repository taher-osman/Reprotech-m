// API service for module-integration module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface ModuleIntegrationRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ModuleIntegrationStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class ModuleIntegrationAPI {
  async getRecords(): Promise<ModuleIntegrationRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/module-integration`);
      if (!response.ok) {
        throw new Error('Failed to fetch module-integration records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching module-integration records:', error);
      // Return mock data for now
      return [
        {
          id: 'MI-001',
          name: 'Sample module-integration Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<ModuleIntegrationStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/module-integration/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch module-integration stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching module-integration stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<ModuleIntegrationRecord>): Promise<ModuleIntegrationRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/module-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create module-integration record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating module-integration record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<ModuleIntegrationRecord>): Promise<ModuleIntegrationRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/module-integration/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update module-integration record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating module-integration record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/module-integration/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete module-integration record');
      }
    } catch (error) {
      console.error('Error deleting module-integration record:', error);
      throw error;
    }
  }
}

const api = new ModuleIntegrationAPI();
export default api;

// Export types for use in components
export type {
  ModuleIntegrationRecord,
  ModuleIntegrationStats
};
