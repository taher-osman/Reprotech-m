// Enhanced Inventory Integration Service for Media Master System
// Provides comprehensive chemical/reagent database integration

export interface InventoryChemical {
  item_id: string;
  name: string;
  cas_no: string;
  molecular_weight: number;
  density?: number;
  stock_concentration?: number;
  available_quantity: number;
  hazard_class: 'Safe' | 'Irritant' | 'Corrosive' | 'Toxic' | 'Flammable' | 'Oxidizer';
  unit: string;
  purity: number;
  storage_temp: string;
  supplier: string;
  lot_number: string;
  expiry_date: string;
  cost_per_unit: number;
  is_available: boolean;
  category: 'Buffer' | 'Salt' | 'Sugar' | 'Protein' | 'Vitamin' | 'Hormone' | 'Antibiotic' | 'Indicator' | 'Growth Factor';
  sub_category: string;
  specifications: string;
  solubility: string;
  ph_range?: string;
  osmolarity_contribution?: number;
}

export interface MediaIngredientCalculation {
  ingredient_id: string;
  target_concentration: number;
  target_unit: string;
  calculated_amount: number;
  calculated_unit: string;
  volume_needed?: number;
  mass_needed?: number;
  cost_contribution: number;
  compatibility_warnings: string[];
  stock_sufficient: boolean;
}

export interface FormulaValidation {
  is_valid: boolean;
  total_cost: number;
  estimated_osmolarity: number;
  estimated_ph: number;
  compatibility_issues: string[];
  stock_warnings: string[];
  hazard_warnings: string[];
}

