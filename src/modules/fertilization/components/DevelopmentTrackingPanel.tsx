import React, { useState, useEffect } from 'react';
import { Clock, FlaskConical, CheckCircle, AlertCircle, Calendar, Eye, Save, TrendingUp, Award, Timer, X } from 'lucide-react';
import { fertilizationApi } from '../services/fertilizationApi';
import { FertilizationSession, DevelopmentTrackingData } from '../types/fertilizationTypes';
import { formatDate } from '../utils/fertilizationUtils';

interface DevelopmentTrackingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  session: FertilizationSession;
  onUpdate: (sessionId: string, data: DevelopmentTrackingData) => Promise<void>;
}

const DevelopmentTrackingPanel: React.FC<DevelopmentTrackingPanelProps> = ({
  isOpen,
  onClose,
  session,
  onUpdate
}) => {
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'cleavage' | 'blastocyst' | 'quality'>('overview');
  
  // Development tracking form state
  const [trackingData, setTrackingData] = useState<Partial<DevelopmentTrackingData>>({
    sessionId: session.id,
    cleavageObserved: session.cleavageObserved || false,
    cleavageDate: session.cleavageDate || '',
    blastocystStage: session.blastocystStage || false,
    blastocystDay: session.blastocystDay || '',
    blastocystGrade: session.blastocystGrade || '',
    failureReason: session.failureReason || '',
    qualityNotes: session.notes || ''
  });

  const handleSaveTracking = async () => {
    try {
      setSaving(true);
      await onUpdate(session.id, trackingData as DevelopmentTrackingData);
      onClose();
    } catch (error) {
      console.error('Error updating development tracking:', error);
    } finally {
      setSaving(false);
    }
  };

  const getDevelopmentProgress = () => {
    let progress = 0;
    if (session.selectedOocytes.length > 0) progress += 25;
    if (trackingData.cleavageObserved) progress += 25;
    if (trackingData.blastocystStage) progress += 25;
    if (session.actualEmbryoCount && session.actualEmbryoCount > 0) progress += 25;
    return progress;
  };

  const getTimelineSteps = () => {
    const steps = [
      {
        title: 'Fertilization Initiated',
        date: session.fertilizationDate,
        status: 'completed' as const,
        icon: FlaskConical,
        description: `${session.fertilizationType} procedure started`
      }
    ];

    if (trackingData.cleavageObserved && trackingData.cleavageDate) {
      steps.push({
        title: 'Cleavage Observed',
        date: trackingData.cleavageDate,
        status: 'completed' as const,
        icon: CheckCircle,
        description: 'Cell division confirmed'
      });
    }

    if (trackingData.blastocystStage && trackingData.blastocystDay) {
      steps.push({
        title: 'Blastocyst Development',
        date: trackingData.blastocystDay,
        status: 'completed' as const,
        icon: Award,
        description: `Grade ${trackingData.blastocystGrade || 'N/A'} blastocyst formed`
      });
    }

    // Add expected next step
    if (!trackingData.cleavageObserved) {
      steps.push({
        title: 'Expected Cleavage Check',
        date: new Date(new Date(session.fertilizationDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pending' as const,
        icon: Eye,
        description: 'Check for cell division'
      });
    } else if (!trackingData.blastocystStage) {
      steps.push({
        title: 'Expected Blastocyst Check',
        date: new Date(new Date(session.fertilizationDate).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pending' as const,
        icon: Timer,
        description: 'Monitor blastocyst formation'
      });
    }

    return steps;
  };

  if (!isOpen) return null;

  const progress = getDevelopmentProgress();
  const timelineSteps = getTimelineSteps();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FlaskConical className="h-6 w-6 text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Development Tracking</h3>
                <p className="text-sm text-gray-600">Session: {session.sessionId}</p>
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                PHASE 3
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{progress}% Complete</div>
                <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: TrendingUp },
              { id: 'cleavage', name: 'Cleavage', icon: Eye },
              { id: 'blastocyst', name: 'Blastocyst', icon: Award },
              { id: 'quality', name: 'Quality', icon: CheckCircle }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Development Timeline */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Development Timeline</h4>
                <div className="space-y-4">
                  {timelineSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={index} className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          step.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`h-4 w-4 ${
                            step.status === 'completed' ? 'text-green-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <h5 className={`font-medium ${
                              step.status === 'completed' ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {step.title}
                            </h5>
                            {step.status === 'completed' && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <p className={`text-sm ${
                            step.status === 'completed' ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {step.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(step.date)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {session.selectedOocytes.length}
                  </div>
                  <div className="text-sm text-blue-700">Oocytes Used</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {trackingData.cleavageObserved ? 'Yes' : 'No'}
                  </div>
                  <div className="text-sm text-green-700">Cleavage Observed</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {trackingData.blastocystStage ? 'Yes' : 'No'}
                  </div>
                  <div className="text-sm text-purple-700">Blastocyst Stage</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {session.actualEmbryoCount || 0}
                  </div>
                  <div className="text-sm text-orange-700">Embryos Generated</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cleavage' && (
            <div className="space-y-6">
              <h4 className="text-md font-medium text-gray-900">Cleavage Monitoring</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="cleavageObserved"
                      checked={trackingData.cleavageObserved || false}
                      onChange={(e) => setTrackingData(prev => ({
                        ...prev,
                        cleavageObserved: e.target.checked
                      }))}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    <label htmlFor="cleavageObserved" className="text-sm font-medium text-gray-700">
                      Cleavage Observed
                    </label>
                  </div>

                  {trackingData.cleavageObserved && (
                    <div>
                      <label htmlFor="cleavageDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Cleavage Date
                      </label>
                      <input
                        type="date"
                        id="cleavageDate"
                        value={trackingData.cleavageDate || ''}
                        onChange={(e) => setTrackingData(prev => ({
                          ...prev,
                          cleavageDate: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">Cleavage Guidelines</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Check 16-20 hours post-fertilization</li>
                    <li>• Look for 2-cell stage development</li>
                    <li>• Assess cell symmetry and fragmentation</li>
                    <li>• Document abnormal cleavage patterns</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'blastocyst' && (
            <div className="space-y-6">
              <h4 className="text-md font-medium text-gray-900">Blastocyst Development</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="blastocystStage"
                      checked={trackingData.blastocystStage || false}
                      onChange={(e) => setTrackingData(prev => ({
                        ...prev,
                        blastocystStage: e.target.checked
                      }))}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    <label htmlFor="blastocystStage" className="text-sm font-medium text-gray-700">
                      Blastocyst Stage Reached
                    </label>
                  </div>

                  {trackingData.blastocystStage && (
                    <>
                      <div>
                        <label htmlFor="blastocystDay" className="block text-sm font-medium text-gray-700 mb-2">
                          Development Day
                        </label>
                        <select
                          id="blastocystDay"
                          value={trackingData.blastocystDay || ''}
                          onChange={(e) => setTrackingData(prev => ({
                            ...prev,
                            blastocystDay: e.target.value
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select day</option>
                          <option value="D5">Day 5</option>
                          <option value="D6">Day 6</option>
                          <option value="D7">Day 7</option>
                          <option value="D8">Day 8</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="blastocystGrade" className="block text-sm font-medium text-gray-700 mb-2">
                          Morphology Grade
                        </label>
                        <select
                          id="blastocystGrade"
                          value={trackingData.blastocystGrade || ''}
                          onChange={(e) => setTrackingData(prev => ({
                            ...prev,
                            blastocystGrade: e.target.value
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select grade</option>
                          <option value="AA">AA - Excellent</option>
                          <option value="AB">AB - Good</option>
                          <option value="BA">BA - Good</option>
                          <option value="BB">BB - Fair</option>
                          <option value="BC">BC - Poor</option>
                          <option value="CB">CB - Poor</option>
                          <option value="CC">CC - Very Poor</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">Grading System</h5>
                  <div className="text-sm text-green-700 space-y-2">
                    <div><strong>AA/AB:</strong> Excellent quality, high pregnancy potential</div>
                    <div><strong>BA/BB:</strong> Good quality, suitable for transfer</div>
                    <div><strong>BC/CB:</strong> Fair quality, consider for transfer</div>
                    <div><strong>CC:</strong> Poor quality, limited potential</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quality' && (
            <div className="space-y-6">
              <h4 className="text-md font-medium text-gray-900">Quality Assessment</h4>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="qualityNotes" className="block text-sm font-medium text-gray-700 mb-2">
                    Quality Notes & Observations
                  </label>
                  <textarea
                    id="qualityNotes"
                    rows={4}
                    value={trackingData.qualityNotes || ''}
                    onChange={(e) => setTrackingData(prev => ({
                      ...prev,
                      qualityNotes: e.target.value
                    }))}
                    placeholder="Record observations about embryo quality, morphology, development patterns..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {!trackingData.cleavageObserved && (
                  <div>
                    <label htmlFor="failureReason" className="block text-sm font-medium text-gray-700 mb-2">
                      Failure Reason (if applicable)
                    </label>
                    <select
                      id="failureReason"
                      value={trackingData.failureReason || ''}
                      onChange={(e) => setTrackingData(prev => ({
                        ...prev,
                        failureReason: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select reason</option>
                      <option value="Poor oocyte quality">Poor oocyte quality</option>
                      <option value="Sperm quality issues">Sperm quality issues</option>
                      <option value="Technical difficulties">Technical difficulties</option>
                      <option value="Culture conditions">Culture conditions</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveTracking}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Development Data'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentTrackingPanel; 