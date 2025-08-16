const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api/v1';

interface APIResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

class ApiService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Load tokens from localStorage on initialization
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add authorization header if token exists
    if (this.accessToken) {
      (defaultOptions.headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      console.log(`[API] ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401 && this.refreshToken) {
          // Try to refresh token
          await this.refreshAccessToken();
          // Retry the original request with new token
          (config.headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
          const retryResponse = await fetch(url, config);
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }
          return await retryResponse.json();
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(username: string, password: string): Promise<AuthTokens> {
    const response = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.access_token && response.refresh_token) {
      this.setTokens(response.access_token, response.refresh_token);
      return {
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      };
    }

    throw new Error('Invalid login response');
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }

  async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request<any>('/auth/refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.refreshToken}`,
      },
    });

    if (response.access_token) {
      this.accessToken = response.access_token;
      localStorage.setItem('access_token', response.access_token);
    }
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Health and Info endpoints
  async getHealth(): Promise<any> {
    return this.request('/health');
  }

  async getApiInfo(): Promise<any> {
    return this.request('/info');
  }

  // Customer Management
  async getCustomers(params?: any): Promise<any> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/customers${queryString}`);
  }

  async getCustomer(id: string): Promise<any> {
    return this.request(`/customers/${id}`);
  }

  async createCustomer(customerData: any): Promise<any> {
    return this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  }

  async updateCustomer(id: string, customerData: any): Promise<any> {
    return this.request(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  }

  async deleteCustomer(id: string): Promise<any> {
    return this.request(`/customers/${id}`, {
      method: 'DELETE',
    });
  }

  // Animal Management
  async getAnimals(params?: any): Promise<any> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/animals${queryString}`);
  }

  async getAnimal(id: string): Promise<any> {
    return this.request(`/animals/${id}`);
  }

  async createAnimal(animalData: any): Promise<any> {
    return this.request('/animals', {
      method: 'POST',
      body: JSON.stringify(animalData),
    });
  }

  async updateAnimal(id: string, animalData: any): Promise<any> {
    return this.request(`/animals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(animalData),
    });
  }

  async deleteAnimal(id: string): Promise<any> {
    return this.request(`/animals/${id}`, {
      method: 'DELETE',
    });
  }

  // Laboratory Management
  async getLabTests(params?: any): Promise<any> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/lab/tests${queryString}`);
  }

  async getLabTest(id: string): Promise<any> {
    return this.request(`/lab/tests/${id}`);
  }

  async createLabTest(testData: any): Promise<any> {
    return this.request('/lab/tests', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  }

  async updateLabTest(id: string, testData: any): Promise<any> {
    return this.request(`/lab/tests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testData),
    });
  }

  // Genomics Management
  async getGenomicProfiles(params?: any): Promise<any> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/genomics/profiles${queryString}`);
  }

  async getGenomicProfile(id: string): Promise<any> {
    return this.request(`/genomics/profiles/${id}`);
  }

  async createGenomicProfile(profileData: any): Promise<any> {
    return this.request('/genomics/profiles', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  // Biobank Management
  async getSamples(params?: any): Promise<any> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/biobank/samples${queryString}`);
  }

  async getSample(id: string): Promise<any> {
    return this.request(`/biobank/samples/${id}`);
  }

  async createSample(sampleData: any): Promise<any> {
    return this.request('/biobank/samples', {
      method: 'POST',
      body: JSON.stringify(sampleData),
    });
  }

  async updateSample(id: string, sampleData: any): Promise<any> {
    return this.request(`/biobank/samples/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sampleData),
    });
  }

  // Analytics and Dashboard
  async getDashboardStats(): Promise<any> {
    return this.request('/analytics/dashboard/stats');
  }

  async getAnalyticsReports(params?: any): Promise<any> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/analytics/reports${queryString}`);
  }

  async generateReport(reportData: any): Promise<any> {
    return this.request('/analytics/reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  // Workflow Management
  async getWorkflows(params?: any): Promise<any> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/workflows${queryString}`);
  }

  async getWorkflow(id: string): Promise<any> {
    return this.request(`/workflows/${id}`);
  }

  async createWorkflow(workflowData: any): Promise<any> {
    return this.request('/workflows', {
      method: 'POST',
      body: JSON.stringify(workflowData),
    });
  }

  async updateWorkflow(id: string, workflowData: any): Promise<any> {
    return this.request(`/workflows/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workflowData),
    });
  }

  // User Management
  async getUsers(params?: any): Promise<any> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/users${queryString}`);
  }

  async getUser(id: string): Promise<any> {
    return this.request(`/users/${id}`);
  }

  async createUser(userData: any): Promise<any> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: any): Promise<any> {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;

