// Inventory Integration Service for Phase 3: Module Integration
// This service handles automatic stock deduction from clinical modules

export interface InventoryItem {
  id: string;
  itemName: string;
  category: string;
  unitOfMeasure: string;
  currentStock: number;
  minLevel: number;
  costPerUnit: number;
}

export interface StockDeduction {
  itemId: string;
  quantity: number;
  procedureId?: string;
  procedureType: string;
  animalId?: string;
  technician: string;
  notes?: string;
}

export interface ProcedureKit {
  id: string;
  name: string;
  description: string;
  procedureType: string;
  items: KitItem[];
  isActive: boolean;
  estimatedCost: number;
}

export interface KitItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unitOfMeasure: string;
  isOptional: boolean;
  notes?: string;
}

export interface ProcedureTemplate {
  id: string;
  name: string;
  procedureType: string;
  defaultKit: ProcedureKit;
  variations: ProcedureKit[];
  species: string[];
  estimatedDuration: number; // minutes
  requiredStaff: string[];
}

export interface AutoDeductionResult {
  success: boolean;
  deductions: StockDeduction[];
  warnings: string[];
  errors: string[];
  totalCost: number;
  insufficientStock: KitItem[];
}

class InventoryIntegrationService {
  private baseUrl = '/api/inventory';

  // Procedure Templates
  async getProcedureTemplates(procedureType?: string): Promise<ProcedureTemplate[]> {
    try {
      const url = procedureType ? 
        `${this.baseUrl}/templates?type=${procedureType}` : 
        `${this.baseUrl}/templates`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch procedure templates');
      return await response.json();
    } catch (error) {
      console.error('Error fetching procedure templates:', error);
      return this.getMockProcedureTemplates(procedureType);
    }
  }

