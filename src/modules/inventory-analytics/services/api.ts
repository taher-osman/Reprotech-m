// API service for inventory-analytics module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface InventoryAnalyticsRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface InventoryAnalyticsStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class InventoryAnalyticsAPI {
  async getRecords(): Promise<InventoryAnalyticsRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/inventory-analytics`);
      if (!response.ok) {
        throw new Error('Failed to fetch inventory-analytics records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching inventory-analytics records:', error);
      // Return mock data for now
      return [
        {
          id: 'IA-001',
          name: 'Sample inventory-analytics Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<InventoryAnalyticsStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/inventory-analytics/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch inventory-analytics stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching inventory-analytics stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<InventoryAnalyticsRecord>): Promise<InventoryAnalyticsRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/inventory-analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create inventory-analytics record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating inventory-analytics record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<InventoryAnalyticsRecord>): Promise<InventoryAnalyticsRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/inventory-analytics/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update inventory-analytics record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating inventory-analytics record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/inventory-analytics/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete inventory-analytics record');
      }
    } catch (error) {
      console.error('Error deleting inventory-analytics record:', error);
      throw error;
    }
  }
}

const api = new InventoryAnalyticsAPI();
export default api;

// Export types for use in components
export type {
  InventoryAnalyticsRecord,
  InventoryAnalyticsStats
};
