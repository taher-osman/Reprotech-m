// API service for media-preparation module
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';

interface MediaPreparationRecord {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaPreparationStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

class MediaPreparationAPI {
  async getRecords(): Promise<MediaPreparationRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/media-preparation`);
      if (!response.ok) {
        throw new Error('Failed to fetch media-preparation records');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching media-preparation records:', error);
      // Return mock data for now
      return [
        {
          id: 'MP-001',
          name: 'Sample media-preparation Record',
          status: 'Active',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
      ];
    }
  }

  async getStats(): Promise<MediaPreparationStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/media-preparation/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch media-preparation stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching media-preparation stats:', error);
      // Return mock data for now
      return {
        total: 10,
        active: 7,
        completed: 2,
        pending: 1
      };
    }
  }

  async createRecord(data: Partial<MediaPreparationRecord>): Promise<MediaPreparationRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/media-preparation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create media-preparation record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating media-preparation record:', error);
      throw error;
    }
  }

  async updateRecord(id: string, data: Partial<MediaPreparationRecord>): Promise<MediaPreparationRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/media-preparation/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update media-preparation record');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating media-preparation record:', error);
      throw error;
    }
  }

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/test/media-preparation/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete media-preparation record');
      }
    } catch (error) {
      console.error('Error deleting media-preparation record:', error);
      throw error;
    }
  }
}

const api = new MediaPreparationAPI();
export default api;

// Export types for use in components
export type {
  MediaPreparationRecord,
  MediaPreparationStats
};