class InventoryIntegrationService {
  // Mock chemical database for demonstration
  private mockChemicals: InventoryChemical[] = [
    {
      item_id: 'CHM-001',
      name: 'Sodium Chloride (NaCl)',
      cas_no: '7647-14-5',
      molecular_weight: 58.44,
      density: 2.16,
      stock_concentration: 1000,
      available_quantity: 500,
      hazard_class: 'Safe',
      unit: 'g',
      purity: 99.9,
      storage_temp: 'Room Temperature',
      supplier: 'Sigma-Aldrich',
      lot_number: 'RNBJ4728',
      expiry_date: '2026-12-31',
      cost_per_unit: 0.05,
      is_available: true,
      category: 'Salt',
      sub_category: 'Inorganic Salt',
      specifications: 'ACS Grade, 99.9% pure',
      solubility: 'Highly soluble in water',
      osmolarity_contribution: 2000
    },
    {
      item_id: 'CHM-002',
      name: 'HEPES Buffer',
      cas_no: '7365-45-9',
      molecular_weight: 238.31,
      density: 1.22,
      stock_concentration: 1000,
      available_quantity: 250,
      hazard_class: 'Irritant',
      unit: 'g',
      purity: 99.5,
      storage_temp: '2-8°C',
      supplier: 'Life Technologies',
      lot_number: 'HEP2024-015',
      expiry_date: '2025-08-15',
      cost_per_unit: 2.50,
      is_available: true,
      category: 'Buffer',
      sub_category: 'Biological Buffer',
      specifications: 'Cell culture grade, endotoxin tested',
      solubility: 'Soluble in water',
      ph_range: '7.2-7.6',
      osmolarity_contribution: 1000
    },
    {
      item_id: 'CHM-003',
      name: 'D-Glucose',
      cas_no: '50-99-7',
      molecular_weight: 180.16,
      density: 1.54,
      stock_concentration: 500,
      available_quantity: 1000,
      hazard_class: 'Safe',
      unit: 'g',
      purity: 99.8,
      storage_temp: 'Room Temperature',
      supplier: 'Merck',
      lot_number: 'GLU-789456',
      expiry_date: '2027-03-20',
      cost_per_unit: 0.15,
      is_available: true,
      category: 'Sugar',
      sub_category: 'Monosaccharide',
      specifications: 'Cell culture grade',
      solubility: 'Highly soluble in water',
      osmolarity_contribution: 5556
    },
    {
      item_id: 'CHM-004',
      name: 'Sodium Pyruvate',
      cas_no: '113-24-6',
      molecular_weight: 110.04,
      density: 1.267,
      stock_concentration: 100,
      available_quantity: 50,
      hazard_class: 'Safe',
      unit: 'g',
      purity: 99.0,
      storage_temp: '2-8°C',
      supplier: 'Thermo Fisher',
      lot_number: 'PYR-456123',
      expiry_date: '2025-12-31',
      cost_per_unit: 1.25,
      is_available: true,
      category: 'Salt',
      sub_category: 'Organic Salt',
      specifications: 'Cell culture grade',
      solubility: 'Soluble in water',
      osmolarity_contribution: 9091
    },
    {
      item_id: 'CHM-005',
      name: 'BSA (Bovine Serum Albumin)',
      cas_no: '9048-46-8',
      molecular_weight: 66500,
      density: 1.37,
      available_quantity: 100,
      hazard_class: 'Safe',
      unit: 'g',
      purity: 98.0,
      storage_temp: '-20°C',
      supplier: 'Sigma-Aldrich',
      lot_number: 'BSA-987654',
      expiry_date: '2026-06-30',
      cost_per_unit: 15.00,
      is_available: true,
      category: 'Protein',
      sub_category: 'Serum Protein',
      specifications: 'Cell culture grade, low endotoxin',
      solubility: 'Soluble in aqueous solutions',
      osmolarity_contribution: 15
    },
    {
      item_id: 'CHM-006',
      name: 'Calcium Chloride (CaCl2)',
      cas_no: '10043-52-4',
      molecular_weight: 110.98,
      density: 2.15,
      stock_concentration: 1000,
      available_quantity: 200,
      hazard_class: 'Irritant',
      unit: 'g',
      purity: 99.5,
      storage_temp: 'Room Temperature',
      supplier: 'Merck',
      lot_number: 'CAC-345678',
      expiry_date: '2027-01-15',
      cost_per_unit: 0.08,
      is_available: true,
      category: 'Salt',
      sub_category: 'Inorganic Salt',
      specifications: 'Anhydrous, cell culture grade',
      solubility: 'Highly soluble in water',
      osmolarity_contribution: 2703
    },
    {
      item_id: 'CHM-007',
      name: 'Magnesium Sulfate (MgSO4)',
      cas_no: '7487-88-9',
      molecular_weight: 120.37,
      density: 2.66,
      stock_concentration: 500,
      available_quantity: 300,
      hazard_class: 'Safe',
      unit: 'g',
      purity: 99.7,
      storage_temp: 'Room Temperature',
      supplier: 'Life Technologies',
      lot_number: 'MGS-123789',
      expiry_date: '2026-11-30',
      cost_per_unit: 0.12,
      is_available: true,
      category: 'Salt',
      sub_category: 'Inorganic Salt',
      specifications: 'Heptahydrate, cell culture grade',
      solubility: 'Soluble in water',
      osmolarity_contribution: 1660
    },
    {
      item_id: 'CHM-008',
      name: 'Penicillin-Streptomycin',
      cas_no: '61-33-6',
      molecular_weight: 334.39,
      available_quantity: 25,
      hazard_class: 'Irritant',
      unit: 'mL',
      purity: 100.0,
      storage_temp: '-20°C',
      supplier: 'Gibco',
      lot_number: 'PEN-567890',
      expiry_date: '2025-09-30',
      cost_per_unit: 8.50,
      is_available: true,
      category: 'Antibiotic',
      sub_category: 'Antibiotic Mixture',
      specifications: '10,000 units/mL Penicillin, 10,000 μg/mL Streptomycin',
      solubility: 'Aqueous solution',
      osmolarity_contribution: 0
    },
    {
      item_id: 'CHM-009',
      name: 'Phenol Red',
      cas_no: '143-74-8',
      molecular_weight: 354.38,
      density: 1.41,
      available_quantity: 10,
      hazard_class: 'Toxic',
      unit: 'g',
      purity: 95.0,
      storage_temp: 'Room Temperature',
      supplier: 'Sigma-Aldrich',
      lot_number: 'PHR-234567',
      expiry_date: '2026-08-15',
      cost_per_unit: 25.00,
      is_available: true,
      category: 'Indicator',
      sub_category: 'pH Indicator',
      specifications: 'Cell culture grade',
      solubility: 'Slightly soluble in water',
      osmolarity_contribution: 2825
    },
    {
      item_id: 'CHM-010',
      name: 'L-Glutamine',
      cas_no: '56-85-9',
      molecular_weight: 146.14,
      density: 1.54,
      stock_concentration: 200,
      available_quantity: 100,
      hazard_class: 'Safe',
      unit: 'g',
      purity: 99.0,
      storage_temp: '-20°C',
      supplier: 'Thermo Fisher',
      lot_number: 'GLN-345678',
      expiry_date: '2025-10-31',
      cost_per_unit: 3.20,
      is_available: true,
      category: 'Growth Factor',
      sub_category: 'Amino Acid',
      specifications: 'Cell culture grade, sterile filtered',
      solubility: 'Soluble in water',
      osmolarity_contribution: 6849
    }
  ];

