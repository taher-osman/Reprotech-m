import {
  MediaFormula,
  MediaBatch,
  MediaQualityControl,
  MediaUsage,
  MediaAnalytics,
  MediaSOP,
  MediaCategory,
  BatchStatus,
  ProcedureType,
  UsageOutcome,
  TestResult,
  ClarityLevel,
  AppearanceStatus
} from '../types/mediaTypes';

// Demo data for testing and development
export class MediaDemoService {
  private static instance: MediaDemoService;
  private formulas: MediaFormula[] = [];
  private batches: MediaBatch[] = [];
  private qcRecords: MediaQualityControl[] = [];
  private usageRecords: MediaUsage[] = [];
  private sopRecords: MediaSOP[] = [];

  constructor() {
    this.initializeDemoData();
  }

  static getInstance(): MediaDemoService {
    if (!MediaDemoService.instance) {
      MediaDemoService.instance = new MediaDemoService();
    }
    return MediaDemoService.instance;
  }

  private initializeDemoData() {
    this.generateMockFormulas();
    this.generateMockBatches();
    this.generateMockQCRecords();
    this.generateMockUsageRecords();
    this.generateMockSOPs();
  }

  private generateMockFormulas() {
    this.formulas = [
      {
        id: 'form-001',
        name: 'IVF Medium v2.1',
        description: 'Optimized IVF culture medium for bovine embryos with enhanced development potential',
        category: 'IVF' as MediaCategory,
        version: '2.1',
        sopReference: 'SOP-IVF-001',
        preparationTime: 45,
        shelfLife: 30,
        storageConditions: {
          temperature: { min: 2, max: 8, unit: 'Celsius' },
          lightSensitive: true,
          humidity: { min: 40, max: 60 },
          specialConditions: 'Store in CO2 incubator when in use'
        },
        phTarget: { min: 7.2, max: 7.4 },
        osmolarityTarget: { min: 280, max: 320 },
        isActive: true,
        createdBy: 'Dr. Sarah Johnson',
        createdAt: new Date('2024-11-15'),
        updatedBy: 'Dr. Sarah Johnson',
        updatedAt: new Date('2025-01-10'),
        ingredients: [
          {
            id: 'ing-001',
            mediaFormulaId: 'form-001',
            inventoryItemId: 'inv-001',
            concentration: 2.2,
            unit: 'g/L',
            isCritical: true,
            order: 1,
            notes: 'Dissolve first in distilled water'
          },
          {
            id: 'ing-002',
            mediaFormulaId: 'form-001',
            inventoryItemId: 'inv-002',
            concentration: 0.8,
            unit: 'g/L',
            isCritical: true,
            order: 2,
            notes: 'Add slowly while stirring'
          }
        ],
        estimatedCost: 125.50
      },
      {
        id: 'form-002',
        name: 'SOF-HEPES Buffer',
        description: 'Synthetic oviduct fluid with HEPES buffer for embryo manipulation',
        category: 'IVF' as MediaCategory,
        version: '1.0',
        sopReference: 'SOP-SOF-001',
        preparationTime: 30,
        shelfLife: 21,
        storageConditions: {
          temperature: { min: 2, max: 8, unit: 'Celsius' },
          lightSensitive: false,
          humidity: { min: 30, max: 70 }
        },
        phTarget: { min: 7.3, max: 7.5 },
        osmolarityTarget: { min: 285, max: 315 },
        isActive: true,
        createdBy: 'Lab Tech Maria',
        createdAt: new Date('2024-12-01'),
        updatedBy: 'Lab Tech Maria',
        updatedAt: new Date('2025-01-08'),
        ingredients: [
          {
            id: 'ing-003',
            mediaFormulaId: 'form-002',
            inventoryItemId: 'inv-003',
            concentration: 1.17,
            unit: 'g/L',
            isCritical: true,
            order: 1,
            notes: 'Buffer component'
          }
        ],
        estimatedCost: 89.75
      },
      {
        id: 'form-003',
        name: 'SCNT Activation Medium',
        description: 'Specialized medium for somatic cell nuclear transfer activation',
        category: 'SCNT' as MediaCategory,
        version: '1.3',
        sopReference: 'SOP-SCNT-001',
        preparationTime: 60,
        shelfLife: 7,
        storageConditions: {
          temperature: { min: 35, max: 39, unit: 'Celsius' },
          lightSensitive: true,
          humidity: { min: 95, max: 100 },
          specialConditions: 'Must be pre-warmed before use'
        },
        phTarget: { min: 7.0, max: 7.2 },
        osmolarityTarget: { min: 270, max: 300 },
        isActive: true,
        createdBy: 'Dr. Ahmed Hassan',
        createdAt: new Date('2024-10-20'),
        updatedBy: 'Dr. Ahmed Hassan',
        updatedAt: new Date('2025-01-05'),
        ingredients: [],
        estimatedCost: 245.80
      },
      {
        id: 'form-004',
        name: 'Semen Processing Buffer',
        description: 'Isotonic buffer for semen washing and preparation',
        category: 'Semen Processing' as MediaCategory,
        version: '2.0',
        sopReference: 'SOP-SEM-001',
        preparationTime: 25,
        shelfLife: 14,
        storageConditions: {
          temperature: { min: 2, max: 8, unit: 'Celsius' },
          lightSensitive: false,
          humidity: { min: 20, max: 80 }
        },
        phTarget: { min: 7.4, max: 7.6 },
        osmolarityTarget: { min: 290, max: 310 },
        isActive: true,
        createdBy: 'Dr. Jennifer Lee',
        createdAt: new Date('2024-11-30'),
        updatedBy: 'Dr. Jennifer Lee',
        updatedAt: new Date('2025-01-12'),
        ingredients: [],
        estimatedCost: 67.25
      }
    ];
  }

