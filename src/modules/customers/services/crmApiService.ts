
import { mockCustomerProfiles } from '../data/mockData';
import {
  CustomerProfile,
  CRMDocument,
  Contract,
  Invoice,
  CustomerAnalytics,
  CustomReport,
  CustomerPortalAccess,
  InteractionRecord,
  CRMApiResponse,
  CRMSearchFilters,
  ExportConfiguration,
  ExportResult,
  DocumentRepository,
  ContractManagement,
  InvoiceManagement,
  ModuleIntegration
} from '../types/crmTypes';

// Helper to simulate API response
const createMockResponse = <T>(data: T): Promise<CRMApiResponse<T>> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          data,
          message: 'Request successful',
          statusCode: 200,
        });
      }, 500); // Simulate network delay
    });
  };

class CRMApiService {
  private baseUrl = '/api/crm';

  // Customer Profile Management
  async getCustomers(filters?: CRMSearchFilters): Promise<CRMApiResponse<CustomerProfile[]>> {
    console.log('Fetching customers with filters:', filters);
    return createMockResponse(mockCustomerProfiles);
  }

  async getCustomer(customerId: string): Promise<CRMApiResponse<CustomerProfile>> {
    const customer = mockCustomerProfiles.find(c => c.id === customerId);
    if (customer) {
      return createMockResponse(customer);
    }
    return Promise.reject({
        success: false,
        data: null,
        message: 'Customer not found',
        statusCode: 404,
      });
  }

