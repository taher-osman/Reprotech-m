import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Badge } from './components/ui/Badge';
import { 
  Plus, Save, Play, Pause, Settings, AlertTriangle, CheckCircle2,
  GitBranch, Clock, Users, FileText, Target, Zap, ChevronDown,
  ChevronRight, Edit3, Trash2, Copy, Eye, TestTube, Activity
} from 'lucide-react';
import {
  AdvancedWorkflowTemplate,
  AdvancedWorkflowStep,
  AdvancedWorkflowCondition,
  AdvancedWorkflowAction,
  WorkflowDecisionPoint,
  AlternativeWorkflowAssignment
} from '../types/workflowTypes';

interface WorkflowDesignerProps {
  template?: AdvancedWorkflowTemplate;
  onSave: (template: AdvancedWorkflowTemplate) => void;
  onCancel: () => void;
  availableModules: string[];
}

const AdvancedWorkflowDesigner: React.FC<WorkflowDesignerProps> = ({
  template,
  onSave,
  onCancel,
  availableModules
}) => {
  const [currentTemplate, setCurrentTemplate] = useState<AdvancedWorkflowTemplate>(
    template || createEmptyTemplate()
  );
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [designMode, setDesignMode] = useState<'visual' | 'text'>('visual');
  const [showPreview, setShowPreview] = useState(false);

  // Create the example camel superovulation protocol
  function createCamelSuperovulationProtocol(): AdvancedWorkflowTemplate {
    return {
      id: 'WT-CAMEL-SUPEROV-2025',
      name: 'Camel Superovulation Protocol - Advanced',
      description: 'Complete superovulation protocol for camel donors with conditional logic and module integration',
      category: 'DONOR_COMPLETE',
      applicableRoles: ['DONOR'],
      applicableSpecies: ['CAMEL'],
      
      // Clinical Protocol Information
      clinicalProtocol: {
        protocolName: 'Modified Camel MOET Protocol v3.0',
        species: ['CAMEL'],
        indication: ['Superovulation', 'Embryo Production', 'Genetic Preservation'],
        contraindications: ['Active infection', 'Poor body condition', 'Recent calving <60 days'],
        expectedOutcomes: {
          primary: '6-12 transferable embryos per flush',
          secondary: ['85% fertilization rate', '70% viable embryos', 'Minimal complications'],
          complications: ['Ovarian hyperstimulation', 'Poor response', 'Infection risk']
        },
        references: [{
          title: 'Superovulation in Dromedary Camels: Recent Advances',
          authors: 'Al-Rashid et al.',
          journal: 'Reproduction in Domestic Animals',
          year: 2023,
          doi: '10.1111/rda.14234'
        }]
      },
      
      // Enhanced steps with complete camel protocol
      advancedSteps: [
        {
          id: 'step-1',
          name: 'Initial Assessment & Preparation',
          description: 'Comprehensive health evaluation and uterine preparation',
          stepType: 'EXAM',
          order: 1,
          
          // Module requirements
          moduleRequirements: [{
            module: 'ULTRASOUND',
            dataRequired: ['ovarian_status', 'uterine_condition', 'follicle_count'],
            functionsNeeded: ['schedule_exam', 'record_findings'],
            integrationPoints: {
              onStepStart: '/api/ultrasound/schedule-initial-exam',
              onStepComplete: '/api/ultrasound/evaluate-readiness'
            }
          }],
          
          // Exit paths with conditions
          exitPaths: [{
            id: 'path-success',
            name: 'Ready for Protocol',
            conditions: [{
              id: 'cond-1',
              field: 'uterine_status',
              operator: '==',
              value: 'HEALTHY',
              logicalOperator: 'AND',
              dataSource: 'ULTRASOUND',
              fieldPath: 'lastUltrasound.uterineStatus.endometritis',
              errorMessage: 'Uterine inflammation detected - treat before continuing',
              warningMessage: 'Mild inflammation present - monitor closely'
            }, {
              id: 'cond-2',
              field: 'follicle_count',
              operator: '>=',
              value: 3,
              logicalOperator: 'AND',
              dataSource: 'ULTRASOUND',
              fieldPath: 'lastUltrasound.leftOvary.follicleCount + lastUltrasound.rightOvary.follicleCount',
              errorMessage: 'Insufficient follicle development - consider postponing protocol'
            }],
            actions: [{
              id: 'action-1',
              type: 'SCHEDULE_EXAM',
              targetModule: 'ULTRASOUND',
              priority: 'NORMAL',
              parameters: { examType: 'BASELINE', scheduleDays: 1 },
              moduleIntegration: {
                scheduleEvent: {
                  eventType: 'BASELINE_ULTRASOUND',
                  preferredTime: '08:00',
                  room: 'Ultrasound Room 1',
                  equipment: ['Ultrasound machine', 'Rectal probe'],
                  preparation: ['12h fasting', 'Clean rectum']
                }
              },
              onFailure: {
                retryAttempts: 2,
                retryDelay: 24,
                notifyVeterinarian: true,
                escalationMessage: 'Unable to schedule baseline ultrasound - manual intervention required'
              }
            }],
            nextStepId: 'step-2',
            probability: 85
          }, {
            id: 'path-defer',
            name: 'Defer Protocol',
            conditions: [{
              id: 'cond-defer',
              field: 'uterine_status',
              operator: '!=',
              value: 'HEALTHY',
              dataSource: 'ULTRASOUND',
              fieldPath: 'lastUltrasound.uterineStatus.endometritis',
              errorMessage: 'Animal not ready for superovulation protocol'
            }],
            actions: [{
              id: 'action-defer',
              type: 'SCHEDULE_PROCEDURE',
              targetModule: 'CALENDAR',
              priority: 'HIGH',
              parameters: { 
                procedureType: 'UTERINE_TREATMENT',
                scheduleDays: 7
              },
              moduleIntegration: {
                createRecord: {
                  recordType: 'treatment_plan',
                  requiredFields: { treatment: 'uterine_lavage', duration: '5-7 days' }
                }
              },
              onFailure: {
                retryAttempts: 1,
                retryDelay: 4,
                notifyVeterinarian: true,
                escalationMessage: 'Failed to schedule treatment - manual intervention needed'
              }
            }],
            alternativeWorkflowId: 'WT-CAMEL-TREATMENT',
            probability: 15
          }],
          
          // Quality control checks
          qualityChecks: [{
            id: 'qc-1',
            name: 'Body Condition Score',
            condition: {
              id: 'bcs-check',
              field: 'body_condition',
              operator: '>=',
              value: 3,
              dataSource: 'EXAM',
              fieldPath: 'physicalExam.bodyConditionScore',
              errorMessage: 'Body condition too poor for superovulation (BCS < 3)'
            },
            severity: 'ERROR',
            requiresVerification: true
          }],
          
          onStartActions: [],
          onSuccessActions: [],
          onFailureActions: [],
          estimatedDuration: 1,
          isManualStep: false,
          displayInDashboard: true,
          notificationRequired: true,
          
          adaptiveSettings: {
            learnFromOutcomes: true,
            optimizeBasedOnSuccess: true,
            adjustTimingAutomatically: false,
            suggestImprovements: true
          }
        },
        
        {
          id: 'step-2',
          name: 'GnRH Injection (Day 0)',
          description: 'Initial GnRH injection when follicles are 10-19mm',
          stepType: 'INJECTION',
          order: 2,
          
          // Decision point for follicle size
          decisionPoint: {
            id: 'decision-follicle-size',
            name: 'Follicle Size Decision',
            description: 'Evaluate follicle development for GnRH timing',
            evaluationConditions: [{
              id: 'follicle-size-check',
              field: 'dominant_follicle_size',
              operator: '>=',
              value: 10,
              tolerance: 1,
              units: 'mm',
              dataSource: 'ULTRASOUND',
              fieldPath: 'lastUltrasound.leftOvary.dominantFollicle || lastUltrasound.rightOvary.dominantFollicle',
              errorMessage: 'Follicles too small for GnRH injection',
              timeConstraint: { withinDays: 1 }
            }, {
              id: 'follicle-max-check',
              field: 'dominant_follicle_size',
              operator: '<=',
              value: 19,
              units: 'mm',
              dataSource: 'ULTRASOUND',
              fieldPath: 'lastUltrasound.leftOvary.dominantFollicle || lastUltrasound.rightOvary.dominantFollicle',
              warningMessage: 'Large follicles detected - may ovulate early'
            }],
            
            decisionMatrix: [{
              outcome: 'SUCCESS',
              probability: 80,
              nextStepId: 'step-3',
              requiredActions: [{
                id: 'gnrh-injection',
                type: 'SCHEDULE_INJECTION',
                targetModule: 'INJECTION',
                priority: 'HIGH',
                parameters: {
                  medication: 'GnRH',
                  dosage: '100 μg',
                  route: 'IM',
                  scheduleDays: 0
                },
                moduleIntegration: {
                  createRecord: {
                    recordType: 'injection_record',
                    requiredFields: {
                      medication: 'GnRH (Buserelin)',
                      dosage: '100 μg',
                      route: 'IM',
                      location: 'Neck muscle'
                    }
                  }
                },
                onFailure: {
                  retryAttempts: 1,
                  retryDelay: 2,
                  notifyVeterinarian: true,
                  escalationMessage: 'GnRH injection failed - manual administration required'
                }
              }]
            }, {
              outcome: 'ALTERNATIVE_NEEDED',
              probability: 20,
              alternativeWorkflowId: 'WT-CAMEL-DELAYED-PROTOCOL',
              requiredActions: [{
                id: 'defer-gnrh',
                type: 'WAIT_DAYS',
                targetModule: 'CALENDAR',
                priority: 'NORMAL',
                parameters: { days: 2 },
                moduleIntegration: {
                  scheduleEvent: {
                    eventType: 'FOLLICLE_RECHECK',
                    preferredTime: '08:00'
                  }
                },
                onFailure: {
                  retryAttempts: 0,
                  retryDelay: 0,
                  notifyVeterinarian: true,
                  escalationMessage: 'Protocol timing adjustment needed'
                }
              }]
            }],
            
            allowManualOverride: true,
            manualOptions: [{
              id: 'force-proceed',
              label: 'Proceed with GnRH (Override)',
              description: 'Continue protocol despite follicle size concerns',
              nextStepId: 'step-3',
              requiresJustification: true
            }, {
              id: 'switch-protocol',
              label: 'Switch to Alternative Protocol',
              description: 'Change to delayed synchronization protocol',
              alternativeWorkflowId: 'WT-CAMEL-DELAYED-PROTOCOL',
              requiresJustification: true
            }],
            
            escalationRules: [{
              condition: {
                id: 'emergency-escalation',
                field: 'time_since_last_exam',
                operator: '>',
                value: 48,
                units: 'hours',
                dataSource: 'ANIMAL_STATUS',
                fieldPath: 'lastUltrasound.daysAgo * 24',
                errorMessage: 'Exam data too old for protocol decisions'
              },
              escalateTo: 'senior_veterinarian',
              urgency: 'URGENT',
              message: 'Outdated exam data requires senior vet review before proceeding'
            }],
            
            historicalOutcomes: [{
              outcome: 'SUCCESS',
              frequency: 78,
              successRate: 92,
              averageTimeToDecision: 2.5
            }, {
              outcome: 'ALTERNATIVE_NEEDED',
              frequency: 22,
              successRate: 85,
              averageTimeToDecision: 4.8
            }]
          },
          
          moduleRequirements: [{
            module: 'INJECTION',
            dataRequired: ['injection_schedule', 'medication_availability'],
            functionsNeeded: ['schedule_injection', 'track_administration'],
            integrationPoints: {
              onStepStart: '/api/injection/prepare-gnrh',
              onStepComplete: '/api/injection/confirm-administration'
            }
          }],
          
          exitPaths: [{
            id: 'path-next',
            name: 'Proceed to Follow-up',
            conditions: [{
              id: 'injection-confirmed',
              field: 'injection_status',
              operator: '==',
              value: 'COMPLETED',
              dataSource: 'INJECTION',
              fieldPath: 'lastInjection.status',
              errorMessage: 'GnRH injection not confirmed'
            }],
            actions: [{
              id: 'schedule-followup',
              type: 'SCHEDULE_EXAM',
              targetModule: 'ULTRASOUND',
              priority: 'NORMAL',
              delay: { days: 4 },
              parameters: { examType: 'OVULATION_CHECK' },
              moduleIntegration: {
                scheduleEvent: {
                  eventType: 'POST_GNRH_ULTRASOUND',
                  preferredTime: '08:00'
                }
              },
              onFailure: {
                retryAttempts: 2,
                retryDelay: 6,
                notifyVeterinarian: true,
                escalationMessage: 'Failed to schedule follow-up ultrasound'
              }
            }],
            nextStepId: 'step-3',
            probability: 95
          }],
          
          onStartActions: [],
          onSuccessActions: [],
          onFailureActions: [],
          estimatedDuration: 1,
          isManualStep: true,
          displayInDashboard: true,
          notificationRequired: true,
          
          adaptiveSettings: {
            learnFromOutcomes: true,
            optimizeBasedOnSuccess: true,
            adjustTimingAutomatically: true,
            suggestImprovements: true
          }
        }
      ],
      
      // Alternative workflow mappings
      alternativeWorkflows: [{
        triggerId: 'poor-follicle-response',
        triggerDescription: 'Insufficient follicle development detected',
        alternativeTemplateId: 'WT-CAMEL-RESCUE-PROTOCOL',
        alternativeTemplateName: 'Camel Rescue Superovulation Protocol',
        transitionRules: {
          preserveData: ['animalId', 'startDate', 'assignedVet'],
          resetData: ['stepNumber', 'injectionHistory'],
          requiredApproval: true
        }
      }, {
        triggerId: 'uterine-inflammation',
        triggerDescription: 'Endometritis detected during protocol',
        alternativeTemplateId: 'WT-CAMEL-TREATMENT',
        alternativeTemplateName: 'Camel Uterine Treatment Protocol',
        transitionRules: {
          preserveData: ['animalId', 'lastUltrasound', 'assignedVet'],
          resetData: ['workflowProgress'],
          requiredApproval: false
        }
      }],
      
      // Success prediction model
      predictionModel: {
        factorsConsidered: ['body_condition_score', 'age', 'previous_response', 'season', 'follicle_count'],
        weights: {
          body_condition_score: 0.25,
          age: 0.20,
          previous_response: 0.30,
          season: 0.10,
          follicle_count: 0.15
        },
        thresholds: {
          highSuccess: 85,
          moderateSuccess: 65,
          lowSuccess: 45
        },
        lastUpdated: new Date().toISOString(),
        accuracy: 87.5
      },
      
      steps: [], // Legacy field - use advancedSteps instead
      startingStep: 'step-1',
      maxDuration: 21,
      priority: 'HIGH',
      autoStart: false,
      expectedSuccessRate: 85,
      averageDuration: 14,
      createdBy: 'Dr. Ahmed Al-Rashid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '3.0',
      isActive: true,
      usageCount: 0,
      successCount: 0,
      
      optimization: {
        suggestedImprovements: [{
          id: 'imp-1',
          description: 'Add AI-powered follicle size prediction',
          impact: 'HIGH',
          implementationEffort: 'MEDIUM',
          evidenceSupport: 85
        }, {
          id: 'imp-2',
          description: 'Implement real-time hormone monitoring',
          impact: 'MEDIUM',
          implementationEffort: 'HIGH',
          evidenceSupport: 72
        }],
        performanceTrends: [{
          month: '2024-12',
          successRate: 82,
          averageDuration: 15.2,
          satisfactionScore: 4.3
        }, {
          month: '2025-01',
          successRate: 85,
          averageDuration: 14.8,
          satisfactionScore: 4.5
        }]
      }
    };
  }

  function createEmptyTemplate(): AdvancedWorkflowTemplate {
    return {
      id: `WT-${Date.now()}`,
      name: 'New Workflow Template',
      description: '',
      category: 'CUSTOM',
      applicableRoles: [],
      applicableSpecies: [],
      clinicalProtocol: {
        protocolName: '',
        species: [],
        indication: [],
        contraindications: [],
        expectedOutcomes: { primary: '', secondary: [], complications: [] },
        references: []
      },
      advancedSteps: [],
      alternativeWorkflows: [],
      predictionModel: {
        factorsConsidered: [],
        weights: {},
        thresholds: { highSuccess: 80, moderateSuccess: 60, lowSuccess: 40 },
        lastUpdated: new Date().toISOString(),
        accuracy: 0
      },
      optimization: {
        suggestedImprovements: [],
        performanceTrends: []
      },
      steps: [],
      startingStep: '',
      maxDuration: 14,
      priority: 'MEDIUM',
      autoStart: false,
      expectedSuccessRate: 70,
      averageDuration: 7,
      createdBy: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      isActive: true,
      usageCount: 0,
      successCount: 0
    };
  }

  const handleSaveTemplate = () => {
    onSave(currentTemplate);
  };

  const loadCamelProtocol = () => {
    setCurrentTemplate(createCamelSuperovulationProtocol());
  };

  return (
    <div className="w-full h-full bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Advanced Workflow Designer</h1>
            <p className="text-gray-600">Design complex veterinary protocols with conditional logic and module integration</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadCamelProtocol}>
              <TestTube className="w-4 h-4 mr-2" />
              Load Camel Protocol
            </Button>
            <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSaveTemplate}>
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
        
        {/* Template Info */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">{currentTemplate.name}</p>
                  <p className="text-xs text-gray-500">Version {currentTemplate.version}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">{currentTemplate.expectedSuccessRate}% Success Rate</p>
                  <p className="text-xs text-gray-500">{currentTemplate.averageDuration} days average</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">{currentTemplate.advancedSteps.length} Steps</p>
                  <p className="text-xs text-gray-500">{currentTemplate.alternativeWorkflows.length} alternatives</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">{currentTemplate.applicableSpecies.join(', ')}</p>
                  <p className="text-xs text-gray-500">{currentTemplate.applicableRoles.join(', ')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Workflow Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Workflow Steps & Decision Logic
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentTemplate.advancedSteps.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No workflow steps defined yet</p>
              <Button onClick={loadCamelProtocol}>
                <Plus className="w-4 h-4 mr-2" />
                Load Example Protocol
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {currentTemplate.advancedSteps.map((step, index) => (
                <StepCard 
                  key={step.id} 
                  step={step} 
                  index={index}
                  isSelected={selectedStep === step.id}
                  onSelect={() => setSelectedStep(step.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Workflow Preview</h2>
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Close
              </Button>
            </div>
            <WorkflowPreview template={currentTemplate} />
          </div>
        </div>
      )}
    </div>
  );
};

// Step Card Component
const StepCard: React.FC<{
  step: AdvancedWorkflowStep;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ step, index, isSelected, onSelect }) => {
  const [expanded, setExpanded] = useState(false);

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'EXAM': return <TestTube className="w-5 h-5 text-blue-500" />;
      case 'INJECTION': return <Zap className="w-5 h-5 text-green-500" />;
      case 'PROCEDURE': return <Activity className="w-5 h-5 text-purple-500" />;
      case 'DECISION': return <GitBranch className="w-5 h-5 text-orange-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Card className={`${isSelected ? 'ring-2 ring-blue-500' : ''} cursor-pointer`} onClick={onSelect}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-full">
              {getStepIcon(step.stepType)}
            </div>
            <div>
              <h3 className="font-semibold">Step {index + 1}: {step.name}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline">{step.stepType}</Badge>
            <Badge variant="outline">{step.estimatedDuration}d</Badge>
            {step.decisionPoint && <Badge variant="secondary">Decision Point</Badge>}
            {step.exitPaths.length > 1 && <Badge variant="secondary">{step.exitPaths.length} Paths</Badge>}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4 border-t pt-4">
            {/* Module Requirements */}
            {step.moduleRequirements.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Module Integration</h4>
                <div className="flex flex-wrap gap-2">
                  {step.moduleRequirements.map((req) => (
                    <Badge key={req.module} variant="outline">{req.module}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Decision Point */}
            {step.decisionPoint && (
              <div>
                <h4 className="font-medium mb-2">Decision Logic</h4>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm">{step.decisionPoint.description}</p>
                  <div className="mt-2">
                    <p className="text-xs font-medium">Conditions: {step.decisionPoint.evaluationConditions.length}</p>
                    <p className="text-xs font-medium">Outcomes: {step.decisionPoint.decisionMatrix.length}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Exit Paths */}
            <div>
              <h4 className="font-medium mb-2">Exit Paths</h4>
              <div className="space-y-2">
                {step.exitPaths.map((path) => (
                  <div key={path.id} className="bg-gray-50 p-2 rounded flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{path.name}</p>
                      <p className="text-xs text-gray-600">{path.conditions.length} conditions, {path.actions.length} actions</p>
                    </div>
                    <Badge variant="outline">{path.probability}%</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Checks */}
            {step.qualityChecks.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Quality Controls</h4>
                <div className="space-y-1">
                  {step.qualityChecks.map((check) => (
                    <div key={check.id} className="flex items-center gap-2 text-sm">
                      <AlertTriangle className={`w-4 h-4 ${check.severity === 'CRITICAL' ? 'text-red-500' : check.severity === 'ERROR' ? 'text-orange-500' : 'text-yellow-500'}`} />
                      <span>{check.name}</span>
                      <Badge variant="outline" className="ml-auto">{check.severity}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Workflow Preview Component
const WorkflowPreview: React.FC<{ template: AdvancedWorkflowTemplate }> = ({ template }) => {
  return (
    <div className="space-y-6">
      {/* Template Overview */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Protocol Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Name:</strong> {template.name}</p>
            <p><strong>Species:</strong> {template.applicableSpecies.join(', ')}</p>
            <p><strong>Expected Duration:</strong> {template.averageDuration} days</p>
          </div>
          <div>
            <p><strong>Success Rate:</strong> {template.expectedSuccessRate}%</p>
            <p><strong>Priority:</strong> {template.priority}</p>
            <p><strong>Steps:</strong> {template.advancedSteps.length}</p>
          </div>
        </div>
      </div>

      {/* Clinical Protocol */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Clinical Information</h3>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p><strong>Protocol:</strong> {template.clinicalProtocol.protocolName}</p>
          <p><strong>Primary Outcome:</strong> {template.clinicalProtocol.expectedOutcomes.primary}</p>
          <p><strong>Indications:</strong> {template.clinicalProtocol.indication.join(', ')}</p>
          <p><strong>Contraindications:</strong> {template.clinicalProtocol.contraindications.join(', ')}</p>
        </div>
      </div>

      {/* Step Flow */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Workflow Flow</h3>
        <div className="space-y-3">
          {template.advancedSteps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium">{step.name}</p>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              <div className="text-right">
                <Badge variant="outline">{step.stepType}</Badge>
                {step.decisionPoint && <Badge variant="secondary" className="ml-2">Decision</Badge>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alternative Workflows */}
      {template.alternativeWorkflows.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Alternative Protocols</h3>
          <div className="space-y-2">
            {template.alternativeWorkflows.map((alt) => (
              <div key={alt.triggerId} className="bg-yellow-50 p-3 rounded-lg">
                <p className="font-medium">{alt.alternativeTemplateName}</p>
                <p className="text-sm text-gray-600">{alt.triggerDescription}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedWorkflowDesigner; 