  /**
   * Get all available chemicals/reagents for media preparation
   */
  async getAvailableChemicals(category?: string): Promise<InventoryChemical[]> {
    let chemicals = this.mockChemicals.filter(chem => chem.is_available);
    
    if (category) {
      chemicals = chemicals.filter(chem => 
        chem.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    return chemicals;
  }

  /**
   * Get chemical by ID
   */
  async getChemicalById(itemId: string): Promise<InventoryChemical | null> {
    return this.mockChemicals.find(chem => chem.item_id === itemId) || null;
  }

  /**
   * Search chemicals by name or CAS number
   */
  async searchChemicals(query: string): Promise<InventoryChemical[]> {
    const lowerQuery = query.toLowerCase();
    return this.mockChemicals.filter(chem =>
      chem.name.toLowerCase().includes(lowerQuery) ||
      chem.cas_no.includes(lowerQuery) ||
      chem.supplier.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Calculate ingredient requirements for given concentration and volume
   */
  calculateIngredientAmount(
    chemical: InventoryChemical,
    targetConcentration: number,
    targetUnit: string,
    totalVolume: number
  ): MediaIngredientCalculation {
    let massNeeded = 0;
    let volumeNeeded = 0;
    const warnings: string[] = [];

    // Convert target concentration to mg for calculation
    let targetConcMg = targetConcentration;
    if (targetUnit === 'mM' && chemical.molecular_weight) {
      targetConcMg = (targetConcentration * chemical.molecular_weight) / 1000;
    } else if (targetUnit === 'μM' && chemical.molecular_weight) {
      targetConcMg = (targetConcentration * chemical.molecular_weight) / 1000000;
    } else if (targetUnit === '%') {
      targetConcMg = targetConcentration * 10; // % w/v to mg/mL
    } else if (targetUnit === 'g/L') {
      targetConcMg = targetConcentration; // Already mg/mL
    }

    // Calculate mass needed for target volume
    massNeeded = (targetConcMg * totalVolume) / 1000; // Convert to grams

    // Account for purity
    if (chemical.purity < 100) {
      massNeeded = massNeeded / (chemical.purity / 100);
    }

    // If stock solution available, calculate volume needed
    if (chemical.stock_concentration && chemical.stock_concentration > 0) {
      volumeNeeded = (targetConcMg * totalVolume) / chemical.stock_concentration;
    }

    // Cost calculation
    const costContribution = massNeeded * chemical.cost_per_unit;

    // Check stock availability
    const stockSufficient = massNeeded <= chemical.available_quantity;
    if (!stockSufficient) {
      warnings.push(`Insufficient stock: need ${massNeeded.toFixed(3)}g, have ${chemical.available_quantity}g`);
    }

    // Compatibility warnings
    if (chemical.hazard_class !== 'Safe') {
      warnings.push(`${chemical.hazard_class} chemical - use appropriate safety measures`);
    }

    if (volumeNeeded > totalVolume * 0.1) {
      warnings.push(`Large volume addition (${volumeNeeded.toFixed(1)} mL) may affect final volume`);
    }

    // Check expiry
    const expiryDate = new Date(chemical.expiry_date);
    const daysToExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysToExpiry < 30) {
      warnings.push(`Chemical expires in ${daysToExpiry} days`);
    }

    return {
      ingredient_id: chemical.item_id,
      target_concentration: targetConcentration,
      target_unit: targetUnit,
      calculated_amount: massNeeded,
      calculated_unit: 'g',
      volume_needed: volumeNeeded,
      mass_needed: massNeeded,
      cost_contribution: costContribution,
      compatibility_warnings: warnings,
      stock_sufficient: stockSufficient
    };
  }

  /**
   * Validate complete formula composition
   */
  async validateFormula(
    ingredients: MediaIngredientCalculation[],
    targetVolume: number
  ): Promise<FormulaValidation> {
    const warnings: string[] = [];
    const hazardWarnings: string[] = [];
    const stockWarnings: string[] = [];
    let totalCost = 0;
    let estimatedOsmolarity = 0;
    let estimatedPh = 7.4; // Default

    for (const ingredient of ingredients) {
      totalCost += ingredient.cost_contribution;
      
      // Add warnings
      warnings.push(...ingredient.compatibility_warnings);
      
      if (!ingredient.stock_sufficient) {
        stockWarnings.push(`${ingredient.ingredient_id}: Insufficient stock`);
      }

      // Get chemical data for osmolarity calculation
      const chemical = await this.getChemicalById(ingredient.ingredient_id);
      if (chemical && chemical.osmolarity_contribution) {
        if (ingredient.target_unit === 'mM') {
          estimatedOsmolarity += ingredient.target_concentration;
        } else if (ingredient.target_unit === 'mg/mL' && chemical.molecular_weight) {
          estimatedOsmolarity += (ingredient.target_concentration / chemical.molecular_weight) * 1000;
        }
      }

      // Hazard warnings
      if (chemical && chemical.hazard_class !== 'Safe') {
        hazardWarnings.push(`${chemical.name}: ${chemical.hazard_class}`);
      }
    }

    // pH estimation based on buffer presence
    const hasHEPES = ingredients.some(ing => 
      this.mockChemicals.find(chem => 
        chem.item_id === ing.ingredient_id && chem.name.includes('HEPES')
      )
    );
    
    if (hasHEPES) {
      estimatedPh = 7.4;
    }

    const isValid = stockWarnings.length === 0 && warnings.length === 0;

    return {
      is_valid: isValid,
      total_cost: totalCost,
      estimated_osmolarity: estimatedOsmolarity,
      estimated_ph: estimatedPh,
      compatibility_issues: warnings,
      stock_warnings: stockWarnings,
      hazard_warnings: hazardWarnings
    };
  }

  /**
   * Get chemical categories for filtering
   */
  getCategories(): string[] {
    return Array.from(new Set(this.mockChemicals.map(chem => chem.category)));
  }

  /**
   * Check if ingredients are compatible
   */
  async checkCompatibility(ingredientIds: string[]): Promise<string[]> {
    const warnings: string[] = [];
    const chemicals = await Promise.all(
      ingredientIds.map(id => this.getChemicalById(id))
    );

    // Check for incompatible combinations
    const hasCalcium = chemicals.some(chem => chem?.name.includes('Calcium'));
    const hasPhosphate = chemicals.some(chem => chem?.name.includes('Phosphate'));
    
    if (hasCalcium && hasPhosphate) {
      warnings.push('Calcium and phosphate may precipitate - add separately or use chelator');
    }

    const hazardousChemicals = chemicals.filter(chem => 
      chem && chem.hazard_class !== 'Safe'
    );
    
    if (hazardousChemicals.length > 0) {
      warnings.push(`Contains ${hazardousChemicals.length} hazardous chemicals - review safety procedures`);
    }

    return warnings;
  }

  /**
   * Get suggested alternatives for unavailable chemicals
   */
  async getSuggestedAlternatives(chemicalId: string): Promise<InventoryChemical[]> {
    const chemical = await this.getChemicalById(chemicalId);
    if (!chemical) return [];

    // Find alternatives in the same category
    return this.mockChemicals.filter(chem =>
      chem.item_id !== chemicalId &&
      chem.category === chemical.category &&
      chem.is_available
    );
  }
}

export const inventoryIntegrationService = new InventoryIntegrationService();
export default inventoryIntegrationService; 