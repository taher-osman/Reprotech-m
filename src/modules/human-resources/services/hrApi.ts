import api from '@/services/api';
import {
  EmployeeProfile,
  JobPositionTemplate,
  ContractTracker,
  EmployeeListResponse,
  JobPositionListResponse,
  ContractListResponse,
  EmployeeFormData,
  JobPositionFormData,
  ContractFormData,
  EmployeeFilters,
  JobPositionFilters,
  ContractFilters,
  EmployeeDashboardStats,
  EmployeePersonalStats
} from '../types/hrTypes';

// Employee Management API
export const employeeApi = {
  // Get all employees with filters
  getEmployees: async (filters?: EmployeeFilters, page = 1, limit = 10): Promise<EmployeeListResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.department) params.append('department', filters.department);
    if (filters?.jobTitle) params.append('jobTitle', filters.jobTitle);
    if (filters?.nationality) params.append('nationality', filters.nationality);
    if (filters?.state) params.append('state', filters.state);
    if (filters?.contractType) params.append('contractType', filters.contractType);
    if (filters?.dateRange) {
      params.append('startDate', filters.dateRange.start);
      params.append('endDate', filters.dateRange.end);
    }
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get(`/hr/employees?${params.toString()}`);
    return response.data;
  },

  // Get single employee
  getEmployee: async (id: string): Promise<EmployeeProfile> => {
    const response = await api.get(`/hr/employees/${id}`);
    return response.data;
  },

  // Create new employee
  createEmployee: async (data: EmployeeFormData): Promise<EmployeeProfile> => {
    const response = await api.post('/hr/employees', data);
    return response.data;
  },

  // Update employee
  updateEmployee: async (id: string, data: Partial<EmployeeFormData>): Promise<EmployeeProfile> => {
    const response = await api.put(`/hr/employees/${id}`, data);
    return response.data;
  },

  // Delete employee
  deleteEmployee: async (id: string): Promise<void> => {
    await api.delete(`/hr/employees/${id}`);
  },

  // Upload employee photo
  uploadPhoto: async (id: string, file: File): Promise<{ photoUrl: string }> => {
    const formData = new FormData();
    formData.append('photo', file);
    const response = await api.post(`/hr/employees/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Upload employee signature
  uploadSignature: async (id: string, file: File): Promise<{ signatureUrl: string }> => {
    const formData = new FormData();
    formData.append('signature', file);
    const response = await api.post(`/hr/employees/${id}/signature`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Upload employee attachments
  uploadAttachments: async (id: string, files: File[]): Promise<{ attachments: string[] }> => {
    const formData = new FormData();
    files.forEach(file => formData.append('attachments', file));
    const response = await api.post(`/hr/employees/${id}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Get employee dashboard stats
  getDashboardStats: async (): Promise<EmployeeDashboardStats> => {
    const response = await api.get('/hr/employees/dashboard-stats');
    return response.data;
  },

  // Get employee personal stats
  getPersonalStats: async (id: string): Promise<EmployeePersonalStats> => {
    const response = await api.get(`/hr/employees/${id}/personal-stats`);
    return response.data;
  },

  // Export employees to Excel/PDF
  exportEmployees: async (filters?: EmployeeFilters, format: 'excel' | 'pdf' = 'excel'): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.department) params.append('department', filters.department);
    if (filters?.jobTitle) params.append('jobTitle', filters.jobTitle);
    if (filters?.nationality) params.append('nationality', filters.nationality);
    if (filters?.state) params.append('state', filters.state);
    if (filters?.contractType) params.append('contractType', filters.contractType);
    params.append('format', format);

    const response = await api.get(`/hr/employees/export?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

// Job Position Management API
export const jobPositionApi = {
  // Get all job positions
  getJobPositions: async (filters?: JobPositionFilters, page = 1, limit = 10): Promise<JobPositionListResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.minSalary) params.append('minSalary', filters.minSalary.toString());
    if (filters?.maxSalary) params.append('maxSalary', filters.maxSalary.toString());
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get(`/hr/job-positions?${params.toString()}`);
    return response.data;
  },

  // Get single job position
  getJobPosition: async (id: string): Promise<JobPositionTemplate> => {
    const response = await api.get(`/hr/job-positions/${id}`);
    return response.data;
  },

  // Create new job position
  createJobPosition: async (data: JobPositionFormData): Promise<JobPositionTemplate> => {
    const response = await api.post('/hr/job-positions', data);
    return response.data;
  },

  // Update job position
  updateJobPosition: async (id: string, data: Partial<JobPositionFormData>): Promise<JobPositionTemplate> => {
    const response = await api.put(`/hr/job-positions/${id}`, data);
    return response.data;
  },

  // Delete job position
  deleteJobPosition: async (id: string): Promise<void> => {
    await api.delete(`/hr/job-positions/${id}`);
  },

  // Get active job positions for dropdown
  getActiveJobPositions: async (): Promise<{ id: string; title: string }[]> => {
    const response = await api.get('/hr/job-positions/active');
    return response.data;
  }
};

// Contract Management API
export const contractApi = {
  // Get all contracts
  getContracts: async (filters?: ContractFilters, page = 1, limit = 10): Promise<ContractListResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.contractType) params.append('contractType', filters.contractType);
    if (filters?.dateRange) {
      params.append('startDate', filters.dateRange.start);
      params.append('endDate', filters.dateRange.end);
    }
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get(`/hr/contracts?${params.toString()}`);
    return response.data;
  },

  // Get single contract
  getContract: async (id: string): Promise<ContractTracker> => {
    const response = await api.get(`/hr/contracts/${id}`);
    return response.data;
  },

  // Create new contract
  createContract: async (data: ContractFormData): Promise<ContractTracker> => {
    const response = await api.post('/hr/contracts', data);
    return response.data;
  },

  // Update contract
  updateContract: async (id: string, data: Partial<ContractFormData>): Promise<ContractTracker> => {
    const response = await api.put(`/hr/contracts/${id}`, data);
    return response.data;
  },

  // Delete contract
  deleteContract: async (id: string): Promise<void> => {
    await api.delete(`/hr/contracts/${id}`);
  },

  // Terminate contract
  terminateContract: async (id: string, reason: string, lastWorkingDay: string): Promise<ContractTracker> => {
    const response = await api.post(`/hr/contracts/${id}/terminate`, {
      reason,
      lastWorkingDay
    });
    return response.data;
  },

  // Renew contract
  renewContract: async (id: string, newEndDate: string): Promise<ContractTracker> => {
    const response = await api.post(`/hr/contracts/${id}/renew`, {
      newEndDate
    });
    return response.data;
  },

  // Generate final settlement
  generateFinalSettlement: async (id: string): Promise<{ settlementUrl: string }> => {
    const response = await api.post(`/hr/contracts/${id}/final-settlement`);
    return response.data;
  },

  // Get contracts expiring soon
  getExpiringContracts: async (days: number = 30): Promise<ContractTracker[]> => {
    const response = await api.get(`/hr/contracts/expiring-soon?days=${days}`);
    return response.data;
  }
};

// Mock data for development
export const mockEmployeeData: EmployeeProfile[] = [
  {
    id: '1',
    employeeId: 'EMP-2024-001',
    fullName: {
      arabic: 'أحمد محمد علي',
      english: 'Ahmed Mohamed Ali'
    },
    religion: 'Islam',
    nationality: 'Egyptian',
    email: 'ahmed.ali@reprotech.com',
    phone: '+966501234567',
    education: 'Bachelor of Veterinary Medicine',
    dateOfBirth: '1985-03-15',
    workStartDate: '2024-01-15',
    gender: 'Male',
    idNumber: '1234567890',
    idExpiryDate: '2029-12-31',
    workLocation: 'Riyadh Main Clinic',
    department: 'Veterinary Services',
    jobTitle: 'Senior Veterinarian',
    visaTitle: 'Veterinarian',
    sponsor: 'Reprotech Company',
    contractType: 'Fixed',
    contractStartDate: '2024-01-15',
    contractEndDate: '2026-01-15',
    contractDuration: 24,
    salary: 15000,
    experienceYears: 8,
    annualLeaveDays: 30,
    state: 'Active',
    attachments: [],
    bankDetails: {
      iban: 'SA0380000000608010167519',
      bank: 'Saudi National Bank',
      accountNumber: '1234567890'
    },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    employeeId: 'EMP-2024-002',
    fullName: {
      arabic: 'فاطمة أحمد حسن',
      english: 'Fatima Ahmed Hassan'
    },
    religion: 'Islam',
    nationality: 'Saudi',
    email: 'fatima.hassan@reprotech.com',
    phone: '+966502345678',
    education: 'Master of Animal Science',
    dateOfBirth: '1990-07-22',
    workStartDate: '2024-02-01',
    gender: 'Female',
    idNumber: '0987654321',
    idExpiryDate: '2030-06-30',
    workLocation: 'Jeddah Branch',
    department: 'Research & Development',
    jobTitle: 'Research Scientist',
    visaTitle: 'Research Scientist',
    sponsor: 'Reprotech Company',
    contractType: 'Unlimited',
    contractStartDate: '2024-02-01',
    contractDuration: 0,
    salary: 18000,
    experienceYears: 5,
    annualLeaveDays: 30,
    state: 'Active',
    attachments: [],
    bankDetails: {
      iban: 'SA0380000000608010167520',
      bank: 'Al Rajhi Bank',
      accountNumber: '0987654321'
    },
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  }
];

export const mockJobPositionData: JobPositionTemplate[] = [
  {
    id: '1',
    title: 'Senior Veterinarian',
    educationRequired: 'Bachelor of Veterinary Medicine',
    yearsOfExperience: 5,
    baseSalary: 15000,
    annualLeave: 30,
    leaveAllowance: 5000,
    transportationAllowance: 1000,
    housingAllowance: 2000,
    ticketAllowance: 3000,
    communicationAllowance: 500,
    socialSecurityDeduction: 10,
    insuranceCost: 800,
    visaCost: 2000,
    endServiceBenefits: 15,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Research Scientist',
    educationRequired: 'Master of Animal Science',
    yearsOfExperience: 3,
    baseSalary: 18000,
    annualLeave: 30,
    leaveAllowance: 6000,
    transportationAllowance: 1200,
    housingAllowance: 2500,
    ticketAllowance: 3500,
    communicationAllowance: 600,
    socialSecurityDeduction: 10,
    insuranceCost: 900,
    visaCost: 2500,
    endServiceBenefits: 15,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockContractData: ContractTracker[] = [
  {
    id: '1',
    employeeId: '1',
    contractNumber: 'CON-2024-001',
    contractStartDate: '2024-01-15',
    contractEndDate: '2026-01-15',
    contractDuration: 24,
    salaryDetails: {
      baseSalary: 15000,
      allowances: {
        transportation: 1000,
        housing: 2000,
        ticket: 3000,
        communication: 500
      },
      deductions: {
        socialSecurity: 1500,
        insurance: 800,
        visa: 2000
      }
    },
    finalSettlementGenerated: false,
    status: 'Active',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
]; 