// API service for lab-workflow module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface LabWorkflowRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface LabWorkflowStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class LabWorkflowAPI {
  async getRecords(): Promise<LabWorkflowRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/lab-workflow`);
      if (!response.ok) {
        throw new Error('Failed to fetch lab-workflow records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching lab-workflow records:', error);
      // Return mock data for now
      return [
        {
          id: 'LW-001',
          name: 'Sample lab-workflow Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<LabWorkflowStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/lab-workflow/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch lab-workflow stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching lab-workflow stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<LabWorkflowRecord>): Promise<LabWorkflowRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/lab-workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create lab-workflow record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating lab-workflow record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<LabWorkflowRecord>): Promise<LabWorkflowRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/lab-workflow/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update lab-workflow record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating lab-workflow record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/lab-workflow/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete lab-workflow record');
      }
    } catch (error) {
      console.error('Error deleting lab-workflow record:', error);
      throw error;
    }
  }
}

const api = new LabWorkflowAPI();
export default api;

// Export types for use in components
export type {
  LabWorkflowRecord,
  LabWorkflowStats
};
