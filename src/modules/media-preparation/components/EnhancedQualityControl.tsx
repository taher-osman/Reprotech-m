import React, { useState, useEffect } from 'react';
import { 
  TestTube, 
  CheckCircle, 
  AlertCircle,
  Target,
  Activity,
  TrendingUp,
  Camera,
  Microscope,
  Thermometer,
  Timer,
  Save,
  Send
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Textarea } from '../../../components/ui/Textarea';
import { Progress } from '../../../components/ui/Progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/Select';

interface QCTest {
  id: string;
  name: string;
  type: 'chemical' | 'physical' | 'biological' | 'microbiological';
  unit: string;
  targetMin: number;
  targetMax: number;
  measured?: number;
  status: 'pending' | 'in_progress' | 'passed' | 'failed' | 'out_of_range';
  method: string;
  duration: number; // minutes
  equipment: string[];
  criticalityLevel: 'low' | 'medium' | 'high' | 'critical';
  autoValidation: boolean;
  lastCalibration?: Date;
}

interface QCSession {
  batchId: string;
  batchNumber: string;
  formulaName: string;
  startTime: Date;
  technician: string;
  environmentalConditions: {
    temperature: number;
    humidity: number;
    pressure: number;
  };
  tests: QCTest[];
  overallStatus: 'pending' | 'in_progress' | 'passed' | 'failed' | 'requires_review';
  notes: string;
  images: string[];
  approver?: string;
  approvalTime?: Date;
}