  private generateMockBatches() {
    this.batches = [
      {
        id: 'batch-001',
        batchNumber: 'MED-2025-0001',
        mediaFormulaId: 'form-001',
        preparedBy: 'Dr. Sarah Johnson',
        preparedAt: new Date('2025-01-15T09:30:00'),
        expiryDate: new Date('2025-02-14'),
        batchSize: 500,
        unit: 'mL',
        status: 'Released' as BatchStatus,
        storageLocation: 'Refrigerator A-2',
        notes: 'Prepared for IVF session on 2025-01-16',
        createdAt: new Date('2025-01-15T09:00:00'),
        updatedAt: new Date('2025-01-15T11:45:00'),
        ingredients: [],
        usageRecords: [],
        totalCost: 125.50
      },
      {
        id: 'batch-002',
        batchNumber: 'MED-2025-0002',
        mediaFormulaId: 'form-002',
        preparedBy: 'Lab Tech Maria',
        preparedAt: new Date('2025-01-14T14:20:00'),
        expiryDate: new Date('2025-02-04'),
        batchSize: 250,
        unit: 'mL',
        status: 'QC_Pending' as BatchStatus,
        storageLocation: 'Refrigerator B-1',
        notes: 'Quality control testing scheduled for tomorrow',
        createdAt: new Date('2025-01-14T14:00:00'),
        updatedAt: new Date('2025-01-14T16:30:00'),
        ingredients: [],
        usageRecords: [],
        totalCost: 89.75
      },
      {
        id: 'batch-003',
        batchNumber: 'MED-2025-0003',
        mediaFormulaId: 'form-003',
        preparedBy: 'Dr. Ahmed Hassan',
        preparedAt: new Date('2025-01-13T10:15:00'),
        expiryDate: new Date('2025-01-20'),
        batchSize: 100,
        unit: 'mL',
        status: 'QC_Passed' as BatchStatus,
        storageLocation: 'Incubator C-3',
        notes: 'High priority batch for SCNT procedure',
        createdAt: new Date('2025-01-13T10:00:00'),
        updatedAt: new Date('2025-01-13T15:20:00'),
        ingredients: [],
        usageRecords: [],
        totalCost: 245.80
      },
      {
        id: 'batch-004',
        batchNumber: 'MED-2025-0004',
        mediaFormulaId: 'form-004',
        preparedBy: 'Dr. Jennifer Lee',
        preparedAt: new Date('2025-01-12T08:45:00'),
        expiryDate: new Date('2025-01-26'),
        batchSize: 1000,
        unit: 'mL',
        status: 'Released' as BatchStatus,
        storageLocation: 'Refrigerator A-1',
        notes: 'Large batch for multiple semen processing sessions',
        createdAt: new Date('2025-01-12T08:30:00'),
        updatedAt: new Date('2025-01-12T12:00:00'),
        ingredients: [],
        usageRecords: [],
        totalCost: 67.25
      },
      {
        id: 'batch-005',
        batchNumber: 'MED-2025-0005',
        mediaFormulaId: 'form-001',
        preparedBy: 'Dr. Sarah Johnson',
        preparedAt: new Date('2025-01-10T11:20:00'),
        expiryDate: new Date('2025-01-15'),
        batchSize: 300,
        unit: 'mL',
        status: 'Expired' as BatchStatus,
        storageLocation: 'Refrigerator A-2',
        notes: 'Expired batch - scheduled for disposal',
        createdAt: new Date('2025-01-10T11:00:00'),
        updatedAt: new Date('2025-01-15T23:59:59'),
        ingredients: [],
        usageRecords: [],
        totalCost: 125.50
      }
    ];
  }

