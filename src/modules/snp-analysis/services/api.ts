// API service for snp-analysis module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface SnpAnalysisRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface SnpAnalysisStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class SnpAnalysisAPI {
  async getRecords(): Promise<SnpAnalysisRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/snp-analysis`);
      if (!response.ok) {
        throw new Error('Failed to fetch snp-analysis records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching snp-analysis records:', error);
      // Return mock data for now
      return [
        {
          id: 'SA-001',
          name: 'Sample snp-analysis Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<SnpAnalysisStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/snp-analysis/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch snp-analysis stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching snp-analysis stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<SnpAnalysisRecord>): Promise<SnpAnalysisRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/snp-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create snp-analysis record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating snp-analysis record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<SnpAnalysisRecord>): Promise<SnpAnalysisRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/snp-analysis/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update snp-analysis record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating snp-analysis record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/snp-analysis/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete snp-analysis record');
      }
    } catch (error) {
      console.error('Error deleting snp-analysis record:', error);
      throw error;
    }
  }
}

const api = new SnpAnalysisAPI();
export default api;

// Export types for use in components
export type {
  SnpAnalysisRecord,
  SnpAnalysisStats
};
