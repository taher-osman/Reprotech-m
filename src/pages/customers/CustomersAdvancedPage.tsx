import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

interface Customer {
  id: string;
  customerId: string;
  name: string;
  type: 'Individual' | 'Farm' | 'Research Institution' | 'Veterinary Clinic' | 'Government' | 'Corporate';
  status: 'Active' | 'Inactive' | 'Pending' | 'Suspended';
  registrationDate: string;
  lastActivity: string;
  contactInfo: ContactInfo;
  businessInfo: BusinessInfo;
  animalStats: AnimalStats;
  financialData: FinancialData;
  contracts: Contract[];
  documents: Document[];
  notes: string;
  priority: 'Standard' | 'High' | 'VIP' | 'Critical';
  region: string;
  assignedManager: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  website?: string;
  emergencyContact?: string;
}

interface BusinessInfo {
  industry: string;
  establishedYear: number;
  employeeCount: number;
  annualRevenue: number;
  taxId: string;
  certifications: string[];
}

interface AnimalStats {
  totalAnimals: number;
  activeAnimals: number;
  species: { [key: string]: number };
  breeds: { [key: string]: number };
  avgAge: number;
  healthScore: number;
}

interface FinancialData {
  totalRevenue: number;
  outstandingBalance: number;
  creditLimit: number;
  paymentTerms: string;
  lastPayment: string;
  avgMonthlySpend: number;
}

interface Contract {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  value: number;
  status: 'Active' | 'Expired' | 'Pending' | 'Cancelled';
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
}

const CustomersAdvancedPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [regionFilter, setRegionFilter] = useState('All Regions');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockData: Customer[] = [
      {
        id: 'CUST-001',
        customerId: 'GVF-2024-001',
        name: 'Green Valley Farm',
        type: 'Farm',
        status: 'Active',
        registrationDate: '2023-03-15',
        lastActivity: '2024-08-16',
        contactInfo: {
          email: 'contact@greenvalleyfarm.com',
          phone: '+1-555-0123',
          address: '1234 Farm Road',
          city: 'Madison',
          country: 'USA',
          website: 'www.greenvalleyfarm.com',
          emergencyContact: '+1-555-0124'
        },
        businessInfo: {
          industry: 'Dairy Farming',
          establishedYear: 1985,
          employeeCount: 45,
          annualRevenue: 2500000,
          taxId: 'TAX-123456789',
          certifications: ['Organic Certified', 'Animal Welfare Approved', 'ISO 14001']
        },
        animalStats: {
          totalAnimals: 850,
          activeAnimals: 820,
          species: { 'Bovine': 750, 'Equine': 50, 'Ovine': 50 },
          breeds: { 'Holstein': 450, 'Jersey': 300, 'Thoroughbred': 50, 'Dorset': 50 },
          avgAge: 4.2,
          healthScore: 92.5
        },
        financialData: {
          totalRevenue: 485000,
          outstandingBalance: 12500,
          creditLimit: 50000,
          paymentTerms: 'Net 30',
          lastPayment: '2024-08-10',
          avgMonthlySpend: 28500
        },
        contracts: [
          { id: 'CON-001', type: 'Breeding Services', startDate: '2024-01-01', endDate: '2024-12-31', value: 125000, status: 'Active' },
          { id: 'CON-002', type: 'Health Monitoring', startDate: '2024-06-01', endDate: '2025-05-31', value: 85000, status: 'Active' }
        ],
        documents: [
          { id: 'DOC-001', name: 'Farm Certification.pdf', type: 'Certificate', uploadDate: '2024-01-15', size: '2.3 MB' },
          { id: 'DOC-002', name: 'Insurance Policy.pdf', type: 'Insurance', uploadDate: '2024-03-20', size: '1.8 MB' }
        ],
        notes: 'Premium customer with excellent payment history. Interested in expanding genomic testing program.',
        priority: 'VIP',
        region: 'North America',
        assignedManager: 'Sarah Johnson'
      },
      {
        id: 'CUST-002',
        customerId: 'UVR-2024-002',
        name: 'University Veterinary Research Center',
        type: 'Research Institution',
        status: 'Active',
        registrationDate: '2023-09-22',
        lastActivity: '2024-08-15',
        contactInfo: {
          email: 'research@uvrc.edu',
          phone: '+1-555-0456',
          address: '789 University Drive',
          city: 'Boston',
          country: 'USA',
          website: 'www.uvrc.edu'
        },
        businessInfo: {
          industry: 'Research & Education',
          establishedYear: 1962,
          employeeCount: 120,
          annualRevenue: 8500000,
          taxId: 'TAX-987654321',
          certifications: ['AAALAC Accredited', 'NIH Approved', 'USDA Licensed']
        },
        animalStats: {
          totalAnimals: 245,
          activeAnimals: 230,
          species: { 'Bovine': 80, 'Equine': 45, 'Ovine': 60, 'Caprine': 35, 'Feline': 25 },
          breeds: { 'Holstein': 50, 'Angus': 30, 'Arabian': 25, 'Suffolk': 35, 'Boer': 35, 'Maine Coon': 25 },
          avgAge: 3.8,
          healthScore: 96.2
        },
        financialData: {
          totalRevenue: 285000,
          outstandingBalance: 8500,
          creditLimit: 75000,
          paymentTerms: 'Net 45',
          lastPayment: '2024-08-05',
          avgMonthlySpend: 18500
        },
        contracts: [
          { id: 'CON-003', type: 'Research Collaboration', startDate: '2024-01-01', endDate: '2026-12-31', value: 450000, status: 'Active' },
          { id: 'CON-004', type: 'Genomic Analysis', startDate: '2024-03-01', endDate: '2024-12-31', value: 125000, status: 'Active' }
        ],
        documents: [
          { id: 'DOC-003', name: 'Research Agreement.pdf', type: 'Contract', uploadDate: '2024-01-01', size: '4.2 MB' },
          { id: 'DOC-004', name: 'IACUC Approval.pdf', type: 'Approval', uploadDate: '2024-02-15', size: '1.5 MB' }
        ],
        notes: 'Leading research institution with focus on genetic studies. Requires specialized reporting and data analysis.',
        priority: 'High',
        region: 'North America',
        assignedManager: 'Dr. Michael Chen'
      },
      {
        id: 'CUST-003',
        customerId: 'EVC-2024-003',
        name: 'Elite Veterinary Clinic',
        type: 'Veterinary Clinic',
        status: 'Active',
        registrationDate: '2024-02-10',
        lastActivity: '2024-08-14',
        contactInfo: {
          email: 'info@elitevet.com',
          phone: '+1-555-0789',
          address: '456 Medical Plaza',
          city: 'Denver',
          country: 'USA',
          website: 'www.elitevet.com'
        },
        businessInfo: {
          industry: 'Veterinary Services',
          establishedYear: 2018,
          employeeCount: 25,
          annualRevenue: 1200000,
          taxId: 'TAX-456789123',
          certifications: ['AAHA Accredited', 'Fear Free Certified']
        },
        animalStats: {
          totalAnimals: 125,
          activeAnimals: 115,
          species: { 'Feline': 45, 'Canine': 50, 'Equine': 20, 'Exotic': 10 },
          breeds: { 'Mixed Breed': 35, 'Golden Retriever': 15, 'Persian': 20, 'Quarter Horse': 20, 'Various': 35 },
          avgAge: 6.5,
          healthScore: 88.7
        },
        financialData: {
          totalRevenue: 95000,
          outstandingBalance: 3500,
          creditLimit: 25000,
          paymentTerms: 'Net 15',
          lastPayment: '2024-08-12',
          avgMonthlySpend: 8500
        },
        contracts: [
          { id: 'CON-005', type: 'Diagnostic Services', startDate: '2024-02-01', endDate: '2025-01-31', value: 65000, status: 'Active' }
        ],
        documents: [
          { id: 'DOC-005', name: 'Clinic License.pdf', type: 'License', uploadDate: '2024-02-10', size: '1.2 MB' }
        ],
        notes: 'Growing veterinary practice with focus on advanced diagnostics. Potential for expansion.',
        priority: 'Standard',
        region: 'North America',
        assignedManager: 'Lisa Rodriguez'
      },
      {
        id: 'CUST-004',
        customerId: 'AGD-2024-004',
        name: 'Agricultural Development Ministry',
        type: 'Government',
        status: 'Active',
        registrationDate: '2023-11-08',
        lastActivity: '2024-08-13',
        contactInfo: {
          email: 'livestock@agdev.gov',
          phone: '+44-20-7946-0958',
          address: 'Whitehall Place 15',
          city: 'London',
          country: 'United Kingdom'
        },
        businessInfo: {
          industry: 'Government Agriculture',
          establishedYear: 1889,
          employeeCount: 2500,
          annualRevenue: 0,
          taxId: 'GOV-UK-AGR-001',
          certifications: ['ISO 9001', 'Government Standard']
        },
        animalStats: {
          totalAnimals: 1250,
          activeAnimals: 1200,
          species: { 'Bovine': 800, 'Ovine': 300, 'Caprine': 100, 'Equine': 50 },
          breeds: { 'Aberdeen Angus': 400, 'Highland': 200, 'Hereford': 200, 'Scottish Blackface': 200, 'Cheviot': 100, 'Various': 150 },
          avgAge: 5.1,
          healthScore: 94.8
        },
        financialData: {
          totalRevenue: 750000,
          outstandingBalance: 0,
          creditLimit: 200000,
          paymentTerms: 'Net 60',
          lastPayment: '2024-08-01',
          avgMonthlySpend: 45000
        },
        contracts: [
          { id: 'CON-006', type: 'National Breeding Program', startDate: '2024-01-01', endDate: '2027-12-31', value: 1500000, status: 'Active' },
          { id: 'CON-007', type: 'Disease Surveillance', startDate: '2024-04-01', endDate: '2025-03-31', value: 285000, status: 'Active' }
        ],
        documents: [
          { id: 'DOC-006', name: 'Government Contract.pdf', type: 'Contract', uploadDate: '2023-11-08', size: '8.5 MB' },
          { id: 'DOC-007', name: 'Compliance Certificate.pdf', type: 'Certificate', uploadDate: '2024-01-15', size: '2.1 MB' }
        ],
        notes: 'Major government contract for national livestock improvement program. Requires detailed reporting and compliance.',
        priority: 'Critical',
        region: 'Europe',
        assignedManager: 'James Wilson'
      }
    ];

    setTimeout(() => {
      setCustomers(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || customer.status === statusFilter;
    const matchesType = typeFilter === 'All Types' || customer.type === typeFilter;
    const matchesRegion = regionFilter === 'All Regions' || customer.region === regionFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesRegion;
  });

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'Active').length,
    totalAnimals: customers.reduce((sum, c) => sum + c.animalStats.totalAnimals, 0),
    totalRevenue: customers.reduce((sum, c) => sum + c.financialData.totalRevenue, 0),
    avgHealthScore: customers.reduce((sum, c) => sum + c.animalStats.healthScore, 0) / customers.length || 0,
    outstandingBalance: customers.reduce((sum, c) => sum + c.financialData.outstandingBalance, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Standard': return 'bg-gray-100 text-gray-800';
      case 'High': return 'bg-yellow-100 text-yellow-800';
      case 'VIP': return 'bg-purple-100 text-purple-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContractStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer & CRM Management</h1>
          <p className="text-gray-600 mt-2">Advanced customer relationship management with analytics</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            📊 CRM Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            👥 New Customer
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalCustomers}</p>
            </div>
            <div className="text-blue-500 text-2xl">👥</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeCustomers}</p>
            </div>
            <div className="text-green-500 text-2xl">✅</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Animals</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalAnimals.toLocaleString()}</p>
            </div>
            <div className="text-purple-500 text-2xl">🐄</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-emerald-600">${(stats.totalRevenue / 1000).toFixed(0)}K</p>
            </div>
            <div className="text-emerald-500 text-2xl">💰</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Health Score</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.avgHealthScore.toFixed(1)}%</p>
            </div>
            <div className="text-indigo-500 text-2xl">🏥</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-orange-600">${(stats.outstandingBalance / 1000).toFixed(0)}K</p>
            </div>
            <div className="text-orange-500 text-2xl">⏳</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Pending</option>
              <option>Suspended</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Types</option>
              <option>Individual</option>
              <option>Farm</option>
              <option>Research Institution</option>
              <option>Veterinary Clinic</option>
              <option>Government</option>
              <option>Corporate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Regions</option>
              <option>North America</option>
              <option>Europe</option>
              <option>Asia Pacific</option>
              <option>Latin America</option>
              <option>Africa</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
              📊 Export CRM
            </button>
          </div>
        </div>
      </Card>

      {/* Customer Records */}
      <div className="space-y-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {customer.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {customer.customerId} • {customer.type} • {customer.region}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(customer.status)}>
                    {customer.status}
                  </Badge>
                  <Badge className={getPriorityColor(customer.priority)}>
                    {customer.priority}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                  📋 View Profile
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                  ✏️ Edit
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Contact & Business Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Contact & Business</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-blue-600">{customer.contactInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{customer.contactInfo.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">City:</span>
                    <span className="font-medium">{customer.contactInfo.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Industry:</span>
                    <span className="font-medium">{customer.businessInfo.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Established:</span>
                    <span className="font-medium">{customer.businessInfo.establishedYear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Manager:</span>
                    <span className="font-medium">{customer.assignedManager}</span>
                  </div>
                </div>
              </div>

              {/* Animal Statistics */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Animal Portfolio</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Animals:</span>
                    <span className="font-medium text-purple-600">{customer.animalStats.totalAnimals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active:</span>
                    <span className="font-medium text-green-600">{customer.animalStats.activeAnimals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Age:</span>
                    <span className="font-medium">{customer.animalStats.avgAge} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Health Score:</span>
                    <span className="font-medium text-green-600">{customer.animalStats.healthScore}%</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-600 text-xs">Top Species:</span>
                    <div className="mt-1 space-y-1">
                      {Object.entries(customer.animalStats.species).slice(0, 3).map(([species, count]) => (
                        <div key={species} className="flex justify-between text-xs">
                          <span className="text-gray-600">{species}:</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Data */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Financial Overview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Revenue:</span>
                    <span className="font-medium text-green-600">${customer.financialData.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Outstanding:</span>
                    <span className="font-medium text-orange-600">${customer.financialData.outstandingBalance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Credit Limit:</span>
                    <span className="font-medium">${customer.financialData.creditLimit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Terms:</span>
                    <span className="font-medium">{customer.financialData.paymentTerms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Avg:</span>
                    <span className="font-medium text-blue-600">${customer.financialData.avgMonthlySpend.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Payment:</span>
                    <span className="font-medium">{new Date(customer.financialData.lastPayment).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Contracts & Documents */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Contracts & Documents</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600 font-medium">Active Contracts:</span>
                    <div className="mt-1 space-y-1">
                      {customer.contracts.filter(c => c.status === 'Active').map((contract) => (
                        <div key={contract.id} className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">{contract.type}:</span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium">${(contract.value / 1000).toFixed(0)}K</span>
                            <Badge className={getContractStatusColor(contract.status)}>
                              {contract.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className="text-gray-600 font-medium">Documents:</span>
                    <div className="mt-1 space-y-1">
                      {customer.documents.slice(0, 2).map((doc) => (
                        <div key={doc.id} className="flex justify-between text-xs">
                          <span className="text-gray-600 truncate">{doc.name}:</span>
                          <span className="font-medium">{doc.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-gray-600 font-medium">Certifications:</span>
                    <div className="mt-1 space-y-1">
                      {customer.businessInfo.certifications.slice(0, 2).map((cert, index) => (
                        <div key={index} className="text-xs text-green-600">• {cert}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {customer.notes && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Customer Notes</h4>
                <p className="text-sm text-gray-800">{customer.notes}</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 text-4xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or add a new customer.</p>
        </Card>
      )}
    </div>
  );
};

export default CustomersAdvancedPage;

