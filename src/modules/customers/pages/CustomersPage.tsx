import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Edit, 
  Phone, 
  Mail, 
  MapPin,
  DollarSign,
  Calendar,
  Trash2,
  Eye,
  Building,
  Star,
  TrendingUp,
  BarChart3,
  FileText,
  Shield,
  PieChart,
  Receipt,
  FileCheck,
  Globe,
  Settings,
  Database
} from 'lucide-react';
import apiService from '../../../services/api';
import { crmApiService } from '../services/crmApiService';
import { CustomerProfile } from '../types/crmTypes';

interface Customer {
  id: string;
  customerId: string;
  name: string;
  region: string;
  category: 'Standard' | 'Premium' | 'VIP' | 'Research';
  contactNumber: string;
  email: string;
  animalsCount: number;
  totalRevenue: number;
  joinDate: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  lastContactDate?: string;
  notes?: string;
}

type CRMTab = 
  | 'customers' 
  | 'documents' 
  | 'portal' 
  | 'analytics' 
  | 'invoices' 
  | 'contracts' 
  | 'integration';

interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  premiumCustomers: number;
  totalRevenue: number;
  averageAnimalsPerCustomer: number;
  newCustomersThisMonth: number;
}

export const CustomersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CRMTab>('customers');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
    calculateStats();
  }, [customers, searchTerm, categoryFilter, statusFilter, regionFilter]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      
      // Fetch both customers and animals to calculate real animal counts
      const [customersResponse, animalsResponse] = await Promise.all([
        apiService.get<{ customers: Customer[] }>('/customers'),
        apiService.get<{ animals?: any[] }>('/animals')
      ]);
      
      const customersData = customersResponse.customers || [];
      const animalsData = animalsResponse.animals || [];
      
      // Calculate actual animal counts for each customer
      const customersWithCounts = customersData.map(customer => {
        const animalCount = animalsData.filter(animal => 
          animal.customer?.customerID === customer.customerId ||
          animal.customer?.name === customer.name
        ).length;
        
        return {
          ...customer,
          animalsCount: animalCount
        };
      });
      
      setCustomers(customersWithCounts);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(customer => customer.category === categoryFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    if (regionFilter) {
      filtered = filtered.filter(customer => customer.region === regionFilter);
    }

    setFilteredCustomers(filtered);
    setCurrentPage(1);
  };

  const calculateStats = () => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'Active').length;
    const premiumCustomers = customers.filter(c => c.category === 'Premium' || c.category === 'VIP').length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalRevenue, 0);
    const averageAnimalsPerCustomer = customers.length > 0 ? 
      Math.round(customers.reduce((sum, c) => sum + c.animalsCount, 0) / customers.length) : 0;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newCustomersThisMonth = customers.filter(c => {
      const joinDate = new Date(c.joinDate);
      return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
    }).length;

    setStats({
      totalCustomers,
      activeCustomers,
      premiumCustomers,
      totalRevenue,
      averageAnimalsPerCustomer,
      newCustomersThisMonth
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'VIP': return 'bg-purple-100 text-purple-800';
      case 'Premium': return 'bg-blue-100 text-blue-800';
      case 'Research': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-yellow-100 text-yellow-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectCustomer = (customerId: string) => {
    const newSelected = new Set(selectedCustomers);
    if (newSelected.has(customerId)) {
      newSelected.delete(customerId);
    } else {
      newSelected.add(customerId);
    }
    setSelectedCustomers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedCustomers.size === filteredCustomers.length) {
      setSelectedCustomers(new Set());
    } else {
      setSelectedCustomers(new Set(filteredCustomers.map(c => c.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedCustomers.size === 0) return;
    
    if (confirm(`Delete ${selectedCustomers.size} selected customers?`)) {
      const updatedCustomers = customers.filter(c => !selectedCustomers.has(c.id));
      setCustomers(updatedCustomers);
      setSelectedCustomers(new Set());
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPaginatedCustomers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCustomers.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const tabs = [
    { id: 'customers', name: 'Customer Management', icon: Users, description: 'Manage customer profiles and relationships' },
    { id: 'documents', name: 'Document Center', icon: FileText, description: 'Centralized document management' },
    { id: 'portal', name: 'Customer Portal', icon: Shield, description: 'Customer self-service portal' },
    { id: 'analytics', name: 'Analytics & Reports', icon: PieChart, description: 'Customer analytics and reporting' },
    { id: 'invoices', name: 'Financial Management', icon: Receipt, description: 'Invoices and payment tracking' },
    { id: 'contracts', name: 'Contract Management', icon: FileCheck, description: 'Contract lifecycle management' },
    { id: 'integration', name: 'Module Integration', icon: Database, description: 'Cross-module integration' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            🎯 Advanced CRM System
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive Customer Relationship Management for Veterinary Biotechnology
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as CRMTab)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Tab Description */}
        <div className="px-6 py-4 bg-gray-50">
          <p className="text-sm text-gray-600">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'customers' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalCustomers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activeCustomers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Premium</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.premiumCustomers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Animals</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.averageAnimalsPerCustomer || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">New This Month</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.newCustomersThisMonth || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow border p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3 py-2 border rounded-lg transition-colors ${
                showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          {selectedCustomers.size > 0 && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {selectedCustomers.size} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="flex items-center space-x-2 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="VIP">VIP</option>
              <option value="Research">Research</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>

            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Regions</option>
              <option value="Riyadh">Riyadh</option>
              <option value="Dubai">Dubai</option>
              <option value="Abu Dhabi">Abu Dhabi</option>
              <option value="Dammam">Dammam</option>
              <option value="Jeddah">Jeddah</option>
              <option value="Medina">Medina</option>
              <option value="Tabuk">Tabuk</option>
              <option value="Al Khobar">Al Khobar</option>
              <option value="Taif">Taif</option>
            </select>
          </div>
        )}
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Customers ({filteredCustomers.length})
            </h3>
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCustomers.size === filteredCustomers.length && filteredCustomers.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Select All</span>
              </label>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading customers...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Animals
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getPaginatedCustomers().map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.has(customer.id)}
                        onChange={() => handleSelectCustomer(customer.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Building className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.customerId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center space-x-1 mb-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center space-x-1 mb-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>{customer.contactNumber}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span>{customer.region}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(customer.category)}`}>
                        {customer.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.animalsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(customer.totalRevenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
        </>
      )}

      {/* Document Management Tab */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Document Management Center</h3>
            <p className="text-gray-600 mb-6">Centralized document repository with version control, security, and collaboration features</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">📄 Communications</h4>
                <p className="text-blue-700 text-sm">Letters, emails, meeting minutes</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">📋 Contracts & Legal</h4>
                <p className="text-green-700 text-sm">Agreements, NDAs, compliance documents</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">📊 Technical Reports</h4>
                <p className="text-purple-700 text-sm">Analysis results, genomic reports</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Portal Tab */}
      {activeTab === 'portal' && (
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="text-center py-12">
            <Shield className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Customer Portal Dashboard</h3>
            <p className="text-gray-600 mb-6">Secure customer self-service portal with multi-factor authentication</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">🔐 Secure Access</h4>
                <p className="text-green-700 text-sm">Multi-factor authentication, role-based permissions</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">📱 Mobile Responsive</h4>
                <p className="text-blue-700 text-sm">Optimized for desktop, tablet, and mobile devices</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="text-center py-12">
            <PieChart className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Analytics & Reporting</h3>
            <p className="text-gray-600 mb-6">Comprehensive analytics with customizable reports and data visualization</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">📈 Activity Analytics</h4>
                <p className="text-purple-700 text-sm">Interaction tracking, engagement scores</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">💰 Financial Analytics</h4>
                <p className="text-blue-700 text-sm">Revenue trends, profitability analysis</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">🧬 Reproductive Metrics</h4>
                <p className="text-green-700 text-sm">Success rates, quality trends</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">📊 Custom Reports</h4>
                <p className="text-orange-700 text-sm">PDF/Excel export, scheduled reports</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Management Tab */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="text-center py-12">
            <Receipt className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Financial Management & Invoicing</h3>
            <p className="text-gray-600 mb-6">Complete invoice lifecycle management with payment tracking and financial analytics</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">🧾 Invoice Management</h4>
                <p className="text-green-700 text-sm">Generation, approval, delivery tracking</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">💳 Payment Processing</h4>
                <p className="text-blue-700 text-sm">Multiple payment methods, automated reminders</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">📊 Financial Analytics</h4>
                <p className="text-purple-700 text-sm">Cash flow, aging reports, profitability</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contract Management Tab */}
      {activeTab === 'contracts' && (
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="text-center py-12">
                            <FileCheck className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Contract Lifecycle Management</h3>
            <p className="text-gray-600 mb-6">End-to-end contract management with automated workflows and compliance tracking</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">📝 Creation & Approval</h4>
                <p className="text-blue-700 text-sm">Template-based generation, workflow approval</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">🔄 Version Control</h4>
                <p className="text-green-700 text-sm">Amendment tracking, history management</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">⚠️ Automated Alerts</h4>
                <p className="text-orange-700 text-sm">Expiration warnings, renewal reminders</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">📈 Performance Tracking</h4>
                <p className="text-purple-700 text-sm">Compliance monitoring, KPI metrics</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Module Integration Tab */}
      {activeTab === 'integration' && (
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="text-center py-12">
            <Database className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Cross-Module Integration Hub</h3>
            <p className="text-gray-600 mb-6">Seamless integration with all Reprotech modules for unified data management</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div className="bg-indigo-50 p-6 rounded-lg">
                <h4 className="font-semibold text-indigo-900 mb-3">🐄 Animal Management</h4>
                <ul className="text-indigo-700 text-sm space-y-1">
                  <li>• Ownership tracking</li>
                  <li>• Health records integration</li>
                  <li>• Performance data sync</li>
                </ul>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-3">🧬 Reproduction Hub</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Service history tracking</li>
                  <li>• Genomic data integration</li>
                  <li>• Success rate analytics</li>
                </ul>
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-3">📦 Inventory & Finance</h4>
                <ul className="text-orange-700 text-sm space-y-1">
                  <li>• Resource utilization</li>
                  <li>• Cost allocation</li>
                  <li>• Supplier relationships</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 