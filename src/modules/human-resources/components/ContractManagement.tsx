import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Clock,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { ContractTracker, ContractFilters } from '../types/hrTypes';
import { contractApi, mockContractData, mockEmployeeData } from '../services/hrApi';

const ContractManagement: React.FC = () => {
  const [contracts, setContracts] = useState<ContractTracker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ContractFilters>({});
  const [selectedContracts, setSelectedContracts] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadContracts();
  }, [filters]);

  const loadContracts = async () => {
    try {
      setLoading(true);
      // In real implementation, this would fetch from API
      // const response = await contractApi.getContracts(filters, 1, 50);
      
      // Mock data for demonstration
      const filteredContracts = mockContractData.filter(contract => {
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const employee = mockEmployeeData.find(emp => emp.id === contract.employeeId);
          return (
            contract.contractNumber.toLowerCase().includes(searchLower) ||
            (employee && employee.fullName.english.toLowerCase().includes(searchLower))
          );
        }
        if (filters.status && contract.status !== filters.status) {
          return false;
        }
        if (filters.contractType) {
          const employee = mockEmployeeData.find(emp => emp.id === contract.employeeId);
          if (employee && employee.contractType !== filters.contractType) {
            return false;
          }
        }
        return true;
      });

      setContracts(filteredContracts);
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    loadContracts();
  };

  const handleFilterChange = (key: keyof ContractFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSelectContract = (contractId: string) => {
    const newSelected = new Set(selectedContracts);
    if (newSelected.has(contractId)) {
      newSelected.delete(contractId);
    } else {
      newSelected.add(contractId);
    }
    setSelectedContracts(newSelected);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Terminated':
        return 'bg-gray-100 text-gray-800';
      case 'Renewed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'Fixed':
        return 'bg-blue-100 text-blue-800';
      case 'Unlimited':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpiringSoon = (contract: ContractTracker) => {
    if (!contract.contractEndDate) return false;
    const endDate = new Date(contract.contractEndDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (contract: ContractTracker) => {
    if (!contract.contractEndDate) return false;
    const endDate = new Date(contract.contractEndDate);
    const today = new Date();
    return endDate < today;
  };

  const calculateTotalSalary = (contract: ContractTracker) => {
    return contract.salaryDetails.baseSalary + 
           contract.salaryDetails.allowances.transportation + 
           contract.salaryDetails.allowances.housing + 
           contract.salaryDetails.allowances.ticket + 
           contract.salaryDetails.allowances.communication;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Contract Management</h2>
            <p className="text-gray-600">Track and manage employee contracts</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Analytics</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Contract</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contracts by number or employee name..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Terminated">Terminated</option>
                <option value="Renewed">Renewed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
              <select
                value={filters.contractType || ''}
                onChange={(e) => handleFilterChange('contractType', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="Fixed">Fixed</option>
                <option value="Unlimited">Unlimited</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiring Soon</label>
              <select
                onChange={(e) => {
                  if (e.target.value === '30') {
                    // Filter for contracts expiring in 30 days
                    const thirtyDaysFromNow = new Date();
                    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                    handleFilterChange('dateRange', {
                      start: new Date().toISOString().split('T')[0],
                      end: thirtyDaysFromNow.toISOString().split('T')[0]
                    });
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Contracts</option>
                <option value="30">Expiring in 30 days</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {selectedContracts.size > 0 && (
          <div className="bg-blue-50 px-6 py-3 border-b">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedContracts.size} contract(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  Export Selected
                </button>
                <button className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700">
                  Renew Selected
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedContracts.size === contracts.length && contracts.length > 0}
                    onChange={() => {
                      if (selectedContracts.size === contracts.length) {
                        setSelectedContracts(new Set());
                      } else {
                        setSelectedContracts(new Set(contracts.map(contract => contract.id)));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary Package
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </td>
                </tr>
              ) : contracts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No contracts found
                  </td>
                </tr>
              ) : (
                contracts.map((contract) => {
                  const employee = mockEmployeeData.find(emp => emp.id === contract.employeeId);
                  const expiringSoon = isExpiringSoon(contract);
                  const expired = isExpired(contract);

                  return (
                    <tr key={contract.id} className={`hover:bg-gray-50 ${
                      expiringSoon ? 'bg-yellow-50' : expired ? 'bg-red-50' : ''
                    }`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedContracts.has(contract.id)}
                          onChange={() => handleSelectContract(contract.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee?.fullName.english || 'Unknown Employee'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee?.employeeId || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee?.department || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              {contract.contractNumber}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getContractTypeColor(employee?.contractType || '')}`}>
                              {employee?.contractType || 'N/A'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            {contract.contractStartDate}
                          </div>
                          {contract.contractEndDate && (
                            <div className="text-sm text-gray-500">
                              to {contract.contractEndDate}
                              {expiringSoon && (
                                <span className="ml-2 text-yellow-600">
                                  <AlertTriangle className="w-4 h-4 inline" />
                                  Expiring soon
                                </span>
                              )}
                              {expired && (
                                <span className="ml-2 text-red-600">
                                  <XCircle className="w-4 h-4 inline" />
                                  Expired
                                </span>
                              )}
                            </div>
                          )}
                          <div className="text-sm text-gray-500">
                            Duration: {contract.contractDuration} months
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            SAR {calculateTotalSalary(contract).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            Base: SAR {contract.salaryDetails.baseSalary.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            Allowances: SAR {(contract.salaryDetails.allowances.transportation + 
                                             contract.salaryDetails.allowances.housing + 
                                             contract.salaryDetails.allowances.ticket + 
                                             contract.salaryDetails.allowances.communication).toLocaleString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                            {contract.status}
                          </span>
                          {contract.finalSettlementGenerated && (
                            <div className="text-xs text-green-600">
                              <CheckCircle className="w-3 h-3 inline mr-1" />
                              Settlement Generated
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          {contract.status === 'Active' && (
                            <button className="text-yellow-600 hover:text-yellow-900">
                              <Clock className="w-4 h-4" />
                            </button>
                          )}
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Contracts</p>
              <p className="text-2xl font-bold text-gray-900">{contracts.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Contracts</p>
              <p className="text-2xl font-bold text-gray-900">
                {contracts.filter(c => c.status === 'Active').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">
                {contracts.filter(c => isExpiringSoon(c)).length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-gray-900">
                {contracts.filter(c => isExpired(c)).length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractManagement; 