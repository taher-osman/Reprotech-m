import { 
  FinanceApiResponse, 
  ChartOfAccounts, 
  JournalEntry, 
  JournalLine,
  CostCenter, 
  CostCenterStats,
  CostCenterBudget,
  ServiceCost,
  ServiceTransaction,
  Invoice,
  Payment,
  PaymentMethod,
  PaymentStatus,
  Supplier,
  Customer,
  Asset,
  FinancialReport,
  FinancialDashboard,
  ModuleIntegration,
  AuditTrail,
  FinanceFilters,
  AccountType,
  CurrencyCode,
  ServiceType,
  CostCenterType,
  ReportType,
  ModuleSource,
  BudgetStatus,
  BudgetVariance,
  AssetCategory,
  DepreciationMethod,
  AssetStatus,
  DepreciationSchedule,
  ReportFormat,
  ReportParameters,
  SyncStatus,
  CustomerType
} from '../types';

// ====================================
// GENERAL LEDGER & CHART OF ACCOUNTS
// ====================================

export const getChartOfAccounts = async (filters?: FinanceFilters): Promise<FinanceApiResponse<ChartOfAccounts[]>> => {
  // Mock data for development
  const mockAccounts: ChartOfAccounts[] = [
    {
      id: '1',
      accountCode: '1000',
      accountName: 'Cash and Bank',
      accountType: AccountType.CURRENT_ASSET,
      isActive: true,
      balance: 250000,
      currencyCode: CurrencyCode.SAR,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-01')
    },
    {
      id: '2',
      accountCode: '1200',
      accountName: 'Accounts Receivable',
      accountType: AccountType.CURRENT_ASSET,
      isActive: true,
      balance: 85000,
      currencyCode: CurrencyCode.SAR,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-01')
    },
    {
      id: '3',
      accountCode: '1500',
      accountName: 'Laboratory Equipment',
      accountType: AccountType.FIXED_ASSET,
      isActive: true,
      balance: 450000,
      currencyCode: CurrencyCode.SAR,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-01')
    },
    {
      id: '4',
      accountCode: '2000',
      accountName: 'Accounts Payable',
      accountType: AccountType.CURRENT_LIABILITY,
      isActive: true,
      balance: -45000,
      currencyCode: CurrencyCode.SAR,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-01')
    },
    {
      id: '5',
      accountCode: '4000',
      accountName: 'IVF Service Revenue',
      accountType: AccountType.REVENUE,
      isActive: true,
      balance: -180000,
      currencyCode: CurrencyCode.SAR,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-01')
    },
    {
      id: '6',
      accountCode: '5000',
      accountName: 'Staff Salaries',
      accountType: AccountType.EXPENSE,
      isActive: true,
      balance: 95000,
      currencyCode: CurrencyCode.SAR,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-01')
    }
  ];

  return {
    success: true,
    data: mockAccounts,
    message: 'Chart of accounts retrieved successfully'
  };
};

export const getCostCenters = async (): Promise<FinanceApiResponse<CostCenter[]>> => {
  const mockCostCenters: CostCenter[] = [
    {
      id: 'cc-reproduction-lab',
      code: 'REPRO-LAB',
      name: 'Reproduction Laboratory',
      type: CostCenterType.REPRODUCTION_LAB,
      description: 'IVF, OPU, Embryo Transfer, and SCNT procedures',
      isActive: true,
      managerId: 'emp-001',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-01')
    },
    {
      id: 'cc-clinical-dept',
      code: 'CLINICAL',
      name: 'Clinical Department',
      type: CostCenterType.CLINICAL_DEPARTMENT,
      description: 'General animal health and diagnostic services',
      isActive: true,
      managerId: 'emp-002',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-01')
    },
    {
      id: 'cc-genomic-lab',
      code: 'GENOMICS',
      name: 'Genomic Laboratory',
      type: CostCenterType.GENOMIC_LAB,
      description: 'Genetic testing and analysis services',
      isActive: true,
      managerId: 'emp-003',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-01')
    },
    {
      id: 'cc-field-teams',
      code: 'FIELD',
      name: 'Field Veterinary Teams',
      type: CostCenterType.FIELD_TEAMS,
      description: 'Mobile veterinary services and farm visits',
      isActive: true,
      managerId: 'emp-004',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-01')
    },
    {
      id: 'cc-admin',
      code: 'ADMIN',
      name: 'Administrative',
      type: CostCenterType.ADMINISTRATIVE,
      description: 'Administrative and support functions',
      isActive: true,
      managerId: 'emp-005',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-12-01')
    }
  ];

  return {
    success: true,
    data: mockCostCenters,
    message: 'Cost centers retrieved successfully'
  };
};

