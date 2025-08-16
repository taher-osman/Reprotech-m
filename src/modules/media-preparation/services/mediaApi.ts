import { api } from '@/services/api';
import {
  MediaFormula,
  MediaBatch,
  MediaQualityControl,
  MediaUsage,
  MediaAnalytics,
  MediaSOP,
  CreateMediaFormulaRequest,
  CreateMediaBatchRequest,
  QualityControlRequest,
  MediaUsageRequest,
  MediaFormulaFilters,
  MediaBatchFilters,
  QualityControlFilters,
  UsageFilters,
  MediaListResponse,
  MediaFormulaResponse,
  MediaBatchResponse,
  MediaAnalyticsResponse
} from '../types/mediaTypes';

// Media Formula API
export const mediaFormulaApi = {
  // Get all formulas with optional filters
  getFormulas: async (filters?: MediaFormulaFilters, page = 1, limit = 10): Promise<MediaListResponse<MediaFormula>> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.createdBy) params.append('createdBy', filters.createdBy);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get(`/media/formulas?${params.toString()}`);
    return response.data;
  },

  // Get single formula by ID
  getFormula: async (id: string): Promise<MediaFormulaResponse> => {
    const response = await api.get(`/media/formulas/${id}`);
    return response.data;
  },

  // Create new formula
  createFormula: async (data: CreateMediaFormulaRequest): Promise<MediaFormulaResponse> => {
    const response = await api.post('/media/formulas', data);
    return response.data;
  },

  // Update formula
  updateFormula: async (id: string, data: Partial<CreateMediaFormulaRequest>): Promise<MediaFormulaResponse> => {
    const response = await api.put(`/media/formulas/${id}`, data);
    return response.data;
  },

  // Delete formula
  deleteFormula: async (id: string): Promise<{ success: boolean; message?: string }> => {
    const response = await api.delete(`/media/formulas/${id}`);
    return response.data;
  },

  // Get formula ingredients
  getFormulaIngredients: async (id: string): Promise<MediaListResponse<any>> => {
    const response = await api.get(`/media/formulas/${id}/ingredients`);
    return response.data;
  },

  // Add ingredient to formula
  addIngredient: async (formulaId: string, ingredient: any): Promise<MediaFormulaResponse> => {
    const response = await api.post(`/media/formulas/${formulaId}/ingredients`, ingredient);
    return response.data;
  }
};

// Media Batch API
export const mediaBatchApi = {
  // Get all batches with optional filters
  getBatches: async (filters?: MediaBatchFilters, page = 1, limit = 10): Promise<MediaListResponse<MediaBatch>> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.mediaFormulaId) params.append('mediaFormulaId', filters.mediaFormulaId);
    if (filters?.preparedBy) params.append('preparedBy', filters.preparedBy);
    if (filters?.dateRange) {
      params.append('startDate', filters.dateRange.start.toISOString());
      params.append('endDate', filters.dateRange.end.toISOString());
    }
    if (filters?.search) params.append('search', filters.search);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get(`/media/batches?${params.toString()}`);
    return response.data;
  },

  // Get single batch by ID
  getBatch: async (id: string): Promise<MediaBatchResponse> => {
    const response = await api.get(`/media/batches/${id}`);
    return response.data;
  },

  // Create new batch
  createBatch: async (data: CreateMediaBatchRequest): Promise<MediaBatchResponse> => {
    const response = await api.post('/media/batches', data);
    return response.data;
  },

  // Update batch
  updateBatch: async (id: string, data: Partial<CreateMediaBatchRequest>): Promise<MediaBatchResponse> => {
    const response = await api.put(`/media/batches/${id}`, data);
    return response.data;
  },

  // Delete batch
  deleteBatch: async (id: string): Promise<{ success: boolean; message?: string }> => {
    const response = await api.delete(`/media/batches/${id}`);
    return response.data;
  },

  // Start batch preparation
  startPreparation: async (id: string): Promise<MediaBatchResponse> => {
    const response = await api.post(`/media/batches/${id}/start-preparation`);
    return response.data;
  },

  // Complete batch preparation
  completePreparation: async (id: string): Promise<MediaBatchResponse> => {
    const response = await api.post(`/media/batches/${id}/complete`);
    return response.data;
  },

  // Get batch ingredients
  getBatchIngredients: async (id: string): Promise<MediaListResponse<any>> => {
    const response = await api.get(`/media/batches/${id}/ingredients`);
    return response.data;
  }
};

