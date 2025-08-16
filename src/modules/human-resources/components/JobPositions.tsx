import React, { useState, useEffect } from 'react';
import {
  Building,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  MoreHorizontal,
  DollarSign,
  Users,
  GraduationCap,
  Clock,
  Award,
  Shield,
  TrendingUp,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { JobPositionTemplate, JobPositionFilters } from '../types/hrTypes';
import { jobPositionApi, mockJobPositionData } from '../services/hrApi';

const JobPositions: React.FC = () => {
  const [positions, setPositions] = useState<JobPositionTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<JobPositionFilters>({});
  const [selectedPositions, setSelectedPositions] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadJobPositions();
  }, [filters]);

  const loadJobPositions = async () => {
    try {
      setLoading(true);
      // In real implementation, this would fetch from API
      // const response = await jobPositionApi.getJobPositions(filters, 1, 50);
      
      // Mock data for demonstration
      const filteredPositions = mockJobPositionData.filter(position => {
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            position.title.toLowerCase().includes(searchLower) ||
            position.educationRequired.toLowerCase().includes(searchLower)
          );
        }
        if (filters.isActive !== undefined && position.isActive !== filters.isActive) {
          return false;
        }
        if (filters.minSalary && position.baseSalary < filters.minSalary) {
          return false;
        }
        if (filters.maxSalary && position.baseSalary > filters.maxSalary) {
          return false;
        }
        return true;
      });

      setPositions(filteredPositions);
    } catch (error) {
      console.error('Error loading job positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    loadJobPositions();
  };

  const handleFilterChange = (key: keyof JobPositionFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSelectPosition = (positionId: string) => {
    const newSelected = new Set(selectedPositions);
    if (newSelected.has(positionId)) {
      newSelected.delete(positionId);
    } else {
      newSelected.add(positionId);
    }
    setSelectedPositions(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedPositions.size === positions.length) {
      setSelectedPositions(new Set());
    } else {
      setSelectedPositions(new Set(positions.map(pos => pos.id)));
    }
  };

  const calculateTotalCompensation = (position: JobPositionTemplate) => {
    return position.baseSalary + 
           position.transportationAllowance + 
           position.housingAllowance + 
           position.ticketAllowance + 
           position.communicationAllowance + 
           position.leaveAllowance;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Job Positions</h2>
            <p className="text-gray-600">Manage job templates and position configurations</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Analytics</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Position</span>
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
              placeholder="Search positions by title or education requirements..."
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
                value={filters.isActive === undefined ? '' : filters.isActive.toString()}
                onChange={(e) => handleFilterChange('isActive', e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary</label>
              <input
                type="number"
                placeholder="Min salary"
                value={filters.minSalary || ''}
                onChange={(e) => handleFilterChange('minSalary', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary</label>
              <input
                type="number"
                placeholder="Max salary"
                value={filters.maxSalary || ''}
                onChange={(e) => handleFilterChange('maxSalary', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Job Positions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : positions.length === 0 ? (
          <div className="col-span-2 text-center py-8">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Job Positions</h3>
            <p className="text-gray-500">Create your first job position to get started.</p>
          </div>
        ) : (
          positions.map((position) => (
            <div key={position.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedPositions.has(position.id)}
                    onChange={() => handleSelectPosition(position.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    position.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {position.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Position Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{position.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>{position.educationRequired}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{position.yearsOfExperience} years exp.</span>
                    </div>
                  </div>
                </div>

                {/* Salary Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Compensation Package</h4>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        SAR {calculateTotalCompensation(position).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Total per month</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Salary:</span>
                      <span className="font-medium">SAR {position.baseSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transportation:</span>
                      <span className="font-medium">SAR {position.transportationAllowance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Housing:</span>
                      <span className="font-medium">SAR {position.housingAllowance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ticket:</span>
                      <span className="font-medium">SAR {position.ticketAllowance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Communication:</span>
                      <span className="font-medium">SAR {position.communicationAllowance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Leave Allowance:</span>
                      <span className="font-medium">SAR {position.leaveAllowance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Benefits and Deductions */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2 flex items-center space-x-1">
                      <Award className="w-4 h-4" />
                      <span>Benefits</span>
                    </h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Annual Leave:</span>
                        <span>{position.annualLeave} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">End Service:</span>
                        <span>{position.endServiceBenefits}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2 flex items-center space-x-1">
                      <Shield className="w-4 h-4" />
                      <span>Deductions</span>
                    </h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Social Security:</span>
                        <span>{position.socialSecurityDeduction}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Insurance:</span>
                        <span>SAR {position.insuranceCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Visa Cost:</span>
                        <span>SAR {position.visaCost.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">0 employees</span>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                    Assign Employee
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bulk Actions */}
      {selectedPositions.size > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedPositions.size} position(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Export Selected
              </button>
              <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                Deactivate Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPositions; 