const EnhancedQualityControl: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<QCSession | null>(null);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [realTimeReadings, setRealTimeReadings] = useState({
    ph: 7.35,
    osmolarity: 295,
    temperature: 22.5,
    conductivity: 15.2
  });

  // Initialize default QC tests
  const defaultTests: QCTest[] = [
    {
      id: 'ph-test',
      name: 'pH Measurement',
      type: 'chemical',
      unit: 'pH units',
      targetMin: 7.2,
      targetMax: 7.4,
      status: 'pending',
      method: 'Calibrated pH electrode',
      duration: 5,
      equipment: ['pH meter', 'Buffer solutions'],
      criticalityLevel: 'critical',
      autoValidation: true,
      lastCalibration: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: 'osmolarity-test',
      name: 'Osmolarity Test',
      type: 'physical',
      unit: 'mOsm/L',
      targetMin: 280,
      targetMax: 320,
      status: 'pending',
      method: 'Freezing point osmometer',
      duration: 10,
      equipment: ['Osmometer', 'Calibration standards'],
      criticalityLevel: 'critical',
      autoValidation: true,
      lastCalibration: new Date(Date.now() - 12 * 60 * 60 * 1000)
    },
    {
      id: 'sterility-test',
      name: 'Sterility Test',
      type: 'microbiological',
      unit: 'CFU/mL',
      targetMin: 0,
      targetMax: 0,
      status: 'pending',
      method: 'Membrane filtration',
      duration: 1440, // 24 hours
      equipment: ['Sterile filters', 'Culture media', 'Incubator'],
      criticalityLevel: 'critical',
      autoValidation: false
    },
    {
      id: 'clarity-test',
      name: 'Visual Clarity',
      type: 'physical',
      unit: 'NTU',
      targetMin: 0,
      targetMax: 5,
      status: 'pending',
      method: 'Nephelometric measurement',
      duration: 3,
      equipment: ['Turbidimeter', 'Reference standards'],
      criticalityLevel: 'high',
      autoValidation: true
    },
    {
      id: 'endotoxin-test',
      name: 'Endotoxin Level',
      type: 'biological',
      unit: 'EU/mL',
      targetMin: 0,
      targetMax: 0.25,
      status: 'pending',
      method: 'LAL kinetic assay',
      duration: 60,
      equipment: ['LAL reagents', 'Microplate reader'],
      criticalityLevel: 'critical',
      autoValidation: true
    },
    {
      id: 'protein-test',
      name: 'Protein Concentration',
      type: 'chemical',
      unit: 'mg/mL',
      targetMin: 2.8,
      targetMax: 3.2,
      status: 'pending',
      method: 'Bradford assay',
      duration: 15,
      equipment: ['Spectrophotometer', 'Bradford reagent'],
      criticalityLevel: 'medium',
      autoValidation: true
    }
  ];

  const availableBatches = [
    { id: 'MED-2025-0001', number: 'MED-2025-0001', formula: 'IVF Medium v2.1' },
    { id: 'MED-2025-0002', number: 'MED-2025-0002', formula: 'SOF-HEPES Buffer' },
    { id: 'MED-2025-0003', number: 'MED-2025-0003', formula: 'SCNT Activation Medium' }
  ];

  // Simulate real-time readings
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeReadings(prev => ({
        ph: prev.ph + (Math.random() - 0.5) * 0.02,
        osmolarity: prev.osmolarity + (Math.random() - 0.5) * 2,
        temperature: prev.temperature + (Math.random() - 0.5) * 0.1,
        conductivity: prev.conductivity + (Math.random() - 0.5) * 0.1
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const startQCSession = () => {
    if (!selectedBatch) return;
    
    const batch = availableBatches.find(b => b.id === selectedBatch);
    if (!batch) return;

    const session: QCSession = {
      batchId: selectedBatch,
      batchNumber: batch.number,
      formulaName: batch.formula,
      startTime: new Date(),
      technician: 'Current User',
      environmentalConditions: {
        temperature: realTimeReadings.temperature,
        humidity: 45,
        pressure: 1013.25
      },
      tests: [...defaultTests],
      overallStatus: 'in_progress',
      notes: '',
      images: []
    };

    setCurrentSession(session);
  };

  const updateTestResult = (testId: string, measured: number) => {
    if (!currentSession) return;

    const updatedTests = currentSession.tests.map(test => {
      if (test.id === testId) {
        let status: QCTest['status'];
        if (measured >= test.targetMin && measured <= test.targetMax) {
          status = 'passed';
        } else if (measured < test.targetMin * 0.9 || measured > test.targetMax * 1.1) {
          status = 'failed';
        } else {
          status = 'out_of_range';
        }

        return {
          ...test,
          measured,
          status
        };
      }
      return test;
    });

    // Update overall status
    const criticalFailed = updatedTests.some(t => 
      t.criticalityLevel === 'critical' && (t.status === 'failed' || t.status === 'out_of_range')
    );
    const anyFailed = updatedTests.some(t => t.status === 'failed');
    const allCompleted = updatedTests.every(t => t.status !== 'pending' && t.status !== 'in_progress');

    let overallStatus: QCSession['overallStatus'] = 'in_progress';
    if (allCompleted) {
      if (criticalFailed) {
        overallStatus = 'failed';
      } else if (anyFailed) {
        overallStatus = 'requires_review';
      } else {
        overallStatus = 'passed';
      }
    }

    setCurrentSession({
      ...currentSession,
      tests: updatedTests,
      overallStatus
    });
  };

  const autoFillFromRealTime = (testId: string) => {
    switch (testId) {
      case 'ph-test':
        updateTestResult(testId, realTimeReadings.ph);
        break;
      case 'osmolarity-test':
        updateTestResult(testId, realTimeReadings.osmolarity);
        break;
      default:
        break;
    }
  };

  const getTestStatusColor = (status: QCTest['status']) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'out_of_range': return 'bg-orange-100 text-orange-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCriticalityColor = (level: QCTest['criticalityLevel']) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const completedTests = currentSession?.tests.filter(t => 
    t.status === 'passed' || t.status === 'failed' || t.status === 'out_of_range'
  ).length || 0;
  
  const totalTests = currentSession?.tests.length || 0;
  const progress = totalTests > 0 ? (completedTests / totalTests) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <TestTube className="h-6 w-6 text-purple-600" />
            <span>Enhanced Quality Control</span>
          </h2>
          <p className="text-gray-600">Real-time testing and automated validation</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            ISO 17025 Compliant
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            GMP Validated
          </Badge>
        </div>
      </div>

      {!currentSession ? (
        /* Batch Selection */
        <Card>
          <CardHeader>
            <CardTitle>Start Quality Control Session</CardTitle>
            <CardDescription>Select a batch to begin QC testing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="batch">Select Batch</Label>
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a batch for testing" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBatches.map(batch => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.number} - {batch.formula}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={startQCSession}
                disabled={!selectedBatch}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <TestTube className="h-4 w-4 mr-2" />
                Start QC Session
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Session Overview */}
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">QC Session: {currentSession.batchNumber}</CardTitle>
                  <CardDescription className="text-lg">
                    {currentSession.formulaName} | Started: {currentSession.startTime.toLocaleTimeString()}
                  </CardDescription>
                </div>
                <Badge 
                  className={
                    currentSession.overallStatus === 'passed' ? 'bg-green-100 text-green-800' :
                    currentSession.overallStatus === 'failed' ? 'bg-red-100 text-red-800' :
                    currentSession.overallStatus === 'requires_review' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }
                >
                  {currentSession.overallStatus.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{completedTests}</div>
                  <div className="text-sm text-gray-600">Tests Completed</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</div>
                  <div className="text-sm text-gray-600">Progress</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {currentSession.environmentalConditions.temperature.toFixed(1)}°C
                  </div>
                  <div className="text-sm text-gray-600">Lab Temperature</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {currentSession.environmentalConditions.humidity}%
                  </div>
                  <div className="text-sm text-gray-600">Humidity</div>
                </div>
              </div>
              <Progress value={progress} className="h-3" />
            </CardContent>
          </Card>

          {/* Real-time Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-600" />
                <span>Real-time Monitoring</span>
              </CardTitle>
              <CardDescription>Live readings from connected instruments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">pH Level</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {realTimeReadings.ph.toFixed(2)}
                      </div>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Target: 7.2-7.4</div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Osmolarity</div>
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(realTimeReadings.osmolarity)}
                      </div>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">mOsm/L</div>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Temperature</div>
                      <div className="text-2xl font-bold text-orange-600">
                        {realTimeReadings.temperature.toFixed(1)}°C
                      </div>
                    </div>
                    <Thermometer className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Ambient</div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Conductivity</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {realTimeReadings.conductivity.toFixed(1)}
                      </div>
                    </div>
                    <Activity className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">mS/cm</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Quality Control Tests</CardTitle>
              <CardDescription>Individual test results and validation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentSession.tests.map((test) => (
                  <div key={test.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getCriticalityColor(test.criticalityLevel)}`} />
                        <div>
                          <div className="font-semibold">{test.name}</div>
                          <div className="text-sm text-gray-600">{test.method}</div>
                        </div>
                      </div>
                      <Badge className={getTestStatusColor(test.status)}>
                        {test.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor={`${test.id}-result`}>Measured Value</Label>
                        <div className="flex space-x-2">
                          <Input
                            id={`${test.id}-result`}
                            type="number"
                            step="0.01"
                            value={test.measured || ''}
                            onChange={(e) => updateTestResult(test.id, parseFloat(e.target.value))}
                            placeholder={`Enter ${test.unit}`}
                          />
                          {test.autoValidation && (test.id === 'ph-test' || test.id === 'osmolarity-test') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => autoFillFromRealTime(test.id)}
                            >
                              Auto
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Target Range</Label>
                        <div className="text-sm font-medium">
                          {test.targetMin} - {test.targetMax} {test.unit}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Duration</Label>
                        <div className="text-sm font-medium">
                          {test.duration < 60 ? `${test.duration} min` : `${Math.round(test.duration / 60)} hrs`}
                        </div>
                      </div>
                      
                      <div>
                        <Label>Equipment</Label>
                        <div className="text-sm">
                          {test.equipment[0]}
                          {test.equipment.length > 1 && ` +${test.equipment.length - 1} more`}
                        </div>
                      </div>
                    </div>
                    
                    {test.measured !== undefined && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <div className="text-sm">
                          <span className="font-medium">Result: </span>
                          <span className={
                            test.status === 'passed' ? 'text-green-600' :
                            test.status === 'failed' ? 'text-red-600' :
                            'text-orange-600'
                          }>
                            {test.measured} {test.unit}
                            {test.status === 'passed' && ' ✓ Within specifications'}
                            {test.status === 'failed' && ' ✗ Failed specifications'}
                            {test.status === 'out_of_range' && ' ⚠ Out of range but acceptable'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Session Notes and Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Notes</CardTitle>
                <CardDescription>Record observations and comments</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={currentSession.notes}
                  onChange={(e) => setCurrentSession({...currentSession, notes: e.target.value})}
                  placeholder="Add any observations, deviations, or notes about this QC session..."
                  className="h-32"
                />
                <div className="flex space-x-2 mt-3">
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Add Photo
                  </Button>
                  <Button variant="outline" size="sm">
                    <Microscope className="h-4 w-4 mr-2" />
                    Microscopy
                  </Button>
                  <Button variant="outline" size="sm">
                    <Timer className="h-4 w-4 mr-2" />
                    Set Timer
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Actions</CardTitle>
                <CardDescription>Save results and finalize QC</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Progress
                  </Button>
                  
                  {currentSession.overallStatus === 'passed' && (
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve & Release Batch
                    </Button>
                  )}
                  
                  {currentSession.overallStatus === 'failed' && (
                    <Button variant="destructive" className="w-full">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Reject Batch
                    </Button>
                  )}
                  
                  {currentSession.overallStatus === 'requires_review' && (
                    <Button variant="outline" className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Send for Review
                    </Button>
                  )}
                  
                  <div className="text-xs text-gray-500 text-center">
                    Results will be automatically recorded in batch history
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default EnhancedQualityControl; 