  private generateMockQCRecords() {
    this.qcRecords = [
      {
        id: 'qc-001',
        mediaBatchId: 'batch-001',
        testedBy: 'QC Tech John',
        testedAt: new Date('2025-01-15T11:30:00'),
        phValue: 7.3,
        osmolarityValue: 295,
        clarity: 'Clear' as ClarityLevel,
        sterilityTest: 'Pass' as TestResult,
        appearance: 'Normal' as AppearanceStatus,
        notes: 'All parameters within acceptable range',
        overallResult: 'Pass' as TestResult,
        approvedBy: 'Dr. Sarah Johnson',
        approvedAt: new Date('2025-01-15T11:45:00')
      },
      {
        id: 'qc-002',
        mediaBatchId: 'batch-002',
        testedBy: 'QC Tech John',
        testedAt: new Date('2025-01-14T16:15:00'),
        phValue: 7.4,
        osmolarityValue: 308,
        clarity: 'Clear' as ClarityLevel,
        sterilityTest: 'Pending' as TestResult,
        appearance: 'Normal' as AppearanceStatus,
        notes: 'Waiting for sterility test results (24-48 hours)',
        overallResult: 'Pending' as TestResult
      },
      {
        id: 'qc-003',
        mediaBatchId: 'batch-003',
        testedBy: 'QC Tech Sarah',
        testedAt: new Date('2025-01-13T14:30:00'),
        phValue: 7.1,
        osmolarityValue: 285,
        clarity: 'Clear' as ClarityLevel,
        sterilityTest: 'Pass' as TestResult,
        appearance: 'Normal' as AppearanceStatus,
        notes: 'Excellent quality parameters for SCNT procedure',
        overallResult: 'Pass' as TestResult,
        approvedBy: 'Dr. Ahmed Hassan',
        approvedAt: new Date('2025-01-13T15:20:00')
      }
    ];
  }

  private generateMockUsageRecords() {
    this.usageRecords = [
      {
        id: 'usage-001',
        mediaBatchId: 'batch-001',
        procedureType: 'IVF' as ProcedureType,
        procedureId: 'IVF-2025-0012',
        usedAt: new Date('2025-01-16T09:15:00'),
        quantityUsed: 50,
        unit: 'mL',
        technicianId: 'tech-001',
        outcome: 'Success' as UsageOutcome,
        notes: 'Excellent embryo development observed'
      },
      {
        id: 'usage-002',
        mediaBatchId: 'batch-001',
        procedureType: 'IVF' as ProcedureType,
        procedureId: 'IVF-2025-0013',
        usedAt: new Date('2025-01-16T14:30:00'),
        quantityUsed: 75,
        unit: 'mL',
        technicianId: 'tech-002',
        outcome: 'Success' as UsageOutcome,
        notes: 'Normal development rates achieved'
      },
      {
        id: 'usage-003',
        mediaBatchId: 'batch-004',
        procedureType: 'Semen Processing' as ProcedureType,
        procedureId: 'SEM-2025-0008',
        usedAt: new Date('2025-01-15T10:45:00'),
        quantityUsed: 100,
        unit: 'mL',
        technicianId: 'tech-003',
        outcome: 'Success' as UsageOutcome,
        notes: 'High sperm recovery rate'
      },
      {
        id: 'usage-004',
        mediaBatchId: 'batch-003',
        procedureType: 'SCNT' as ProcedureType,
        procedureId: 'SCNT-2025-0002',
        usedAt: new Date('2025-01-14T11:20:00'),
        quantityUsed: 25,
        unit: 'mL',
        technicianId: 'tech-001',
        outcome: 'Partial' as UsageOutcome,
        notes: 'Some activation issues encountered'
      }
    ];
  }

