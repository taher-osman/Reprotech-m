import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Save,
  Calculator,
  Beaker,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  FlaskConical,
  TestTube,
  FileText,
  Eye,
  Package,
  Zap,
  ShieldAlert,
  TrendingUp,
  Link,
  Sparkles,
  User,
  Calendar,
  AlertCircle,
  Printer,
  Copy,
  Send,
  Target,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui';
import { Button } from '../../../components/ui';
import { Badge } from '../../../components/ui';
import { Input } from '../../../components/ui';
import { Label } from '../../../components/ui';
import { Textarea } from '../../../components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui';
import { 
  MediaFormula, 
  MediaBatch, 
  LinkedIngredient, 
  InventoryChemical, 
  BatchStatus,
  HazardClass 
} from '../types/mediaTypes';
import { mediaDemoService } from '../services/mediaDemoService';
import inventoryIntegrationService from '../services/inventoryIntegrationService';

// Enhanced interfaces for Media Creation
interface MediaBatchCreation {
  batch_id: string;
  media_id: string;
  batch_volume: number;
  unit: string;
  prepared_by: string;
  preparation_date: string;
  status: BatchStatus;
  notes: string;
  is_base_media: boolean;
  formula?: MediaFormula;
  ingredients: BatchIngredient[];
  total_cost: number;
  estimated_ph?: number;
  estimated_osmolarity?: number;
  estimated_stability_days?: number;
}

interface BatchIngredient {
  chemical_name: string;
  inventory_item_id: string;
  amount_required: number;
  unit: string;
  stock_available: number;
  unit_cost: number;
  total_cost: number;
  hazard_class: HazardClass;
  sufficient_stock: boolean;
  molecular_weight?: number;
  cas_no?: string;
  supplier?: string;
  lot_number?: string;
  expiry_date?: string;
}

interface ExistingBatch {
  batch_id: string;
  media_name: string;
  volume: number;
  preparation_date: string;
  status: BatchStatus;
  prepared_by: string;
  total_cost: number;
  qc_status?: 'Pending' | 'Passed' | 'Failed';
  notes?: string;
}

