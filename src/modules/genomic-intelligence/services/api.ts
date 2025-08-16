// API service for genomic-intelligence module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface GenomicIntelligenceRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface GenomicIntelligenceStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class GenomicIntelligenceAPI {
  async getRecords(): Promise<GenomicIntelligenceRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/genomic-intelligence`);
      if (!response.ok) {
        throw new Error('Failed to fetch genomic-intelligence records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching genomic-intelligence records:', error);
      // Return mock data for now
      return [
        {
          id: 'GI-001',
          name: 'Sample genomic-intelligence Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<GenomicIntelligenceStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/genomic-intelligence/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch genomic-intelligence stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching genomic-intelligence stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<GenomicIntelligenceRecord>): Promise<GenomicIntelligenceRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/genomic-intelligence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create genomic-intelligence record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating genomic-intelligence record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<GenomicIntelligenceRecord>): Promise<GenomicIntelligenceRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/genomic-intelligence/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update genomic-intelligence record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating genomic-intelligence record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/genomic-intelligence/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete genomic-intelligence record');
      }
    } catch (error) {
      console.error('Error deleting genomic-intelligence record:', error);
      throw error;
    }
  }
}

const api = new GenomicIntelligenceAPI();
export default api;

// Export types for use in components
export type {
  GenomicIntelligenceRecord,
  GenomicIntelligenceStats
};
