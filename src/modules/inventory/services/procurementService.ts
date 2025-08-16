// Procurement Service for Phase 5 - Comprehensive supplier and purchase order management

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
  performance: {
    onTimeDelivery: number;
    qualityScore: number;
    priceCompetitiveness: number;
    communicationRating: number;
  };
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
  approvalWorkflow?: ApprovalStep[];
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
  received?: number;
  status: 'PENDING' | 'PARTIAL' | 'COMPLETE';
}

interface ApprovalStep {
  id: string;
  stepName: string;
  approverRole: string;
  approverName?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  comments?: string;
  timestamp?: string;
  thresholdAmount: number;
}

interface ReorderSuggestion {
  id: string;
  itemId: string;
  itemName: string;
  currentStock: number;
  minLevel: number;
  maxLevel: number;
  suggestedQuantity: number;
  preferredSupplierId: string;
  preferredSupplier: string;
  estimatedCost: number;
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  lastOrderDate: string;
  avgConsumption: number;
  seasonalFactor: number;
  leadTime: number;
}

interface ProcurementAnalytics {
  totalSpend: number;
  monthlySpend: number;
  avgOrderValue: number;
  totalSuppliers: number;
  activeOrders: number;
  onTimeDeliveryRate: number;
  costSavings: number;
  topCategories: CategorySpend[];
  supplierPerformance: SupplierPerformance[];
  monthlyTrends: MonthlyTrend[];
}

interface CategorySpend {
  category: string;
  amount: number;
  percentage: number;
  orderCount: number;
}

interface SupplierPerformance {
  supplierId: string;
  supplierName: string;
  totalOrders: number;
  totalSpend: number;
  onTimeRate: number;
  qualityScore: number;
  rating: number;
}

interface MonthlyTrend {
  month: string;
  spend: number;
  orders: number;
  avgDeliveryTime: number;
}

class ProcurementService {
  private baseUrl = '/api/procurement';

  // Supplier Management
  async getSuppliers(): Promise<Supplier[]> {
    try {
      const response = await fetch(`${this.baseUrl}/suppliers`);
      return await response.json();
    } catch (error) {
      console.warn('Using mock suppliers data');
      return this.getMockSuppliers();
    }
  }

