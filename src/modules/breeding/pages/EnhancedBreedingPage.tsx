import React, { useState, useEffect } from 'react';
import { Heart, Plus, Search, Filter, Edit, Trash2, Eye, Calendar, AlertTriangle, Clock, RefreshCw, CheckCircle, XCircle, Activity, Brain, TrendingUp, Target, Zap, Users, BarChart3 } from 'lucide-react';

interface BreedingRecord {
  id: string;
  breedingID: string;
  donorId: string;
  donorName: string;
  bullId: string;
  bullName: string;
  breedingDate: string;
  breedingTime: string;
  method: 'NATURAL' | 'AI' | 'IVF_SEMEN' | 'EMBRYO_TRANSFER';
  operator: string;
  status: 'COMPLETED' | 'FAILED' | 'INCOMPLETE' | 'SCHEDULED' | 'PREDICTED';
  attemptNumber: number;
  expectedFlushDate: string;
  quality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  notes: string;
  failureReason?: string;
  geneticCompatibility: number;
  estrusStage: 'PROESTRUS' | 'ESTRUS' | 'METESTRUS' | 'DIESTRUS';
  predictedSuccess: number;
  aiScheduleId?: string;
  createdAt: string;
  updatedAt: string;
}

interface Animal {
  id: string;
  name: string;
  internalNumber: string;
  species: string;
  sex: 'MALE' | 'FEMALE';
  geneticProfile?: string;
  lastEstrus?: string;
  cycleLength?: number;
}

interface AISchedule {
  id: string;
  animalId: string;
  animalName: string;
  predictedEstrus: string;
  optimalBreedingWindow: { start: string; end: string };
  recommendedBull: string;
  geneticCompatibility: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'SCHEDULED' | 'COMPLETED' | 'MISSED';
}

interface GeneticAnalysis {
  compatibility: number;
  inbreedingRisk: number;
  expectedTraits: string[];
  recommendations: string[];
}

