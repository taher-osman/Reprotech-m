import React, { useState, useEffect } from 'react';
import { ShoppingCart, Building, DollarSign, TrendingUp, Package, Users, Clock, CheckCircle, Shield, Zap } from 'lucide-react';
import { ProcurementManager } from '../../inventory/components/ProcurementManager';
import { ApprovalWorkflowManager } from '../components/ApprovalWorkflowManager';

// Mock purchase orders that would normally come from a shared state or API
const mockPurchaseOrders = [
  {
    id: '2',
    orderNumber: 'PO-2025-002',
    supplierId: '2',
    supplierName: 'Vetoquinol Pharmaceuticals',
    items: [
      { id: '3', itemId: '2', itemName: 'FSH (Folltropin)', quantity: 20, unitPrice: 125.00, totalPrice: 2500.00, category: 'HORMONE', urgency: 'CRITICAL' }
    ],
    totalAmount: 2500.00,
    status: 'PENDING_APPROVAL',
    orderDate: '2025-01-02',
    expectedDelivery: '2025-01-04',
    priority: 'URGENT',
    requestedBy: 'Dr. Michael Chen',
    department: 'IVF Laboratory',
    approvalLevel: 1,
    totalApprovalLevels: 3,
    currentApprover: 'Department Head'
  },
  {
    id: '3',
    orderNumber: 'PO-2025-003',
    supplierId: '3',
    supplierName: 'CryoTech Industries',
    items: [
      { id: '4', itemId: '3', itemName: 'Liquid Nitrogen', quantity: 100, unitPrice: 12.50, totalPrice: 1250.00, category: 'CRYO_MATERIAL', urgency: 'HIGH' }
    ],
    totalAmount: 1250.00,
    status: 'PENDING_APPROVAL',
    orderDate: '2025-01-01',
    expectedDelivery: '2025-01-03',
    priority: 'HIGH',
    requestedBy: 'James Wilson',
    department: 'Cryopreservation Lab',
    approvalLevel: 2,
    totalApprovalLevels: 3,
    currentApprover: 'Finance Manager'
  }
];

