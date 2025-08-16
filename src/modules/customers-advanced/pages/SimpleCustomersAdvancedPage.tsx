import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, DollarSign, Calendar, Phone, Mail, MapPin, Plus, Search, Filter, Edit, Eye, MessageSquare, FileText, CreditCard, BarChart3, Activity, AlertCircle, CheckCircle, Clock, Star } from 'lucide-react';

const SimpleCustomersAdvancedPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [customers, setCustomers] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    setCustomers([
      {
        id: 'CUST-001',
        name: 'John Smith',
        company: 'Smith Ranch',
        email: 'john@smithranch.com',
        phone: '+1 (555) 123-4567',
        address: '123 Ranch Road, Texas, USA',
        status: 'Active',
        tier: 'Premium',
        totalAnimals: 45,
        totalSpent: 125000,
        lastVisit: '2025-08-15',
        joinDate: '2023-03-15',
        satisfaction: 4.8,
        upcomingAppointments: 2,
        activeContracts: 3
      },
      {
        id: 'CUST-002',
        name: 'Sarah Wilson',
        company: 'Wilson Dairy Farm',
        email: 'sarah@wilsondairy.com',
        phone: '+1 (555) 234-5678',
        address: '456 Farm Lane, California, USA',
        status: 'Active',
        tier: 'Gold',
        totalAnimals: 78,
        totalSpent: 89000,
        lastVisit: '2025-08-14',
        joinDate: '2022-11-20',
        satisfaction: 4.6,
        upcomingAppointments: 1,
        activeContracts: 2
      },
      {
        id: 'CUST-003',
        name: 'Mike Brown',
        company: 'Brown Livestock',
        email: 'mike@brownlivestock.com',
        phone: '+1 (555) 345-6789',
        address: '789 Pasture Drive, Montana, USA',
        status: 'Active',
        tier: 'Standard',
        totalAnimals: 32,
        totalSpent: 45000,
        lastVisit: '2025-08-12',
        joinDate: '2024-01-10',
        satisfaction: 4.4,
        upcomingAppointments: 3,
        activeContracts: 1
      },
      {
        id: 'CUST-004',
        name: 'Lisa Davis',
        company: 'Davis Breeding Center',
        email: 'lisa@davisbreeding.com',
        phone: '+1 (555) 456-7890',
        address: '321 Breeding Road, Kentucky, USA',
        status: 'Inactive',
        tier: 'Premium',
        totalAnimals: 67,
        totalSpent: 156000,
        lastVisit: '2025-07-28',
        joinDate: '2021-09-05',
        satisfaction: 4.9,
        upcomingAppointments: 0,
        activeContracts: 4
      }
    ]);

    setCommunications([
      {
        id: 'COMM-001',
        customerId: 'CUST-001',
        customerName: 'John Smith',
        type: 'Email',
        subject: 'Embryo Transfer Results',
        date: '2025-08-15',
        status: 'Sent',
        priority: 'High',
        notes: 'Successful embryo transfer results shared'
      },
      {
        id: 'COMM-002',
        customerId: 'CUST-002',
        customerName: 'Sarah Wilson',
        type: 'Phone Call',
        subject: 'Appointment Confirmation',
        date: '2025-08-14',
        status: 'Completed',
        priority: 'Normal',
        notes: 'Confirmed upcoming ultrasound appointment'
      },
      {
        id: 'COMM-003',
        customerId: 'CUST-003',
        customerName: 'Mike Brown',
        type: 'Meeting',
        subject: 'Contract Renewal Discussion',
        date: '2025-08-13',
        status: 'Scheduled',
        priority: 'High',
        notes: 'Annual contract renewal meeting scheduled'
      },
      {
        id: 'COMM-004',
        customerId: 'CUST-001',
        customerName: 'John Smith',
        type: 'SMS',
        subject: 'Appointment Reminder',
        date: '2025-08-12',
        status: 'Delivered',
        priority: 'Normal',
        notes: 'Automated appointment reminder sent'
      }
    ]);

    setInvoices([
      {
        id: 'INV-001',
        customerId: 'CUST-001',
        customerName: 'John Smith',
        amount: 15000,
        status: 'Paid',
        dueDate: '2025-08-10',
        paidDate: '2025-08-08',
        services: 'Embryo Transfer Package',
        paymentMethod: 'Bank Transfer'
      },
      {
        id: 'INV-002',
        customerId: 'CUST-002',
        customerName: 'Sarah Wilson',
        amount: 8500,
        status: 'Pending',
        dueDate: '2025-08-20',
        paidDate: null,
        services: 'Ultrasound & Health Check',
        paymentMethod: null
      },
      {
        id: 'INV-003',
        customerId: 'CUST-003',
        customerName: 'Mike Brown',
        amount: 12000,
        status: 'Overdue',
        dueDate: '2025-08-05',
        paidDate: null,
        services: 'Vaccination Program',
        paymentMethod: null
      },
      {
        id: 'INV-004',
        customerId: 'CUST-004',
        customerName: 'Lisa Davis',
        amount: 25000,
        status: 'Paid',
        dueDate: '2025-07-30',
        paidDate: '2025-07-29',
        services: 'Comprehensive Breeding Package',
        paymentMethod: 'Credit Card'
      }
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Inactive': return 'text-red-600 bg-red-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Suspended': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Premium': return 'text-purple-600 bg-purple-100';
      case 'Gold': return 'text-yellow-600 bg-yellow-100';
      case 'Standard': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getInvoiceStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Overdue': return 'text-red-600 bg-red-100';
      case 'Cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCommunicationTypeColor = (type) => {
    switch (type) {
      case 'Email': return 'text-blue-600 bg-blue-100';
      case 'Phone Call': return 'text-green-600 bg-green-100';
      case 'Meeting': return 'text-purple-600 bg-purple-100';
      case 'SMS': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-lg p-6 text-white mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Customer Relationship Management</h1>
            <p className="text-purple-100 mb-4">Advanced CRM with customer analytics, communication tracking, and billing integration</p>
            <div className="flex gap-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">360° Customer View</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Automated Workflows</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Revenue Analytics</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">Aug 16, 02:58 PM</div>
            <div className="text-purple-200">CRM System: Active</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'dashboard', label: 'CRM Dashboard', icon: BarChart3 },
          { id: 'customers', label: 'Customer Profiles', icon: Users },
          { id: 'communications', label: 'Communications', icon: MessageSquare },
          { id: 'billing', label: 'Billing & Payments', icon: CreditCard }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* CRM Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Customers</p>
                  <p className="text-3xl font-bold text-blue-900">247</p>
                  <p className="text-blue-600 text-sm">+12 this month</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-green-900">$89,500</p>
                  <p className="text-green-600 text-sm">+15% vs last month</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Avg Satisfaction</p>
                  <p className="text-3xl font-bold text-purple-900">4.7</p>
                  <p className="text-purple-600 text-sm">⭐⭐⭐⭐⭐</p>
                </div>
                <Star className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Active Contracts</p>
                  <p className="text-3xl font-bold text-orange-900">156</p>
                  <p className="text-orange-600 text-sm">Renewal rate: 94%</p>
                </div>
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Customer Tier Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Customer Tier Distribution</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">Premium</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">89 customers</span>
                    <div className="text-sm text-gray-500">36%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-700">Gold</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">98 customers</span>
                    <div className="text-sm text-gray-500">40%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Standard</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">60 customers</span>
                    <div className="text-sm text-gray-500">24%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Payment received from John Smith</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email sent to Sarah Wilson</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Meeting scheduled with Mike Brown</p>
                    <p className="text-xs text-gray-500">6 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Invoice overdue: Mike Brown</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Profiles Tab */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          {/* Customer Controls */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Suspended</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>All Tiers</option>
                <option>Premium</option>
                <option>Gold</option>
                <option>Standard</option>
              </select>
            </div>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Customer
            </button>
          </div>

          {/* Customer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customers.map((customer) => (
              <div key={customer.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-600">{customer.company}</p>
                    <p className="text-xs text-gray-500">{customer.id}</p>
                  </div>
                  <div className="flex gap-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTierColor(customer.tier)}`}>
                      {customer.tier}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{customer.address}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Animals:</span>
                    <span className="font-medium ml-1">{customer.totalAnimals}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Spent:</span>
                    <span className="font-medium ml-1">${customer.totalSpent.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Satisfaction:</span>
                    <span className="font-medium ml-1">{customer.satisfaction}/5</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Contracts:</span>
                    <span className="font-medium ml-1">{customer.activeContracts}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 flex items-center justify-center gap-1">
                    <Eye className="w-3 h-3" />
                    View Profile
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-50 flex items-center justify-center gap-1">
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Communications Tab */}
      {activeTab === 'communications' && (
        <div className="space-y-6">
          {/* Communication Controls */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search communications..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>All Types</option>
                <option>Email</option>
                <option>Phone Call</option>
                <option>Meeting</option>
                <option>SMS</option>
              </select>
            </div>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Communication
            </button>
          </div>

          {/* Communications Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Communication</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {communications.map((comm) => (
                  <tr key={comm.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{comm.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comm.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCommunicationTypeColor(comm.type)}`}>
                        {comm.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comm.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comm.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(comm.status)}`}>
                        {comm.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comm.priority}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-purple-600 hover:text-purple-900 mr-3">View</button>
                      <button className="text-blue-600 hover:text-blue-900">Reply</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Billing & Payments Tab */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          {/* Billing Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-900">$415K</p>
                  <p className="text-green-600 text-sm">This year</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Outstanding</p>
                  <p className="text-3xl font-bold text-blue-900">$20.5K</p>
                  <p className="text-blue-600 text-sm">Pending payment</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-red-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Overdue</p>
                  <p className="text-3xl font-bold text-red-900">$12K</p>
                  <p className="text-red-600 text-sm">Requires attention</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Avg Invoice</p>
                  <p className="text-3xl font-bold text-purple-900">$15.1K</p>
                  <p className="text-purple-600 text-sm">Per customer</p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Invoice Controls */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>All Status</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Overdue</option>
              </select>
            </div>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Invoice
            </button>
          </div>

          {/* Invoices Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${invoice.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.services}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.dueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getInvoiceStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.paymentMethod || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-purple-600 hover:text-purple-900 mr-3">View</button>
                      <button className="text-blue-600 hover:text-blue-900">Send</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleCustomersAdvancedPage;