export const EnhancedBreedingPage: React.FC = () => {
  const [records, setRecords] = useState<BreedingRecord[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [aiSchedules, setAiSchedules] = useState<AISchedule[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'records' | 'ai-schedule' | 'genetics' | 'analytics'>('dashboard');
  const [selectedPair, setSelectedPair] = useState<{donor: string, bull: string} | null>(null);
  const [geneticAnalysis, setGeneticAnalysis] = useState<GeneticAnalysis | null>(null);

  // Enhanced sample data with AI and genetic features
  useEffect(() => {
    const sampleAnimals: Animal[] = [
      { id: '1', name: 'Bella', internalNumber: 'C001', species: 'CAMEL', sex: 'FEMALE', geneticProfile: 'AA-BB-CC', lastEstrus: '2025-08-10', cycleLength: 21 },
      { id: '2', name: 'Luna', internalNumber: 'C002', species: 'CAMEL', sex: 'FEMALE', geneticProfile: 'AA-BC-CD', lastEstrus: '2025-08-12', cycleLength: 20 },
      { id: '3', name: 'Star', internalNumber: 'C003', species: 'CAMEL', sex: 'FEMALE', geneticProfile: 'AB-BB-DD', lastEstrus: '2025-08-08', cycleLength: 22 },
      { id: '4', name: 'Thunder', internalNumber: 'B001', species: 'BOVINE', sex: 'MALE', geneticProfile: 'AA-BB-CC' },
      { id: '5', name: 'Storm', internalNumber: 'B002', species: 'BOVINE', sex: 'MALE', geneticProfile: 'AB-BC-CD' },
      { id: '6', name: 'King', internalNumber: 'C004', species: 'CAMEL', sex: 'MALE', geneticProfile: 'BB-CC-DD' },
    ];

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    const sampleAISchedules: AISchedule[] = [
      {
        id: '1',
        animalId: '1',
        animalName: 'Bella',
        predictedEstrus: tomorrow.toISOString().split('T')[0],
        optimalBreedingWindow: { 
          start: tomorrow.toISOString().split('T')[0], 
          end: dayAfter.toISOString().split('T')[0] 
        },
        recommendedBull: 'King',
        geneticCompatibility: 92,
        priority: 'HIGH',
        status: 'PENDING'
      },
      {
        id: '2',
        animalId: '2',
        animalName: 'Luna',
        predictedEstrus: dayAfter.toISOString().split('T')[0],
        optimalBreedingWindow: { 
          start: dayAfter.toISOString().split('T')[0], 
          end: new Date(dayAfter.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
        },
        recommendedBull: 'Storm',
        geneticCompatibility: 88,
        priority: 'MEDIUM',
        status: 'PENDING'
      }
    ];

    const sampleRecords: BreedingRecord[] = [
      {
        id: '1',
        breedingID: 'BR-2025-001',
        donorId: '1',
        donorName: 'Bella',
        bullId: '6',
        bullName: 'King',
        breedingDate: today.toISOString().split('T')[0],
        breedingTime: '09:30',
        method: 'AI',
        operator: 'Dr. Smith',
        status: 'COMPLETED',
        attemptNumber: 1,
        expectedFlushDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quality: 'EXCELLENT',
        notes: 'AI performed during optimal estrus window',
        geneticCompatibility: 92,
        estrusStage: 'ESTRUS',
        predictedSuccess: 85,
        aiScheduleId: '1',
        createdAt: today.toISOString(),
        updatedAt: today.toISOString()
      },
      {
        id: '2',
        breedingID: 'BR-2025-002',
        donorId: '2',
        donorName: 'Luna',
        bullId: '5',
        bullName: 'Storm',
        breedingDate: tomorrow.toISOString().split('T')[0],
        breedingTime: '10:00',
        method: 'AI',
        operator: 'Dr. Johnson',
        status: 'SCHEDULED',
        attemptNumber: 1,
        expectedFlushDate: new Date(tomorrow.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quality: 'GOOD',
        notes: 'Scheduled based on AI prediction model',
        geneticCompatibility: 88,
        estrusStage: 'PROESTRUS',
        predictedSuccess: 78,
        aiScheduleId: '2',
        createdAt: today.toISOString(),
        updatedAt: today.toISOString()
      }
    ];

    setAnimals(sampleAnimals);
    setRecords(sampleRecords);
    setAiSchedules(sampleAISchedules);
    setIsLoading(false);
  }, []);

  const calculateGeneticCompatibility = (donorProfile: string, bullProfile: string): GeneticAnalysis => {
    // Simplified genetic compatibility calculation
    const donorGenes = donorProfile.split('-');
    const bullGenes = bullProfile.split('-');
    
    let compatibility = 0;
    let inbreedingRisk = 0;
    const expectedTraits = [];
    const recommendations = [];

    for (let i = 0; i < donorGenes.length; i++) {
      if (donorGenes[i] !== bullGenes[i]) {
        compatibility += 30;
        expectedTraits.push(`Diverse trait ${i + 1}`);
      } else {
        inbreedingRisk += 25;
        recommendations.push(`Monitor trait ${i + 1} for inbreeding`);
      }
    }

    if (compatibility > 80) {
      recommendations.push('Excellent genetic match - proceed with breeding');
    } else if (compatibility > 60) {
      recommendations.push('Good genetic match - suitable for breeding');
    } else {
      recommendations.push('Consider alternative bull for better genetic diversity');
    }

    return {
      compatibility: Math.min(compatibility, 100),
      inbreedingRisk: Math.min(inbreedingRisk, 100),
      expectedTraits,
      recommendations
    };
  };

  const predictEstrus = (animal: Animal): string => {
    if (!animal.lastEstrus || !animal.cycleLength) return 'Unknown';
    
    const lastEstrus = new Date(animal.lastEstrus);
    const nextEstrus = new Date(lastEstrus);
    nextEstrus.setDate(nextEstrus.getDate() + animal.cycleLength);
    
    return nextEstrus.toISOString().split('T')[0];
  };

  const getSuccessRate = (): number => {
    const completed = records.filter(r => r.status === 'COMPLETED').length;
    const total = records.filter(r => r.status !== 'SCHEDULED' && r.status !== 'PREDICTED').length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'FAILED': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'INCOMPLETE': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'SCHEDULED': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'PREDICTED': return <Brain className="h-4 w-4 text-purple-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'INCOMPLETE': return 'bg-yellow-100 text-yellow-800';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'PREDICTED': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-700 rounded-lg p-6 text-white mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Advanced Breeding Management</h1>
            <p className="text-pink-100 mb-4">AI-powered breeding optimization with genetic compatibility analysis</p>
            <div className="flex gap-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">AI Scheduling</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Genetic Analysis</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Success Prediction</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">Aug 16, 02:44 PM</div>
            <div className="text-pink-200">Breeding Status: Operational</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Heart },
          { id: 'records', label: 'Breeding Records', icon: Activity },
          { id: 'ai-schedule', label: 'AI Scheduling', icon: Brain },
          { id: 'genetics', label: 'Genetic Analysis', icon: Target },
          { id: 'analytics', label: 'Success Analytics', icon: BarChart3 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-pink-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Breedings</p>
                  <p className="text-3xl font-bold text-blue-900">{records.length}</p>
                  <p className="text-blue-600 text-sm">This month</p>
                </div>
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Success Rate</p>
                  <p className="text-3xl font-bold text-green-900">{getSuccessRate()}%</p>
                  <p className="text-green-600 text-sm">AI optimized</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">AI Predictions</p>
                  <p className="text-3xl font-bold text-purple-900">{aiSchedules.length}</p>
                  <p className="text-purple-600 text-sm">Pending schedules</p>
                </div>
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Avg Compatibility</p>
                  <p className="text-3xl font-bold text-orange-900">90%</p>
                  <p className="text-orange-600 text-sm">Genetic match</p>
                </div>
                <Target className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Breeding Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Schedule AI</div>
                  <div className="text-sm text-gray-600">Plan breeding event</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition-colors">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Brain className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">AI Prediction</div>
                  <div className="text-sm text-gray-600">Predict estrus cycle</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-400 transition-colors">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Genetic Match</div>
                  <div className="text-sm text-gray-600">Analyze compatibility</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 transition-colors">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Success Report</div>
                  <div className="text-sm text-gray-600">Generate analytics</div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Breeding Activity */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Recent Breeding Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">AI breeding completed for Bella (C001)</div>
                  <div className="text-sm text-gray-600">Dr. Smith • Aug 16, 09:30 AM • 92% genetic compatibility</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Brain className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">AI prediction: Luna entering estrus tomorrow</div>
                  <div className="text-sm text-gray-600">System • Aug 16, 02:00 PM • Optimal breeding window identified</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">AI breeding scheduled for Luna (C002)</div>
                  <div className="text-sm text-gray-600">Dr. Johnson • Aug 17, 10:00 AM • 88% genetic compatibility</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Scheduling Tab */}
      {activeTab === 'ai-schedule' && (
        <div className="space-y-6">
          {/* AI Schedule Controls */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search AI schedules..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                <option>All Priorities</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Generate AI Schedule
            </button>
          </div>

          {/* AI Schedules Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted Estrus</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Optimal Window</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommended Bull</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compatibility</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {aiSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{schedule.animalName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.predictedEstrus}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {schedule.optimalBreedingWindow.start} - {schedule.optimalBreedingWindow.end}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.recommendedBull}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${schedule.geneticCompatibility}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{schedule.geneticCompatibility}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(schedule.priority)}`}>
                        {schedule.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(schedule.status)}`}>
                        {schedule.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-pink-600 hover:text-pink-900 mr-3">Schedule</button>
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Genetic Analysis Tab */}
      {activeTab === 'genetics' && (
        <div className="space-y-6">
          {/* Genetic Compatibility Analyzer */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Genetic Compatibility Analyzer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Donor</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  onChange={(e) => setSelectedPair(prev => ({ ...prev, donor: e.target.value }))}
                >
                  <option value="">Choose donor...</option>
                  {animals.filter(a => a.sex === 'FEMALE').map(animal => (
                    <option key={animal.id} value={animal.id}>
                      {animal.name} ({animal.internalNumber}) - {animal.geneticProfile}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Bull</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  onChange={(e) => setSelectedPair(prev => ({ ...prev, bull: e.target.value }))}
                >
                  <option value="">Choose bull...</option>
                  {animals.filter(a => a.sex === 'MALE').map(animal => (
                    <option key={animal.id} value={animal.id}>
                      {animal.name} ({animal.internalNumber}) - {animal.geneticProfile}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button 
              className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
              onClick={() => {
                if (selectedPair?.donor && selectedPair?.bull) {
                  const donor = animals.find(a => a.id === selectedPair.donor);
                  const bull = animals.find(a => a.id === selectedPair.bull);
                  if (donor?.geneticProfile && bull?.geneticProfile) {
                    setGeneticAnalysis(calculateGeneticCompatibility(donor.geneticProfile, bull.geneticProfile));
                  }
                }
              }}
            >
              Analyze Compatibility
            </button>
          </div>

          {/* Genetic Analysis Results */}
          {geneticAnalysis && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Genetic Analysis Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Genetic Compatibility</span>
                      <span className="text-sm font-bold text-green-600">{geneticAnalysis.compatibility}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${geneticAnalysis.compatibility}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Inbreeding Risk</span>
                      <span className="text-sm font-bold text-red-600">{geneticAnalysis.inbreedingRisk}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${geneticAnalysis.inbreedingRisk}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Expected Traits</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {geneticAnalysis.expectedTraits.map((trait, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-600 mr-2" />
                          {trait}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {geneticAnalysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-center">
                          <Target className="w-3 h-3 text-blue-600 mr-2" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Success Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Success Rate Trends</h3>
              <div className="text-3xl font-bold text-green-600 mb-2">{getSuccessRate()}%</div>
              <div className="text-sm text-gray-600">Overall success rate</div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>AI Method</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Natural</span>
                  <span>72%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Genetic Impact</h3>
              <div className="text-3xl font-bold text-purple-600 mb-2">90%</div>
              <div className="text-sm text-gray-600">Avg compatibility</div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>High compatibility (&gt;80%)</span>
                  <span className="font-medium text-green-600">75%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Medium compatibility (60-80%)</span>
                  <span className="font-medium text-yellow-600">20%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Low compatibility (&lt;60%)</span>
                  <span className="font-medium text-red-600">5%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">AI Predictions</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">92%</div>
              <div className="text-sm text-gray-600">Prediction accuracy</div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Estrus predictions</span>
                  <span className="font-medium text-blue-600">94%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Success predictions</span>
                  <span className="font-medium text-purple-600">90%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Timing optimization</span>
                  <span className="font-medium text-green-600">88%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Performance Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Top Performing Bulls</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">King (C004)</div>
                      <div className="text-sm text-gray-600">3 successful breedings</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">100%</div>
                      <div className="text-xs text-gray-500">Success rate</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Storm (B002)</div>
                      <div className="text-sm text-gray-600">2 successful breedings</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">85%</div>
                      <div className="text-xs text-gray-500">Success rate</div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Optimization Recommendations</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900">AI Timing Optimization</div>
                      <div className="text-sm text-blue-700">Schedule breedings 12-18 hours after estrus detection for optimal results</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <Target className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-900">Genetic Diversity</div>
                      <div className="text-sm text-green-700">Maintain genetic compatibility above 80% for best success rates</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedBreedingPage;

