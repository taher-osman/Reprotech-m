import React, { useState, useEffect } from 'react';
import { 
  X, 
  Zap, 
  FlaskConical, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Target, 
  Microscope,
  Calendar,
  Star,
  Plus,
  Minus,
  Save,
  ArrowRight,
  Package,
  Database,
  Activity,
  TrendingUp
} from 'lucide-react';
import { 
  FertilizationSession, 
  EmbryoGenerationData, 
  GeneratedEmbryo,
  EmbryoDevelopmentStage,
  EMBRYO_DEVELOPMENT_STAGES,
  DEVELOPMENT_STAGES_ORDER
} from '../types/fertilizationTypes';

interface EmbryoGenerationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  session: FertilizationSession;
  onGenerate: (sessionId: string, data: EmbryoGenerationData) => Promise<void>;
}

interface EmbryoData {
  parentOocyteId: string;
  parentSemenId?: string;
  parentFibroblastId?: string;
  quality: number;
  morphologyGrade: string;
  cellCount: number;
  developmentStage: EmbryoDevelopmentStage;
  notes?: string;
}

const EmbryoGenerationPanel: React.FC<EmbryoGenerationPanelProps> = ({
  isOpen,
  onClose,
  session,
  onGenerate
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [embryos, setEmbryos] = useState<EmbryoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [generationStep, setGenerationStep] = useState(1);

  useEffect(() => {
    if (isOpen && session) {
      initializeEmbryos();
    }
  }, [isOpen, session]);

  const initializeEmbryos = () => {
    // Initialize embryos based on selected oocytes and development tracking results
    const initialEmbryos: EmbryoData[] = session.selectedOocytes.map((oocyte, index) => ({
      parentOocyteId: oocyte.sampleId,
      parentSemenId: session.selectedSemen?.[0]?.sampleId,
      parentFibroblastId: session.selectedFibroblasts?.[0]?.sampleId,
      quality: oocyte.qualityScore || 7,
      morphologyGrade: session.blastocystGrade || 'BB',
      cellCount: getDevelopmentCellCount(session.blastocystStage ? 'Blastocyst' : 'Cleavage'),
      developmentStage: session.blastocystStage ? 'Blastocyst' : 'Cleavage',
      notes: `Embryo ${index + 1} from ${oocyte.animalName}`
    }));
    setEmbryos(initialEmbryos);
  };

  const getDevelopmentCellCount = (stage: EmbryoDevelopmentStage): number => {
    const cellCounts = {
      'Fertilized': 2,
      'Cleavage': 8,
      'Morula': 32,
      'Early Blastocyst': 64,
      'Blastocyst': 128,
      'Hatched Blastocyst': 150,
      'Arrested': 0
    };
    return cellCounts[stage] || 8;
  };

  const updateEmbryo = (index: number, field: keyof EmbryoData, value: any) => {
    setEmbryos(prev => prev.map((embryo, i) => 
      i === index ? { ...embryo, [field]: value } : embryo
    ));
  };

  const addEmbryo = () => {
    const newEmbryo: EmbryoData = {
      parentOocyteId: session.selectedOocytes[0]?.sampleId || '',
      parentSemenId: session.selectedSemen?.[0]?.sampleId,
      parentFibroblastId: session.selectedFibroblasts?.[0]?.sampleId,
      quality: 7,
      morphologyGrade: 'BB',
      cellCount: 8,
      developmentStage: 'Cleavage',
      notes: `Additional embryo ${embryos.length + 1}`
    };
    setEmbryos(prev => [...prev, newEmbryo]);
  };

  const removeEmbryo = (index: number) => {
    setEmbryos(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (embryos.length === 0) return;

    setLoading(true);
    try {
      const generationData: EmbryoGenerationData = {
        sessionId: session.id,
        embryos: embryos
      };

      await onGenerate(session.id, generationData);
      setGenerationStep(4); // Success step
    } catch (error) {
      console.error('Error generating embryos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 9) return 'text-green-600 bg-green-100';
    if (quality >= 7) return 'text-blue-600 bg-blue-100';
    if (quality >= 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStageOrder = (stage: EmbryoDevelopmentStage) => DEVELOPMENT_STAGES_ORDER[stage] || 0;

  if (!isOpen) return null;

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Session Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Session Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{session.selectedOocytes.length}</div>
            <div className="text-sm text-blue-700">Oocytes Used</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{session.targetEmbryoCount}</div>
            <div className="text-sm text-green-700">Target Embryos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{session.cleavageObserved ? '✓' : '?'}</div>
            <div className="text-sm text-purple-700">Cleavage Observed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{session.blastocystStage ? session.blastocystGrade : 'N/A'}</div>
            <div className="text-sm text-orange-700">Blastocyst Grade</div>
          </div>
        </div>
      </div>

      {/* Development Results */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Activity className="h-5 w-5 text-green-600 mr-2" />
          Development Tracking Results
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Cleavage Status</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              session.cleavageObserved ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {session.cleavageObserved ? `Observed on ${session.cleavageDate}` : 'Not Observed'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Blastocyst Development</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              session.blastocystStage ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
            }`}>
              {session.blastocystStage ? `${session.blastocystDay} - Grade ${session.blastocystGrade}` : 'Not Reached'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600">Success Prediction</span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {session.blastocystStage ? 'High (85-92%)' : session.cleavageObserved ? 'Moderate (60-75%)' : 'Low (30-45%)'}
            </span>
          </div>
        </div>
      </div>

      {/* Generation Steps */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="h-5 w-5 text-indigo-600 mr-2" />
          Embryo Generation Process
        </h3>
        <div className="space-y-3">
          {[
            { step: 1, title: 'Review & Configure', desc: 'Set embryo parameters and quality grades', active: generationStep === 1 },
            { step: 2, title: 'Generate Records', desc: 'Create embryo database entries', active: generationStep === 2 },
            { step: 3, title: 'Sample Integration', desc: 'Create samples in Sample Management', active: generationStep === 3 },
            { step: 4, title: 'Complete', desc: 'Update statuses and enable transfers', active: generationStep === 4 }
          ].map((item, index) => (
            <div key={index} className={`flex items-center p-3 rounded-lg ${
              item.active ? 'bg-indigo-50 border border-indigo-200' : 
              generationStep > item.step ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                item.active ? 'bg-indigo-600 text-white' :
                generationStep > item.step ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'
              }`}>
                {generationStep > item.step ? <CheckCircle className="h-4 w-4" /> : item.step}
              </div>
              <div className="ml-3">
                <div className="font-medium text-gray-900">{item.title}</div>
                <div className="text-sm text-gray-600">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderConfiguration = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Configure Embryos</h3>
        <button
          onClick={addEmbryo}
          className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 flex items-center space-x-1 text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Embryo</span>
        </button>
      </div>

      {/* Embryo Configuration */}
      <div className="space-y-4">
        {embryos.map((embryo, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Embryo {index + 1}</h4>
              {embryos.length > 1 && (
                <button
                  onClick={() => removeEmbryo(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Minus className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Quality Score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quality Score
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={embryo.quality}
                    onChange={(e) => updateEmbryo(index, 'quality', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getQualityColor(embryo.quality)}`}>
                    {embryo.quality}/10
                  </span>
                </div>
              </div>

              {/* Morphology Grade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Morphology Grade
                </label>
                <select
                  value={embryo.morphologyGrade}
                  onChange={(e) => updateEmbryo(index, 'morphologyGrade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="AA">AA - Excellent</option>
                  <option value="AB">AB - Good</option>
                  <option value="BA">BA - Good</option>
                  <option value="BB">BB - Fair</option>
                  <option value="BC">BC - Poor</option>
                  <option value="CB">CB - Poor</option>
                  <option value="CC">CC - Very Poor</option>
                </select>
              </div>

              {/* Development Stage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Development Stage
                </label>
                <select
                  value={embryo.developmentStage}
                  onChange={(e) => {
                    const stage = e.target.value as EmbryoDevelopmentStage;
                    updateEmbryo(index, 'developmentStage', stage);
                    updateEmbryo(index, 'cellCount', getDevelopmentCellCount(stage));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {EMBRYO_DEVELOPMENT_STAGES.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              {/* Cell Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cell Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={embryo.cellCount}
                  onChange={(e) => updateEmbryo(index, 'cellCount', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={embryo.notes || ''}
                  onChange={(e) => updateEmbryo(index, 'notes', e.target.value)}
                  placeholder="Optional notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <h4 className="font-medium text-indigo-900 mb-2">Generation Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-indigo-700">Total Embryos:</span>
            <span className="ml-2 font-semibold text-indigo-900">{embryos.length}</span>
          </div>
          <div>
            <span className="text-indigo-700">Avg Quality:</span>
            <span className="ml-2 font-semibold text-indigo-900">
              {embryos.length > 0 ? (embryos.reduce((sum, e) => sum + e.quality, 0) / embryos.length).toFixed(1) : 0}/10
            </span>
          </div>
          <div>
            <span className="text-indigo-700">High Grade:</span>
            <span className="ml-2 font-semibold text-indigo-900">
              {embryos.filter(e => ['AA', 'AB', 'BA'].includes(e.morphologyGrade)).length}
            </span>
          </div>
          <div>
            <span className="text-indigo-700">Advanced Stage:</span>
            <span className="ml-2 font-semibold text-indigo-900">
              {embryos.filter(e => getStageOrder(e.developmentStage) >= 4).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGeneration = () => (
    <div className="space-y-6">
      {/* Generation Progress */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : generationStep === 4 ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <Zap className="h-8 w-8 text-blue-600" />
            )}
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {loading ? 'Generating Embryos...' : 
             generationStep === 4 ? 'Generation Complete!' : 
             'Ready to Generate'}
          </h3>
          
          <p className="text-gray-600 mb-6">
            {loading ? 'Creating embryo records and integrating with Sample Management' :
             generationStep === 4 ? 'All embryos have been successfully generated and integrated' :
             `Generate ${embryos.length} embryo${embryos.length !== 1 ? 's' : ''} from this fertilization session`}
          </p>

          {!loading && generationStep !== 4 && (
            <button
              onClick={handleGenerate}
              disabled={embryos.length === 0}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center space-x-2 mx-auto"
            >
              <Zap className="h-5 w-5" />
              <span>Generate Embryos</span>
            </button>
          )}
        </div>
      </div>

      {/* Integration Status */}
      {(loading || generationStep === 4) && (
        <div className="space-y-4">
          <div className={`border rounded-lg p-4 ${
            generationStep >= 2 ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                generationStep >= 2 ? 'bg-green-600' : 'bg-gray-400'
              }`}>
                {generationStep >= 2 ? <CheckCircle className="h-4 w-4 text-white" /> : <Database className="h-4 w-4 text-white" />}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Embryo Database Records</h4>
                <p className="text-sm text-gray-600">Creating embryo entries with development tracking data</p>
              </div>
            </div>
          </div>

          <div className={`border rounded-lg p-4 ${
            generationStep >= 3 ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                generationStep >= 3 ? 'bg-green-600' : 'bg-gray-400'
              }`}>
                {generationStep >= 3 ? <CheckCircle className="h-4 w-4 text-white" /> : <Package className="h-4 w-4 text-white" />}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Sample Management Integration</h4>
                <p className="text-sm text-gray-600">Creating embryo samples and updating parent sample statuses</p>
              </div>
            </div>
          </div>

          <div className={`border rounded-lg p-4 ${
            generationStep >= 4 ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                generationStep >= 4 ? 'bg-green-600' : 'bg-gray-400'
              }`}>
                {generationStep >= 4 ? <CheckCircle className="h-4 w-4 text-white" /> : <ArrowRight className="h-4 w-4 text-white" />}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Workflow Integration</h4>
                <p className="text-sm text-gray-600">Ready for embryo transfer or cryopreservation workflows</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Actions */}
      {generationStep === 4 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-3 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Next Steps Available
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button className="flex items-center justify-center p-3 border border-green-300 rounded-lg hover:bg-green-100 text-green-700">
              <ArrowRight className="h-4 w-4 mr-2" />
              Transfer Embryos
            </button>
            <button className="flex items-center justify-center p-3 border border-green-300 rounded-lg hover:bg-green-100 text-green-700">
              <Package className="h-4 w-4 mr-2" />
              Cryopreservation
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Phase 4: Embryo Generation</h2>
                <p className="text-sm text-gray-600">Generate embryo samples for {session.sessionId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'configure', label: 'Configure', icon: Microscope },
                { id: 'generate', label: 'Generate', icon: Zap }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'configure' && renderConfiguration()}
          {activeTab === 'generate' && renderGeneration()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {activeTab === 'overview' && 'Review session results and development tracking data'}
              {activeTab === 'configure' && `${embryos.length} embryo${embryos.length !== 1 ? 's' : ''} configured`}
              {activeTab === 'generate' && (generationStep === 4 ? 'Generation completed successfully' : 'Ready to generate embryos')}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                {generationStep === 4 ? 'Close' : 'Cancel'}
              </button>
              {activeTab !== 'generate' && (
                <button
                  onClick={() => setActiveTab(activeTab === 'overview' ? 'configure' : 'generate')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <span>{activeTab === 'overview' ? 'Configure' : 'Generate'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbryoGenerationPanel; 