export const ProcurementManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [purchaseOrders, setPurchaseOrders] = useState(mockPurchaseOrders);

  const procurementStats = {
    activeSuppliers: 3,
    totalPurchaseOrders: 12,
    pendingApprovals: purchaseOrders.filter(po => po.status === 'PENDING_APPROVAL').length,
    totalSpending: 89750.25
  };

  const handleUpdatePurchaseOrder = (orderId: string, updates: any) => {
    setPurchaseOrders(prev => prev.map(po => 
      po.id === orderId ? { ...po, ...updates } : po
    ));
    
    // In a real application, this would also update the main procurement system
    console.log(`Updated Purchase Order ${orderId}:`, updates);
  };

  const recentActivity = [
    { 
      type: 'PO Created',
      description: 'Purchase Order #PO-2025-003 created for Culture Media',
      supplier: 'Life Technologies',
      amount: 1250.50,
      status: 'Pending Approval',
      date: '2025-01-02'
    },
    { 
      type: 'Supplier Added',
      description: 'New supplier CryoTech Industries registered',
      supplier: 'CryoTech Industries',
      amount: null,
      status: 'Active',
      date: '2025-01-01'
    },
    { 
      type: 'Reorder Alert',
      description: 'Automatic reorder triggered for FSH Folltropin',
      supplier: 'Vetoquinol',
      amount: 2000.00,
      status: 'Processing',
      date: '2024-12-31'
    },
    { 
      type: 'PO Delivered',
      description: 'Purchase Order #PO-2024-145 delivered successfully',
      supplier: 'Bio-Reagents Co.',
      amount: 3450.75,
      status: 'Completed',
      date: '2024-12-30'
    }
  ];

  const supplierPerformance = [
    {
      name: 'Life Technologies',
      rating: 4.8,
      onTimeDelivery: 94.5,
      qualityScore: 9.2,
      totalOrders: 45,
      totalSpent: 45250.50
    },
    {
      name: 'Vetoquinol',
      rating: 4.6,
      onTimeDelivery: 91.2,
      qualityScore: 8.9,
      totalOrders: 28,
      totalSpent: 32100.25
    },
    {
      name: 'CryoTech Industries',
      rating: 4.9,
      onTimeDelivery: 96.8,
      qualityScore: 9.5,
      totalOrders: 12,
      totalSpent: 12399.50
    }
  ];

  const tabs = [
    { id: 'overview', name: 'Procurement Overview', icon: ShoppingCart },
    { id: 'manager', name: 'Full Procurement Hub', icon: Building },
    { id: 'approval-workflow', name: 'Approval Workflow', icon: Shield }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Procurement Management Hub</h1>
            <p className="text-indigo-100 mt-1">Supplier management and purchase order automation</p>
          </div>
          <div className="flex space-x-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">PHASE 5</span>
            <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-indigo-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{procurementStats.activeSuppliers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Purchase Orders</p>
              <p className="text-2xl font-bold text-gray-900">{procurementStats.totalPurchaseOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900">{procurementStats.pendingApprovals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Spending</p>
              <p className="text-2xl font-bold text-gray-900">${procurementStats.totalSpending.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Supplier Performance */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Supplier Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  On-Time Delivery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quality Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {supplierPerformance.map((supplier, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900">{supplier.rating}</span>
                      <div className="ml-2 flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < Math.floor(supplier.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{supplier.onTimeDelivery}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${supplier.onTimeDelivery}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{supplier.qualityScore}/10</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{supplier.totalOrders}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">${supplier.totalSpent.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 border border-gray-100 rounded-lg">
              <div className={`p-2 rounded-full ${
                activity.type === 'PO Created' ? 'bg-blue-100' :
                activity.type === 'Supplier Added' ? 'bg-green-100' :
                activity.type === 'Reorder Alert' ? 'bg-orange-100' :
                'bg-purple-100'
              }`}>
                {activity.type === 'PO Created' && <ShoppingCart className="h-4 w-4 text-blue-600" />}
                {activity.type === 'Supplier Added' && <Users className="h-4 w-4 text-green-600" />}
                {activity.type === 'Reorder Alert' && <TrendingUp className="h-4 w-4 text-orange-600" />}
                {activity.type === 'PO Delivered' && <CheckCircle className="h-4 w-4 text-purple-600" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{activity.type}</h4>
                  <span className="text-xs text-gray-500">{activity.date}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>Supplier: {activity.supplier}</span>
                  {activity.amount && <span>Amount: ${activity.amount.toLocaleString()}</span>}
                  <span className={`px-2 py-1 rounded-full ${
                    activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    activity.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-800' :
                    activity.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase 5 Features Preview */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Phase 5: Advanced Features</h3>
            <p className="text-purple-100 mt-1">Approval Workflow Management & AI-Powered Procurement</p>
          </div>
          <div className="flex space-x-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">COMING SOON</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="text-center p-4 bg-white/10 rounded-lg">
            <Shield className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
            <h4 className="font-medium">Approval Workflows</h4>
            <p className="text-sm text-purple-100">Multi-level approval system with smart routing</p>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-lg">
            <Zap className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
            <h4 className="font-medium">AI Optimization</h4>
            <p className="text-sm text-purple-100">Predictive analytics and automated decision making</p>
          </div>
          <div className="text-center p-4 bg-white/10 rounded-lg">
            <TrendingUp className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
            <h4 className="font-medium">Performance Analytics</h4>
            <p className="text-sm text-purple-100">Advanced reporting and workflow optimization</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'manager' && <ProcurementManager />}
      {activeTab === 'approval-workflow' && (
        <ApprovalWorkflowManager 
          purchaseOrders={purchaseOrders}
          onUpdatePurchaseOrder={handleUpdatePurchaseOrder}
        />
      )}
    </div>
  );
}; 