  async createProcedureTemplate(template: Omit<ProcedureTemplate, 'id'>): Promise<ProcedureTemplate> {
    try {
      const response = await fetch(`${this.baseUrl}/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template)
      });
      if (!response.ok) throw new Error('Failed to create procedure template');
      return await response.json();
    } catch (error) {
      console.error('Error creating procedure template:', error);
      throw error;
    }
  }

  // Kit Management
  async getProcedureKits(procedureType?: string): Promise<ProcedureKit[]> {
    try {
      const url = procedureType ? 
        `${this.baseUrl}/kits?type=${procedureType}` : 
        `${this.baseUrl}/kits`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch procedure kits');
      return await response.json();
    } catch (error) {
      console.error('Error fetching procedure kits:', error);
      return this.getMockProcedureKits(procedureType);
    }
  }

  async createProcedureKit(kit: Omit<ProcedureKit, 'id'>): Promise<ProcedureKit> {
    try {
      const response = await fetch(`${this.baseUrl}/kits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kit)
      });
      if (!response.ok) throw new Error('Failed to create procedure kit');
      return await response.json();
    } catch (error) {
      console.error('Error creating procedure kit:', error);
      throw error;
    }
  }

  // Stock Availability Check
  async checkStockAvailability(items: KitItem[]): Promise<{
    available: boolean;
    insufficientItems: KitItem[];
    warnings: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/check-availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });
      if (!response.ok) throw new Error('Failed to check stock availability');
      return await response.json();
    } catch (error) {
      console.error('Error checking stock availability:', error);
      return this.getMockStockAvailability(items);
    }
  }

  // Automatic Stock Deduction
  async performAutoDeduction(deductions: StockDeduction[]): Promise<AutoDeductionResult> {
    try {
      const response = await fetch(`${this.baseUrl}/auto-deduct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deductions })
      });
      if (!response.ok) throw new Error('Failed to perform auto deduction');
      return await response.json();
    } catch (error) {
      console.error('Error performing auto deduction:', error);
      return this.getMockAutoDeductionResult(deductions);
    }
  }

  // Convenience method for procedure-based deduction
  async deductForProcedure(
    procedureType: string,
    procedureId: string,
    kitId: string,
    technician: string,
    animalId?: string,
    customQuantities?: Record<string, number>
  ): Promise<AutoDeductionResult> {
    try {
      // Get the kit details
      const kits = await this.getProcedureKits(procedureType);
      const kit = kits.find(k => k.id === kitId);
      
      if (!kit) {
        throw new Error(`Kit ${kitId} not found for procedure type ${procedureType}`);
      }

      // Prepare deductions
      const deductions: StockDeduction[] = kit.items.map(item => ({
        itemId: item.itemId,
        quantity: customQuantities?.[item.itemId] || item.quantity,
        procedureId,
        procedureType,
        animalId,
        technician,
        notes: `Auto-deducted for ${procedureType} procedure`
      }));

      return await this.performAutoDeduction(deductions);
    } catch (error) {
      console.error('Error deducting for procedure:', error);
      throw error;
    }
  }

  // Cost Estimation
  async estimateProcedureCost(kitId: string): Promise<{
    totalCost: number;
    itemCosts: Array<{ itemId: string; itemName: string; quantity: number; unitCost: number; totalCost: number }>;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/estimate-cost/${kitId}`);
      if (!response.ok) throw new Error('Failed to estimate procedure cost');
      return await response.json();
    } catch (error) {
      console.error('Error estimating procedure cost:', error);
      return this.getMockCostEstimate(kitId);
    }
  }

  // Mock Data for Development
  private getMockProcedureTemplates(procedureType?: string): ProcedureTemplate[] {
    const templates: ProcedureTemplate[] = [
      {
        id: 'ivf-standard',
        name: 'Standard IVF Protocol',
        procedureType: 'IVF',
        defaultKit: {
          id: 'ivf-kit-standard',
          name: 'Standard IVF Kit',
          description: 'Complete kit for standard IVF procedures',
          procedureType: 'IVF',
          isActive: true,
          estimatedCost: 425.50,
          items: [
            { itemId: '1', itemName: 'Culture Medium DMEM', quantity: 10, unitOfMeasure: 'mL', isOptional: false },
            { itemId: '2', itemName: 'FSH (Folltropin)', quantity: 200, unitOfMeasure: 'IU', isOptional: false },
            { itemId: '4', itemName: 'Oocyte Collection Needles', quantity: 5, unitOfMeasure: 'pieces', isOptional: false },
            { itemId: '5', itemName: 'Culture Dishes', quantity: 3, unitOfMeasure: 'pieces', isOptional: false },
            { itemId: '6', itemName: 'Pipette Tips', quantity: 20, unitOfMeasure: 'pieces', isOptional: true }
          ]
        },
        variations: [],
        species: ['BOVINE', 'EQUINE'],
        estimatedDuration: 180,
        requiredStaff: ['embryologist', 'veterinarian']
      },
      {
        id: 'embryo-transfer-standard',
        name: 'Standard Embryo Transfer Protocol',
        procedureType: 'EMBRYO_TRANSFER',
        defaultKit: {
          id: 'et-kit-standard',
          name: 'Standard Embryo Transfer Kit',
          description: 'Complete kit for embryo transfer procedures',
          procedureType: 'EMBRYO_TRANSFER',
          isActive: true,
          estimatedCost: 185.75,
          items: [
            { itemId: '7', itemName: 'Transfer Medium', quantity: 5, unitOfMeasure: 'mL', isOptional: false },
            { itemId: '8', itemName: 'Transfer Catheter', quantity: 1, unitOfMeasure: 'pieces', isOptional: false },
            { itemId: '9', itemName: 'Sterile Gloves', quantity: 2, unitOfMeasure: 'pairs', isOptional: false },
            { itemId: '10', itemName: 'Antibiotics', quantity: 1, unitOfMeasure: 'vial', isOptional: true }
          ]
        },
        variations: [],
        species: ['BOVINE', 'EQUINE', 'OVINE'],
        estimatedDuration: 45,
        requiredStaff: ['veterinarian']
      },
      {
        id: 'opu-standard',
        name: 'Standard OPU Protocol',
        procedureType: 'OPU',
        defaultKit: {
          id: 'opu-kit-standard',
          name: 'Standard OPU Kit',
          description: 'Complete kit for OPU procedures',
          procedureType: 'OPU',
          isActive: true,
          estimatedCost: 320.25,
          items: [
            { itemId: '11', itemName: 'Aspiration Medium', quantity: 50, unitOfMeasure: 'mL', isOptional: false },
            { itemId: '12', itemName: 'OPU Needles', quantity: 3, unitOfMeasure: 'pieces', isOptional: false },
            { itemId: '13', itemName: 'Collection Tubes', quantity: 10, unitOfMeasure: 'pieces', isOptional: false },
            { itemId: '2', itemName: 'FSH (Folltropin)', quantity: 400, unitOfMeasure: 'IU', isOptional: false }
          ]
        },
        variations: [],
        species: ['BOVINE', 'EQUINE'],
        estimatedDuration: 120,
        requiredStaff: ['veterinarian', 'technician']
      }
    ];

    return procedureType ? templates.filter(t => t.procedureType === procedureType) : templates;
  }

  private getMockProcedureKits(procedureType?: string): ProcedureKit[] {
    const kits = this.getMockProcedureTemplates(procedureType).map(t => t.defaultKit);
    return kits;
  }

  private getMockStockAvailability(items: KitItem[]) {
    // Simulate some items being low in stock
    const insufficientItems = items.filter((_, index) => index % 4 === 0); // Every 4th item
    const warnings = insufficientItems.map(item => 
      `Low stock warning: ${item.itemName} (${item.quantity} requested, only 5 available)`
    );

    return {
      available: insufficientItems.length === 0,
      insufficientItems,
      warnings
    };
  }

  private getMockAutoDeductionResult(deductions: StockDeduction[]): AutoDeductionResult {
    const totalCost = deductions.length * 45.75; // Mock calculation
    
    return {
      success: true,
      deductions,
      warnings: ['Some items are approaching minimum stock levels'],
      errors: [],
      totalCost,
      insufficientStock: []
    };
  }

  private getMockCostEstimate(kitId: string) {
    return {
      totalCost: 425.50,
      itemCosts: [
        { itemId: '1', itemName: 'Culture Medium DMEM', quantity: 10, unitCost: 8.55, totalCost: 85.50 },
        { itemId: '2', itemName: 'FSH (Folltropin)', quantity: 200, unitCost: 1.25, totalCost: 250.00 },
        { itemId: '4', itemName: 'Oocyte Collection Needles', quantity: 5, unitCost: 12.00, totalCost: 60.00 },
        { itemId: '5', itemName: 'Culture Dishes', quantity: 3, unitCost: 10.00, totalCost: 30.00 }
      ]
    };
  }
}

// Export singleton instance
export const inventoryIntegrationService = new InventoryIntegrationService();
export default inventoryIntegrationService; 