  private generateMockSOPs() {
    this.sopRecords = [
      {
        id: 'sop-001',
        mediaFormulaId: 'form-001',
        title: 'IVF Medium v2.1 Preparation SOP',
        version: '2.1',
        content: `
# IVF Medium v2.1 Preparation Standard Operating Procedure

## 1. Purpose
This SOP describes the preparation of IVF Medium v2.1 for bovine embryo culture.

## 2. Materials and Equipment
- Laminar flow hood (Class II)
- pH meter (calibrated)
- Osmometer
- Sterile filter units (0.22 μm)
- Sterile containers and pipettes
- All required chemicals and reagents

## 3. Preparation Steps
1. Clean and sterilize all equipment
2. Prepare base medium according to formula
3. Add supplements in correct order
4. Adjust pH to 7.2-7.4
5. Measure osmolarity (280-320 mOsm/L)
6. Filter sterilize through 0.22 μm filter
7. Aliquot into sterile containers
8. Label with batch number and expiry date

## 4. Quality Control
- pH measurement (±0.1)
- Osmolarity measurement (±5 mOsm/L)
- Sterility testing
- Appearance check (clear, no precipitate)

## 5. Storage
Store at 2-8°C, protect from light
        `,
        validationChecklist: [
          {
            id: 'check-001',
            step: 'Equipment sterilization completed',
            isRequired: true,
            description: 'All equipment must be properly sterilized before use'
          },
          {
            id: 'check-002',
            step: 'pH calibration verified',
            isRequired: true,
            description: 'pH meter must be calibrated with standard buffers'
          },
          {
            id: 'check-003',
            step: 'Osmometer calibration verified',
            isRequired: true,
            description: 'Osmometer must be calibrated before use'
          }
        ],
        safetyNotes: 'Wear appropriate PPE. Work in laminar flow hood. Handle chemicals according to MSDS.',
        createdBy: 'Dr. Sarah Johnson',
        createdAt: new Date('2024-11-15'),
        updatedBy: 'Dr. Sarah Johnson',
        updatedAt: new Date('2025-01-10')
      }
    ];
  }

  // Public methods to access demo data
  getFormulas() { return [...this.formulas]; }
  getBatches() { return [...this.batches]; }
  getQCRecords() { return [...this.qcRecords]; }
  getUsageRecords() { return [...this.usageRecords]; }
  getSOPs() { return [...this.sopRecords]; }

  getAnalytics(): MediaAnalytics {
    return {
      totalFormulas: this.formulas.length,
      activeBatches: this.batches.filter(b => b.status === 'Released' || b.status === 'QC_Passed').length,
      pendingQC: this.batches.filter(b => b.status === 'QC_Pending').length,
      expiredBatches: this.batches.filter(b => b.status === 'Expired').length,
      totalUsage: this.usageRecords.length,
      successRate: 94.2,
      performanceByFormula: [
        {
          formulaId: 'form-001',
          formulaName: 'IVF Medium v2.1',
          totalBatches: 3,
          successRate: 96.5,
          averageCost: 125.50,
          averagePreparationTime: 45,
          usageCount: 8
        },
        {
          formulaId: 'form-002',
          formulaName: 'SOF-HEPES Buffer',
          totalBatches: 1,
          successRate: 92.0,
          averageCost: 89.75,
          averagePreparationTime: 30,
          usageCount: 3
        }
      ],
      performanceByBatch: [],
      usageTrends: [],
      costAnalysis: {
        totalCost: 653.80,
        averageCostPerBatch: 130.76,
        costByFormula: {
          'form-001': 376.50,
          'form-002': 89.75,
          'form-003': 245.80,
          'form-004': 67.25
        },
        costByMonth: {
          '2025-01': 653.80
        }
      }
    };
  }

  // CRUD operations for demo purposes
  addFormula(formula: Omit<MediaFormula, 'id' | 'createdAt' | 'updatedAt'>) {
    const newFormula: MediaFormula = {
      ...formula,
      id: `form-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.formulas.push(newFormula);
    return newFormula;
  }

  updateFormula(id: string, updates: Partial<MediaFormula>) {
    const index = this.formulas.findIndex(f => f.id === id);
    if (index !== -1) {
      this.formulas[index] = { ...this.formulas[index], ...updates, updatedAt: new Date() };
      return this.formulas[index];
    }
    return null;
  }

  deleteFormula(id: string) {
    const index = this.formulas.findIndex(f => f.id === id);
    if (index !== -1) {
      this.formulas.splice(index, 1);
      return true;
    }
    return false;
  }

  addBatch(batch: Omit<MediaBatch, 'id' | 'createdAt' | 'updatedAt' | 'batchNumber'>) {
    const newBatch: MediaBatch = {
      ...batch,
      id: `batch-${Date.now()}`,
      batchNumber: this.generateBatchNumber(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.batches.push(newBatch);
    return newBatch;
  }

  private generateBatchNumber(): string {
    const year = new Date().getFullYear();
    const count = this.batches.length + 1;
    return `MED-${year}-${count.toString().padStart(4, '0')}`;
  }
}

export const mediaDemoService = MediaDemoService.getInstance(); 