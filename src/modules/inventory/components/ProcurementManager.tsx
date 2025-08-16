import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Truck, 
  Building2, 
  DollarSign, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter,
  FileText,
  Star,
  TrendingUp,
  Package,
  Users,
  Download,
  X
} from 'lucide-react';
import { SupplierForm } from './SupplierForm';
import { PurchaseOrderForm } from './PurchaseOrderForm';
import { AnalyticsDashboard } from './AnalyticsDashboard';

// Types
interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  categories: string[];
  rating: number;
  totalOrders: number;
  totalValue: number;
  avgDeliveryDays: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  paymentTerms: string;
  certifications: string[];
  lastOrderDate: string;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  items: POItem[];
  totalAmount: number;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'SENT' | 'PARTIALLY_RECEIVED' | 'COMPLETED' | 'CANCELLED';
  orderDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  approvedBy?: string;
  notes?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  requestedBy: string;
  department?: string;
  approvalLevel?: number;
  totalApprovalLevels?: number;
  currentApprover?: string;
}

interface POItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
  urgency: string;
}

interface ReorderSuggestion {
  id: string;
  itemName: string;
  currentStock: number;
  minLevel: number;
  maxLevel: number;
  suggestedQuantity: number;
  preferredSupplier: string;
  estimatedCost: number;
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  lastOrderDate: string;
  avgConsumption: number;
}

