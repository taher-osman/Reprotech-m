import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Save, 
  Edit, 
  Trash2,
  Beaker,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  FlaskConical,
  TestTube,
  Eye,
  FileText,
  Zap,
  ShieldAlert,
  TrendingUp,
  Package,
  Link,
  Sparkles
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
  MediaCategory, 
  ConcentrationUnit, 
  StorageConditions, 
  MediaFormula, 
  MediaType, 
  ApplicationType, 
  MediaStatus, 
  HazardClass,
  LinkedIngredient,
  InventoryChemical 
} from '../types/mediaTypes';
import { mediaDemoService } from '../services/mediaDemoService';
import inventoryIntegrationService from '../services/inventoryIntegrationService';

const MediaFormulaBuilder: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<MediaStatus | 'all'>('all');
  const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formulas, setFormulas] = useState<MediaFormula[]>([]);
  const [availableChemicals, setAvailableChemicals] = useState<InventoryChemical[]>([]);
  const [showIngredientsView, setShowIngredientsView] = useState(false);
  const [selectedFormula, setSelectedFormula] = useState<MediaFormula | null>(null);

  useEffect(() => {
    // Load formulas from demo service
    setFormulas(mediaDemoService.getFormulas());
    // Load available chemicals for inventory integration
    loadAvailableChemicals();
  }, []);

  const loadAvailableChemicals = async () => {
    try {
      const chemicals = await inventoryIntegrationService.getAvailableChemicals();
      setAvailableChemicals(chemicals);
    } catch (error) {
      console.error('Error loading chemicals:', error);
    }
  };

  const categories: MediaCategory[] = ['IVF', 'ICSI', 'SCNT', 'Semen Processing', 'Research', 'General'];
  const mediaTypes: MediaType[] = ['Culture Medium', 'Washing Medium', 'Fertilization Medium', 'Maturation Medium', 'Capacitation Medium', 'Freezing Medium', 'Buffer Solution', 'Stock Solution'];
  const applications: ApplicationType[] = ['Oocyte Collection', 'Sperm Preparation', 'IVF/ICSI', 'Embryo Culture', 'Embryo Transfer', 'Cryopreservation', 'Research', 'Quality Control'];
  const statusOptions: MediaStatus[] = ['Draft', 'Under Review', 'Approved', 'Active', 'Deprecated', 'Discontinued'];

  const filteredFormulas = formulas.filter(formula => {
    const matchesSearch = formula.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         formula.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (formula.media_id && formula.media_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (formula.media_name && formula.media_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || formula.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || (formula.status && formula.status === selectedStatus);
    const matchesType = selectedType === 'all' || (formula.media_type && formula.media_type === selectedType);
    return matchesSearch && matchesCategory && matchesStatus && matchesType;
  });

  // Helper functions for status badges
  const getStatusBadgeColor = (status: MediaStatus) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Active': return 'bg-blue-100 text-blue-800';
      case 'Deprecated': return 'bg-orange-100 text-orange-800';
      case 'Discontinued': return 'bg-red-100 text-red-800';
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

  const handleDeleteFormula = (id: string) => {
    if (window.confirm('Are you sure you want to delete this formula?')) {
      mediaDemoService.deleteFormula(id);
      setFormulas(mediaDemoService.getFormulas());
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold flex items-center space-x-3">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <span>Media Master System</span>
            <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              Inventory Integrated
            </Badge>
          </h2>
          <p className="text-gray-600 text-lg mt-2">
            Advanced formula builder with real-time inventory integration and cost analysis
          </p>
          <div className="flex items-center space-x-4 mt-3">
            <Badge variant="outline" className="text-green-600 border-green-300">
              <CheckCircle className="h-3 w-3 mr-1" />
              {availableChemicals.length} Chemicals Available
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-300">
              <Beaker className="h-3 w-3 mr-1" />
              {filteredFormulas.length} Formulas
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-300">
              <Link className="h-3 w-3 mr-1" />
              Real-time Stock Check
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowIngredientsView(!showIngredientsView)}
            className={showIngredientsView ? "bg-blue-50 border-blue-300" : ""}
          >
            <Package className="h-4 w-4 mr-2" />
            {showIngredientsView ? 'Formula View' : 'Ingredients View'}
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                New Formula
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Media Formula</DialogTitle>
                <DialogDescription>
                  Define a new media formula with ingredients, concentrations, and specifications
                </DialogDescription>
              </DialogHeader>
              <CreateFormulaForm onClose={() => setIsCreateDialogOpen(false)} onSave={(formula) => {
                mediaDemoService.addFormula(formula);
                setFormulas(mediaDemoService.getFormulas());
                setIsCreateDialogOpen(false);
              }} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Filters */}
      <Card className="border-2 border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <span>Advanced Filters & Search</span>
          </CardTitle>
          <CardDescription>
            Filter by category, type, status, and search across all formula properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <Label>Search Formulas</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as MediaCategory | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Media Type</Label>
              <Select value={selectedType} onValueChange={(value) => setSelectedType(value as MediaType | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {mediaTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as MediaStatus | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statusOptions.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Showing {filteredFormulas.length} of {formulas.length} formulas
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedType('all');
                  setSelectedStatus('all');
                }}
              >
                Clear Filters
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Filtered
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Formulas Table */}
      <Card className="border-2 border-purple-100">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Beaker className="h-5 w-5 text-purple-600" />
                <span>Media Master Table ({filteredFormulas.length})</span>
              </CardTitle>
              <CardDescription>
                Complete media formulas with inventory integration and cost analysis
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview SOP
              </Button>
              <Button variant="outline" size="sm">
                <Package className="h-4 w-4 mr-2" />
                View Inventory
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Media Details</TableHead>
                  <TableHead>Type & Application</TableHead>
                  <TableHead>Version & Volume</TableHead>
                  <TableHead>Ingredients</TableHead>
                  <TableHead>Timing</TableHead>
                  <TableHead>Cost Analysis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Approval</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFormulas.map((formula) => (
                  <TableRow key={formula.id} className="hover:bg-purple-50">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">{formula.media_name || formula.name}</div>
                        <div className="text-sm font-mono text-blue-600">{formula.media_id}</div>
                        <div className="text-xs text-gray-500 max-w-xs truncate">{formula.description}</div>
                        {formula.notes && (
                          <div className="text-xs text-orange-600 italic">Note: {formula.notes}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Badge variant="outline" className="capitalize text-xs">
                          {formula.media_type || 'Culture Medium'}
                        </Badge>
                        <Badge variant="outline" className="capitalize text-xs">
                          {formula.application || formula.category}
                        </Badge>
                        {formula.is_base_media && (
                          <Badge className="bg-purple-100 text-purple-800 text-xs">
                            Base Media
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="secondary" className="text-xs">v{formula.version}</Badge>
                        <div className="text-sm text-gray-600">
                          {formula.default_volume || 1000} mL
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Beaker className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">{formula.ingredients?.length || 0}</span>
                        </div>
                        {formula.linkedIngredients && formula.linkedIngredients.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Link className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600">{formula.linkedIngredients.length} linked</span>
                          </div>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 text-xs p-1"
                          onClick={() => setSelectedFormula(formula)}
                        >
                          View Details
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-gray-600" />
                          <span className="text-xs">{formula.preparationTime}m</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FlaskConical className="h-3 w-3 text-green-600" />
                          <span className="text-xs">{formula.shelfLife}d</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3 text-green-600" />
                          <span className="text-sm font-medium">${formula.estimatedCost.toFixed(2)}</span>
                        </div>
                        {formula.usageCount && (
                          <div className="text-xs text-gray-500">Used {formula.usageCount}x</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge 
                          className={getStatusBadgeColor(formula.status || 'Draft')}
                        >
                          {formula.status || 'Draft'}
                        </Badge>
                        <Badge 
                          variant={formula.isActive ? "default" : "secondary"}
                          className={formula.isActive ? "bg-green-100 text-green-800 text-xs" : "text-xs"}
                        >
                          {formula.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-600">
                          By: {formula.created_by || formula.createdBy}
                        </div>
                        {formula.approved_by && (
                          <div className="text-xs text-green-600">
                            ✓ {formula.approved_by}
                          </div>
                        )}
                        {formula.approved_at && (
                          <div className="text-xs text-gray-500">
                            {new Date(formula.approved_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <Button variant="outline" size="sm" title="Edit Formula" className="text-xs h-6">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" title="Create Batch" className="text-xs h-6">
                          <TestTube className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" title="View SOP" className="text-xs h-6">
                          <FileText className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          title="Delete"
                          onClick={() => handleDeleteFormula(formula.id)}
                          className="text-xs h-6 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredFormulas.length === 0 && (
            <div className="text-center py-12">
              <Beaker className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No formulas found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or create a new formula</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Formula
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Formulas</CardTitle>
            <Beaker className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formulas.length}</div>
            <p className="text-xs text-muted-foreground">Active and inactive</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Formulas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formulas.filter(f => f.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${formulas.length > 0 ? (formulas.reduce((sum, f) => sum + f.estimatedCost, 0) / formulas.length).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">Per formula</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Used</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">IVF Medium v2.1</div>
            <p className="text-xs text-muted-foreground">Most popular formula</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Create Formula Form Component
const CreateFormulaForm: React.FC<{ 
  onClose: () => void; 
  onSave: (formula: Omit<MediaFormula, 'id' | 'createdAt' | 'updatedAt'>) => void; 
}> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '' as MediaCategory,
    version: '',
    preparationTime: 30,
    shelfLife: 21,
    phTarget: { min: 7.2, max: 7.4 },
    osmolarityTarget: { min: 280, max: 320 },
    storageConditions: {
      temperature: { min: 2, max: 8, unit: 'Celsius' as const },
      lightSensitive: false,
      humidity: { min: 0, max: 100 }
    } as StorageConditions,
    ingredients: [] as any[],
    sopReference: '',
    isActive: true,
    createdBy: 'Current User',
    updatedBy: 'Current User',
    estimatedCost: 0
  });

  const categories: MediaCategory[] = ['IVF', 'ICSI', 'SCNT', 'Semen Processing', 'Research', 'General'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      alert('Please fill in required fields');
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Formula Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., IVF Medium v2.1"
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as MediaCategory })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the formula and its intended use..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            value={formData.version}
            onChange={(e) => setFormData({ ...formData, version: e.target.value })}
            placeholder="e.g., 1.0"
          />
        </div>
        <div>
          <Label htmlFor="prepTime">Prep Time (min)</Label>
          <Input
            id="prepTime"
            type="number"
            value={formData.preparationTime}
            onChange={(e) => setFormData({ ...formData, preparationTime: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="shelfLife">Shelf Life (days)</Label>
          <Input
            id="shelfLife"
            type="number"
            value={formData.shelfLife}
            onChange={(e) => setFormData({ ...formData, shelfLife: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="cost">Est. Cost ($)</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            value={formData.estimatedCost}
            onChange={(e) => setFormData({ ...formData, estimatedCost: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>pH Target Range</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              step="0.1"
              value={formData.phTarget.min}
              onChange={(e) => setFormData({
                ...formData,
                phTarget: { ...formData.phTarget, min: parseFloat(e.target.value) }
              })}
              placeholder="Min"
            />
            <span>to</span>
            <Input
              type="number"
              step="0.1"
              value={formData.phTarget.max}
              onChange={(e) => setFormData({
                ...formData,
                phTarget: { ...formData.phTarget, max: parseFloat(e.target.value) }
              })}
              placeholder="Max"
            />
          </div>
        </div>
        <div>
          <Label>Osmolarity Target (mOsm/L)</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={formData.osmolarityTarget.min}
              onChange={(e) => setFormData({
                ...formData,
                osmolarityTarget: { ...formData.osmolarityTarget, min: parseInt(e.target.value) }
              })}
              placeholder="Min"
            />
            <span>to</span>
            <Input
              type="number"
              value={formData.osmolarityTarget.max}
              onChange={(e) => setFormData({
                ...formData,
                osmolarityTarget: { ...formData.osmolarityTarget, max: parseInt(e.target.value) }
              })}
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Create Formula
        </Button>
      </div>
    </form>
  );
};

export default MediaFormulaBuilder; 