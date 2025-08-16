// API service for inventory module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface InventoryRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface InventoryStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class InventoryAPI {
  async getRecords(): Promise<InventoryRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/inventory`);
      if (!response.ok) {
        throw new Error('Failed to fetch inventory records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching inventory records:', error);
      // Return mock data for now
      return [
        {
          id: 'I-001',
          name: 'Sample inventory Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<InventoryStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/inventory/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch inventory stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching inventory stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<InventoryRecord>): Promise<InventoryRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create inventory record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating inventory record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<InventoryRecord>): Promise<InventoryRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/inventory/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update inventory record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating inventory record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/inventory/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete inventory record');
      }
    } catch (error) {
      console.error('Error deleting inventory record:', error);
      throw error;
    }
  }
}

const api = new InventoryAPI();
export default api;

// Export types for use in components
export type {
  InventoryRecord,
  InventoryStats
};