// Quality Control API
export const qualityControlApi = {
  // Get QC results for a batch
  getQC: async (batchId: string): Promise<{ success: boolean; data: MediaQualityControl }> => {
    const response = await api.get(`/media/batches/${batchId}/qc`);
    return response.data;
  },

  // Record QC test results
  recordQC: async (data: QualityControlRequest): Promise<{ success: boolean; data: MediaQualityControl }> => {
    const response = await api.post(`/media/batches/${data.mediaBatchId}/qc`, data);
    return response.data;
  },

  // Update QC results
  updateQC: async (batchId: string, data: Partial<QualityControlRequest>): Promise<{ success: boolean; data: MediaQualityControl }> => {
    const response = await api.put(`/media/batches/${batchId}/qc`, data);
    return response.data;
  },

  // Approve QC
  approveQC: async (batchId: string): Promise<{ success: boolean; message?: string }> => {
    const response = await api.post(`/media/batches/${batchId}/qc/approve`);
    return response.data;
  },

  // Reject QC
  rejectQC: async (batchId: string): Promise<{ success: boolean; message?: string }> => {
    const response = await api.post(`/media/batches/${batchId}/qc/reject`);
    return response.data;
  },

  // Get QC history
  getQCHistory: async (filters?: QualityControlFilters, page = 1, limit = 10): Promise<MediaListResponse<MediaQualityControl>> => {
    const params = new URLSearchParams();
    if (filters?.overallResult) params.append('overallResult', filters.overallResult);
    if (filters?.testedBy) params.append('testedBy', filters.testedBy);
    if (filters?.dateRange) {
      params.append('startDate', filters.dateRange.start.toISOString());
      params.append('endDate', filters.dateRange.end.toISOString());
    }
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get(`/media/qc?${params.toString()}`);
    return response.data;
  }
};

// Media Usage API
export const mediaUsageApi = {
  // Get usage records with optional filters
  getUsage: async (filters?: UsageFilters, page = 1, limit = 10): Promise<MediaListResponse<MediaUsage>> => {
    const params = new URLSearchParams();
    if (filters?.procedureType) params.append('procedureType', filters.procedureType);
    if (filters?.outcome) params.append('outcome', filters.outcome);
    if (filters?.technicianId) params.append('technicianId', filters.technicianId);
    if (filters?.dateRange) {
      params.append('startDate', filters.dateRange.start.toISOString());
      params.append('endDate', filters.dateRange.end.toISOString());
    }
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get(`/media/usage?${params.toString()}`);
    return response.data;
  },

  // Record media usage
  recordUsage: async (data: MediaUsageRequest): Promise<{ success: boolean; data: MediaUsage }> => {
    const response = await api.post('/media/usage', data);
    return response.data;
  },

  // Get usage details
  getUsageDetails: async (id: string): Promise<{ success: boolean; data: MediaUsage }> => {
    const response = await api.get(`/media/usage/${id}`);
    return response.data;
  },

  // Update usage record
  updateUsage: async (id: string, data: Partial<MediaUsageRequest>): Promise<{ success: boolean; data: MediaUsage }> => {
    const response = await api.put(`/media/usage/${id}`, data);
    return response.data;
  }
};

