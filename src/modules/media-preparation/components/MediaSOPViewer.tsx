import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Plus,
  Edit,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Calendar,
  BookOpen,
  Shield,
  Thermometer,
  Droplets
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';

const MediaSOPViewer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock SOP data
  const sopRecords = [
    {
      id: '1',
      title: 'IVF Medium v2.1 Preparation SOP',
      formulaName: 'IVF Medium v2.1',
      version: '2.1',
      category: 'IVF',
      createdBy: 'Dr. Smith',
      createdAt: '2025-01-15',
      lastUpdated: '2025-01-15',
      status: 'Active',
      checklistItems: 12,
      safetyNotes: 'Wear appropriate PPE, work in laminar flow hood'
    },
    {
      id: '2',
      title: 'SOF-HEPES Buffer Preparation',
      formulaName: 'SOF-HEPES',
      version: '1.0',
      category: 'IVF',
      createdBy: 'Lab Tech A',
      createdAt: '2025-01-10',
      lastUpdated: '2025-01-12',
      status: 'Active',
      checklistItems: 8,
      safetyNotes: 'Handle HEPES with care, pH sensitive'
    },
    {
      id: '3',
      title: 'SCNT Wash Buffer Protocol',
      formulaName: 'SCNT Wash Buffer',
      version: '1.2',
      category: 'SCNT',
      createdBy: 'Dr. Johnson',
      createdAt: '2025-01-08',
      lastUpdated: '2025-01-14',
      status: 'Active',
      checklistItems: 6,
      safetyNotes: 'Sterile technique required, use filtered solutions'
    },
    {
      id: '4',
      title: 'Semen Processing Medium SOP',
      formulaName: 'Semen Processing Medium',
      version: '1.5',
      category: 'Semen Processing',
      createdBy: 'Lab Tech B',
      createdAt: '2025-01-05',
      lastUpdated: '2025-01-10',
      status: 'Draft',
      checklistItems: 10,
      safetyNotes: 'Biosafety level 2 precautions'
    }
  ];

  const categories = ['IVF', 'ICSI', 'SCNT', 'Semen Processing', 'Research', 'General'];

  const filteredSOPs = sopRecords.filter(sop => {
    const matchesSearch = sop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sop.formulaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sop.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || sop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-orange-100 text-orange-800';
      case 'Archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="h-4 w-4" />;
      case 'Draft': return <Clock className="h-4 w-4" />;
      case 'Archived': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">SOP Library</h2>
          <p className="text-gray-600">Standard Operating Procedures for media preparation</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New SOP
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search SOPs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Advanced
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SOP List */}
      <Card>
        <CardHeader>
          <CardTitle>SOP Records ({filteredSOPs.length})</CardTitle>
          <CardDescription>Standard Operating Procedures and protocols</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SOP Title</TableHead>
                <TableHead>Formula</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSOPs.map((sop) => (
                <TableRow key={sop.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{sop.title}</div>
                      <div className="text-sm text-gray-600">{sop.checklistItems} checklist items</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{sop.formulaName}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">v{sop.version}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {sop.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4 text-gray-600" />
                      <span>{sop.createdBy}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(sop.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(sop.status)}
                        <span>{sop.status}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">{sop.lastUpdated}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* SOP Viewer */}
      <Card>
        <CardHeader>
          <CardTitle>SOP Viewer</CardTitle>
          <CardDescription>Detailed view of selected Standard Operating Procedure</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="content" className="w-full">
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="checklist">Validation Checklist</TabsTrigger>
              <TabsTrigger value="safety">Safety Notes</TabsTrigger>
              <TabsTrigger value="history">Version History</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-6">
              <div className="space-y-6">
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">IVF Medium v2.1 Preparation SOP</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <span className="font-medium">Version:</span> 2.1
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> IVF
                    </div>
                    <div>
                      <span className="font-medium">Created:</span> 2025-01-15
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> Active
                    </div>
                  </div>
                  
                  <div className="prose max-w-none">
                    <h4>1. Equipment and Materials</h4>
                    <ul>
                      <li>Laminar flow hood (Class II)</li>
                      <li>pH meter (calibrated)</li>
                      <li>Osmometer</li>
                      <li>Sterile filter units (0.22 μm)</li>
                      <li>Sterile containers and pipettes</li>
                    </ul>

                    <h4>2. Preparation Steps</h4>
                    <ol>
                      <li>Clean and sterilize all equipment</li>
                      <li>Prepare base medium according to formula</li>
                      <li>Add supplements in correct order</li>
                      <li>Adjust pH to 7.2-7.4</li>
                      <li>Measure osmolarity (280-320 mOsm/L)</li>
                      <li>Filter sterilize through 0.22 μm filter</li>
                      <li>Aliquot into sterile containers</li>
                      <li>Label with batch number and expiry date</li>
                    </ol>

                    <h4>3. Quality Control</h4>
                    <ul>
                      <li>pH measurement (±0.1)</li>
                      <li>Osmolarity measurement (±5 mOsm/L)</li>
                      <li>Sterility testing</li>
                      <li>Appearance check (clear, no precipitate)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="checklist" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Validation Checklist</h3>
                <div className="space-y-3">
                  {[
                    'Equipment sterilization completed',
                    'All ingredients available and within expiry',
                    'pH meter calibrated',
                    'Osmometer calibrated',
                    'Sterile filters available',
                    'Base medium prepared correctly',
                    'Supplements added in correct order',
                    'pH adjusted to target range',
                    'Osmolarity within specifications',
                    'Sterility testing initiated',
                    'Proper labeling completed',
                    'Storage conditions verified'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <input type="checkbox" className="h-4 w-4" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="safety" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Safety Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span>Personal Protective Equipment</span>
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Lab coat</li>
                      <li>• Gloves (nitrile)</li>
                      <li>• Safety glasses</li>
                      <li>• Face shield (if needed)</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <span>Hazards</span>
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Chemical exposure</li>
                      <li>• Biological hazards</li>
                      <li>• Sharp objects</li>
                      <li>• Temperature extremes</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center space-x-2">
                      <Thermometer className="h-4 w-4 text-green-600" />
                      <span>Environmental Controls</span>
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Laminar flow hood</li>
                      <li>• Temperature monitoring</li>
                      <li>• Humidity control</li>
                      <li>• Light protection</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center space-x-2">
                      <Droplets className="h-4 w-4 text-purple-600" />
                      <span>Waste Disposal</span>
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Chemical waste containers</li>
                      <li>• Biological waste bags</li>
                      <li>• Sharps containers</li>
                      <li>• Autoclave treatment</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Version History</h3>
                <div className="space-y-3">
                  {[
                    { version: '2.1', date: '2025-01-15', author: 'Dr. Smith', changes: 'Updated pH range, added new supplement' },
                    { version: '2.0', date: '2024-12-01', author: 'Dr. Johnson', changes: 'Major revision, improved stability' },
                    { version: '1.5', date: '2024-08-15', author: 'Lab Tech A', changes: 'Minor corrections, updated safety notes' },
                    { version: '1.0', date: '2024-06-01', author: 'Dr. Smith', changes: 'Initial version' }
                  ].map((version, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary">v{version.version}</Badge>
                          <span className="font-medium">{version.date}</span>
                        </div>
                        <span className="text-sm text-gray-600">by {version.author}</span>
                      </div>
                      <p className="text-sm text-gray-600">{version.changes}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* SOP Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SOPs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sopRecords.length}</div>
            <p className="text-xs text-muted-foreground">All procedures</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active SOPs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {sopRecords.filter(sop => sop.status === 'Active').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently in use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft SOPs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {sopRecords.filter(sop => sop.status === 'Draft').length}
            </div>
            <p className="text-xs text-muted-foreground">Under review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Different types</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MediaSOPViewer; 