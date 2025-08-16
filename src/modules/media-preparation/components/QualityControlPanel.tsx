import React, { useState, useEffect } from 'react';
import { 
  TestTube, 
  Search, 
  Filter, 
  Download, 
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Thermometer,
  Droplets,
  BarChart3,
  Eye,
  Edit
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { TestResult, ClarityLevel, AppearanceStatus } from '../types/mediaTypes';

const QualityControlPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState<TestResult | 'all'>('all');

  // Mock QC data
  const qcRecords = [
    {
      id: '1',
      batchNumber: 'MED-2025-0001',
      formulaName: 'IVF Medium v2.1',
      testedBy: 'QC Specialist A',
      testedAt: '2025-01-15',
      phValue: 7.3,
      osmolarityValue: 295,
      clarity: 'Clear' as ClarityLevel,
      sterilityTest: 'Pass' as TestResult,
      appearance: 'Normal' as AppearanceStatus,
      overallResult: 'Pass' as TestResult,
      approvedBy: 'Dr. Supervisor',
      approvedAt: '2025-01-15'
    },
    {
      id: '2',
      batchNumber: 'MED-2025-0002',
      formulaName: 'SOF-HEPES',
      testedBy: 'QC Specialist B',
      testedAt: '2025-01-14',
      phValue: 7.1,
      osmolarityValue: 285,
      clarity: 'Clear' as ClarityLevel,
      sterilityTest: 'Pending' as TestResult,
      appearance: 'Normal' as AppearanceStatus,
      overallResult: 'Pending' as TestResult,
      approvedBy: null,
      approvedAt: null
    },
    {
      id: '3',
      batchNumber: 'MED-2025-0003',
      formulaName: 'SCNT Wash Buffer',
      testedBy: 'QC Specialist A',
      testedAt: '2025-01-13',
      phValue: 7.5,
      osmolarityValue: 310,
      clarity: 'Slightly Cloudy' as ClarityLevel,
      sterilityTest: 'Fail' as TestResult,
      appearance: 'Abnormal' as AppearanceStatus,
      overallResult: 'Fail' as TestResult,
      approvedBy: null,
      approvedAt: null
    }
  ];

  const filteredQC = qcRecords.filter(qc => {
    const matchesSearch = qc.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         qc.formulaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         qc.testedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesResult = selectedResult === 'all' || qc.overallResult === selectedResult;
    return matchesSearch && matchesResult;
  });

  const getResultColor = (result: TestResult) => {
    switch (result) {
      case 'Pass': return 'bg-green-100 text-green-800';
      case 'Fail': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultIcon = (result: TestResult) => {
    switch (result) {
      case 'Pass': return <CheckCircle className="h-4 w-4" />;
      case 'Fail': return <AlertCircle className="h-4 w-4" />;
      case 'Pending': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quality Control</h2>
          <p className="text-gray-600">Manage QC testing and approval workflows</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <TestTube className="h-4 w-4 mr-2" />
            New QC Test
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
                  placeholder="Search QC records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedResult} onValueChange={(value) => setSelectedResult(value as TestResult | 'all')}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="Pass">Pass</SelectItem>
                <SelectItem value="Fail">Fail</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Advanced
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* QC Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>QC Records ({filteredQC.length})</CardTitle>
          <CardDescription>Quality control test results and approvals</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch Number</TableHead>
                <TableHead>Formula</TableHead>
                <TableHead>Tested By</TableHead>
                <TableHead>pH</TableHead>
                <TableHead>Osmolarity</TableHead>
                <TableHead>Clarity</TableHead>
                <TableHead>Sterility</TableHead>
                <TableHead>Appearance</TableHead>
                <TableHead>Overall Result</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQC.map((qc) => (
                <TableRow key={qc.id}>
                  <TableCell>
                    <div className="font-mono font-medium">{qc.batchNumber}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{qc.formulaName}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4 text-gray-600" />
                      <span>{qc.testedBy}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Thermometer className="h-4 w-4 text-blue-600" />
                      <span>{qc.phValue}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Droplets className="h-4 w-4 text-green-600" />
                      <span>{qc.osmolarityValue} mOsm/L</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {qc.clarity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getResultColor(qc.sterilityTest)}>
                      {qc.sterilityTest}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {qc.appearance}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getResultColor(qc.overallResult)}>
                      <div className="flex items-center space-x-1">
                        {getResultIcon(qc.overallResult)}
                        <span>{qc.overallResult}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {qc.approvedBy ? (
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4 text-gray-600" />
                        <span className="text-sm">{qc.approvedBy}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Pending</span>
                    )}
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

      {/* QC Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qcRecords.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round((qcRecords.filter(qc => qc.overallResult === 'Pass').length / qcRecords.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {qcRecords.filter(qc => qc.overallResult === 'Pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting results</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Tests</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {qcRecords.filter(qc => qc.overallResult === 'Fail').length}
            </div>
            <p className="text-xs text-muted-foreground">Require investigation</p>
          </CardContent>
        </Card>
      </div>

      {/* QC Workflow */}
      <Card>
        <CardHeader>
          <CardTitle>QC Workflow</CardTitle>
          <CardDescription>Quality control testing process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TestTube className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium">1. Sample Collection</h3>
              <p className="text-sm text-gray-600">Collect media samples for testing</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Thermometer className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium">2. Physical Tests</h3>
              <p className="text-sm text-gray-600">pH, osmolarity, clarity, appearance</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-medium">3. Sterility Testing</h3>
              <p className="text-sm text-gray-600">Microbiological contamination check</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium">4. Approval</h3>
              <p className="text-sm text-gray-600">Supervisor review and release</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityControlPanel; 