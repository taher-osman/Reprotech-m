import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  Search, 
  Filter, 
  Download, 
  Plus,
  User,
  Calendar,
  FlaskConical,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/Select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { ProcedureType, UsageOutcome } from '../types/mediaTypes';

const MediaUsageTracker: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureType | 'all'>('all');
  const [selectedOutcome, setSelectedOutcome] = useState<UsageOutcome | 'all'>('all');

  // Mock usage data
  const usageRecords = [
    {
      id: '1',
      batchNumber: 'MED-2025-0001',
      formulaName: 'IVF Medium v2.1',
      procedureType: 'IVF' as ProcedureType,
      procedureId: 'IVF-2025-001',
      usedAt: '2025-01-15',
      quantityUsed: 50,
      unit: 'mL',
      technicianId: 'Dr. Smith',
      outcome: 'Success' as UsageOutcome,
      notes: 'Successful fertilization achieved'
    },
    {
      id: '2',
      batchNumber: 'MED-2025-0001',
      formulaName: 'IVF Medium v2.1',
      procedureType: 'ICSI' as ProcedureType,
      procedureId: 'ICSI-2025-002',
      usedAt: '2025-01-14',
      quantityUsed: 30,
      unit: 'mL',
      technicianId: 'Lab Tech A',
      outcome: 'Partial' as UsageOutcome,
      notes: 'Partial success, some embryos formed'
    },
    {
      id: '3',
      batchNumber: 'MED-2025-0002',
      formulaName: 'SOF-HEPES',
      procedureType: 'Embryo Culture' as ProcedureType,
      procedureId: 'CULT-2025-003',
      usedAt: '2025-01-13',
      quantityUsed: 100,
      unit: 'mL',
      technicianId: 'Dr. Johnson',
      outcome: 'Success' as UsageOutcome,
      notes: 'Excellent embryo development'
    },
    {
      id: '4',
      batchNumber: 'MED-2025-0003',
      formulaName: 'SCNT Wash Buffer',
      procedureType: 'SCNT' as ProcedureType,
      procedureId: 'SCNT-2025-004',
      usedAt: '2025-01-12',
      quantityUsed: 25,
      unit: 'mL',
      technicianId: 'Lab Tech B',
      outcome: 'Failed' as UsageOutcome,
      notes: 'Nuclear transfer unsuccessful'
    }
  ];

  const procedures: ProcedureType[] = ['IVF', 'ICSI', 'SCNT', 'Semen Processing', 'Embryo Culture', 'Research'];
  const outcomes: UsageOutcome[] = ['Success', 'Partial', 'Failed'];

  const filteredUsage = usageRecords.filter(usage => {
    const matchesSearch = usage.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         usage.formulaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         usage.technicianId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProcedure = selectedProcedure === 'all' || usage.procedureType === selectedProcedure;
    const matchesOutcome = selectedOutcome === 'all' || usage.outcome === selectedOutcome;
    return matchesSearch && matchesProcedure && matchesOutcome;
  });

  const getOutcomeColor = (outcome: UsageOutcome) => {
    switch (outcome) {
      case 'Success': return 'bg-green-100 text-green-800';
      case 'Partial': return 'bg-orange-100 text-orange-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOutcomeIcon = (outcome: UsageOutcome) => {
    switch (outcome) {
      case 'Success': return <CheckCircle className="h-4 w-4" />;
      case 'Partial': return <Clock className="h-4 w-4" />;
      case 'Failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Usage Tracking</h2>
          <p className="text-gray-600">Track media usage in procedures and outcomes</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Record Usage
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
                  placeholder="Search usage records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedProcedure} onValueChange={(value) => setSelectedProcedure(value as ProcedureType | 'all')}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select procedure" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Procedures</SelectItem>
                {procedures.map(procedure => (
                  <SelectItem key={procedure} value={procedure}>{procedure}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedOutcome} onValueChange={(value) => setSelectedOutcome(value as UsageOutcome | 'all')}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Outcomes</SelectItem>
                {outcomes.map(outcome => (
                  <SelectItem key={outcome} value={outcome}>{outcome}</SelectItem>
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

      {/* Usage Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Records ({filteredUsage.length})</CardTitle>
          <CardDescription>Media usage tracking and outcome analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch Number</TableHead>
                <TableHead>Formula</TableHead>
                <TableHead>Procedure</TableHead>
                <TableHead>Procedure ID</TableHead>
                <TableHead>Used By</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Date Used</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsage.map((usage) => (
                <TableRow key={usage.id}>
                  <TableCell>
                    <div className="font-mono font-medium">{usage.batchNumber}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{usage.formulaName}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {usage.procedureType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-sm">{usage.procedureId}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4 text-gray-600" />
                      <span>{usage.technicianId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Droplets className="h-4 w-4 text-blue-600" />
                      <span>{usage.quantityUsed} {usage.unit}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">{usage.usedAt}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getOutcomeColor(usage.outcome)}>
                      <div className="flex items-center space-x-1">
                        {getOutcomeIcon(usage.outcome)}
                        <span>{usage.outcome}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{usage.notes}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageRecords.length}</div>
            <p className="text-xs text-muted-foreground">Records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round((usageRecords.filter(u => u.outcome === 'Success').length / usageRecords.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Successful outcomes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usageRecords.reduce((sum, u) => sum + u.quantityUsed, 0)} mL
            </div>
            <p className="text-xs text-muted-foreground">Used in procedures</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Used</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">IVF Medium v2.1</div>
            <p className="text-xs text-muted-foreground">Most popular formula</p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Analytics</CardTitle>
          <CardDescription>Performance analysis by procedure type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">IVF Procedures</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Usage:</span>
                  <span className="font-medium">2 records</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate:</span>
                  <span className="font-medium text-green-600">50%</span>
                </div>
                <div className="flex justify-between">
                  <span>Volume Used:</span>
                  <span className="font-medium">80 mL</span>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">ICSI Procedures</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Usage:</span>
                  <span className="font-medium">1 record</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate:</span>
                  <span className="font-medium text-orange-600">0%</span>
                </div>
                <div className="flex justify-between">
                  <span>Volume Used:</span>
                  <span className="font-medium">30 mL</span>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Embryo Culture</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Usage:</span>
                  <span className="font-medium">1 record</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate:</span>
                  <span className="font-medium text-green-600">100%</span>
                </div>
                <div className="flex justify-between">
                  <span>Volume Used:</span>
                  <span className="font-medium">100 mL</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaUsageTracker; 