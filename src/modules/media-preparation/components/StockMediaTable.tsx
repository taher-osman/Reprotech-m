import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Split,
  Eye,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  QrCode,
  Printer,
  FileText,
  TrendingUp,
  MapPin,
  Beaker,
  Zap,
  Activity,
  Target,
  Link,
  Calendar,
  DollarSign,
  Thermometer,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Textarea } from '../../../components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/Dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { 
  StockMedia,
  StockMediaStatus,
  QCStatus,
  StockMediaFilters,
  MediaUsageLog,
  StorageLocation,
  AliquotDetails,
  BatchSplitRequest,
  UsageCertificate,
  MediaFormula,
  VolumeUnit
} from '../types/mediaTypes';

const StockMediaTable: React.FC = () => {
  // State management
  const [stockMediaList, setStockMediaList] = useState<StockMedia[]>([]);
  const [filteredStock, setFilteredStock] = useState<StockMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Filter states
  const [filters, setFilters] = useState<StockMediaFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [selectedStock, setSelectedStock] = useState<StockMedia | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    loadStockMediaData();
  }, []);

  // Filter data when search or filters change
  useEffect(() => {
    applyFilters();
  }, [stockMediaList, searchQuery, filters]);

  const loadStockMediaData = async () => {
    try {
      setLoading(true);
      // Mock data - in real implementation, this would fetch from API
      const mockStockMedia: StockMedia[] = [
        {
          stock_media_id: 'SM-20241204-001',
          media_id: 'MED-IVF-001',
          batch_id: 'MED-20241201-001',
          prepared_volume: 5000,
          remaining_volume: 3250,
          status: 'Available',
          storage_location: {
            compartment: 'Fridge A',
            rack: 'Rack 2',
            box: 'Box 1',
            position: 'A1',
            temperature: 4,
            full_location: 'Fridge A > Rack 2 > Box 1 > A1'
          },
          expiration_date: new Date('2024-12-20'),
          prepared_date: new Date('2024-12-01'),
          prepared_by: 'Dr. Smith',
          qc_status: 'Passed',
          notes: 'High-quality IVF medium prepared for research protocols',
          is_base_media: true,
          is_aliquoted: true,
          aliquot_details: {
            total_aliquots: 100,
            volume_per_aliquot: 50,
            unit: 'mL',
            container_type: '50 mL tubes',
            used_aliquots: 35,
            remaining_aliquots: 65
          },
          barcode: 'BC-SM-001',
          qr_code: 'QR-SM-001',
          usage_history: [],
          created_at: new Date('2024-12-01'),
          updated_at: new Date('2024-12-03')
        },
        {
          stock_media_id: 'SM-20241204-002',
          media_id: 'MED-WASH-001',
          batch_id: 'MED-20241202-003',
          prepared_volume: 2000,
          remaining_volume: 450,
          status: 'Available',
          storage_location: {
            compartment: 'Fridge B',
            rack: 'Rack 1',
            box: 'Box 3',
            position: 'B2',
            temperature: 4,
            full_location: 'Fridge B > Rack 1 > Box 3 > B2'
          },
          expiration_date: new Date('2024-12-15'),
          prepared_date: new Date('2024-12-02'),
          prepared_by: 'Lab Tech A',
          qc_status: 'Passed',
          notes: 'Washing medium for oocyte processing',
          is_base_media: false,
          is_aliquoted: false,
          usage_history: [],
          created_at: new Date('2024-12-02'),
          updated_at: new Date('2024-12-04')
        },
        {
          stock_media_id: 'SM-20241204-003',
          media_id: 'MED-FERT-001',
          batch_id: 'MED-20241203-005',
          prepared_volume: 1000,
          remaining_volume: 0,
          status: 'Used',
          storage_location: {
            compartment: 'Freezer A',
            rack: 'Rack 3',
            box: 'Box 2',
            position: 'C1',
            temperature: -20,
            full_location: 'Freezer A > Rack 3 > Box 2 > C1'
          },
          expiration_date: new Date('2024-12-25'),
          prepared_date: new Date('2024-12-03'),
          prepared_by: 'Dr. Johnson',
          qc_status: 'Passed',
          notes: 'Fertilization medium - completely used',
          is_base_media: true,
          is_aliquoted: false,
          usage_history: [],
          created_at: new Date('2024-12-03'),
          updated_at: new Date('2024-12-04')
        },
        {
          stock_media_id: 'SM-20241204-004',
          media_id: 'MED-CULT-001',
          batch_id: 'MED-20241204-001',
          prepared_volume: 3000,
          remaining_volume: 2800,
          status: 'Available',
          storage_location: {
            compartment: 'Incubator A',
            rack: 'Rack 1',
            box: 'Box 1',
            position: 'A3',
            temperature: 37,
            full_location: 'Incubator A > Rack 1 > Box 1 > A3'
          },
          expiration_date: new Date('2024-12-10'),
          prepared_date: new Date('2024-12-04'),
          prepared_by: 'Lab Tech B',
          qc_status: 'Pending',
          notes: 'Culture medium awaiting QC results',
          is_base_media: true,
          is_aliquoted: true,
          aliquot_details: {
            total_aliquots: 60,
            volume_per_aliquot: 50,
            unit: 'mL',
            container_type: '50 mL tubes',
            used_aliquots: 4,
            remaining_aliquots: 56
          },
          barcode: 'BC-SM-004',
          qr_code: 'QR-SM-004',
          usage_history: [],
          created_at: new Date('2024-12-04'),
          updated_at: new Date('2024-12-04')
        }
      ];
      
      setStockMediaList(mockStockMedia);
    } catch (error) {
      console.error('Error loading stock media data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...stockMediaList];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(stock =>
        stock.stock_media_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.media_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.prepared_by.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.storage_location.full_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (stock.notes && stock.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(stock => stock.status === filters.status);
    }

    // QC status filter
    if (filters.qc_status) {
      filtered = filtered.filter(stock => stock.qc_status === filters.qc_status);
    }

    // Expiration status filter
    if (filters.expiration_status) {
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      filtered = filtered.filter(stock => {
        switch (filters.expiration_status) {
          case 'Active':
            return stock.expiration_date > sevenDaysFromNow;
          case 'Near Expiry':
            return stock.expiration_date <= sevenDaysFromNow && stock.expiration_date > now;
          case 'Expired':
            return stock.expiration_date <= now;
          default:
            return true;
        }
      });
    }

    // Base media filter
    if (filters.is_base_media !== undefined) {
      filtered = filtered.filter(stock => stock.is_base_media === filters.is_base_media);
    }

    // Storage compartment filter
    if (filters.storage_compartment) {
      filtered = filtered.filter(stock => 
        stock.storage_location.compartment === filters.storage_compartment
      );
    }

    setFilteredStock(filtered);
  };

  const getStatusBadge = (status: StockMediaStatus) => {
    switch (status) {
      case 'Available':
        return <Badge className="bg-green-100 text-green-800">✓ Available</Badge>;
      case 'Used':
        return <Badge className="bg-gray-100 text-gray-800">◯ Used</Badge>;
      case 'Expired':
        return <Badge className="bg-red-100 text-red-800">✗ Expired</Badge>;
      case 'Discarded':
        return <Badge className="bg-red-100 text-red-800">🗑 Discarded</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getQCStatusBadge = (qcStatus: QCStatus) => {
    switch (qcStatus) {
      case 'Passed':
        return <Badge className="bg-green-100 text-green-800">✓ Passed</Badge>;
      case 'Failed':
        return <Badge className="bg-red-100 text-red-800">✗ Failed</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800">⏳ Pending</Badge>;
      case 'N/A':
        return <Badge className="bg-gray-100 text-gray-800">N/A</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{qcStatus}</Badge>;
    }
  };

  const getExpiryStatus = (expiryDate: Date) => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    if (expiryDate <= now) {
      return <Badge className="bg-red-100 text-red-800">⚠ Expired</Badge>;
    } else if (expiryDate <= sevenDaysFromNow) {
      return <Badge className="bg-orange-100 text-orange-800">⚠ Near Expiry</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">✓ Active</Badge>;
    }
  };

  const getVolumeStatus = (remaining: number, prepared: number) => {
    const percentage = (remaining / prepared) * 100;
    if (percentage === 0) {
      return <Badge className="bg-gray-100 text-gray-800">Empty</Badge>;
    } else if (percentage <= 20) {
      return <Badge className="bg-red-100 text-red-800">Low</Badge>;
    } else if (percentage <= 50) {
      return <Badge className="bg-orange-100 text-orange-800">Medium</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">High</Badge>;
    }
  };

  const handleViewDetails = (stock: StockMedia) => {
    setSelectedStock(stock);
    setIsDetailModalOpen(true);
  };

  const handleSplitBatch = (stock: StockMedia) => {
    setSelectedStock(stock);
    setIsSplitModalOpen(true);
  };

  const handleExportReport = () => {
    console.log('Exporting stock media report...');
    alert('Stock media report exported successfully!');
  };

  const handlePrintLabels = () => {
    console.log('Printing QR/barcode labels...');
    alert('Labels sent to printer!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold flex items-center space-x-3">
            <Package className="h-8 w-8 text-green-600" />
            <span>Stock Media Inventory</span>
            <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
              Batch Tracking
            </Badge>
          </h2>
          <p className="text-gray-600 text-lg mt-2">
            Track large-scale media batches with storage location, usage logging, and QC integration
          </p>
          <div className="flex items-center space-x-4 mt-3">
            <Badge variant="outline" className="text-green-600 border-green-300">
              <Activity className="h-3 w-3 mr-1" />
              {filteredStock.filter(s => s.status === 'Available').length} Available
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-300">
              <CheckCircle className="h-3 w-3 mr-1" />
              {filteredStock.filter(s => s.qc_status === 'Passed').length} QC Passed
            </Badge>
            <Badge variant="outline" className="text-orange-600 border-orange-300">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {filteredStock.filter(s => {
                const now = new Date();
                const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                return s.expiration_date <= sevenDays && s.expiration_date > now;
              }).length} Near Expiry
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-300">
              <Target className="h-3 w-3 mr-1" />
              {filteredStock.filter(s => s.is_base_media).length} Base Media
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Inventory
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Usage Report
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrintLabels}>
            <QrCode className="h-4 w-4 mr-2" />
            Print Labels
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card className="border-2 border-green-100">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>Stock Overview</span>
              </TabsTrigger>
              <TabsTrigger value="storage" className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Storage Map</span>
              </TabsTrigger>
              <TabsTrigger value="usage" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Usage Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="traceability" className="flex items-center space-x-2">
                <Link className="h-4 w-4" />
                <span>Traceability</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                {/* Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Filter className="h-5 w-5 text-blue-600" />
                      <span>Search & Filters</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search stock media..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                      <Select value={filters.status || ''} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as StockMediaStatus || undefined }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Statuses</SelectItem>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="Used">Used</SelectItem>
                          <SelectItem value="Expired">Expired</SelectItem>
                          <SelectItem value="Discarded">Discarded</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={filters.qc_status || ''} onValueChange={(value) => setFilters(prev => ({ ...prev, qc_status: value as QCStatus || undefined }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by QC Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All QC Statuses</SelectItem>
                          <SelectItem value="Passed">Passed</SelectItem>
                          <SelectItem value="Failed">Failed</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={filters.expiration_status || ''} onValueChange={(value) => setFilters(prev => ({ ...prev, expiration_status: value as 'Active' | 'Near Expiry' | 'Expired' || undefined }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by Expiry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Expiry Status</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Near Expiry">Near Expiry</SelectItem>
                          <SelectItem value="Expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Stock Media Table */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <Beaker className="h-5 w-5 text-green-600" />
                          <span>Stock Media Inventory ({filteredStock.length})</span>
                        </CardTitle>
                        <CardDescription>
                          Comprehensive tracking of prepared media batches with storage and usage monitoring
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Stock
                        </Button>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Import
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                        <span className="ml-3">Loading stock media...</span>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Stock Details</TableHead>
                              <TableHead>Media Information</TableHead>
                              <TableHead>Volume Status</TableHead>
                              <TableHead>Storage Location</TableHead>
                              <TableHead>QC & Expiry</TableHead>
                              <TableHead>Prepared Details</TableHead>
                              <TableHead>Aliquot Info</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredStock.map((stock) => (
                              <TableRow key={stock.stock_media_id} className="hover:bg-gray-50">
                                <TableCell>
                                  <div>
                                    <div className="font-mono font-medium text-blue-600">
                                      {stock.stock_media_id}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Batch: {stock.batch_id}
                                    </div>
                                    <div className="flex items-center space-x-2 mt-1">
                                      {getStatusBadge(stock.status)}
                                      {stock.is_base_media && (
                                        <Badge variant="outline" className="text-xs">
                                          Base Media
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{stock.media_id}</div>
                                    {stock.notes && (
                                      <div className="text-sm text-gray-500 mt-1 max-w-48 truncate">
                                        {stock.notes}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">
                                      {stock.remaining_volume.toFixed(0)} / {stock.prepared_volume.toFixed(0)} mL
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {((stock.remaining_volume / stock.prepared_volume) * 100).toFixed(1)}% remaining
                                    </div>
                                    <div className="mt-1">
                                      {getVolumeStatus(stock.remaining_volume, stock.prepared_volume)}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium text-sm">
                                      {stock.storage_location.compartment}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {stock.storage_location.full_location}
                                    </div>
                                    <div className="flex items-center space-x-1 mt-1">
                                      <Thermometer className="h-3 w-3 text-blue-500" />
                                      <span className="text-xs">{stock.storage_location.temperature}°C</span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-2">
                                    {getQCStatusBadge(stock.qc_status)}
                                    {getExpiryStatus(stock.expiration_date)}
                                    <div className="text-xs text-gray-500">
                                      Exp: {stock.expiration_date.toLocaleDateString()}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="text-sm font-medium">{stock.prepared_by}</div>
                                    <div className="text-xs text-gray-500">
                                      {stock.prepared_date.toLocaleDateString()}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {stock.is_aliquoted && stock.aliquot_details ? (
                                    <div>
                                      <div className="text-sm font-medium">
                                        {stock.aliquot_details.remaining_aliquots}/{stock.aliquot_details.total_aliquots}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {stock.aliquot_details.volume_per_aliquot} {stock.aliquot_details.unit} each
                                      </div>
                                      <div className="text-xs text-gray-400">
                                        {stock.aliquot_details.container_type}
                                      </div>
                                    </div>
                                  ) : (
                                    <Badge variant="outline" className="text-xs">
                                      Bulk
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      title="View Details"
                                      onClick={() => handleViewDetails(stock)}
                                    >
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                    {stock.remaining_volume > 0 && (
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        title="Split Batch"
                                        onClick={() => handleSplitBatch(stock)}
                                      >
                                        <Split className="h-3 w-3" />
                                      </Button>
                                    )}
                                    <Button variant="ghost" size="sm" title="QR Code">
                                      <QrCode className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" size="sm" title="Edit">
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    {filteredStock.length === 0 && !loading && (
                      <div className="text-center py-12">
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No stock media found</h3>
                        <p className="text-gray-500 mb-4">Create your first stock media batch to get started</p>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Stock Media
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Storage Map Tab */}
            <TabsContent value="storage" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span>Storage Location Map</span>
                  </CardTitle>
                  <CardDescription>
                    Visual representation of storage compartments and stock distribution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <Thermometer className="h-4 w-4 text-blue-500" />
                          <span>Fridge A (4°C)</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Stock Count:</span> {filteredStock.filter(s => s.storage_location.compartment === 'Fridge A').length}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Total Volume:</span> {filteredStock.filter(s => s.storage_location.compartment === 'Fridge A').reduce((sum, s) => sum + s.remaining_volume, 0).toFixed(0)} mL
                          </div>
                          <div className="text-xs text-gray-500">
                            Locations: Rack 1-3, Boxes A-C
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <Thermometer className="h-4 w-4 text-green-500" />
                          <span>Fridge B (4°C)</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Stock Count:</span> {filteredStock.filter(s => s.storage_location.compartment === 'Fridge B').length}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Total Volume:</span> {filteredStock.filter(s => s.storage_location.compartment === 'Fridge B').reduce((sum, s) => sum + s.remaining_volume, 0).toFixed(0)} mL
                          </div>
                          <div className="text-xs text-gray-500">
                            Locations: Rack 1-2, Boxes A-D
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-purple-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <Thermometer className="h-4 w-4 text-purple-500" />
                          <span>Incubator A (37°C)</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Stock Count:</span> {filteredStock.filter(s => s.storage_location.compartment === 'Incubator A').length}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Total Volume:</span> {filteredStock.filter(s => s.storage_location.compartment === 'Incubator A').reduce((sum, s) => sum + s.remaining_volume, 0).toFixed(0)} mL
                          </div>
                          <div className="text-xs text-gray-500">
                            Locations: Rack 1, Boxes A-B
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Usage Analytics Tab */}
            <TabsContent value="usage" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span>Usage Statistics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {stockMediaList.reduce((sum, stock) => sum + (stock.prepared_volume - stock.remaining_volume), 0).toFixed(0)} mL
                        </div>
                        <div className="text-sm text-gray-600">Total Used</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {stockMediaList.reduce((sum, stock) => sum + stock.remaining_volume, 0).toFixed(0)} mL
                        </div>
                        <div className="text-sm text-gray-600">Total Remaining</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {((stockMediaList.reduce((sum, stock) => sum + (stock.prepared_volume - stock.remaining_volume), 0) / stockMediaList.reduce((sum, stock) => sum + stock.prepared_volume, 0)) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">Usage Efficiency</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      <span>Quick Stats</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Available Batches:</span>
                        <span className="font-medium">{stockMediaList.filter(s => s.status === 'Available').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Base Media Batches:</span>
                        <span className="font-medium">{stockMediaList.filter(s => s.is_base_media).length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Aliquoted Batches:</span>
                        <span className="font-medium">{stockMediaList.filter(s => s.is_aliquoted).length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">QC Passed:</span>
                        <span className="font-medium">{stockMediaList.filter(s => s.qc_status === 'Passed').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Near Expiry:</span>
                        <span className="font-medium text-orange-600">
                          {stockMediaList.filter(s => {
                            const now = new Date();
                            const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                            return s.expiration_date <= sevenDays && s.expiration_date > now;
                          }).length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Traceability Tab */}
            <TabsContent value="traceability" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Link className="h-5 w-5 text-purple-600" />
                    <span>Batch Traceability</span>
                  </CardTitle>
                  <CardDescription>
                    Complete traceability chain and usage certificates for regulatory compliance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-16">
                    <Link className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Comprehensive Traceability</h3>
                    <p className="text-gray-500 mb-4">
                      Track complete batch genealogy, usage patterns, and generate compliance certificates
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Usage Certificate
                      </Button>
                      <Button variant="outline">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Batch Genealogy
                      </Button>
                      <Button variant="outline">
                        <Activity className="h-4 w-4 mr-2" />
                        Audit Trail
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedStock && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Stock Media Details - {selectedStock.stock_media_id}</DialogTitle>
              <DialogDescription>
                Comprehensive information about this stock media batch
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Media Information</Label>
                  <div className="text-sm text-gray-600">
                    <div>Media ID: {selectedStock.media_id}</div>
                    <div>Batch ID: {selectedStock.batch_id}</div>
                    <div>Status: {selectedStock.status}</div>
                    <div>QC Status: {selectedStock.qc_status}</div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Volume Details</Label>
                  <div className="text-sm text-gray-600">
                    <div>Prepared: {selectedStock.prepared_volume} mL</div>
                    <div>Remaining: {selectedStock.remaining_volume} mL</div>
                    <div>Used: {selectedStock.prepared_volume - selectedStock.remaining_volume} mL</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Storage Location</Label>
                  <div className="text-sm text-gray-600">
                    <div>{selectedStock.storage_location.full_location}</div>
                    <div>Temperature: {selectedStock.storage_location.temperature}°C</div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Dates</Label>
                  <div className="text-sm text-gray-600">
                    <div>Prepared: {selectedStock.prepared_date.toLocaleDateString()}</div>
                    <div>Expires: {selectedStock.expiration_date.toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
            {selectedStock.notes && (
              <div>
                <Label className="text-sm font-medium">Notes</Label>
                <p className="text-sm text-gray-600 mt-1">{selectedStock.notes}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default StockMediaTable; 