  async createSupplier(supplier: Omit<Supplier, 'id'>): Promise<Supplier> {
    try {
      const response = await fetch(`${this.baseUrl}/suppliers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplier)
      });
      return await response.json();
    } catch (error) {
      console.warn('Using mock supplier creation');
      return { ...supplier, id: Date.now().toString() };
    }
  }

  async updateSupplier(id: string, supplier: Partial<Supplier>): Promise<Supplier> {
    try {
      const response = await fetch(`${this.baseUrl}/suppliers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplier)
      });
      return await response.json();
    } catch (error) {
      console.warn('Using mock supplier update');
      return { ...supplier, id } as Supplier;
    }
  }

  async deleteSupplier(id: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/suppliers/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.warn('Mock supplier deletion');
    }
  }

  // Purchase Order Management
  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    try {
      const response = await fetch(`${this.baseUrl}/purchase-orders`);
      return await response.json();
    } catch (error) {
      console.warn('Using mock purchase orders data');
      return this.getMockPurchaseOrders();
    }
  }

  async createPurchaseOrder(order: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder> {
    try {
      const response = await fetch(`${this.baseUrl}/purchase-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      return await response.json();
    } catch (error) {
      console.warn('Using mock PO creation');
      return { ...order, id: Date.now().toString() };
    }
  }

  async updatePurchaseOrder(id: string, order: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    try {
      const response = await fetch(`${this.baseUrl}/purchase-orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      return await response.json();
    } catch (error) {
      console.warn('Using mock PO update');
      return { ...order, id } as PurchaseOrder;
    }
  }

  async approvePurchaseOrder(id: string, comments?: string): Promise<PurchaseOrder> {
    try {
      const response = await fetch(`${this.baseUrl}/purchase-orders/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments })
      });
      return await response.json();
    } catch (error) {
      console.warn('Using mock PO approval');
      const mockPO = this.getMockPurchaseOrders().find(po => po.id === id);
      return { ...mockPO!, status: 'APPROVED', approvedBy: 'Manager' };
    }
  }

  // Reorder Automation
  async getReorderSuggestions(): Promise<ReorderSuggestion[]> {
    try {
      const response = await fetch(`${this.baseUrl}/reorder-suggestions`);
      return await response.json();
    } catch (error) {
      console.warn('Using mock reorder suggestions');
      return this.getMockReorderSuggestions();
    }
  }

  async generateReorderSuggestions(): Promise<ReorderSuggestion[]> {
    try {
      const response = await fetch(`${this.baseUrl}/reorder-suggestions/generate`, {
        method: 'POST'
      });
      return await response.json();
    } catch (error) {
      console.warn('Using mock reorder generation');
      return this.getMockReorderSuggestions();
    }
  }

  async createReorderPO(suggestionId: string): Promise<PurchaseOrder> {
    try {
      const response = await fetch(`${this.baseUrl}/reorder-suggestions/${suggestionId}/create-po`, {
        method: 'POST'
      });
      return await response.json();
    } catch (error) {
      console.warn('Using mock reorder PO creation');
      const suggestion = this.getMockReorderSuggestions().find(s => s.id === suggestionId);
      return {
        id: Date.now().toString(),
        orderNumber: `PO-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`,
        supplierId: suggestion?.preferredSupplierId || '1',
        supplierName: suggestion?.preferredSupplier || 'Default Supplier',
        items: [{
          id: '1',
          itemId: suggestion?.itemId || '1',
          itemName: suggestion?.itemName || 'Sample Item',
          quantity: suggestion?.suggestedQuantity || 100,
          unitPrice: suggestion ? suggestion.estimatedCost / suggestion.suggestedQuantity : 10,
          totalPrice: suggestion?.estimatedCost || 1000,
          category: 'CONSUMABLE',
          urgency: suggestion?.urgencyLevel || 'MEDIUM',
          status: 'PENDING'
        }],
        totalAmount: suggestion?.estimatedCost || 1000,
        status: 'DRAFT',
        orderDate: new Date().toISOString().split('T')[0],
        expectedDelivery: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
        priority: suggestion?.urgencyLevel === 'CRITICAL' ? 'URGENT' : 'MEDIUM'
      };
    }
  }

  // Analytics and Reporting
  async getProcurementAnalytics(): Promise<ProcurementAnalytics> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics`);
      return await response.json();
    } catch (error) {
      console.warn('Using mock analytics data');
      return this.getMockAnalytics();
    }
  }

  // Approval Workflow
  async getApprovalWorkflow(amount: number): Promise<ApprovalStep[]> {
    // Define approval thresholds
    const workflow: ApprovalStep[] = [];
    
    if (amount > 1000) {
      workflow.push({
        id: '1',
        stepName: 'Department Manager Approval',
        approverRole: 'MANAGER',
        status: 'PENDING',
        thresholdAmount: 1000
      });
    }
    
    if (amount > 5000) {
      workflow.push({
        id: '2',
        stepName: 'Finance Director Approval',
        approverRole: 'FINANCE_DIRECTOR',
        status: 'PENDING',
        thresholdAmount: 5000
      });
    }
    
    if (amount > 10000) {
      workflow.push({
        id: '3',
        stepName: 'CEO Approval',
        approverRole: 'CEO',
        status: 'PENDING',
        thresholdAmount: 10000
      });
    }
    
    return workflow;
  }

  // Mock Data Methods
  private getMockSuppliers(): Supplier[] {
    return [
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
        lastOrderDate: '2025-01-02',
        performance: {
          onTimeDelivery: 94.5,
          qualityScore: 4.8,
          priceCompetitiveness: 4.2,
          communicationRating: 4.9
        }
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
        lastOrderDate: '2025-01-01',
        performance: {
          onTimeDelivery: 98.2,
          qualityScore: 4.6,
          priceCompetitiveness: 4.8,
          communicationRating: 4.5
        }
      }
    ];
  }

  private getMockPurchaseOrders(): PurchaseOrder[] {
    return [
      {
        id: '1',
        orderNumber: 'PO-2025-001',
        supplierId: '1',
        supplierName: 'Life Technologies Corp',
        items: [
          {
            id: '1',
            itemId: '1',
            itemName: 'Culture Medium DMEM',
            quantity: 10,
            unitPrice: 85.50,
            totalPrice: 855.00,
            category: 'MEDIA',
            urgency: 'HIGH',
            status: 'PENDING'
          }
        ],
        totalAmount: 855.00,
        status: 'APPROVED',
        orderDate: '2025-01-02',
        expectedDelivery: '2025-01-05',
        approvedBy: 'Dr. Smith',
        priority: 'HIGH'
      }
    ];
  }

  private getMockReorderSuggestions(): ReorderSuggestion[] {
    return [
      {
        id: '1',
        itemId: '1',
        itemName: 'Culture Medium DMEM',
        currentStock: 750,
        minLevel: 1000,
        maxLevel: 5000,
        suggestedQuantity: 2000,
        preferredSupplierId: '1',
        preferredSupplier: 'Life Technologies Corp',
        estimatedCost: 1710.00,
        urgencyLevel: 'HIGH',
        lastOrderDate: '2024-12-15',
        avgConsumption: 180,
        seasonalFactor: 1.1,
        leadTime: 3
      },
      {
        id: '2',
        itemId: '3',
        itemName: 'Liquid Nitrogen',
        currentStock: 150,
        minLevel: 200,
        maxLevel: 1000,
        suggestedQuantity: 400,
        preferredSupplierId: '3',
        preferredSupplier: 'CryoTech Industries',
        estimatedCost: 5000.00,
        urgencyLevel: 'CRITICAL',
        lastOrderDate: '2024-12-20',
        avgConsumption: 25,
        seasonalFactor: 1.0,
        leadTime: 1
      }
    ];
  }

  private getMockAnalytics(): ProcurementAnalytics {
    return {
      totalSpend: 485750.50,
      monthlySpend: 45680.75,
      avgOrderValue: 2890.50,
      totalSuppliers: 12,
      activeOrders: 8,
      onTimeDeliveryRate: 94.5,
      costSavings: 15280.75,
      topCategories: [
        { category: 'MEDIA', amount: 185000, percentage: 38.1, orderCount: 45 },
        { category: 'HORMONE', amount: 125000, percentage: 25.7, orderCount: 32 },
        { category: 'EQUIPMENT', amount: 89000, percentage: 18.3, orderCount: 12 }
      ],
      supplierPerformance: [
        {
          supplierId: '1',
          supplierName: 'Life Technologies Corp',
          totalOrders: 156,
          totalSpend: 485750.50,
          onTimeRate: 94.5,
          qualityScore: 4.8,
          rating: 4.8
        }
      ],
      monthlyTrends: [
        { month: '2024-12', spend: 42500, orders: 15, avgDeliveryTime: 2.8 },
        { month: '2025-01', spend: 45680, orders: 18, avgDeliveryTime: 2.5 }
      ]
    };
  }
}

export const procurementService = new ProcurementService();
export type { 
  Supplier, 
  PurchaseOrder, 
  POItem, 
  ReorderSuggestion, 
  ProcurementAnalytics,
  ApprovalStep
}; 