  async createCustomer(customer: Omit<CustomerProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<CRMApiResponse<CustomerProfile>> {
    const newCustomer: CustomerProfile = {
        ...customer,
        id: `cust_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as CustomerProfile;
      mockCustomerProfiles.push(newCustomer);
      return createMockResponse(newCustomer);
  }

  async updateCustomer(customerId: string, updates: Partial<CustomerProfile>): Promise<CRMApiResponse<CustomerProfile>> {
    const customerIndex = mockCustomerProfiles.findIndex(c => c.id === customerId);
    if (customerIndex > -1) {
      mockCustomerProfiles[customerIndex] = { ...mockCustomerProfiles[customerIndex], ...updates, updatedAt: new Date().toISOString() };
      return createMockResponse(mockCustomerProfiles[customerIndex]);
    }
    return Promise.reject({
        success: false,
        data: null,
        message: 'Customer not found',
        statusCode: 404,
      });
  }

  async deleteCustomer(customerId: string): Promise<CRMApiResponse<void>> {
    const customerIndex = mockCustomerProfiles.findIndex(c => c.id === customerId);
    if (customerIndex > -1) {
        mockCustomerProfiles.splice(customerIndex, 1);
        return createMockResponse(undefined);
    }
    return Promise.reject({
        success: false,
        data: null,
        message: 'Customer not found',
        statusCode: 404,
      });
  }

  // NOTE: The rest of the methods are not mocked for now.
  // They will throw errors if called, which is acceptable as we focus on core customer profiles.

  // Interaction Management
  async getCustomerInteractions(customerId: string): Promise<CRMApiResponse<InteractionRecord[]>> {
    throw new Error('getCustomerInteractions is not implemented in mock service');
  }

  async createInteraction(customerId: string, interaction: Omit<InteractionRecord, 'id'>): Promise<CRMApiResponse<InteractionRecord>> {
    throw new Error('createInteraction is not implemented in mock service');
  }

  async updateInteraction(customerId: string, interactionId: string, updates: Partial<InteractionRecord>): Promise<CRMApiResponse<InteractionRecord>> {
    throw new Error('updateInteraction is not implemented in mock service');
  }

  // Document Management
  async getCustomerDocuments(customerId: string): Promise<CRMApiResponse<DocumentRepository>> {
    throw new Error('getCustomerDocuments is not implemented in mock service');
  }

  async uploadDocument(customerId: string, file: File, metadata: Omit<CRMDocument, 'id' | 'createdAt' | 'modifiedAt' | 'size' | 'filePath' | 'version'>): Promise<CRMApiResponse<CRMDocument>> {
    throw new Error('uploadDocument is not implemented in mock service');
  }

  async downloadDocument(customerId: string, documentId: string): Promise<Blob> {
    throw new Error('downloadDocument is not implemented in mock service');
  }

  async deleteDocument(customerId: string, documentId: string): Promise<CRMApiResponse<void>> {
    throw new Error('deleteDocument is not implemented in mock service');
  }

  async updateDocumentMetadata(customerId: string, documentId: string, metadata: Partial<CRMDocument>): Promise<CRMApiResponse<CRMDocument>> {
    throw new Error('updateDocumentMetadata is not implemented in mock service');
  }

  // Contract Management
  async getCustomerContracts(customerId: string): Promise<CRMApiResponse<ContractManagement>> {
    throw new Error('getCustomerContracts is not implemented in mock service');
  }

  async createContract(customerId: string, contract: Omit<Contract, 'id' | 'createdAt' | 'createdBy' | 'lastModified'>): Promise<CRMApiResponse<Contract>> {
    throw new Error('createContract is not implemented in mock service');
  }

  async updateContract(customerId: string, contractId: string, updates: Partial<Contract>): Promise<CRMApiResponse<Contract>> {
    throw new Error('updateContract is not implemented in mock service');
  }

  async renewContract(customerId: string, contractId: string, renewalData: any): Promise<CRMApiResponse<Contract>> {
    throw new Error('renewContract is not implemented in mock service');
  }

  // Invoice & Financial Management
  async getCustomerInvoices(customerId: string): Promise<CRMApiResponse<InvoiceManagement>> {
    throw new Error('getCustomerInvoices is not implemented in mock service');
  }

  async createInvoice(customerId: string, invoice: Omit<Invoice, 'id' | 'createdAt' | 'createdBy' | 'lastModified'>): Promise<CRMApiResponse<Invoice>> {
    throw new Error('createInvoice is not implemented in mock service');
  }

  async updateInvoiceStatus(customerId: string, invoiceId: string, status: Invoice['status']): Promise<CRMApiResponse<Invoice>> {
    throw new Error('updateInvoiceStatus is not implemented in mock service');
  }

  async recordPayment(customerId: string, invoiceId: string, paymentData: any): Promise<CRMApiResponse<Invoice>> {
    throw new Error('recordPayment is not implemented in mock service');
  }

  // Analytics & Reporting
  async getCustomerAnalytics(customerId: string, period?: { startDate: string; endDate: string }): Promise<CRMApiResponse<CustomerAnalytics>> {
    throw new Error('getCustomerAnalytics is not implemented in mock service');
  }

  async generateCustomReport(reportConfig: CustomReport): Promise<CRMApiResponse<ExportResult>> {
    throw new Error('generateCustomReport is not implemented in mock service');
  }

  async getReportTemplates(): Promise<CRMApiResponse<CustomReport[]>> {
    throw new Error('getReportTemplates is not implemented in mock service');
  }

  async saveReportTemplate(template: Omit<CustomReport, 'id' | 'createdAt' | 'lastModified' | 'generationCount'>): Promise<CRMApiResponse<CustomReport>> {
    throw new Error('saveReportTemplate is not implemented in mock service');
  }

  // Customer Portal Management
  async getCustomerPortalAccess(customerId: string): Promise<CRMApiResponse<CustomerPortalAccess>> {
    throw new Error('getCustomerPortalAccess is not implemented in mock service');
  }

  async updatePortalAccess(customerId: string, access: Partial<CustomerPortalAccess>): Promise<CRMApiResponse<CustomerPortalAccess>> {
    throw new Error('updatePortalAccess is not implemented in mock service');
  }

  async generatePortalInvitation(customerId: string): Promise<CRMApiResponse<{ invitationUrl: string; expiryDate: string }>> {
    throw new Error('generatePortalInvitation is not implemented in mock service');
  }

  // Module Integration
  async getModuleIntegration(customerId: string): Promise<CRMApiResponse<ModuleIntegration>> {
    throw new Error('getModuleIntegration is not implemented in mock service');
  }

  async syncWithModule(customerId: string, module: string): Promise<CRMApiResponse<void>> {
    throw new Error('syncWithModule is not implemented in mock service');
  }

  // Export & Import
  async exportCustomerData(customerId: string, config: ExportConfiguration): Promise<CRMApiResponse<ExportResult>> {
    throw new Error('exportCustomerData is not implemented in mock service');
  }

  async exportAllCustomers(config: ExportConfiguration): Promise<CRMApiResponse<ExportResult>> {
    throw new Error('exportAllCustomers is not implemented in mock service');
  }

  async getExportStatus(exportId: string): Promise<CRMApiResponse<ExportResult>> {
    throw new Error('getExportStatus is not implemented in mock service');
  }

  async downloadExport(exportId: string): Promise<Blob> {
    throw new Error('downloadExport is not implemented in mock service');
  }

  // Search & Advanced Filtering
  async searchCustomers(query: string, filters?: CRMSearchFilters): Promise<CRMApiResponse<CustomerProfile[]>> {
    throw new Error('searchCustomers is not implemented in mock service');
  }

  async getFilterOptions(): Promise<CRMApiResponse<{
    categories: string[];
    statuses: string[];
    regions: string[];
    accountManagers: string[];
    tags: string[];
  }>> {
    throw new Error('getFilterOptions is not implemented in mock service');
  }

  // Dashboard Statistics
  async getDashboardStats(): Promise<CRMApiResponse<{
    totalCustomers: number;
    activeCustomers: number;
    newCustomersThisMonth: number;
    totalRevenue: number;
    overdueInvoices: number;
    expiringContracts: number;
    averageCustomerValue: number;
    customerSatisfactionScore: number;
    recentInteractions: InteractionRecord[];
    upcomingTasks: any[];
  }>> {
    throw new Error('getDashboardStats is not implemented in mock service');
  }

  // Bulk Operations
  async bulkUpdateCustomers(customerIds: string[], updates: Partial<CustomerProfile>): Promise<CRMApiResponse<CustomerProfile[]>> {
    throw new Error('bulkUpdateCustomers is not implemented in mock service');
  }

  async bulkDeleteCustomers(customerIds: string[]): Promise<CRMApiResponse<void>> {
    throw new Error('bulkDeleteCustomers is not implemented in mock service');
  }

  // Communication Templates
  async getEmailTemplates(): Promise<CRMApiResponse<any[]>> {
    throw new Error('getEmailTemplates is not implemented in mock service');
  }

  async sendBulkEmail(customerIds: string[], templateId: string, customData?: Record<string, any>): Promise<CRMApiResponse<void>> {
    throw new Error('sendBulkEmail is not implemented in mock service');
  }
}

export const crmApiService = new CRMApiService();