// Analytics API
export const mediaAnalyticsApi = {
  // Get performance analytics
  getPerformance: async (): Promise<MediaAnalyticsResponse> => {
    const response = await api.get('/media/analytics/performance');
    return response.data;
  },

  // Get batch comparison
  getBatchComparison: async (batchIds: string[]): Promise<{ success: boolean; data: any }> => {
    const response = await api.post('/media/analytics/batch-comparison', { batchIds });
    return response.data;
  },

  // Get formula statistics
  getFormulaStats: async (formulaId?: string): Promise<{ success: boolean; data: any }> => {
    const params = formulaId ? `?formulaId=${formulaId}` : '';
    const response = await api.get(`/media/analytics/formula-stats${params}`);
    return response.data;
  },

  // Get usage reports
  getUsageReports: async (dateRange?: { start: Date; end: Date }): Promise<{ success: boolean; data: any }> => {
    const params = dateRange ? 
      `?startDate=${dateRange.start.toISOString()}&endDate=${dateRange.end.toISOString()}` : '';
    const response = await api.get(`/media/reports/usage${params}`);
    return response.data;
  },

  // Get quality reports
  getQualityReports: async (dateRange?: { start: Date; end: Date }): Promise<{ success: boolean; data: any }> => {
    const params = dateRange ? 
      `?startDate=${dateRange.start.toISOString()}&endDate=${dateRange.end.toISOString()}` : '';
    const response = await api.get(`/media/reports/quality${params}`);
    return response.data;
  }
};

// SOP API
export const mediaSOPApi = {
  // Get SOP for a formula
  getSOP: async (formulaId: string): Promise<{ success: boolean; data: MediaSOP }> => {
    const response = await api.get(`/media/formulas/${formulaId}/sop`);
    return response.data;
  },

  // Create or update SOP
  saveSOP: async (formulaId: string, data: Partial<MediaSOP>): Promise<{ success: boolean; data: MediaSOP }> => {
    const response = await api.put(`/media/formulas/${formulaId}/sop`, data);
    return response.data;
  },

  // Get all SOPs
  getAllSOPs: async (): Promise<MediaListResponse<MediaSOP>> => {
    const response = await api.get('/media/sop');
    return response.data;
  }
};

// Inventory Integration API
export const inventoryIntegrationApi = {
  // Get available inventory items for media preparation
  getAvailableItems: async (category?: string): Promise<{ success: boolean; data: any[] }> => {
    const params = category ? `?category=${category}` : '';
    const response = await api.get(`/media/inventory/available${params}`);
    return response.data;
  },

  // Check ingredient availability
  checkAvailability: async (ingredients: { inventoryItemId: string; quantity: number }[]): Promise<{ success: boolean; data: any }> => {
    const response = await api.post('/media/inventory/check-availability', { ingredients });
    return response.data;
  },

  // Deduct ingredients from inventory
  deductIngredients: async (batchId: string, ingredients: any[]): Promise<{ success: boolean; message?: string }> => {
    const response = await api.post(`/media/batches/${batchId}/deduct-ingredients`, { ingredients });
    return response.data;
  }
};

// Export/Import API
export const mediaExportApi = {
  // Export formulas
  exportFormulas: async (format: 'csv' | 'excel' | 'pdf', filters?: MediaFormulaFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    params.append('format', format);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, value.toString());
      });
    }

    const response = await api.get(`/media/export/formulas?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Export batches
  exportBatches: async (format: 'csv' | 'excel' | 'pdf', filters?: MediaBatchFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    params.append('format', format);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'dateRange') {
            params.append('startDate', value.start.toISOString());
            params.append('endDate', value.end.toISOString());
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const response = await api.get(`/media/export/batches?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Import formulas
  importFormulas: async (file: File): Promise<{ success: boolean; data: any; errors?: any[] }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/media/import/formulas', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

// Utility functions
export const mediaUtils = {
  // Generate batch number
  generateBatchNumber: (): string => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `MED-${year}-${random}`;
  },

  // Calculate expiry date
  calculateExpiryDate: (preparedDate: Date, shelfLifeDays: number): Date => {
    const expiryDate = new Date(preparedDate);
    expiryDate.setDate(expiryDate.getDate() + shelfLifeDays);
    return expiryDate;
  },

  // Validate pH value
  validatePH: (ph: number, targetMin: number, targetMax: number): boolean => {
    return ph >= targetMin && ph <= targetMax;
  },

  // Validate osmolarity
  validateOsmolarity: (osmolarity: number, targetMin: number, targetMax: number): boolean => {
    return osmolarity >= targetMin && osmolarity <= targetMax;
  },

  // Calculate batch cost
  calculateBatchCost: (ingredients: any[]): number => {
    return ingredients.reduce((total, ingredient) => total + (ingredient.cost || 0), 0);
  }
}; 