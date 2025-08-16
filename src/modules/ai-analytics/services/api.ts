// API service for ai-analytics module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface AiAnalyticsRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface AiAnalyticsStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class AiAnalyticsAPI {
  async getRecords(): Promise<AiAnalyticsRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/ai-analytics`);
      if (!response.ok) {
        throw new Error('Failed to fetch ai-analytics records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ai-analytics records:', error);
      // Return mock data for now
      return [
        {
          id: 'AA-001',
          name: 'Sample ai-analytics Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<AiAnalyticsStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/ai-analytics/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch ai-analytics stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ai-analytics stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<AiAnalyticsRecord>): Promise<AiAnalyticsRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/ai-analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create ai-analytics record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating ai-analytics record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<AiAnalyticsRecord>): Promise<AiAnalyticsRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/ai-analytics/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update ai-analytics record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating ai-analytics record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/ai-analytics/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete ai-analytics record');
      }
    } catch (error) {
      console.error('Error deleting ai-analytics record:', error);
      throw error;
    }
  }
}

const api = new AiAnalyticsAPI();
export default api;

// Export types for use in components
export type {
  AiAnalyticsRecord,
  AiAnalyticsStats
};