export const ProcurementManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Modal states
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [showPOForm, setShowPOForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null);

  // Data states  
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Life Technologies Corp',
      contactPerson: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@lifetechnologies.com',
      phone: '+1-555-0123',
      address: '123 Biotech Ave, Cambridge, MA 02139',
      categories: ['MEDIA', 'REAGENT', 'EQUIPMENT'],
      rating: 4.8,
      totalOrders: 156,
      totalValue: 485750.50,
      avgDeliveryDays: 3,
      status: 'ACTIVE',
      paymentTerms: 'Net 30',
      certifications: ['ISO 9001', 'ISO 13485', 'FDA Registered'],
      lastOrderDate: '2025-01-02'
    },
    {
      id: '2',
      name: 'Vetoquinol Pharmaceuticals',
      contactPerson: 'Dr. Michael Chen',
      email: 'm.chen@vetoquinol.com',
      phone: '+1-555-0456',
      address: '456 Pharma Drive, Boston, MA 02115',
      categories: ['HORMONE', 'DRUG'],
      rating: 4.6,
      totalOrders: 89,
      totalValue: 225450.00,
      avgDeliveryDays: 2,
      status: 'ACTIVE',
      paymentTerms: 'Net 45',
      certifications: ['GMP', 'ISO 9001', 'USDA Approved'],
      lastOrderDate: '2025-01-01'
    },
    {
      id: '3',
      name: 'CryoTech Industries',
      contactPerson: 'James Wilson',
      email: 'j.wilson@cryotech.com',
      phone: '+1-555-0789',
      address: '789 Cryo Street, Denver, CO 80202',
      categories: ['CRYO_MATERIAL', 'EQUIPMENT'],
      rating: 4.9,
      totalOrders: 45,
      totalValue: 156890.75,
      avgDeliveryDays: 1,
      status: 'ACTIVE',
      paymentTerms: 'Net 15',
      certifications: ['ISO 9001', 'DOT Certified'],
      lastOrderDate: '2024-12-28'
    }
  ]);

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: '1',
      orderNumber: 'PO-2025-001',
      supplierId: '1',
      supplierName: 'Life Technologies Corp',
      items: [
        { id: '1', itemId: '1', itemName: 'Culture Medium DMEM', quantity: 10, unitPrice: 85.50, totalPrice: 855.00, category: 'MEDIA', urgency: 'HIGH' },
        { id: '2', itemId: '4', itemName: 'Fetal Bovine Serum', quantity: 5, unitPrice: 145.00, totalPrice: 725.00, category: 'MEDIA', urgency: 'MEDIUM' }
      ],
      totalAmount: 1580.00,
      status: 'APPROVED',
      orderDate: '2025-01-02',
      expectedDelivery: '2025-01-05',
      approvedBy: 'Dr. Smith',
      priority: 'HIGH',
      requestedBy: 'Dr. Sarah Johnson',
      department: 'Research Laboratory',
      approvalLevel: 3,
      totalApprovalLevels: 3,
      currentApprover: 'Completed'
    },
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
  ]);

  const [reorderSuggestions] = useState<ReorderSuggestion[]>([
    {
      id: '1',
      itemName: 'Culture Medium DMEM',
      currentStock: 750,
      minLevel: 1000,
      maxLevel: 5000,
      suggestedQuantity: 2000,
      preferredSupplier: 'Life Technologies Corp',
      estimatedCost: 1710.00,
      urgencyLevel: 'HIGH',
      lastOrderDate: '2024-12-15',
      avgConsumption: 180
    },
    {
      id: '2',
      itemName: 'Liquid Nitrogen',
      currentStock: 150,
      minLevel: 200,
      maxLevel: 1000,
      suggestedQuantity: 400,
      preferredSupplier: 'CryoTech Industries',
      estimatedCost: 5000.00,
      urgencyLevel: 'CRITICAL',
      lastOrderDate: '2024-12-20',
      avgConsumption: 25
    },
    {
      id: '3',
      itemName: 'Pipette Tips 1000µL',
      currentStock: 2500,
      minLevel: 5000,
      maxLevel: 20000,
      suggestedQuantity: 10000,
      preferredSupplier: 'Lab Supplies Inc',
      estimatedCost: 450.00,
      urgencyLevel: 'MEDIUM',
      lastOrderDate: '2024-11-30',
      avgConsumption: 850
    }
  ]);

  const procurementStats = {
    totalSuppliers: suppliers.length,
    activeOrders: purchaseOrders.filter(po => ['APPROVED', 'SENT', 'PARTIALLY_RECEIVED'].includes(po.status)).length,
    pendingApprovals: purchaseOrders.filter(po => po.status === 'PENDING_APPROVAL').length,
    reorderAlerts: reorderSuggestions.filter(r => r.urgencyLevel === 'CRITICAL' || r.urgencyLevel === 'HIGH').length,
    monthlySpend: 45680.75,
    avgDeliveryTime: 2.5
  };

  const tabs = [
    { id: 'overview', name: 'Procurement Overview', icon: ShoppingCart },
    { id: 'suppliers', name: 'Supplier Management', icon: Building2, count: suppliers.length },
    { id: 'orders', name: 'Purchase Orders', icon: FileText, count: purchaseOrders.length },
    { id: 'reorder', name: 'Reorder Automation', icon: TrendingUp, count: reorderSuggestions.length },
    { id: 'approvals', name: 'Approval Workflow', icon: CheckCircle, count: procurementStats.pendingApprovals },
    { id: 'analytics', name: 'Procurement Analytics', icon: DollarSign }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Phase 5 Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Procurement Management System</h2>
            <p className="text-indigo-100 mt-1">Complete supplier management and automated reordering platform</p>
          </div>
          <div className="flex space-x-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">PHASE 5</span>
            <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">PROCUREMENT ACTIVE</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{procurementStats.totalSuppliers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Orders</p>
              <p className="text-2xl font-bold text-gray-900">{procurementStats.activeOrders}</p>
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
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Reorder Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{procurementStats.reorderAlerts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Monthly Spend</p>
              <p className="text-2xl font-bold text-gray-900">${procurementStats.monthlySpend.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-indigo-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Avg Delivery</p>
              <p className="text-2xl font-bold text-gray-900">{procurementStats.avgDeliveryTime} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={() => setShowPOForm(true)}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3 text-left">
              <h3 className="font-semibold text-gray-900">Create Purchase Order</h3>
              <p className="text-sm text-gray-500">New procurement request</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => setShowSupplierForm(true)}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3 text-left">
              <h3 className="font-semibold text-gray-900">Add Supplier</h3>
              <p className="text-sm text-gray-500">Register new vendor</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => setActiveTab('reorder')}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-3 text-left">
              <h3 className="font-semibold text-gray-900">Review Reorders</h3>
              <p className="text-sm text-gray-500">{procurementStats.reorderAlerts} items need attention</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => setActiveTab('analytics')}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-3 text-left">
              <h3 className="font-semibold text-gray-900">View Analytics</h3>
              <p className="text-sm text-gray-500">Spending and performance</p>
            </div>
          </div>
        </button>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Purchase Orders</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveTab('orders')}
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                View All
              </button>
              <button 
                onClick={() => {
                  const data = JSON.stringify(purchaseOrders, null, 2);
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'purchase-orders.json';
                  link.click();
                  URL.revokeObjectURL(url);
                }}
                className="text-sm text-green-600 hover:text-green-900"
              >
                Export
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {purchaseOrders.slice(0, 3).map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.supplierName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${order.totalAmount.toLocaleString()}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Suppliers */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Top Suppliers</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveTab('suppliers')}
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                View All
              </button>
              <button 
                onClick={() => {
                  const data = JSON.stringify(suppliers, null, 2);
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'suppliers.json';
                  link.click();
                  URL.revokeObjectURL(url);
                }}
                className="text-sm text-green-600 hover:text-green-900"
              >
                Export
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {suppliers.slice(0, 3).map(supplier => (
                <div key={supplier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{supplier.name}</p>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-500 ml-1">{supplier.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{supplier.totalOrders} orders</p>
                    <p className="text-xs text-gray-500">${supplier.totalValue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuppliers = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Supplier Management</h2>
        <button 
          onClick={() => setShowSupplierForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Supplier</span>
        </button>
      </div>

      {/* Supplier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map(supplier => (
          <div key={supplier.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                <p className="text-sm text-gray-500">{supplier.contactPerson}</p>
                <p className="text-sm text-gray-500">{supplier.email}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                supplier.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {supplier.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Rating</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 font-medium">{supplier.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Total Orders</span>
                <span className="font-medium">{supplier.totalOrders}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Total Value</span>
                <span className="font-medium">${supplier.totalValue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Avg Delivery</span>
                <span className="font-medium">{supplier.avgDeliveryDays} days</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Categories</p>
              <div className="flex flex-wrap gap-1">
                {supplier.categories.map(category => (
                  <span key={category} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => alert(`Viewing detailed information for ${supplier.name}\n\nContact: ${supplier.contactPerson}\nEmail: ${supplier.email}\nPhone: ${supplier.phone}\nAddress: ${supplier.address}\nPayment Terms: ${supplier.paymentTerms}\nCertifications: ${supplier.certifications.join(', ')}`)}
                className="text-indigo-600 hover:text-indigo-900 text-sm px-2 py-1 border border-indigo-200 rounded hover:bg-indigo-50"
              >
                <Eye className="h-3 w-3 inline mr-1" />
                View
              </button>
              <button 
                onClick={() => {
                  setEditingSupplier(supplier);
                  setShowSupplierForm(true);
                }}
                className="text-blue-600 hover:text-blue-900 text-sm px-2 py-1 border border-blue-200 rounded hover:bg-blue-50"
              >
                <Edit className="h-3 w-3 inline mr-1" />
                Edit
              </button>
              <button 
                onClick={() => {
                  setEditingPO({ 
                    id: '', 
                    orderNumber: `PO-${new Date().getFullYear()}-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
                    supplierId: supplier.id, 
                    supplierName: supplier.name,
                    items: [],
                    totalAmount: 0,
                    status: 'DRAFT',
                    orderDate: new Date().toISOString().split('T')[0],
                    expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    priority: 'MEDIUM'
                  });
                  setShowPOForm(true);
                }}
                className="text-green-600 hover:text-green-900 text-sm px-2 py-1 border border-green-200 rounded hover:bg-green-50"
              >
                <ShoppingCart className="h-3 w-3 inline mr-1" />
                Order
              </button>
              <button 
                onClick={() => {
                  if (confirm(`Are you sure you want to delete supplier "${supplier.name}"? This action cannot be undone.`)) {
                    setSuppliers(prev => prev.filter(s => s.id !== supplier.id));
                    alert(`Supplier "${supplier.name}" has been deleted successfully!`);
                  }
                }}
                className="text-red-600 hover:text-red-900 text-sm px-2 py-1 border border-red-200 rounded hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3 inline mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Purchase Orders</h2>
        <button 
          onClick={() => setShowPOForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Order</span>
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchaseOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                    <div className="text-sm text-gray-500">{order.items.length} items</div>
                    <div className="text-xs text-gray-400">{order.orderDate}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.supplierName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${order.totalAmount.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    order.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'SENT' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.expectedDelivery}</div>
                  {order.actualDelivery && (
                    <div className="text-xs text-green-600">Delivered: {order.actualDelivery}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => alert(`Viewing details for ${order.orderNumber}`)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setEditingPO(order);
                        setShowPOForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      title="Edit Order"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => alert(`Downloading PDF for ${order.orderNumber}`)}
                      className="text-green-600 hover:text-green-900 p-1 rounded"
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    {order.status === 'PENDING_APPROVAL' && (
                      <button 
                        onClick={() => {
                          setPurchaseOrders(prev => prev.map(po => 
                            po.id === order.id 
                              ? { ...po, status: 'APPROVED' as const, approvedBy: 'Current User' }
                              : po
                          ));
                          alert(`${order.orderNumber} has been approved!`);
                        }}
                        className="text-emerald-600 hover:text-emerald-900 p-1 rounded"
                        title="Approve Order"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    {order.status === 'APPROVED' && (
                      <button 
                        onClick={() => {
                          setPurchaseOrders(prev => prev.map(po => 
                            po.id === order.id 
                              ? { ...po, status: 'SENT' as const }
                              : po
                          ));
                          alert(`${order.orderNumber} has been sent to supplier!`);
                        }}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded"
                        title="Send to Supplier"
                      >
                        <Truck className="h-4 w-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${order.orderNumber}?`)) {
                          setPurchaseOrders(prev => prev.filter(po => po.id !== order.id));
                          alert('Purchase order deleted successfully!');
                        }
                      }}
                      className="text-red-600 hover:text-red-900 p-1 rounded"
                      title="Delete Order"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReorderAutomation = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Automated Reorder System</h2>
            <p className="text-red-100 mt-1">Smart inventory replenishment based on consumption patterns</p>
          </div>
          <div className="flex space-x-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">AI POWERED</span>
            <span className="bg-yellow-500 px-3 py-1 rounded-full text-sm font-medium">
              {procurementStats.reorderAlerts} ALERTS
            </span>
          </div>
        </div>
      </div>

      {/* Reorder Suggestions */}
      <div className="space-y-4">
        {reorderSuggestions.map(suggestion => (
          <div key={suggestion.id} className={`bg-white rounded-lg border-l-4 p-6 ${
            suggestion.urgencyLevel === 'CRITICAL' ? 'border-red-500' :
            suggestion.urgencyLevel === 'HIGH' ? 'border-orange-500' :
            suggestion.urgencyLevel === 'MEDIUM' ? 'border-yellow-500' : 'border-green-500'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-gray-900">{suggestion.itemName}</h3>
                  <span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${
                    suggestion.urgencyLevel === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                    suggestion.urgencyLevel === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                    suggestion.urgencyLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {suggestion.urgencyLevel}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-gray-500">Current Stock</p>
                    <p className="font-semibold text-gray-900">{suggestion.currentStock}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Min Level</p>
                    <p className="font-semibold text-gray-900">{suggestion.minLevel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Suggested Quantity</p>
                    <p className="font-semibold text-green-600">{suggestion.suggestedQuantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Estimated Cost</p>
                    <p className="font-semibold text-gray-900">${suggestion.estimatedCost.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-gray-600">
                    Preferred Supplier: <span className="font-medium">{suggestion.preferredSupplier}</span> | 
                    Avg Consumption: <span className="font-medium">{suggestion.avgConsumption}/month</span> | 
                    Last Order: <span className="font-medium">{suggestion.lastOrderDate}</span>
                  </p>
                </div>
              </div>

              <div className="flex space-x-2 ml-6">
                <button 
                  onClick={() => {
                    const newPO: PurchaseOrder = {
                      id: Date.now().toString(),
                      orderNumber: `PO-2025-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
                      supplierId: '1', // Default to first supplier
                      supplierName: suggestion.preferredSupplier,
                      items: [{
                        id: '1',
                        itemId: suggestion.id,
                        itemName: suggestion.itemName,
                        quantity: suggestion.suggestedQuantity,
                        unitPrice: suggestion.estimatedCost / suggestion.suggestedQuantity,
                        totalPrice: suggestion.estimatedCost,
                        category: 'AUTO_REORDER',
                        urgency: suggestion.urgencyLevel
                      }],
                      totalAmount: suggestion.estimatedCost,
                      status: 'DRAFT',
                      orderDate: new Date().toISOString().split('T')[0],
                      expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                      priority: suggestion.urgencyLevel as any
                    };
                    
                    setPurchaseOrders(prev => [...prev, newPO]);
                    alert(`Purchase order ${newPO.orderNumber} created for ${suggestion.itemName}!`);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Create PO
                </button>
                <button 
                  onClick={() => {
                    const newQuantity = prompt(`Adjust quantity for ${suggestion.itemName} (current: ${suggestion.suggestedQuantity}):`, suggestion.suggestedQuantity.toString());
                    if (newQuantity && !isNaN(Number(newQuantity))) {
                      alert(`Quantity adjusted to ${newQuantity} for ${suggestion.itemName}`);
                    }
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Adjust
                </button>
                <button 
                  onClick={() => {
                    if (confirm(`Dismiss reorder suggestion for ${suggestion.itemName}?`)) {
                      alert(`Reorder suggestion dismissed for ${suggestion.itemName}`);
                    }
                  }}
                  className="text-gray-400 hover:text-gray-600 p-2"
                  title="Dismiss Suggestion"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Stock Level Visualization */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Stock Level</span>
                <span>{suggestion.currentStock} / {suggestion.maxLevel}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    suggestion.currentStock < suggestion.minLevel ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((suggestion.currentStock / suggestion.maxLevel) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Handler functions
  const handleSupplierSave = (supplierData: Supplier) => {
    if (editingSupplier) {
      setSuppliers(prev => prev.map(s => s.id === editingSupplier.id ? { ...supplierData, id: editingSupplier.id } : s));
    } else {
      const newSupplier = { ...supplierData, id: Date.now().toString() };
      setSuppliers(prev => [...prev, newSupplier]);
    }
    setEditingSupplier(null);
  };

  const handlePOSave = (orderData: PurchaseOrder) => {
    if (editingPO) {
      setPurchaseOrders(prev => prev.map(po => po.id === editingPO.id ? { ...orderData, id: editingPO.id } : po));
    } else {
      const newPO = { ...orderData, id: Date.now().toString() };
      setPurchaseOrders(prev => [...prev, newPO]);
    }
    setEditingPO(null);
  };

  const mockInventoryItems = [
    { id: '1', itemName: 'Culture Medium DMEM', category: 'MEDIA', costPrice: 85.50 },
    { id: '2', itemName: 'FSH (Folltropin)', category: 'HORMONE', costPrice: 125.00 },
    { id: '3', itemName: 'Liquid Nitrogen', category: 'CRYO_MATERIAL', costPrice: 12.50 }
  ];

  const renderComingSoon = (feature: string) => (
    <div className="text-center py-12">
      <Package className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">{feature}</h3>
      <p className="mt-1 text-sm text-gray-500">Advanced features coming soon</p>
      <div className="mt-4">
        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
          Phase 5 Development
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  isActive
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className={`-ml-0.5 mr-2 h-5 w-5 ${
                  isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                {tab.name}
                {tab.count && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'suppliers' && renderSuppliers()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'reorder' && renderReorderAutomation()}
        {activeTab === 'approvals' && renderComingSoon('Approval Workflow Management')}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </div>

      {/* Form Modals */}
      <SupplierForm
        isOpen={showSupplierForm}
        onClose={() => {
          setShowSupplierForm(false);
          setEditingSupplier(null);
        }}
        onSave={handleSupplierSave}
        supplier={editingSupplier}
      />

      <PurchaseOrderForm
        isOpen={showPOForm}
        onClose={() => {
          setShowPOForm(false);
          setEditingPO(null);
        }}
        onSave={handlePOSave}
        order={editingPO}
        suppliers={suppliers}
        inventoryItems={mockInventoryItems}
      />
    </div>
  );
}; 