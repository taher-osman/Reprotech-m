import React, { useState } from 'react';
import { 
  X, 
  Save, 
  FileText, 
  Receipt, 
  Calculator, 
  Plus,
  Download,
  Target,
  Package,
  CreditCard
} from 'lucide-react';
import { 
  ReportType, 
  AccountType, 
  ServiceType, 
  CurrencyCode,
  AssetCategory,
  DepreciationMethod,
  PaymentMethod,
  BudgetPeriod
} from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

// Create Invoice Modal
export const CreateInvoiceModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    amount: 0,
    description: '',
    dueDate: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Create Invoice</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <select 
              value={formData.customerId}
              onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            >
              <option value="">Select Customer</option>
              <option value="cust-001">Al-Rajhi Farm</option>
              <option value="cust-002">King Abdulaziz Farm</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (SAR)</label>
            <input 
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input 
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Account Modal
export const AddAccountModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    accountCode: '',
    accountName: '',
    accountType: AccountType.ASSET,
    description: '',
    currencyCode: CurrencyCode.SAR
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Plus className="h-5 w-5 mr-2 text-blue-600" />
            Add Account
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Code</label>
            <input 
              type="text"
              value={formData.accountCode}
              onChange={(e) => setFormData(prev => ({ ...prev, accountCode: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 1000"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
            <input 
              type="text"
              value={formData.accountName}
              onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Cash and Bank"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <select 
              value={formData.accountType}
              onChange={(e) => setFormData(prev => ({ ...prev, accountType: e.target.value as AccountType }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={AccountType.ASSET}>Asset</option>
              <option value={AccountType.LIABILITY}>Liability</option>
              <option value={AccountType.EQUITY}>Equity</option>
              <option value={AccountType.REVENUE}>Revenue</option>
              <option value={AccountType.EXPENSE}>Expense</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Add Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Generate Report Modal
export const GenerateReportModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    reportType: 'PROFIT_LOSS',
    dateFrom: '',
    dateTo: '',
    format: 'PDF'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Generate Report</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select 
              value={formData.reportType}
              onChange={(e) => setFormData(prev => ({ ...prev, reportType: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="PROFIT_LOSS">Profit & Loss</option>
              <option value="BALANCE_SHEET">Balance Sheet</option>
              <option value="CASH_FLOW">Cash Flow</option>
              <option value="COST_CENTER_ANALYSIS">Cost Center Analysis</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input 
                type="date"
                value={formData.dateFrom}
                onChange={(e) => setFormData(prev => ({ ...prev, dateFrom: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input 
                type="date"
                value={formData.dateTo}
                onChange={(e) => setFormData(prev => ({ ...prev, dateTo: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <select 
              value={formData.format}
              onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="PDF">PDF</option>
              <option value="EXCEL">Excel</option>
              <option value="CSV">CSV</option>
            </select>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Asset Modal
export const AddAssetModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    assetCode: '',
    name: '',
    category: AssetCategory.LABORATORY_EQUIPMENT,
    acquisitionCost: 0,
    acquisitionDate: '',
    depreciationMethod: DepreciationMethod.STRAIGHT_LINE,
    usefulLife: 10,
    salvageValue: 0,
    location: '',
    serialNumber: '',
    supplier: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Package className="h-5 w-5 mr-2 text-green-600" />
            Add Asset
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asset Code</label>
              <input 
                type="text"
                value={formData.assetCode}
                onChange={(e) => setFormData(prev => ({ ...prev, assetCode: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., LAB-EQ-001"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Carl Zeiss Microscope"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as AssetCategory }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={AssetCategory.LABORATORY_EQUIPMENT}>Laboratory Equipment</option>
                <option value={AssetCategory.ULTRASOUND_EQUIPMENT}>Ultrasound Equipment</option>
                <option value={AssetCategory.MICROSCOPES}>Microscopes</option>
                <option value={AssetCategory.CENTRIFUGES}>Centrifuges</option>
                <option value={AssetCategory.FREEZERS}>Freezers</option>
                <option value={AssetCategory.VEHICLES}>Vehicles</option>
                <option value={AssetCategory.OFFICE_EQUIPMENT}>Office Equipment</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Acquisition Date</label>
              <input 
                type="date"
                value={formData.acquisitionDate}
                onChange={(e) => setFormData(prev => ({ ...prev, acquisitionDate: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Acquisition Cost (SAR)</label>
              <input 
                type="number"
                value={formData.acquisitionCost}
                onChange={(e) => setFormData(prev => ({ ...prev, acquisitionCost: parseFloat(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Useful Life (Years)</label>
              <input 
                type="number"
                value={formData.usefulLife}
                onChange={(e) => setFormData(prev => ({ ...prev, usefulLife: parseInt(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salvage Value (SAR)</label>
              <input 
                type="number"
                value={formData.salvageValue}
                onChange={(e) => setFormData(prev => ({ ...prev, salvageValue: parseFloat(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input 
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., IVF Laboratory - Station 1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
              <input 
                type="text"
                value={formData.serialNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., CZ-2023-001"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
            <input 
              type="text"
              value={formData.supplier}
              onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Carl Zeiss AG"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Add Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Create Payment Modal
export const CreatePaymentModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    invoiceId: '',
    amount: 0,
    paymentDate: '',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    reference: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
            Record Payment
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <select 
              value={formData.customerId}
              onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Customer</option>
              <option value="cust-001">Al-Rajhi Farm</option>
              <option value="cust-002">King Abdulaziz Farm</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice</label>
            <select 
              value={formData.invoiceId}
              onChange={(e) => setFormData(prev => ({ ...prev, invoiceId: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Invoice (Optional)</option>
              <option value="inv-001">INV-2025-001 - 5,175 SAR</option>
              <option value="inv-002">INV-2025-002 - 3,450 SAR</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (SAR)</label>
              <input 
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
              <input 
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData(prev => ({ ...prev, paymentDate: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select 
              value={formData.paymentMethod}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value as PaymentMethod }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={PaymentMethod.BANK_TRANSFER}>Bank Transfer</option>
              <option value={PaymentMethod.CASH}>Cash</option>
              <option value={PaymentMethod.CHECK}>Check</option>
              <option value={PaymentMethod.CREDIT_CARD}>Credit Card</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
            <input 
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., TXN-20250120-001"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Create Budget Modal
export const CreateBudgetModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    budgetName: '',
    fiscalYear: new Date().getFullYear(),
    budgetPeriod: BudgetPeriod.ANNUAL,
    costCenterId: '',
    totalBudget: 0,
    category: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Target className="h-5 w-5 mr-2 text-purple-600" />
            Create Budget
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget Name</label>
              <input 
                type="text"
                value={formData.budgetName}
                onChange={(e) => setFormData(prev => ({ ...prev, budgetName: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., IVF Lab Operations Budget"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fiscal Year</label>
              <input 
                type="number"
                value={formData.fiscalYear}
                onChange={(e) => setFormData(prev => ({ ...prev, fiscalYear: parseInt(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="2024"
                max="2030"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget Period</label>
              <select 
                value={formData.budgetPeriod}
                onChange={(e) => setFormData(prev => ({ ...prev, budgetPeriod: e.target.value as BudgetPeriod }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={BudgetPeriod.ANNUAL}>Annual</option>
                <option value={BudgetPeriod.QUARTERLY}>Quarterly</option>
                <option value={BudgetPeriod.MONTHLY}>Monthly</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost Center</label>
              <select 
                value={formData.costCenterId}
                onChange={(e) => setFormData(prev => ({ ...prev, costCenterId: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Cost Center</option>
                <option value="cc-001">IVF Laboratory</option>
                <option value="cc-002">Clinical Operations</option>
                <option value="cc-003">Genomic Analysis</option>
                <option value="cc-004">Administration</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Budget (SAR)</label>
            <input 
              type="number"
              value={formData.totalBudget}
              onChange={(e) => setFormData(prev => ({ ...prev, totalBudget: parseFloat(e.target.value) }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="1000"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input 
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input 
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Budget description and objectives"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Create Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Create Service Contract Modal
export const CreateServiceContractModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    contractType: 'IVF_PROGRAM',
    serviceName: '',
    totalValue: 0,
    startDate: '',
    endDate: '',
    targetValue: 70,
    targetType: 'PREGNANCY_RATE',
    costCenterId: 'cc-reproduction-lab',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-green-600" />
            Create Service Contract
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contract Basic Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Contract Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <select 
                  value={formData.customerId}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Customer</option>
                  <option value="cust-001">Al-Rajhi Farm</option>
                  <option value="cust-002">King Abdulaziz Farm</option>
                  <option value="cust-003">Al-Othaim Agricultural</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
                <select 
                  value={formData.contractType}
                  onChange={(e) => setFormData(prev => ({ ...prev, contractType: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="IVF_PROGRAM">IVF Program</option>
                  <option value="EMBRYO_TRANSFER_PLAN">Embryo Transfer Plan</option>
                  <option value="REPRODUCTION_PACKAGE">Reproduction Package</option>
                  <option value="GENETIC_TESTING_PROGRAM">Genetic Testing Program</option>
                  <option value="BREEDING_CONSULTATION">Breeding Consultation</option>
                </select>
              </div>
            </div>
          </div>

          {/* Service Package */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Service Package</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                <input 
                  type="text"
                  value={formData.serviceName}
                  onChange={(e) => setFormData(prev => ({ ...prev, serviceName: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Premium IVF Package"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Value (SAR)</label>
                <input 
                  type="number"
                  value={formData.totalValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalValue: parseFloat(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="1000"
                  required
                />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Timeline & Duration</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input 
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input 
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Performance Targets */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Performance Targets</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Type</label>
                <select 
                  value={formData.targetType}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetType: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PREGNANCY_RATE">Pregnancy Rate</option>
                  <option value="EMBRYO_SURVIVAL_RATE">Embryo Survival Rate</option>
                  <option value="QUALITY_SCORE">Quality Score</option>
                  <option value="CUSTOMER_SATISFACTION">Customer Satisfaction</option>
                  <option value="COST_EFFICIENCY">Cost Efficiency</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Value (%)</label>
                <input 
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetValue: parseFloat(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                  step="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost Center</label>
                <select 
                  value={formData.costCenterId}
                  onChange={(e) => setFormData(prev => ({ ...prev, costCenterId: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="cc-reproduction-lab">Reproduction Laboratory</option>
                  <option value="cc-clinical-dept">Clinical Department</option>
                  <option value="cc-genomic-lab">Genomic Laboratory</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contract Notes</label>
            <textarea 
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Special requirements, quality standards, or additional terms..."
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Create Contract
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Create Integrated Invoice Modal
export const CreateIntegratedInvoiceModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    contractId: '',
    serviceRecords: [
      {
        moduleSource: 'REPRODUCTION',
        recordId: '',
        serviceType: 'IVF',
        costCenterId: 'cc-reproduction-lab'
      }
    ],
    includeQualityMetrics: true,
    includeProfitabilityAnalysis: true
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(formData);
    onClose();
  };

  const addServiceRecord = () => {
    setFormData(prev => ({
      ...prev,
      serviceRecords: [...prev.serviceRecords, {
        moduleSource: 'REPRODUCTION',
        recordId: '',
        serviceType: 'IVF',
        costCenterId: 'cc-reproduction-lab'
      }]
    }));
  };

  const removeServiceRecord = (index: number) => {
    setFormData(prev => ({
      ...prev,
      serviceRecords: prev.serviceRecords.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Receipt className="h-5 w-5 mr-2 text-green-600" />
            Create Integrated Invoice
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer & Contract Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select 
                value={formData.customerId}
                onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Customer</option>
                <option value="cust-001">Al-Rajhi Farm</option>
                <option value="cust-002">King Abdulaziz Farm</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contract (Optional)</label>
              <select 
                value={formData.contractId}
                onChange={(e) => setFormData(prev => ({ ...prev, contractId: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No Contract</option>
                <option value="contract-001">CNT-2025-001 - IVF Program</option>
              </select>
            </div>
          </div>

          {/* Service Records */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Service Records to Bill</h4>
              <button 
                type="button"
                onClick={addServiceRecord}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Service
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.serviceRecords.map((record, index) => (
                <div key={index} className="grid grid-cols-5 gap-3 p-3 bg-white rounded border">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Module Source</label>
                    <select 
                      value={record.moduleSource}
                      onChange={(e) => {
                        const newRecords = [...formData.serviceRecords];
                        newRecords[index].moduleSource = e.target.value;
                        setFormData(prev => ({ ...prev, serviceRecords: newRecords }));
                      }}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="REPRODUCTION">Reproduction</option>
                      <option value="CLINICAL_HUB">Clinical Hub</option>
                      <option value="SAMPLE_MANAGEMENT">Sample Management</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Record ID</label>
                    <input 
                      type="text"
                      value={record.recordId}
                      onChange={(e) => {
                        const newRecords = [...formData.serviceRecords];
                        newRecords[index].recordId = e.target.value;
                        setFormData(prev => ({ ...prev, serviceRecords: newRecords }));
                      }}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="IVF-001"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Service Type</label>
                    <select 
                      value={record.serviceType}
                      onChange={(e) => {
                        const newRecords = [...formData.serviceRecords];
                        newRecords[index].serviceType = e.target.value;
                        setFormData(prev => ({ ...prev, serviceRecords: newRecords }));
                      }}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="IVF">IVF</option>
                      <option value="OPU">OPU</option>
                      <option value="EMBRYO_TRANSFER">Embryo Transfer</option>
                      <option value="ULTRASOUND">Ultrasound</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Cost Center</label>
                    <select 
                      value={record.costCenterId}
                      onChange={(e) => {
                        const newRecords = [...formData.serviceRecords];
                        newRecords[index].costCenterId = e.target.value;
                        setFormData(prev => ({ ...prev, serviceRecords: newRecords }));
                      }}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="cc-reproduction-lab">Reproduction Lab</option>
                      <option value="cc-clinical-dept">Clinical Dept</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button 
                      type="button"
                      onClick={() => removeServiceRecord(index)}
                      className="w-full px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      disabled={formData.serviceRecords.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integration Options */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Integration Features</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input 
                  type="checkbox"
                  checked={formData.includeQualityMetrics}
                  onChange={(e) => setFormData(prev => ({ ...prev, includeQualityMetrics: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Include quality metrics and performance scores</span>
              </label>
              
              <label className="flex items-center">
                <input 
                  type="checkbox"
                  checked={formData.includeProfitabilityAnalysis}
                  onChange={(e) => setFormData(prev => ({ ...prev, includeProfitabilityAnalysis: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Include profitability analysis and cost breakdown</span>
              </label>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Create Integrated Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 