export const getFinancialDashboard = async (period: string): Promise<FinanceApiResponse<FinancialDashboard>> => {
  const mockDashboard: FinancialDashboard = {
    period,
    totalRevenue: 342000,
    totalExpenses: 218000,
    grossProfit: 124000,
    netProfit: 89000,
    profitMargin: 26.0,
    cashPosition: 250000,
    accountsReceivable: 85000,
    accountsPayable: 73000,
    topPerformingCostCenters: [
      {
        costCenter: {
          id: 'cc-reproduction-lab',
          code: 'REPRO-LAB',
          name: 'Reproduction Laboratory',
          type: CostCenterType.REPRODUCTION_LAB,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        revenue: 125000,
        expenses: 78000,
        profit: 47000,
        profitMargin: 37.6,
        trend: 'UP'
      }
    ],
    revenueByService: [
      {
        serviceType: ServiceType.IVF,
        revenue: 125000,
        transactions: 56,
        averageValue: 2232,
        growth: 15.2
      },
      {
        serviceType: ServiceType.EMBRYO_TRANSFER,
        revenue: 89000,
        transactions: 82,
        averageValue: 1085,
        growth: 8.7
      }
    ],
    expensesByCategory: [
      {
        category: 'Staff Costs',
        amount: 95000,
        percentage: 43.6,
        budget: 100000,
        variance: -5000
      },
      {
        category: 'Material Costs',
        amount: 78000,
        percentage: 35.8,
        budget: 80000,
        variance: -2000
      }
    ],
    budgetVariances: [
      {
        costCenterId: 'cc-reproduction-lab',
        costCenterName: 'Reproduction Laboratory',
        budgetAmount: 125000,
        actualAmount: 122500,
        variance: -2500,
        variancePercentage: -2.0,
        status: 'UNDER_BUDGET'
      }
    ],
    kpiMetrics: [
      {
        name: 'Revenue per Staff',
        value: 28500,
        target: 25000,
        unit: 'SAR',
        trend: 'UP',
        variance: 3500,
        status: 'GOOD'
      },
      {
        name: 'Cost per Service',
        value: 876,
        target: 900,
        unit: 'SAR',
        trend: 'DOWN',
        variance: -24,
        status: 'GOOD'
      }
    ]
  };

  return {
    success: true,
    data: mockDashboard,
    message: 'Financial dashboard data retrieved successfully'
  };
};

export const getServiceCosts = async (): Promise<FinanceApiResponse<ServiceCost[]>> => {
  const mockServiceCosts: ServiceCost[] = [
    {
      id: '1',
      serviceType: ServiceType.IVF,
      serviceName: 'In Vitro Fertilization',
      costCenterId: 'cc-reproduction-lab',
      standardCost: 1800,
      actualCosts: {
        laborCost: 800,
        materialCost: 650,
        equipmentCost: 250,
        overheadCost: 100,
        totalCost: 1800
      },
      profitMargin: 25,
      sellingPrice: 2250,
      isActive: true,
      lastUpdated: new Date()
    },
    {
      id: '2',
      serviceType: ServiceType.OPU,
      serviceName: 'Ovum Pick-Up',
      costCenterId: 'cc-reproduction-lab',
      standardCost: 1200,
      actualCosts: {
        laborCost: 600,
        materialCost: 350,
        equipmentCost: 180,
        overheadCost: 70,
        totalCost: 1200
      },
      profitMargin: 30,
      sellingPrice: 1560,
      isActive: true,
      lastUpdated: new Date()
    },
    {
      id: '3',
      serviceType: ServiceType.EMBRYO_TRANSFER,
      serviceName: 'Embryo Transfer',
      costCenterId: 'cc-reproduction-lab',
      standardCost: 800,
      actualCosts: {
        laborCost: 400,
        materialCost: 250,
        equipmentCost: 100,
        overheadCost: 50,
        totalCost: 800
      },
      profitMargin: 35,
      sellingPrice: 1080,
      isActive: true,
      lastUpdated: new Date()
    },
    {
      id: '4',
      serviceType: ServiceType.ULTRASOUND,
      serviceName: 'Ultrasound Examination',
      costCenterId: 'cc-clinical-dept',
      standardCost: 150,
      actualCosts: {
        laborCost: 80,
        materialCost: 20,
        equipmentCost: 35,
        overheadCost: 15,
        totalCost: 150
      },
      profitMargin: 40,
      sellingPrice: 210,
      isActive: true,
      lastUpdated: new Date()
    }
  ];

  return {
    success: true,
    data: mockServiceCosts,
    message: 'Service costs retrieved successfully'
  };
};

export const getInvoices = async (filters?: FinanceFilters): Promise<FinanceApiResponse<Invoice[]>> => {
  const mockInvoices: Invoice[] = [
    {
      id: 'inv-001',
      invoiceNumber: 'INV-2025-001',
      customerId: 'cust-001',
      customer: {
        id: 'cust-001',
        code: 'C-001',
        name: 'Al-Rajhi Farm',
        type: 'FARM' as any,
        paymentTerms: { days: 30, description: 'Net 30 days' },
        creditLimit: 50000,
        currentBalance: 8500,
        isActive: true,
        totalRevenue: 125000,
        createdAt: new Date('2024-01-01')
      },
      issueDate: new Date('2025-01-15'),
      dueDate: new Date('2025-02-14'),
      subtotal: 4500,
      vatAmount: 675,
      totalAmount: 5175,
      paidAmount: 0,
      outstandingAmount: 5175,
      status: 'SENT' as any,
      paymentTerms: { days: 30, description: 'Net 30 days' },
      lines: [
        {
          id: 'line-001',
          invoiceId: 'inv-001',
          description: 'IVF Procedure - Cow #RT-001',
          serviceType: ServiceType.IVF,
          quantity: 2,
          unitPrice: 2250,
          lineTotal: 4500,
          vatRate: 15,
          vatAmount: 675,
          accountId: '5',
          costCenterId: 'cc-reproduction-lab'
        }
      ],
      payments: [],
      costCenterId: 'cc-reproduction-lab',
      moduleSource: ModuleSource.REPRODUCTION,
      sourceRecordId: 'ivf-session-001',
      createdAt: new Date('2025-01-15')
    }
  ];

  return {
    success: true,
    data: mockInvoices,
    message: 'Invoices retrieved successfully'
  };
};

// ====================================
// JOURNAL ENTRIES & GENERAL LEDGER
// ====================================

export const getJournalEntries = async (filters?: FinanceFilters): Promise<FinanceApiResponse<JournalEntry[]>> => {
  const mockJournalEntries: JournalEntry[] = [
    {
      id: 'je-001',
      entryNumber: 'JE-2025-001',
      description: 'IVF Service Revenue - Invoice INV-2025-001',
      reference: 'INV-2025-001',
      entryDate: new Date('2025-01-15'),
      postingDate: new Date('2025-01-15'),
      costCenterId: 'cc-reproduction-lab',
      moduleSource: ModuleSource.CUSTOMER_BILLING,
      sourceId: 'inv-001',
      totalDebit: 5175,
      totalCredit: 5175,
      isPosted: true,
      createdBy: 'admin',
      approvedBy: 'supervisor',
      journalLines: [
        {
          id: 'jl-001',
          journalEntryId: 'je-001',
          accountId: '2',
          account: {
            id: '2',
            accountCode: '1200',
            accountName: 'Accounts Receivable',
            accountType: AccountType.CURRENT_ASSET,
            isActive: true,
            balance: 85000,
            currencyCode: CurrencyCode.SAR,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          description: 'AR - Al-Rajhi Farm',
          debitAmount: 5175,
          creditAmount: 0,
          costCenterId: 'cc-reproduction-lab',
          currencyCode: CurrencyCode.SAR
        },
        {
          id: 'jl-002',
          journalEntryId: 'je-001',
          accountId: '5',
          account: {
            id: '5',
            accountCode: '4000',
            accountName: 'IVF Service Revenue',
            accountType: AccountType.REVENUE,
            isActive: true,
            balance: -180000,
            currencyCode: CurrencyCode.SAR,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          description: 'IVF Service Revenue',
          debitAmount: 0,
          creditAmount: 5175,
          costCenterId: 'cc-reproduction-lab',
          currencyCode: CurrencyCode.SAR
        }
      ],
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-01-15')
    }
  ];

  return {
    success: true,
    data: mockJournalEntries,
    message: 'Journal entries retrieved successfully'
  };
};

export const createJournalEntry = async (journalEntry: Partial<JournalEntry>): Promise<FinanceApiResponse<JournalEntry>> => {
  const newJournalEntry: JournalEntry = {
    id: `je-${Date.now()}`,
    entryNumber: `JE-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    description: journalEntry.description || '',
    reference: journalEntry.reference,
    entryDate: journalEntry.entryDate || new Date(),
    postingDate: journalEntry.postingDate || new Date(),
    costCenterId: journalEntry.costCenterId,
    moduleSource: journalEntry.moduleSource || ModuleSource.MANUAL,
    sourceId: journalEntry.sourceId,
    totalDebit: journalEntry.totalDebit || 0,
    totalCredit: journalEntry.totalCredit || 0,
    isPosted: false,
    createdBy: 'current-user',
    journalLines: journalEntry.journalLines || [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return {
    success: true,
    data: newJournalEntry,
    message: 'Journal entry created successfully'
  };
};

// ====================================
// PAYMENTS MANAGEMENT
// ====================================

export const getPayments = async (filters?: FinanceFilters): Promise<FinanceApiResponse<Payment[]>> => {
  const mockPayments: Payment[] = [
    {
      id: 'pay-001',
      paymentNumber: 'PAY-2025-001',
      customerId: 'cust-001',
      invoiceId: 'inv-001',
      amount: 5175,
      paymentDate: new Date('2025-01-20'),
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      reference: 'TXN-20250120-001',
      bankAccountId: 'acc-001',
      currencyCode: CurrencyCode.SAR,
      status: PaymentStatus.COMPLETED,
      notes: 'Payment for IVF services',
      createdAt: new Date('2025-01-20')
    },
    {
      id: 'pay-002',
      paymentNumber: 'PAY-2025-002',
      supplierId: 'sup-001',
      amount: 15000,
      paymentDate: new Date('2025-01-18'),
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      reference: 'TXN-20250118-002',
      bankAccountId: 'acc-001',
      currencyCode: CurrencyCode.SAR,
      status: PaymentStatus.COMPLETED,
      notes: 'Payment for laboratory supplies',
      createdAt: new Date('2025-01-18')
    }
  ];

  return {
    success: true,
    data: mockPayments,
    message: 'Payments retrieved successfully'
  };
};

export const createPayment = async (payment: Partial<Payment>): Promise<FinanceApiResponse<Payment>> => {
  const newPayment: Payment = {
    id: `pay-${Date.now()}`,
    paymentNumber: `PAY-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    customerId: payment.customerId,
    supplierId: payment.supplierId,
    invoiceId: payment.invoiceId,
    amount: payment.amount || 0,
    paymentDate: payment.paymentDate || new Date(),
    paymentMethod: payment.paymentMethod || PaymentMethod.BANK_TRANSFER,
    reference: payment.reference,
    bankAccountId: payment.bankAccountId,
    currencyCode: payment.currencyCode || CurrencyCode.SAR,
    status: PaymentStatus.PENDING,
    notes: payment.notes,
    createdAt: new Date()
  };

  return {
    success: true,
    data: newPayment,
    message: 'Payment created successfully'
  };
};

// ====================================
// BUDGETING SYSTEM
// ====================================

export const getBudgets = async (fiscalYear?: number): Promise<FinanceApiResponse<CostCenterBudget[]>> => {
  const mockBudgets: CostCenterBudget[] = [
    {
      id: 'budget-001',
      costCenterId: 'cc-reproduction-lab',
      fiscalYear: fiscalYear || 2025,
      status: BudgetStatus.APPROVED,
      totalBudget: 1500000,
      revenueTargets: [
        {
          id: 'bt-001',
          budgetId: 'budget-001',
          accountId: '5',
          account: {
            id: '5',
            accountCode: '4000',
            accountName: 'IVF Service Revenue',
            accountType: AccountType.REVENUE,
            isActive: true,
            balance: -180000,
            currencyCode: CurrencyCode.SAR,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          categoryType: 'REVENUE',
          budgetAmount: 1800000,
          actualAmount: 125000,
          variance: -1675000,
          variancePercentage: -93.1,
          description: 'IVF Service Revenue Target'
        }
      ],
      expenseTargets: [
        {
          id: 'bt-002',
          budgetId: 'budget-001',
          accountId: '6',
          account: {
            id: '6',
            accountCode: '5000',
            accountName: 'Staff Salaries',
            accountType: AccountType.EXPENSE,
            isActive: true,
            balance: 95000,
            currencyCode: CurrencyCode.SAR,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          categoryType: 'EXPENSE',
          budgetAmount: 300000,
          actualAmount: 95000,
          variance: 205000,
          variancePercentage: 68.3,
          description: 'Staff Salaries Budget'
        }
      ],
      monthlyAllocations: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        budgetAmount: 125000,
        actualAmount: i === 0 ? 122500 : 0,
        variance: i === 0 ? -2500 : 0,
        forecastAmount: 125000
      })),
      approvedBy: 'finance-manager',
      approvedAt: new Date('2024-12-15'),
      createdAt: new Date('2024-11-01'),
      updatedAt: new Date('2024-12-15')
    }
  ];

  return {
    success: true,
    data: mockBudgets,
    message: 'Budgets retrieved successfully'
  };
};

export const createBudget = async (budget: Partial<CostCenterBudget>): Promise<FinanceApiResponse<CostCenterBudget>> => {
  const newBudget: CostCenterBudget = {
    id: `budget-${Date.now()}`,
    costCenterId: budget.costCenterId || '',
    fiscalYear: budget.fiscalYear || new Date().getFullYear(),
    status: BudgetStatus.DRAFT,
    totalBudget: budget.totalBudget || 0,
    revenueTargets: budget.revenueTargets || [],
    expenseTargets: budget.expenseTargets || [],
    monthlyAllocations: budget.monthlyAllocations || [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return {
    success: true,
    data: newBudget,
    message: 'Budget created successfully'
  };
};

export const getBudgetVarianceReport = async (period: string): Promise<FinanceApiResponse<BudgetVariance[]>> => {
  const mockVariances: BudgetVariance[] = [
    {
      costCenterId: 'cc-reproduction-lab',
      costCenterName: 'Reproduction Laboratory',
      budgetAmount: 125000,
      actualAmount: 122500,
      variance: -2500,
      variancePercentage: -2.0,
      status: 'UNDER_BUDGET'
    },
    {
      costCenterId: 'cc-clinical-dept',
      costCenterName: 'Clinical Department',
      budgetAmount: 80000,
      actualAmount: 85000,
      variance: 5000,
      variancePercentage: 6.25,
      status: 'OVER_BUDGET'
    },
    {
      costCenterId: 'cc-genomic-lab',
      costCenterName: 'Genomic Laboratory',
      budgetAmount: 60000,
      actualAmount: 60000,
      variance: 0,
      variancePercentage: 0,
      status: 'ON_TARGET'
    }
  ];

  return {
    success: true,
    data: mockVariances,
    message: 'Budget variance report generated successfully'
  };
};

// ====================================
// ASSET MANAGEMENT
// ====================================

export const getAssets = async (filters?: FinanceFilters): Promise<FinanceApiResponse<Asset[]>> => {
  const mockAssets: Asset[] = [
    {
      id: 'asset-001',
      assetCode: 'LAB-EQ-001',
      name: 'Carl Zeiss Microscope',
      category: AssetCategory.MICROSCOPES,
      costCenterId: 'cc-reproduction-lab',
      acquisitionCost: 85000,
      acquisitionDate: new Date('2023-03-15'),
      depreciationMethod: DepreciationMethod.STRAIGHT_LINE,
      usefulLife: 10,
      salvageValue: 8500,
      currentBookValue: 69125,
      accumulatedDepreciation: 15875,
      status: AssetStatus.ACTIVE,
      location: 'IVF Laboratory - Station 1',
      serialNumber: 'CZ-2023-001',
      model: 'Axio Observer Z1',
      supplier: 'Carl Zeiss AG',
      warrantyExpiry: new Date('2026-03-15'),
      lastMaintenanceDate: new Date('2024-12-01'),
      nextMaintenanceDate: new Date('2025-06-01'),
      createdAt: new Date('2023-03-15')
    },
    {
      id: 'asset-002',
      assetCode: 'LAB-EQ-002',
      name: 'Ultrasound Machine GE',
      category: AssetCategory.ULTRASOUND_EQUIPMENT,
      costCenterId: 'cc-clinical-dept',
      acquisitionCost: 120000,
      acquisitionDate: new Date('2022-08-20'),
      depreciationMethod: DepreciationMethod.STRAIGHT_LINE,
      usefulLife: 8,
      salvageValue: 12000,
      currentBookValue: 81000,
      accumulatedDepreciation: 39000,
      status: AssetStatus.ACTIVE,
      location: 'Clinical Department - Room 2',
      serialNumber: 'GE-US-2022-001',
      model: 'LOGIQ P9',
      supplier: 'General Electric',
      warrantyExpiry: new Date('2025-08-20'),
      lastMaintenanceDate: new Date('2024-11-15'),
      nextMaintenanceDate: new Date('2025-05-15'),
      createdAt: new Date('2022-08-20')
    },
    {
      id: 'asset-003',
      assetCode: 'LAB-EQ-003',
      name: 'Liquid Nitrogen Storage Tank',
      category: AssetCategory.FREEZERS,
      costCenterId: 'cc-reproduction-lab',
      acquisitionCost: 35000,
      acquisitionDate: new Date('2024-01-10'),
      depreciationMethod: DepreciationMethod.STRAIGHT_LINE,
      usefulLife: 15,
      salvageValue: 3500,
      currentBookValue: 32900,
      accumulatedDepreciation: 2100,
      status: AssetStatus.ACTIVE,
      location: 'Cryopreservation Room',
      serialNumber: 'LN2-2024-001',
      model: 'MVE SC 4/2V',
      supplier: 'Chart Industries',
      warrantyExpiry: new Date('2027-01-10'),
      lastMaintenanceDate: new Date('2024-12-15'),
      nextMaintenanceDate: new Date('2025-03-15'),
      createdAt: new Date('2024-01-10')
    }
  ];

  return {
    success: true,
    data: mockAssets,
    message: 'Assets retrieved successfully'
  };
};

export const createAsset = async (asset: Partial<Asset>): Promise<FinanceApiResponse<Asset>> => {
  const newAsset: Asset = {
    id: `asset-${Date.now()}`,
    assetCode: asset.assetCode || `AST-${Date.now()}`,
    name: asset.name || '',
    category: asset.category || AssetCategory.LABORATORY_EQUIPMENT,
    costCenterId: asset.costCenterId || '',
    acquisitionCost: asset.acquisitionCost || 0,
    acquisitionDate: asset.acquisitionDate || new Date(),
    depreciationMethod: asset.depreciationMethod || DepreciationMethod.STRAIGHT_LINE,
    usefulLife: asset.usefulLife || 10,
    salvageValue: asset.salvageValue || 0,
    currentBookValue: asset.acquisitionCost || 0,
    accumulatedDepreciation: 0,
    status: AssetStatus.ACTIVE,
    location: asset.location,
    serialNumber: asset.serialNumber,
    model: asset.model,
    supplier: asset.supplier,
    warrantyExpiry: asset.warrantyExpiry,
    createdAt: new Date()
  };

  return {
    success: true,
    data: newAsset,
    message: 'Asset created successfully'
  };
};

export const getDepreciationSchedule = async (assetId: string): Promise<FinanceApiResponse<DepreciationSchedule[]>> => {
  const mockSchedule: DepreciationSchedule[] = Array.from({ length: 12 }, (_, i) => ({
    id: `dep-${assetId}-${i + 1}`,
    assetId,
    period: `2025-${String(i + 1).padStart(2, '0')}`,
    depreciationAmount: 1458.33,
    accumulatedDepreciation: (i + 1) * 1458.33,
    bookValue: 85000 - (i + 1) * 1458.33,
    journalEntryId: i < 1 ? `je-dep-${assetId}-${i + 1}` : undefined
  }));

  return {
    success: true,
    data: mockSchedule,
    message: 'Depreciation schedule retrieved successfully'
  };
};

// ====================================
// MODULE INTEGRATIONS
// ====================================

export const getModuleIntegrations = async (): Promise<FinanceApiResponse<ModuleIntegration[]>> => {
  const mockIntegrations: ModuleIntegration[] = [
    {
      moduleSource: ModuleSource.REPRODUCTION,
      isEnabled: true,
      configuration: {
        autoCreateInvoices: true,
        defaultCostCenter: 'cc-reproduction-lab',
        defaultServiceMapping: {
          'IVF': 'service-ivf',
          'OPU': 'service-opu',
          'EMBRYO_TRANSFER': 'service-et'
        },
        priceListId: 'price-list-001',
        vatRate: 15
      },
      lastSyncAt: new Date('2025-01-15T10:30:00'),
      syncStatus: SyncStatus.CONNECTED
    },
    {
      moduleSource: ModuleSource.SAMPLE_MANAGEMENT,
      isEnabled: true,
      configuration: {
        autoCreateInvoices: false,
        defaultCostCenter: 'cc-reproduction-lab',
        defaultServiceMapping: {
          'SAMPLE_COLLECTION': 'service-collection',
          'SAMPLE_PROCESSING': 'service-processing'
        },
        vatRate: 15
      },
      lastSyncAt: new Date('2025-01-15T09:15:00'),
      syncStatus: SyncStatus.CONNECTED
    },
    {
      moduleSource: ModuleSource.CLINICAL_HUB,
      isEnabled: true,
      configuration: {
        autoCreateInvoices: true,
        defaultCostCenter: 'cc-clinical-dept',
        defaultServiceMapping: {
          'ULTRASOUND': 'service-ultrasound',
          'CLINICAL_EXAM': 'service-exam'
        },
        vatRate: 15
      },
      lastSyncAt: new Date('2025-01-15T08:45:00'),
      syncStatus: SyncStatus.CONNECTED
    },
    {
      moduleSource: ModuleSource.INVENTORY,
      isEnabled: false,
      configuration: {
        autoCreateInvoices: false,
        defaultCostCenter: 'cc-admin',
        vatRate: 15
      },
      syncStatus: SyncStatus.DISCONNECTED
    }
  ];

  return {
    success: true,
    data: mockIntegrations,
    message: 'Module integrations retrieved successfully'
  };
};

export const updateModuleIntegration = async (
  moduleSource: ModuleSource, 
  config: Partial<ModuleIntegration>
): Promise<FinanceApiResponse<ModuleIntegration>> => {
  const updatedIntegration: ModuleIntegration = {
    moduleSource,
    isEnabled: config.isEnabled ?? true,
    configuration: config.configuration || {
      autoCreateInvoices: false,
      vatRate: 15
    },
    lastSyncAt: new Date(),
    syncStatus: SyncStatus.CONNECTED
  };

  return {
    success: true,
    data: updatedIntegration,
    message: 'Module integration updated successfully'
  };
};

// ====================================
// FINANCIAL REPORTS
// ====================================

export const generateFinancialReport = async (
  reportType: ReportType,
  parameters: ReportParameters
): Promise<FinanceApiResponse<FinancialReport>> => {
  const reportData = {
    [ReportType.PROFIT_LOSS]: {
      revenue: {
        'IVF Services': 125000,
        'OPU Services': 89000,
        'Embryo Transfer': 67000,
        'Clinical Services': 45000
      },
      expenses: {
        'Staff Costs': 95000,
        'Material Costs': 78000,
        'Equipment Costs': 25000,
        'Overhead Costs': 20000
      },
      netIncome: 108000
    },
    [ReportType.BALANCE_SHEET]: {
      assets: {
        currentAssets: {
          'Cash and Bank': 250000,
          'Accounts Receivable': 85000,
          'Inventory': 150000
        },
        fixedAssets: {
          'Laboratory Equipment': 450000,
          'Vehicles': 120000,
          'Furniture': 50000
        }
      },
      liabilities: {
        currentLiabilities: {
          'Accounts Payable': 45000,
          'Accrued Expenses': 25000
        },
        longTermLiabilities: {
          'Equipment Loans': 180000
        }
      },
      equity: {
        'Retained Earnings': 805000
      }
    },
    [ReportType.COST_CENTER_ANALYSIS]: {
      costCenters: [
        {
          name: 'Reproduction Laboratory',
          revenue: 281000,
          expenses: 175000,
          profit: 106000,
          profitMargin: 37.7
        },
        {
          name: 'Clinical Department',
          revenue: 45000,
          expenses: 38000,
          profit: 7000,
          profitMargin: 15.6
        }
      ]
    }
  };

  const newReport: FinancialReport = {
    id: `report-${Date.now()}`,
    reportType,
    title: `${reportType.replace('_', ' ')} Report`,
    parameters,
    generatedAt: new Date(),
    generatedBy: 'current-user',
    format: ReportFormat.JSON,
    data: reportData[reportType] || {},
    costCenterFilter: parameters.costCenters,
    periodFilter: parameters.dateRange
  };

  return {
    success: true,
    data: newReport,
    message: 'Financial report generated successfully'
  };
};

export const getFinancialReports = async (): Promise<FinanceApiResponse<FinancialReport[]>> => {
  const mockReports: FinancialReport[] = [
    {
      id: 'report-001',
      reportType: ReportType.PROFIT_LOSS,
      title: 'Monthly P&L Report - January 2025',
      parameters: {
        dateRange: {
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-01-31')
        }
      },
      generatedAt: new Date('2025-01-15T14:30:00'),
      generatedBy: 'finance-manager',
      format: ReportFormat.PDF,
      data: {},
      periodFilter: {
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31')
      }
    }
  ];

  return {
    success: true,
    data: mockReports,
    message: 'Financial reports retrieved successfully'
  };
};

// ====================================
// SUPPLIERS & CUSTOMERS MANAGEMENT
// ====================================

export const getSuppliers = async (filters?: FinanceFilters): Promise<FinanceApiResponse<Supplier[]>> => {
  const mockSuppliers: Supplier[] = [
    {
      id: 'sup-001',
      code: 'SUP-001',
      name: 'BioLife Solutions',
      contactPerson: 'Ahmed Al-Rashid',
      email: 'ahmed@biolife-sa.com',
      phone: '+966-11-123-4567',
      address: {
        street: 'King Fahd Road',
        city: 'Riyadh',
        state: 'Riyadh Province',
        postalCode: '11564',
        country: 'Saudi Arabia'
      },
      paymentTerms: { days: 30, description: 'Net 30 days' },
      creditLimit: 100000,
      currentBalance: 15000,
      vatNumber: '310234567890003',
      isActive: true,
      createdAt: new Date('2024-03-01')
    }
  ];

  return {
    success: true,
    data: mockSuppliers,
    message: 'Suppliers retrieved successfully'
  };
};

export const getCustomers = async (filters?: FinanceFilters): Promise<FinanceApiResponse<Customer[]>> => {
  const mockCustomers: Customer[] = [
    {
      id: 'cust-001',
      code: 'C-001',
      name: 'Al-Rajhi Farm',
      type: CustomerType.FARM,
      contactPerson: 'Mohammed Al-Rajhi',
      email: 'mohammed@rajhifarm.com',
      phone: '+966-11-987-6543',
      address: {
        street: 'Eastern Ring Road',
        city: 'Riyadh',
        state: 'Riyadh Province',
        postalCode: '13241',
        country: 'Saudi Arabia'
      },
      paymentTerms: { days: 30, description: 'Net 30 days' },
      creditLimit: 50000,
      currentBalance: 8500,
      vatNumber: '310123456789003',
      isActive: true,
      totalRevenue: 125000,
      lastTransaction: new Date('2025-01-15'),
      createdAt: new Date('2024-01-01')
    }
  ];

  return {
    success: true,
    data: mockCustomers,
    message: 'Customers retrieved successfully'
  };
};

// ====================================
// CONTRACT MANAGEMENT SYSTEM
// ====================================

export const getServiceContracts = async (filters?: FinanceFilters): Promise<FinanceApiResponse<import('../types').ServiceContract[]>> => {
  const mockContracts: import('../types').ServiceContract[] = [
    {
      id: 'contract-001',
      contractNumber: 'CNT-2025-001',
      customerId: 'cust-001',
      customer: {
        id: 'cust-001',
        code: 'C-001',
        name: 'Al-Rajhi Farm',
        type: 'FARM' as any,
        paymentTerms: { days: 30, description: 'Net 30 days' },
        creditLimit: 100000,
        currentBalance: 15000,
        isActive: true,
        totalRevenue: 250000,
        createdAt: new Date('2024-01-01')
      },
      contractType: 'IVF_PROGRAM' as any,
      servicePackage: {
        id: 'pkg-001',
        name: 'Complete IVF Program',
        description: 'Comprehensive IVF package including OPU, IVF, embryo transfer and pregnancy monitoring',
        services: [
          {
            serviceId: 'srv-001',
            serviceName: 'Ovum Pick-Up',
            serviceType: 'OPU' as any,
            quantity: 10,
            unitPrice: 1560,
            totalPrice: 15600,
            costCenterId: 'cc-reproduction-lab',
            estimatedDuration: 8,
            requiredStaff: ['staff-001', 'staff-002']
          },
          {
            serviceId: 'srv-002',
            serviceName: 'IVF Procedure',
            serviceType: 'IVF' as any,
            quantity: 8,
            unitPrice: 2250,
            totalPrice: 18000,
            costCenterId: 'cc-reproduction-lab',
            estimatedDuration: 12,
            requiredStaff: ['staff-001', 'staff-003']
          }
        ],
        totalValue: 33600,
        estimatedDuration: 90,
        requiredResources: [
          {
            resourceType: 'EQUIPMENT',
            resourceId: 'eq-001',
            quantity: 1,
            duration: 160
          }
        ]
      },
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-06-30'),
      totalValue: 33600,
      paidAmount: 10000,
      remainingAmount: 23600,
      status: 'ACTIVE' as any,
      paymentSchedule: [
        {
          id: 'ps-001',
          description: 'Initial Payment',
          dueDate: new Date('2025-01-01'),
          amount: 10000,
          paidDate: new Date('2025-01-01'),
          paidAmount: 10000,
          status: 'PAID'
        },
        {
          id: 'ps-002',
          description: 'Mid-term Payment',
          dueDate: new Date('2025-03-15'),
          amount: 13600,
          status: 'PENDING'
        },
        {
          id: 'ps-003',
          description: 'Final Payment',
          dueDate: new Date('2025-06-30'),
          amount: 10000,
          status: 'PENDING'
        }
      ],
      serviceTargets: [
        {
          id: 'target-001',
          targetType: 'PREGNANCY_RATE' as any,
          description: 'Achieve 70% pregnancy rate',
          targetValue: 70,
          currentValue: 45,
          unit: '%',
          deadline: new Date('2025-06-30'),
          priority: 'HIGH',
          status: 'IN_PROGRESS' as any,
          milestones: [
            {
              id: 'ms-001',
              description: 'First 3 procedures completed',
              dueDate: new Date('2025-02-28'),
              status: 'COMPLETED',
              value: 3,
              completedDate: new Date('2025-02-25')
            }
          ]
        }
      ],
      progressTracking: {
        overallProgress: 35,
        servicesCompleted: 3,
        totalServices: 8,
        timeElapsed: 40,
        budgetUtilized: 30,
        targetAchievements: [
          {
            targetId: 'target-001',
            targetName: 'Pregnancy Rate',
            achievementPercentage: 64,
            status: 'IN_PROGRESS' as any,
            variance: -6
          }
        ],
        riskFactors: [
          {
            type: 'QUALITY',
            severity: 'MEDIUM',
            description: 'Lower than expected pregnancy rate in first procedures',
            impact: 'May affect final target achievement',
            mitigation: 'Adjust protocol and increase monitoring',
            identified: new Date('2025-01-20')
          }
        ],
        nextMilestones: [
          {
            id: 'ms-002',
            description: 'Complete next 2 IVF procedures',
            dueDate: new Date('2025-03-15'),
            status: 'PENDING',
            value: 5
          }
        ]
      },
      costCenterId: 'cc-reproduction-lab',
      assignedTechnician: 'Dr. Ahmed Al-Mansouri',
      notes: 'High-priority client with specific quality requirements',
      createdAt: new Date('2024-12-15'),
      updatedAt: new Date('2025-01-20')
    }
  ];

  return {
    success: true,
    data: mockContracts,
    message: 'Service contracts retrieved successfully'
  };
};

export const createServiceContract = async (contract: Partial<import('../types').ServiceContract>): Promise<FinanceApiResponse<import('../types').ServiceContract>> => {
  console.log('Creating service contract:', contract);
  
  return {
    success: true,
    data: {
      id: 'contract-new',
      contractNumber: 'CNT-2025-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
      ...contract
    } as any,
    message: 'Service contract created successfully'
  };
};

// ====================================
// ADVANCED ANALYTICS & INTEGRATION
// ====================================

export const getCrossModuleAnalytics = async (period: import('../types').DateRange): Promise<FinanceApiResponse<import('../types').CrossModuleAnalytics>> => {
  const mockAnalytics: import('../types').CrossModuleAnalytics = {
    period,
    modulePerformance: [
      {
        moduleSource: ModuleSource.REPRODUCTION,
        revenue: 185000,
        costs: 128000,
        profit: 57000,
        profitMargin: 30.8,
        transactionCount: 89,
        averageTransactionValue: 2079,
        growthRate: 15.2,
        efficiency: 1438,
        customerSatisfaction: 8.7,
        targetAchievement: 87.5
      },
      {
        moduleSource: ModuleSource.CLINICAL_HUB,
        revenue: 95000,
        costs: 68000,
        profit: 27000,
        profitMargin: 28.4,
        transactionCount: 234,
        averageTransactionValue: 406,
        growthRate: 8.9,
        efficiency: 291,
        customerSatisfaction: 8.9,
        targetAchievement: 92.1
      }
    ],
    serviceEfficiency: [
      {
        serviceType: ServiceType.IVF,
        costCenterId: 'cc-reproduction-lab',
        averageDuration: 6.5,
        standardCost: 1800,
        actualCost: 1842,
        costVariance: 42,
        qualityScore: 8.7,
        customerRating: 9.1,
        repeatCustomerRate: 78,
        profitability: 28.5,
        resourceEfficiency: 87.3
      }
    ],
    costCenterProductivity: [
      {
        costCenterId: 'cc-reproduction-lab',
        costCenterName: 'Reproduction Laboratory',
        revenuePerHour: 890,
        costPerHour: 625,
        utilizationRate: 87.5,
        staffProductivity: 92.3,
        equipmentEfficiency: 89.1,
        targetAchievementRate: 88.7,
        customerSatisfaction: 8.9,
        qualityMetrics: [
          {
            metricName: 'Pregnancy Rate',
            value: 68.5,
            target: 70,
            unit: '%',
            trend: 'IMPROVING'
          }
        ]
      }
    ],
    customerProfitability: [
      {
        customerId: 'cust-001',
        customerName: 'Al-Rajhi Farm',
        totalRevenue: 125000,
        totalCosts: 87500,
        grossProfit: 37500,
        profitMargin: 30.0,
        serviceUtilization: [
          {
            serviceType: ServiceType.IVF,
            frequency: 12,
            totalSpent: 85000,
            averageValue: 7083,
            lastUsed: new Date('2025-01-15')
          }
        ],
        contractPerformance: [
          {
            contractId: 'contract-001',
            onTimeCompletion: true,
            budgetAdherence: 95,
            qualityScore: 8.7,
            customerSatisfaction: 9.1,
            targetAchievement: 87.5
          }
        ],
        loyaltyScore: 85,
        riskScore: 15,
        predictedLifetimeValue: 450000
      }
    ],
    resourceUtilization: [
      {
        resourceType: 'EQUIPMENT',
        resourceId: 'eq-001',
        resourceName: 'IVF Workstation #1',
        utilizationRate: 89.5,
        revenueGenerated: 125000,
        costPerHour: 45,
        efficiency: 92.3,
        bookingRate: 87.2,
        maintenanceTime: 8.5
      }
    ],
    predictiveInsights: [
      {
        type: 'REVENUE_FORECAST',
        timeframe: 'next_quarter',
        prediction: 425000,
        confidence: 85,
        factors: ['Seasonal trends', 'Contract pipeline', 'Historical growth'],
        recommendation: 'Increase capacity in Reproduction Lab by 15%',
        impact: 'HIGH'
      }
    ]
  };

  return {
    success: true,
    data: mockAnalytics,
    message: 'Cross-module analytics retrieved successfully'
  };
};

// ====================================
// ENHANCED INVOICE INTEGRATION
// ====================================

export const createIntegratedInvoice = async (invoiceData: {
  customerId: string;
  serviceRecords: Array<{
    moduleSource: ModuleSource;
    recordId: string;
    serviceType: ServiceType;
    costCenterId: string;
  }>;
  contractId?: string;
}): Promise<FinanceApiResponse<import('../types').IntegratedInvoice>> => {
  console.log('Creating integrated invoice:', invoiceData);

  // Simulate service costing integration
  const serviceBreakdown: import('../types').InvoiceServiceBreakdown[] = invoiceData.serviceRecords.map((record, index) => ({
    serviceId: `srv-${index + 1}`,
    serviceName: `${record.serviceType} Service`,
    serviceType: record.serviceType,
    costCenterId: record.costCenterId,
    quantity: 1,
    standardCost: 1800,
    actualCost: 1842,
    sellingPrice: 2250,
    grossProfit: 408,
    profitMargin: 18.1,
    durationHours: 6.5,
    staffInvolved: ['staff-001', 'staff-002'],
    equipmentUsed: ['eq-001'],
    qualityScore: 8.7
  }));

  const mockIntegratedInvoice: import('../types').IntegratedInvoice = {
    id: 'inv-integrated-001',
    invoiceNumber: 'INV-INT-2025-001',
    customerId: invoiceData.customerId,
    customer: {
      id: invoiceData.customerId,
      code: 'C-001',
      name: 'Al-Rajhi Farm',
      type: 'FARM' as any,
      paymentTerms: { days: 30, description: 'Net 30 days' },
      creditLimit: 100000,
      currentBalance: 15000,
      isActive: true,
      totalRevenue: 250000,
      createdAt: new Date('2024-01-01')
    },
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    subtotal: serviceBreakdown.reduce((sum, item) => sum + item.sellingPrice, 0),
    vatAmount: serviceBreakdown.reduce((sum, item) => sum + item.sellingPrice, 0) * 0.15,
    totalAmount: serviceBreakdown.reduce((sum, item) => sum + item.sellingPrice, 0) * 1.15,
    paidAmount: 0,
    outstandingAmount: serviceBreakdown.reduce((sum, item) => sum + item.sellingPrice, 0) * 1.15,
    status: 'DRAFT' as any,
    paymentTerms: { days: 30, description: 'Net 30 days' },
    lines: serviceBreakdown.map((service, index) => ({
      id: `line-${index + 1}`,
      invoiceId: 'inv-integrated-001',
      description: service.serviceName,
      serviceType: service.serviceType,
      quantity: service.quantity,
      unitPrice: service.sellingPrice,
      lineTotal: service.sellingPrice * service.quantity,
      vatRate: 15,
      vatAmount: service.sellingPrice * service.quantity * 0.15,
      accountId: '5',
      costCenterId: service.costCenterId
    })),
    payments: [],
    costCenterId: serviceBreakdown[0]?.costCenterId,
    moduleSource: serviceBreakdown[0]?.serviceType === ServiceType.IVF ? ModuleSource.REPRODUCTION : ModuleSource.CLINICAL_HUB,
    sourceRecordId: invoiceData.serviceRecords[0]?.recordId,
    createdAt: new Date(),
    serviceBreakdown,
    costCenterAllocation: serviceBreakdown.reduce((acc, service) => {
      const existing = acc.find(item => item.costCenterId === service.costCenterId);
      if (existing) {
        existing.allocatedAmount += service.sellingPrice;
        existing.profitContribution += service.grossProfit;
      } else {
        acc.push({
          costCenterId: service.costCenterId,
          costCenterName: service.costCenterId === 'cc-reproduction-lab' ? 'Reproduction Laboratory' : 'Clinical Department',
          allocatedAmount: service.sellingPrice,
          allocatedPercentage: 100,
          profitContribution: service.grossProfit,
          resourcesUsed: [
            {
              resourceType: 'STAFF',
              resourceId: 'staff-001',
              usage: service.durationHours,
              cost: service.actualCost * 0.5
            }
          ]
        });
      }
      return acc;
    }, [] as import('../types').InvoiceCostCenterAllocation[]),
    contractReference: invoiceData.contractId,
    moduleIntegration: {
      sourceModule: serviceBreakdown[0]?.serviceType === ServiceType.IVF ? ModuleSource.REPRODUCTION : ModuleSource.CLINICAL_HUB,
      sourceRecordId: invoiceData.serviceRecords[0]?.recordId || 'record-001',
      relatedRecords: invoiceData.serviceRecords.map(record => ({
        moduleSource: record.moduleSource,
        recordId: record.recordId,
        recordType: 'service_session',
        relationship: 'billing_source'
      })),
      workflowStatus: 'completed',
      qualityChecks: [
        {
          checkType: 'service_quality',
          status: 'PASSED',
          value: 8.7,
          threshold: 7.0,
          checkedBy: 'system',
          checkedAt: new Date()
        }
      ],
      autoGeneratedItems: [
        {
          itemType: 'service_fee',
          generatedFrom: 'service_costing_module',
          automationRule: 'standard_pricing',
          value: serviceBreakdown[0]?.sellingPrice || 0
        }
      ]
    },
    profitabilityAnalysis: {
      grossRevenue: serviceBreakdown.reduce((sum, item) => sum + item.sellingPrice, 0),
      directCosts: serviceBreakdown.reduce((sum, item) => sum + item.actualCost, 0),
      indirectCosts: serviceBreakdown.reduce((sum, item) => sum + item.actualCost, 0) * 0.15,
      grossProfit: serviceBreakdown.reduce((sum, item) => sum + item.grossProfit, 0),
      netProfit: serviceBreakdown.reduce((sum, item) => sum + item.grossProfit, 0) * 0.85,
      profitMargin: (serviceBreakdown.reduce((sum, item) => sum + item.grossProfit, 0) / serviceBreakdown.reduce((sum, item) => sum + item.sellingPrice, 0)) * 100,
      contributionMargin: 65.2,
      customerLifetimeValueImpact: 2500
    },
    qualityMetrics: [
      {
        metricName: 'Service Quality Score',
        value: 8.7,
        benchmark: 8.0,
        performance: 'EXCELLENT',
        impactOnPrice: 150
      }
    ]
  };

  return {
    success: true,
    data: mockIntegratedInvoice,
    message: 'Integrated invoice created successfully with full service costing and module integration'
  };
};

// Export all functions
export default {
  // General Ledger & Chart of Accounts
  getChartOfAccounts,
  
  // Cost Centers
  getCostCenters,
  
  // Financial Dashboard
  getFinancialDashboard,
  
  // Service Costing
  getServiceCosts,
  
  // Invoicing & Billing
  getInvoices,
  
  // Journal Entries
  getJournalEntries,
  createJournalEntry,
  
  // Payments
  getPayments,
  createPayment,
  
  // Budgeting
  getBudgets,
  createBudget,
  getBudgetVarianceReport,
  
  // Asset Management
  getAssets,
  createAsset,
  getDepreciationSchedule,
  
  // Module Integrations
  getModuleIntegrations,
  updateModuleIntegration,
  
  // Financial Reports
  generateFinancialReport,
  getFinancialReports,
  
  // Suppliers & Customers
  getSuppliers,
  getCustomers,

  // Contract Management
  getServiceContracts,
  createServiceContract,

  // Advanced Analytics
  getCrossModuleAnalytics,

  // Enhanced Invoice Integration
  createIntegratedInvoice
}; 