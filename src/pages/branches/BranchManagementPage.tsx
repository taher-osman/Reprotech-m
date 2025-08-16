import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';

interface Branch {
  id: number;
  branch_code: string;
  name: string;
  branch_type: string;
  status: string;
  address: string;
  city: string;
  state_province: string;
  country: string;
  postal_code: string;
  phone: string;
  email: string;
  website: string;
  latitude: string;
  longitude: string;
  established_date: string;
  license_number: string;
  license_expiry: string;
  capacity: number;
  current_occupancy: number;
  manager_name: string;
  manager_phone: string;
  manager_email: string;
  parent_branch_id: number | null;
  customer_id: number;
  services_offered: string;
  equipment_list: string;
  certifications: string;
  operational_cost_center: string;
  budget_allocation: string;
  created_at: string;
  updated_at: string;
}

interface BranchStats {
  total_branches: number;
  active_branches: number;
  inactive_branches: number;
  total_capacity: number;
  total_occupancy: number;
  occupancy_rate: number;
  type_distribution: Record<string, number>;
  country_distribution: Record<string, number>;
  average_capacity: number;
}

const BranchManagementPage: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [stats, setStats] = useState<BranchStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch branches data
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (filterType !== 'all') params.append('branch_type', filterType);
        if (filterStatus !== 'all') params.append('status', filterStatus);
        if (searchTerm) params.append('search', searchTerm);
        
        const response = await fetch(`http://localhost:5555/api/branches?${params}`);
        const data = await response.json();
        
        if (data.success) {
          setBranches(data.data);
        } else {
          setError(data.message || 'Failed to fetch branches');
        }
      } catch (err) {
        setError('Failed to connect to server');
        console.error('Error fetching branches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, [filterType, filterStatus, searchTerm]);

  // Fetch branch statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5555/api/branches/stats');
        const data = await response.json();
        
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error('Error fetching branch stats:', err);
      }
    };

    fetchStats();
  }, []);

  const getBranchTypeColor = (type: string) => {
    const colors = {
      farm: 'bg-green-100 text-green-800',
      laboratory: 'bg-blue-100 text-blue-800',
      clinic: 'bg-purple-100 text-purple-800',
      research_center: 'bg-indigo-100 text-indigo-800',
      processing_facility: 'bg-orange-100 text-orange-800',
      breeding_center: 'bg-pink-100 text-pink-800',
      quarantine_facility: 'bg-red-100 text-red-800',
      training_center: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
      maintenance: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatBranchType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const parseJsonField = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return [];
    }
  };

  const calculateOccupancyRate = (occupancy: number, capacity: number) => {
    return capacity > 0 ? Math.round((occupancy / capacity) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error Loading Branches</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Branch Management</h1>
          <p className="text-gray-600">Manage farms, laboratories, clinics, and research centers</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <div className="w-6 h-6 text-blue-600">🏢</div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Branches</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_branches}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <div className="w-6 h-6 text-green-600">✅</div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Branches</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active_branches}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <div className="w-6 h-6 text-purple-600">📊</div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_capacity.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <div className="w-6 h-6 text-orange-600">📈</div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.occupancy_rate}%</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search branches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch Type</label>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full"
              >
                <option value="all">All Types</option>
                <option value="farm">Farm</option>
                <option value="laboratory">Laboratory</option>
                <option value="clinic">Clinic</option>
                <option value="research_center">Research Center</option>
                <option value="processing_facility">Processing Facility</option>
                <option value="breeding_center">Breeding Center</option>
                <option value="quarantine_facility">Quarantine Facility</option>
                <option value="training_center">Training Center</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
                <option value="maintenance">Maintenance</option>
              </Select>
            </div>

            <div className="flex items-end">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                + Add New Branch
              </button>
            </div>
          </div>
        </Card>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <Card key={branch.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedBranch(branch)}>
              {/* Branch Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{branch.name}</h3>
                  <p className="text-sm text-gray-600">{branch.branch_code}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge className={getBranchTypeColor(branch.branch_type)}>
                    {formatBranchType(branch.branch_type)}
                  </Badge>
                  <Badge className={getStatusColor(branch.status)}>
                    {branch.status.charAt(0).toUpperCase() + branch.status.slice(1)}
                  </Badge>
                </div>
              </div>

              {/* Location */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">📍 {branch.city}, {branch.state_province}</p>
                <p className="text-sm text-gray-600">{branch.country}</p>
              </div>

              {/* Manager */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">Manager</p>
                <p className="text-sm text-gray-600">{branch.manager_name}</p>
                <p className="text-sm text-gray-600">{branch.manager_email}</p>
              </div>

              {/* Capacity */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Capacity</span>
                  <span className="text-sm text-gray-600">
                    {branch.current_occupancy} / {branch.capacity}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${calculateOccupancyRate(branch.current_occupancy, branch.capacity)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {calculateOccupancyRate(branch.current_occupancy, branch.capacity)}% occupied
                </p>
              </div>

              {/* Budget */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700">Budget Allocation</p>
                <p className="text-sm text-gray-600">{branch.budget_allocation}</p>
              </div>

              {/* Services */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Services</p>
                <div className="flex flex-wrap gap-1">
                  {parseJsonField(branch.services_offered).slice(0, 3).map((service: string, index: number) => (
                    <Badge key={index} className="bg-gray-100 text-gray-700 text-xs">
                      {service}
                    </Badge>
                  ))}
                  {parseJsonField(branch.services_offered).length > 3 && (
                    <Badge className="bg-gray-100 text-gray-700 text-xs">
                      +{parseJsonField(branch.services_offered).length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">📞 {branch.phone}</p>
                    <p className="text-xs text-gray-500">✉️ {branch.email}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details →
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {branches.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🏢</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or add a new branch.</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Add New Branch
            </button>
          </Card>
        )}
      </div>

      {/* Branch Detail Modal */}
      {selectedBranch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedBranch.name}</h2>
                  <p className="text-gray-600">{selectedBranch.branch_code}</p>
                </div>
                <button 
                  onClick={() => setSelectedBranch(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Type</p>
                      <Badge className={getBranchTypeColor(selectedBranch.branch_type)}>
                        {formatBranchType(selectedBranch.branch_type)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Status</p>
                      <Badge className={getStatusColor(selectedBranch.status)}>
                        {selectedBranch.status.charAt(0).toUpperCase() + selectedBranch.status.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Established</p>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedBranch.established_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">License</p>
                      <p className="text-sm text-gray-600">{selectedBranch.license_number}</p>
                      <p className="text-xs text-gray-500">
                        Expires: {new Date(selectedBranch.license_expiry).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location & Contact */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Location & Contact</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Address</p>
                      <p className="text-sm text-gray-600">
                        {selectedBranch.address}<br/>
                        {selectedBranch.city}, {selectedBranch.state_province} {selectedBranch.postal_code}<br/>
                        {selectedBranch.country}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Contact</p>
                      <p className="text-sm text-gray-600">📞 {selectedBranch.phone}</p>
                      <p className="text-sm text-gray-600">✉️ {selectedBranch.email}</p>
                      {selectedBranch.website && (
                        <p className="text-sm text-gray-600">🌐 {selectedBranch.website}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Management */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Management</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Manager</p>
                      <p className="text-sm text-gray-600">{selectedBranch.manager_name}</p>
                      <p className="text-sm text-gray-600">📞 {selectedBranch.manager_phone}</p>
                      <p className="text-sm text-gray-600">✉️ {selectedBranch.manager_email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Budget</p>
                      <p className="text-sm text-gray-600">{selectedBranch.budget_allocation}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Cost Center</p>
                      <p className="text-sm text-gray-600">{selectedBranch.operational_cost_center}</p>
                    </div>
                  </div>
                </div>

                {/* Capacity */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Capacity</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Current Occupancy</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedBranch.current_occupancy} / {selectedBranch.capacity}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                        <div 
                          className="bg-blue-600 h-3 rounded-full" 
                          style={{ width: `${calculateOccupancyRate(selectedBranch.current_occupancy, selectedBranch.capacity)}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {calculateOccupancyRate(selectedBranch.current_occupancy, selectedBranch.capacity)}% occupied
                      </p>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Services Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {parseJsonField(selectedBranch.services_offered).map((service: string, index: number) => (
                      <Badge key={index} className="bg-blue-100 text-blue-800">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Equipment */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Equipment</h3>
                  <div className="flex flex-wrap gap-2">
                    {parseJsonField(selectedBranch.equipment_list).map((equipment: string, index: number) => (
                      <Badge key={index} className="bg-green-100 text-green-800">
                        {equipment}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {parseJsonField(selectedBranch.certifications).map((cert: string, index: number) => (
                      <Badge key={index} className="bg-purple-100 text-purple-800">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                <button 
                  onClick={() => setSelectedBranch(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Edit Branch
                </button>
                <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors">
                  View Animals
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchManagementPage;