const MediaCreationForm: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState('create-batch');
  const [formulas, setFormulas] = useState<MediaFormula[]>([]);
  const [availableChemicals, setAvailableChemicals] = useState<InventoryChemical[]>([]);
  const [existingBatches, setExistingBatches] = useState<ExistingBatch[]>([]);
  const [users] = useState<string[]>(['Dr. Smith', 'Lab Tech A', 'Lab Tech B', 'Dr. Johnson']);
  
  // Form state
  const [batchForm, setBatchForm] = useState<MediaBatchCreation>({
    batch_id: '',
    media_id: '',
    batch_volume: 1000,
    unit: 'mL',
    prepared_by: '',
    preparation_date: new Date().toISOString().split('T')[0],
    status: 'Draft',
    notes: '',
    is_base_media: false,
    ingredients: [],
    total_cost: 0
  });

  // UI states
  const [selectedFormula, setSelectedFormula] = useState<MediaFormula | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showInsufficientStock, setShowInsufficientStock] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load data on component mount
  useEffect(() => {
    loadInitialData();
    generateBatchId();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load formulas from Media Master
      const formulasData = mediaDemoService.getFormulas();
      setFormulas(formulasData);

      // Load available chemicals
      const chemicals = await inventoryIntegrationService.getAvailableChemicals();
      setAvailableChemicals(chemicals);

      // Load existing batches (mock data)
      setExistingBatches([
        {
          batch_id: 'MED-20241203-001',
          media_name: 'IVF Medium v2.1',
          volume: 1000,
          preparation_date: '2024-12-01',
          status: 'Released',
          prepared_by: 'Dr. Smith',
          total_cost: 125.50,
          qc_status: 'Passed'
        },
        {
          batch_id: 'MED-20241203-002',
          media_name: 'Washing Medium v1.5',
          volume: 500,
          preparation_date: '2024-12-02',
          status: 'QC_Pending',
          prepared_by: 'Lab Tech A',
          total_cost: 85.25,
          qc_status: 'Pending'
        },
        {
          batch_id: 'MED-20241203-003',
          media_name: 'Capacitation Medium v3.0',
          volume: 250,
          preparation_date: '2024-12-03',
          status: 'Preparing',
          prepared_by: 'Lab Tech B',
          total_cost: 95.75
        }
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const generateBatchId = () => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const sequence = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    const batchId = `MED-${dateStr}-${sequence}`;
    setBatchForm(prev => ({ ...prev, batch_id: batchId }));
  };

  const handleFormulaSelect = async (mediaId: string) => {
    setIsCalculating(true);
    try {
      const formula = formulas.find(f => f.id === mediaId || f.media_id === mediaId);
      if (!formula) return;

      setSelectedFormula(formula);
      setBatchForm(prev => ({ ...prev, media_id: mediaId, formula }));

      // Auto-calculate ingredients based on selected volume
      await calculateIngredients(formula, batchForm.batch_volume);
    } catch (error) {
      console.error('Error selecting formula:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const calculateIngredients = async (formula: MediaFormula, volume: number) => {
    // Mock calculation for demo - create sample ingredients
    const sampleIngredients: BatchIngredient[] = [
      {
        chemical_name: 'Sodium Chloride (NaCl)',
        inventory_item_id: 'CHM-001',
        amount_required: (volume * 0.009), // 0.9% solution
        unit: 'g',
        stock_available: 500,
        unit_cost: 0.05,
        total_cost: (volume * 0.009) * 0.05,
        hazard_class: 'Safe',
        sufficient_stock: true,
        molecular_weight: 58.44,
        cas_no: '7647-14-5',
        supplier: 'Sigma-Aldrich',
        lot_number: 'RNBJ4728',
        expiry_date: '2026-12-31'
      },
      {
        chemical_name: 'HEPES Buffer',
        inventory_item_id: 'CHM-002',
        amount_required: (volume * 0.025 * 238.31 / 1000), // 25mM solution
        unit: 'g',
        stock_available: 250,
        unit_cost: 2.50,
        total_cost: (volume * 0.025 * 238.31 / 1000) * 2.50,
        hazard_class: 'Irritant',
        sufficient_stock: true,
        molecular_weight: 238.31,
        cas_no: '7365-45-9',
        supplier: 'Life Technologies',
        lot_number: 'HEP2024-015',
        expiry_date: '2025-08-15'
      },
      {
        chemical_name: 'D-Glucose',
        inventory_item_id: 'CHM-003',
        amount_required: (volume * 0.0055 * 180.16 / 1000), // 5.5mM solution
        unit: 'g',
        stock_available: 1000,
        unit_cost: 0.15,
        total_cost: (volume * 0.0055 * 180.16 / 1000) * 0.15,
        hazard_class: 'Safe',
        sufficient_stock: true,
        molecular_weight: 180.16,
        cas_no: '50-99-7',
        supplier: 'Merck',
        lot_number: 'GLU-789456',
        expiry_date: '2027-03-20'
      }
    ];

    const totalCost = sampleIngredients.reduce((sum, ing) => sum + ing.total_cost, 0);

    setBatchForm(prev => ({
      ...prev,
      ingredients: sampleIngredients,
      total_cost: totalCost,
      estimated_ph: 7.4,
      estimated_osmolarity: 300,
      estimated_stability_days: formula?.shelfLife || 21
    }));
  };

  const handleVolumeChange = (volume: number) => {
    setBatchForm(prev => ({ ...prev, batch_volume: volume }));
    if (selectedFormula) {
      calculateIngredients(selectedFormula, volume);
    }
  };

  const getStockStatusBadge = (sufficient: boolean, available: number, required: number) => {
    if (sufficient) {
      return <Badge className="bg-green-100 text-green-800">✓ In Stock</Badge>;
    } else if (available > required * 0.5) {
      return <Badge className="bg-orange-100 text-orange-800">⚠ Low Stock</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">✗ Insufficient</Badge>;
    }
  };

  const getStatusBadgeColor = (status: BatchStatus) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Preparing': return 'bg-blue-100 text-blue-800';
      case 'QC_Pending': return 'bg-yellow-100 text-yellow-800';
      case 'QC_Passed': return 'bg-green-100 text-green-800';
      case 'Released': return 'bg-green-100 text-green-800';
      case 'QC_Failed': return 'bg-red-100 text-red-800';
      case 'Discarded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHazardBadgeColor = (hazardClass: HazardClass) => {
    switch (hazardClass) {
      case 'Safe': return 'bg-green-100 text-green-800';
      case 'Irritant': return 'bg-yellow-100 text-yellow-800';
      case 'Corrosive': return 'bg-orange-100 text-orange-800';
      case 'Toxic': return 'bg-red-100 text-red-800';
      case 'Flammable': return 'bg-red-100 text-red-800';
      case 'Oxidizer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSaveBatch = async () => {
    try {
      // Validate form
      if (!batchForm.media_id || !batchForm.prepared_by || batchForm.ingredients.length === 0) {
        alert('Please fill in all required fields and ensure ingredients are calculated.');
        return;
      }

      // Check for insufficient stock
      const insufficientItems = batchForm.ingredients.filter(ing => !ing.sufficient_stock);
      if (insufficientItems.length > 0 && !showInsufficientStock) {
        setShowInsufficientStock(true);
        return;
      }

      // Here you would normally save to backend and create inventory transactions
      console.log('Saving batch:', batchForm);

      // Add to existing batches
      const newBatch: ExistingBatch = {
        batch_id: batchForm.batch_id,
        media_name: selectedFormula?.media_name || selectedFormula?.name || 'Unknown Media',
        volume: batchForm.batch_volume,
        preparation_date: batchForm.preparation_date,
        status: batchForm.status,
        prepared_by: batchForm.prepared_by,
        total_cost: batchForm.total_cost,
        notes: batchForm.notes
      };

      setExistingBatches(prev => [newBatch, ...prev]);

      // Reset form
      generateBatchId();
      setBatchForm(prev => ({
        ...prev,
        media_id: '',
        batch_volume: 1000,
        prepared_by: '',
        notes: '',
        is_base_media: false,
        ingredients: [],
        total_cost: 0
      }));
      setSelectedFormula(null);
      setShowInsufficientStock(false);

      alert('Batch created successfully! Inventory has been updated.');
    } catch (error) {
      console.error('Error saving batch:', error);
      alert('Error saving batch. Please try again.');
    }
  };

  const handleCloneBatch = (batch: ExistingBatch) => {
    const formula = formulas.find(f => f.media_name === batch.media_name || f.name === batch.media_name);
    if (formula) {
      setBatchForm(prev => ({
        ...prev,
        media_id: formula.id,
        batch_volume: batch.volume,
        notes: `Cloned from ${batch.batch_id}`
      }));
      handleFormulaSelect(formula.id);
      setActiveTab('create-batch');
    }
  };

  const handleSendToQC = (batch: ExistingBatch) => {
    console.log('Sending batch to QC:', batch);
    alert(`Batch ${batch.batch_id} sent to Quality Control module`);
  };

  const filteredBatches = existingBatches.filter(batch =>
    batch.batch_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    batch.media_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    batch.prepared_by.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold flex items-center space-x-3">
            <FlaskConical className="h-8 w-8 text-blue-600" />
            <span>Media Creation Center</span>
            <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
              Inventory Integrated
            </Badge>
          </h2>
          <p className="text-gray-600 text-lg mt-2">
            Create media batches with auto-calculation, inventory tracking, and QC integration
          </p>
          <div className="flex items-center space-x-4 mt-3">
            <Badge variant="outline" className="text-blue-600 border-blue-300">
              <Target className="h-3 w-3 mr-1" />
              {formulas.length} Formulas Available
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-300">
              <Package className="h-3 w-3 mr-1" />
              {availableChemicals.length} Chemicals Ready
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-300">
              <Activity className="h-3 w-3 mr-1" />
              {existingBatches.length} Batches Created
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print Labels
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card className="border-2 border-blue-100">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100">
              <TabsTrigger value="create-batch" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create New Batch</span>
              </TabsTrigger>
              <TabsTrigger value="batch-history" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Batch History</span>
              </TabsTrigger>
            </TabsList>

            {/* Create New Batch Tab */}
            <TabsContent value="create-batch" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel - Batch Configuration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Beaker className="h-5 w-5 text-blue-600" />
                      <span>Batch Configuration</span>
                    </CardTitle>
                    <CardDescription>
                      Configure your new media batch with formula selection and volume
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="batch_id">Batch ID</Label>
                        <Input
                          id="batch_id"
                          value={batchForm.batch_id}
                          disabled
                          className="font-mono bg-gray-50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="preparation_date">Preparation Date</Label>
                        <Input
                          id="preparation_date"
                          type="date"
                          value={batchForm.preparation_date}
                          onChange={(e) => setBatchForm(prev => ({ ...prev, preparation_date: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="media_id">Media Formula *</Label>
                      <Select value={batchForm.media_id} onValueChange={handleFormulaSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a media formula" />
                        </SelectTrigger>
                        <SelectContent>
                          {formulas.map(formula => (
                            <SelectItem key={formula.id} value={formula.id}>
                              <div className="flex items-center space-x-2">
                                <span>{formula.media_name || formula.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {formula.media_id}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="batch_volume">Batch Volume *</Label>
                        <Input
                          id="batch_volume"
                          type="number"
                          value={batchForm.batch_volume}
                          onChange={(e) => handleVolumeChange(Number(e.target.value))}
                          className="text-lg font-bold"
                        />
                      </div>
                      <div>
                        <Label htmlFor="unit">Unit</Label>
                        <Select value={batchForm.unit} onValueChange={(value) => setBatchForm(prev => ({ ...prev, unit: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mL">mL</SelectItem>
                            <SelectItem value="L">L</SelectItem>
                            <SelectItem value="μL">μL</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="prepared_by">Prepared By *</Label>
                      <Select value={batchForm.prepared_by} onValueChange={(value) => setBatchForm(prev => ({ ...prev, prepared_by: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select technician" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map(user => (
                            <SelectItem key={user} value={user}>{user}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={batchForm.status} onValueChange={(value) => setBatchForm(prev => ({ ...prev, status: value as BatchStatus }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Preparing">Preparing</SelectItem>
                          <SelectItem value="QC_Pending">QC Pending</SelectItem>
                          <SelectItem value="QC_Passed">QC Passed</SelectItem>
                          <SelectItem value="Released">Released</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_base_media"
                        checked={batchForm.is_base_media}
                        onChange={(e) => setBatchForm(prev => ({ ...prev, is_base_media: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="is_base_media">
                        Mark as base media (used in downstream formulas)
                      </Label>
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={batchForm.notes}
                        onChange={(e) => setBatchForm(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Additional notes about this batch..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Right Panel - Formula Summary */}
                {selectedFormula && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-green-600" />
                        <span>Formula Summary</span>
                      </CardTitle>
                      <CardDescription>
                        Auto-calculated properties and costs for {selectedFormula.media_name || selectedFormula.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            ${batchForm.total_cost.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-600">Total Cost</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {batchForm.ingredients.length}
                          </div>
                          <div className="text-sm text-gray-600">Ingredients</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {batchForm.estimated_osmolarity} mOsm/L
                          </div>
                          <div className="text-sm text-gray-600">Est. Osmolarity</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            {batchForm.estimated_ph}
                          </div>
                          <div className="text-sm text-gray-600">Est. pH</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Preparation Time:</span>
                          <span className="font-medium">{selectedFormula.preparationTime} minutes</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Stability Period:</span>
                          <span className="font-medium">{batchForm.estimated_stability_days} days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Cost per mL:</span>
                          <span className="font-medium">${(batchForm.total_cost / batchForm.batch_volume).toFixed(4)}</span>
                        </div>
                      </div>

                      {isCalculating && (
                        <div className="flex items-center justify-center p-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span className="ml-2">Calculating ingredients...</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Ingredients Table */}
              {batchForm.ingredients.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="h-5 w-5 text-green-600" />
                      <span>Required Ingredients</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        Auto-calculated for {batchForm.batch_volume} {batchForm.unit}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Ingredient requirements with real-time stock checking and cost analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Chemical</TableHead>
                            <TableHead>Amount Required</TableHead>
                            <TableHead>Stock Available</TableHead>
                            <TableHead>Unit Cost</TableHead>
                            <TableHead>Total Cost</TableHead>
                            <TableHead>Hazard</TableHead>
                            <TableHead>Stock Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {batchForm.ingredients.map((ingredient, index) => (
                            <TableRow key={index} className={!ingredient.sufficient_stock ? 'bg-red-50' : ''}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{ingredient.chemical_name}</div>
                                  <div className="text-sm text-gray-500">
                                    {ingredient.cas_no} • {ingredient.supplier}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    Lot: {ingredient.lot_number} • Exp: {ingredient.expiry_date}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-bold text-blue-600">
                                    {ingredient.amount_required.toFixed(4)} {ingredient.unit}
                                  </div>
                                  {ingredient.molecular_weight && (
                                    <div className="text-xs text-gray-500">
                                      MW: {ingredient.molecular_weight}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  {ingredient.stock_available.toFixed(2)} {ingredient.unit}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  ${ingredient.unit_cost.toFixed(2)}/{ingredient.unit}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-bold text-green-600">
                                  ${ingredient.total_cost.toFixed(2)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getHazardBadgeColor(ingredient.hazard_class)}>
                                  {ingredient.hazard_class}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {getStockStatusBadge(
                                  ingredient.sufficient_stock,
                                  ingredient.stock_available,
                                  ingredient.amount_required
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center mt-6">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={generateBatchId}>
                          <Copy className="h-4 w-4 mr-2" />
                          Generate New ID
                        </Button>
                        <Button variant="outline" onClick={() => selectedFormula && calculateIngredients(selectedFormula, batchForm.batch_volume)}>
                          <Calculator className="h-4 w-4 mr-2" />
                          Recalculate
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button onClick={handleSaveBatch} className="bg-green-600 hover:bg-green-700">
                          <Save className="h-4 w-4 mr-2" />
                          Create Batch
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Batch History Tab */}
            <TabsContent value="batch-history" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-purple-600" />
                        <span>Batch History & Management</span>
                      </CardTitle>
                      <CardDescription>
                        View and manage all created media batches with QC integration
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search batches..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 w-64"
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Batch Details</TableHead>
                          <TableHead>Media & Volume</TableHead>
                          <TableHead>Date & Technician</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>QC Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBatches.map((batch) => (
                          <TableRow key={batch.batch_id} className="hover:bg-gray-50">
                            <TableCell>
                              <div>
                                <div className="font-mono font-medium text-blue-600">
                                  {batch.batch_id}
                                </div>
                                {batch.notes && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {batch.notes}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{batch.media_name}</div>
                                <div className="text-sm text-gray-600">
                                  {batch.volume} mL
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="text-sm">{batch.preparation_date}</div>
                                <div className="text-sm text-gray-600">{batch.prepared_by}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-green-600">
                                ${batch.total_cost.toFixed(2)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadgeColor(batch.status)}>
                                {batch.status.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {batch.qc_status ? (
                                <Badge className={
                                  batch.qc_status === 'Passed' ? 'bg-green-100 text-green-800' :
                                  batch.qc_status === 'Failed' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }>
                                  {batch.qc_status}
                                </Badge>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Button variant="ghost" size="sm" title="View Details">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm" title="Clone Batch" onClick={() => handleCloneBatch(batch)}>
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm" title="Print Label">
                                  <Printer className="h-3 w-3" />
                                </Button>
                                {batch.status === 'QC_Passed' && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    title="Send to QC"
                                    onClick={() => handleSendToQC(batch)}
                                    className="text-purple-600"
                                  >
                                    <Send className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {filteredBatches.length === 0 && (
                    <div className="text-center py-12">
                      <FlaskConical className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No batches found</h3>
                      <p className="text-gray-500 mb-4">Create your first media batch to get started</p>
                      <Button onClick={() => setActiveTab('create-batch')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Batch
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaCreationForm; 