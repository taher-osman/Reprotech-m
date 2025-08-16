import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Syringe,
  Activity,
  Eye,
  Edit,
  Printer,
  Brain,
  Users,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Target,
  Zap,
  FileText,
  Download,
  RefreshCw,
  Plus,
  Trash2,
  Settings,
  Monitor,
  Heart,
  Thermometer,
  BarChart3,
  History,
  Globe,
  Stethoscope,
  Send,
  CheckSquare,
  Square,
  ArrowRight,
  PlayCircle,
  Smartphone,
  X,
  Grid3X3,
  List,
  TrendingUp,
  Bell,
  Beaker,
  Clipboard,
  Camera
} from 'lucide-react';
import { Animal, AnimalRole } from '../../animals/types/animalTypes';
import { filterAnimals, getAnimalsForModule, getAnimalWarnings, hasActiveRole } from '../../animals/utils/animalUtils';
import apiService from '../../../services/api';
import workflowService, { 
  WorkflowDecision, 
  BulkWorkflowAssignment, 
  AutomatedAction 
} from '../../../services/workflowService';
import MobileFieldInterface from '../components/MobileFieldInterface';
import AIDecisionEngine from '../components/AIDecisionEngine';
import AdvancedReporting from '../components/AdvancedReporting';
import SystemHealthMonitor from '../components/SystemHealthMonitor';
import { WorkflowTemplateCreator } from '../components/WorkflowTemplateCreator';
import { DailyOperationsDashboard } from '../components/DailyOperationsDashboard';
import realTimeService from '../../../services/realTimeService';
import { mainCache } from '../../../services/cacheService';
import { 
  WorkflowTemplate, 
  EnhancedClinicalAnimal, 
  DailyInjection, 
  NextDayExam, 
  ActiveWorkflow,
  DailyOperationsOverview,
  WorkflowFilter,
  BulkWorkflowAssignment as WorkflowBulkAssignment
} from '../types/workflowTypes';

// Enhanced interfaces for Clinical Hub with VIP reproductive tracking
interface VIPUltrasoundSummary {
  id: string;
  date: string;
  daysAgo: number;
  examType: 'ROUTINE' | 'PREGNANCY_CHECK' | 'FOLLICLE_MONITORING' | 'POST_PROCEDURE' | 'SUPEROVULATION';
  
  // Enhanced VIP Follicle data with individual sizes
  leftOvary: {
    follicleCount: number;
    follicles: number[]; // Individual follicle sizes in mm
    dominantFollicles: number;
    largestFollicle: number; // mm
    clPresence: boolean;
  };
  rightOvary: {
    follicleCount: number;
    follicles: number[]; // Individual follicle sizes in mm
    dominantFollicles: number;
    largestFollicle: number; // mm
    clPresence: boolean;
  };
  totalFollicles: number;
  
  // Enhanced medical conditions
  endometritis: 'NONE' | 'MILD' | 'MODERATE' | 'SEVERE';
  endometrialThickness: number; // mm
  
  // VIP Assessment
  responseScore: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';
  breedingReadiness: 'READY' | 'NOT_READY' | 'NEEDS_TREATMENT' | 'MONITOR';
  recommendedAction: string;
  
  // Current injection status
  currentInjection?: {
    medication: string;
    daysFromInjection: number;
    nextInjectionDate?: string;
  };
  
  veterinarian: string;
  notes?: string;
}

// Enhanced reproductive cycle tracking
interface ReproductiveCycleData {
  // Cycle counts - THIS IS CRITICAL FOR TRACKING
  superovulationCycles: {
    total: number;
    successful: number;
    currentCycleNumber?: number;
    currentCycleDay?: number;
    lastCycleDate?: string;
  };
  
  opuProcedures: {
    total: number;
    successful: number;
    lastProcedureDate?: string;
    averageOocytes?: number;
  };
  
  flushingProcedures: {
    total: number;
    successful: number;
    lastProcedureDate?: string;
    averageEmbryos?: number;
  };
  
  // Embryo tracking (future plan as requested)
  embryoData: {
    totalCollected: number;
    totalTransferred: number;
    totalFrozen: number;
    currentInventory: number;
    successfulPregnancies: number;
    collectionRate?: number; // embryos per flush
    pregnancyRate?: number; // pregnancies per transfer
  };
  
  // Current reproductive status
  currentStatus: {
    phase: 'RESTING' | 'SYNCHRONIZATION' | 'SUPEROVULATION' | 'COLLECTION' | 'BREEDING' | 'PREGNANCY';
    dayInPhase: number;
    expectedNextEvent: {
      type: string;
      date: string;
      description: string;
    };
  };
}

interface VIPClinicalAnimal extends Animal {
  // VIP Ultrasound - MOST CRITICAL COLUMN
  vipUltrasound?: VIPUltrasoundSummary;
  
  // Enhanced reproductive tracking
  reproductiveCycles: ReproductiveCycleData;
  
  // Current workflow information
  currentWorkflow?: {
    templateName: string;
    currentStep: string;
    stepNumber: number;
    totalSteps: number;
    progress: number; // percentage
    status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
    nextAction: string;
    expectedDate?: string;
  };
  
  // Current assignment data
  yard?: string;
  assignedVet?: string;
  clinicalStatus: 'ACTIVE' | 'MONITORING' | 'TREATMENT' | 'RECOVERY' | 'HOLD';
  
  // Warning system
  warningFlags: Array<{
    type: 'URGENT' | 'WARNING' | 'INFO';
    message: string;
    daysOverdue?: number;
  }>;
  
  // Last activity summary
  lastActivity: {
    type: 'SCAN' | 'INJECTION' | 'PROCEDURE' | 'EXAMINATION';
    date: string;
    description: string;
    outcome?: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  };
}

interface InjectionPlan {
  id: string;
  medication: string;
  dosage: string;
  route: 'IM' | 'IV' | 'SC';
  scheduledDate: string;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE' | 'SKIPPED';
  assignedBy: string;
  notes?: string;
  actualGivenDate?: string;
  actualDosage?: string;
}

interface WorkflowAssignment {
  id: string;
  type: 'INJECTION' | 'OPU' | 'FLUSHING' | 'ET' | 'RECHECK' | 'BREEDING' | 'SKIP';
  scheduledDate: string;
  assignedVet: string;
  room?: string;
  reason: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

interface LatestProcedure {
  id: string;
  type: 'ET' | 'OPU' | 'FLUSHING' | 'INJECTION' | 'SCAN' | 'BREEDING' | 'PREGNANCY_CHECK';
  date: string;
  outcome: 'SUCCESS' | 'FAILED' | 'PARTIAL' | 'PENDING';
  veterinarian: string;
  notes?: string;
  followUpRequired: boolean;
  nextCheckDate?: string;
  complications?: string[];
  qualityScore?: number; // 1-10
}

interface ClinicalAnimal extends Animal {
  lastUltrasound?: UltrasoundSummary;
  ultrasoundHistory: UltrasoundSummary[];
  currentInjectionPlan?: InjectionPlan;
  injectionHistory: InjectionPlan[];
  currentWorkflow?: WorkflowAssignment;
  workflowHistory: WorkflowAssignment[];
  latestProcedure?: LatestProcedure;
  procedureHistory: LatestProcedure[];
  yard?: string;
  assignedVet?: string;
  clinicalStatus: 'ACTIVE' | 'MONITORING' | 'TREATMENT' | 'RECOVERY' | 'HOLD';
  lastActivity: string;
  warningFlags: string[];
  // Enhanced progress tracking
  reproductiveStatus: {
    currentCycle: number;
    cycleName: string;
    dayInCycle: number;
    expectedNextEvent: {
      type: string;
      date: string;
      description: string;
    };
    successRate: number;
    totalAttempts: number;
    successfulProcedures: number;
  };
}

interface ClinicalFilter {
  search: string;
  species: string[];
  roles: string[];
  yards: string[];
  veterinarians: string[];
  clinicalStatus: string[];
  workflowStatus: string[];
  injectionStatus: string[];
  dateRange: { start: string; end: string } | null;
  hasInjectionToday: boolean;
  hasScanToday: boolean;
  hasOverdueTask: boolean;
  // Enhanced filtering options
  clPresence: 'ANY' | 'LEFT_ONLY' | 'RIGHT_ONLY' | 'BOTH' | 'NONE';
  follicleSize: 'ANY' | 'ABOVE_25MM' | 'ABOVE_20MM' | 'BELOW_15MM';
  endometritis: 'ANY' | 'NONE' | 'MILD' | 'MODERATE' | 'SEVERE' | 'ANY_CONDITION';
}

interface Language {
  code: 'en' | 'ar';
  name: string;
  direction: 'ltr' | 'rtl';
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', direction: 'ltr' },
  { code: 'ar', name: 'العربية', direction: 'rtl' }
];

// Translations
const translations = {
  en: {
    title: 'Clinical Hub',
    subtitle: 'Central Intelligence & Control for Reproductive Management',
    tabs: {
      animalSummary: 'Animal Summary',
      workflowDesigner: 'Workflow Template Designer',
      dailyOperations: 'Daily Operations',
      calendarPlan: 'Calendar Plan',
      decisionLog: 'Decision Log',
      reports: 'Reports'
    },
    filters: {
      search: 'Search by Internal Number or Animal ID...',
      species: 'Species',
      roles: 'Roles',
      yards: 'Yards',
      veterinarians: 'Veterinarians',
      clinicalStatus: 'Clinical Status',
      workflowStatus: 'Workflow Status',
      injectionStatus: 'Injection Status',
      dateRange: 'Date Range',
      todayInjections: "Today's Injections",
      todayScans: "Today's Scans",
      overdueTasks: 'Overdue Tasks'
    },
    columns: {
      internalNumber: 'Internal Number',
      animalID: 'Animal ID',
      species: 'Species',
      roles: 'Roles',
      owner: 'Owner',
      yard: 'Yard',
      assignedVet: 'Assigned Vet',
      lastScan: 'Last Scan',
      injectionPlan: 'Injection Plan',
      nextExam: 'Next Exam',
      workflowStatus: 'Workflow Status',
      actions: 'Actions'
    },
    actions: {
      viewProfile: 'View Profile',
      assignWorkflow: 'Assign Workflow',
      printReport: 'Print Report',
      editDetails: 'Edit Details',
      scanHistory: 'Scan History'
    },
    reports: {
      todayInjections: "Today's Injection List",
      tomorrowScans: "Tomorrow's Scan List",
      animalSummary: 'Animal Summary Report',
      ownerReport: 'Owner Group Report',
      yardReport: 'Yard Management Report'
    },
    workflowTypes: {
      INJECTION: 'Schedule Injection',
      OPU: 'Plan OPU',
      FLUSHING: 'Assign to Flushing',
      ET: 'Schedule ET',
      RECHECK: 'Schedule Recheck',
      BREEDING: 'Assign to Breeding',
      SKIP: 'Skip/Hold'
    },
    status: {
      ACTIVE: 'Active',
      MONITORING: 'Monitoring',
      TREATMENT: 'In Treatment',
      RECOVERY: 'Recovery',
      HOLD: 'On Hold'
    }
  },
  ar: {
    title: 'المركز السريري',
    subtitle: 'الذكاء المركزي والتحكم في إدارة التكاثر',
    tabs: {
      animalSummary: 'ملخص الحيوانات',
      workflowDesigner: 'مصمم قوالب سير العمل',
      dailyOperations: 'العمليات اليومية',
      calendarPlan: 'خطة التقويم',
      decisionLog: 'سجل القرارات',
      reports: 'التقارير'
    },
    filters: {
      search: 'البحث برقم الحيوان أو المعرف...',
      species: 'الأنواع',
      roles: 'الأدوار',
      yards: 'الحظائر',
      veterinarians: 'الأطباء البيطريين',
      clinicalStatus: 'الحالة السريرية',
      workflowStatus: 'حالة سير العمل',
      injectionStatus: 'حالة الحقن',
      dateRange: 'نطاق التاريخ',
      todayInjections: 'حقن اليوم',
      todayScans: 'فحوصات اليوم',
      overdueTasks: 'المهام المتأخرة'
    },
    columns: {
      internalNumber: 'الرقم الداخلي',
      animalID: 'معرف الحيوان',
      species: 'النوع',
      roles: 'الأدوار',
      owner: 'المالك',
      yard: 'الحظيرة',
      assignedVet: 'الطبيب المسؤول',
      lastScan: 'آخر فحص',
      injectionPlan: 'خطة الحقن',
      nextExam: 'الفحص التالي',
      workflowStatus: 'حالة سير العمل',
      actions: 'الإجراءات'
    },
    actions: {
      viewProfile: 'عرض الملف',
      assignWorkflow: 'تعيين سير العمل',
      printReport: 'طباعة التقرير',
      editDetails: 'تحرير التفاصيل',
      scanHistory: 'تاريخ الفحوصات'
    },
    reports: {
      todayInjections: 'قائمة حقن اليوم',
      tomorrowScans: 'قائمة فحوصات الغد',
      animalSummary: 'تقرير ملخص الحيوانات',
      ownerReport: 'تقرير مجموعة المالكين',
      yardReport: 'تقرير إدارة الحظائر'
    },
    workflowTypes: {
      INJECTION: 'جدولة الحقن',
      OPU: 'تخطيط OPU',
      FLUSHING: 'تعيين للغسيل',
      ET: 'جدولة ET',
      RECHECK: 'جدولة إعادة فحص',
      BREEDING: 'تعيين للتربية',
      SKIP: 'تخطي/إيقاف'
    },
    status: {
      ACTIVE: 'نشط',
      MONITORING: 'مراقبة',
      TREATMENT: 'في العلاج',
      RECOVERY: 'استرداد',
      HOLD: 'في الانتظار'
    }
  }
};

const ClinicalHubPage: React.FC = () => {
  // Core state for comprehensive workflow management
  const [loading, setLoading] = useState(false);
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);
  const [showWorkflowTemplateCreator, setShowWorkflowTemplateCreator] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkflowTemplate | undefined>();
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('en');
  const [activeTab, setActiveTab] = useState<'animals' | 'designer' | 'operations' | 'calendar' | 'decisions' | 'reports'>('animals');
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');
  
  // Data state - Enhanced for VIP reproductive tracking
  const [vipAnimals, setVipAnimals] = useState<VIPClinicalAnimal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<VIPClinicalAnimal[]>([]);
  const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplate[]>([]);
  const [activeWorkflows, setActiveWorkflows] = useState<ActiveWorkflow[]>([]);
  const [tomorrowExamsLegacy, setTomorrowExams] = useState<NextDayExam[]>([]);
  const [dailyOverview, setDailyOverview] = useState<DailyOperationsOverview>({
    date: new Date().toISOString().split('T')[0],
    injections: {
      total: 0, scheduled: 0, completed: 0, overdue: 0, cancelled: 0, noInjectionToday: 0,
      byMedication: {}, byYard: {}, byTechnician: {}
    },
    nextDayExams: {
      total: 0, byType: {}, byVet: {}, byRoom: {}, estimatedTotalHours: 0
    },
    workflows: {
      active: 0, completing: 0, starting: 0, blocked: 0,
      byTemplate: {}, byPhase: {}
    },
    animals: {
      total: 0, inWorkflow: 0, donors: 0, recipients: 0, breeding: 0,
      scheduledToday: 0, scheduledTomorrow: 0
    }
  });

  // Enhanced filter state for workflow management
  const [filters, setFilters] = useState<ClinicalFilter>({
    search: '',
    species: [],
    roles: [],
    yards: [],
    veterinarians: [],
    clinicalStatus: [],
    workflowStatus: [],
    injectionStatus: [],
    dateRange: null,
    hasInjectionToday: false,
    hasScanToday: false,
    hasOverdueTask: false,
    // Enhanced filtering options
    clPresence: 'ANY',
    follicleSize: 'ANY',
    endometritis: 'ANY'
  });

  // Modal and component states
  const [showBulkWorkflowModal, setShowBulkWorkflowModal] = useState(false);
  const [selectedAnimalForDrawer, setSelectedAnimalForDrawer] = useState<EnhancedClinicalAnimal | null>(null);
  const [showAnimalDrawer, setShowAnimalDrawer] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Phase 2: Mobile Field Interface
  const [showMobileInterface, setShowMobileInterface] = useState(false);
  
  // Phase 3: AI Decision Engine
  const [showAIEngine, setShowAIEngine] = useState(false);
  
  // Phase 4: Advanced Reporting
  const [showAdvancedReporting, setShowAdvancedReporting] = useState(false);
  
  // Phase 5: Real-time Integration & System Health
  const [showSystemHealth, setShowSystemHealth] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toISOString());

  // Enhanced workflow state
  const [decisionHistory, setDecisionHistory] = useState<WorkflowDecision[]>([]);
  const [automatedActions, setAutomatedActions] = useState<AutomatedAction[]>([]);
  const [bulkWorkflowData, setBulkWorkflowData] = useState<Partial<BulkWorkflowAssignment>>({
    consultantId: 'consultant_001',
    consultantName: 'Dr. Sarah Ahmed',
    selectedAnimals: [],
    workflowType: 'BULK_ET',
    baseDate: new Date().toISOString().split('T')[0],
    assignedVet: 'Dr. Ahmad Ali',
    reasoning: ''
  });

  // Reference data
  const [yards] = useState(['Yard A', 'Yard B', 'Yard C', 'Yard D', 'Field 1', 'Field 2']);
  const [veterinarians] = useState(['Dr. Sarah Ahmed', 'Dr. Ahmad Ali', 'Dr. Fatima Hassan', 'Dr. Omar Abdullah']);
  
  // Phase 2: Mobile Field Data
  const [fieldTasks] = useState([
    {
      id: 'task_001',
      type: 'INJECTION' as const,
      animalId: 'AN-2024-001',
      animalName: 'Bella',
      location: 'Yard A',
      scheduledTime: new Date().toISOString(),
      priority: 'HIGH' as const,
      status: 'PENDING' as const,
      instructions: 'Administer GnRH injection - 2.5ml IM',
      requiredEquipment: ['Syringe', 'GnRH', 'Alcohol swab'],
      estimatedDuration: 15,
      assignedTechnician: 'Tech-001',
      photoRequired: true,
      dataSync: 'PENDING' as const
    },
    {
      id: 'task_002',
      type: 'SCAN' as const,
      animalId: 'AN-2024-002',
      animalName: 'Luna',
      location: 'Yard B',
      scheduledTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      priority: 'MEDIUM' as const,
      status: 'PENDING' as const,
      instructions: 'Routine follicle monitoring scan',
      requiredEquipment: ['Ultrasound machine', 'Probe', 'Gel'],
      estimatedDuration: 20,
      assignedTechnician: 'Tech-002',
      photoRequired: false,
      dataSync: 'SYNCED' as const
    }
  ]);
  
  const [mobileDevices] = useState([
    {
      id: 'device_001',
      name: 'Field Tablet 1',
      type: 'TABLET' as const,
      batteryLevel: 85,
      connectionStatus: 'ONLINE' as const,
      lastSync: new Date().toISOString(),
      assignedUser: 'Tech-001',
      location: 'Yard A',
      activeTasks: 3,
      pendingUploads: 2
    },
    {
      id: 'device_002',
      name: 'Mobile Scanner',
      type: 'SCANNER' as const,
      batteryLevel: 45,
      connectionStatus: 'OFFLINE' as const,
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      assignedUser: 'Tech-002',
      location: 'Yard B',
      activeTasks: 1,
      pendingUploads: 5
    }
  ]);
  
  // Phase 3: AI Decision Data
  const [aiRecommendations] = useState([
    {
      id: 'ai_rec_001',
      type: 'PROTOCOL_OPTIMIZATION' as const,
      animalId: 'AN-2024-001',
      animalName: 'Bella',
      title: 'Optimize Synchronization Protocol',
      description: 'AI suggests adjusting FSH dosage based on response pattern',
      confidence: 92,
      impact: 'HIGH' as const,
      reasoning: [
        'Historical response data shows 15% better outcomes with increased FSH',
        'Current follicle development pattern indicates suboptimal stimulation',
        'Similar cases responded well to protocol adjustment'
      ],
      suggestedActions: [
        'Increase FSH dosage to 150 IU',
        'Extend stimulation period by 1 day',
        'Schedule additional monitoring scan'
      ],
      predictedOutcome: {
        successRate: 87,
        timeToResult: 14,
        resourceSaving: 12
      },
      dataPoints: {
        historicalData: 245,
        similarCases: 67,
        modelAccuracy: 94
      },
      status: 'PENDING' as const,
      priority: 1,
      timestamp: new Date().toISOString()
    }
  ]);
  
  const [aiModels] = useState([
    {
      id: 'model_001',
      name: 'Ovulation Prediction Model',
      type: 'PREDICTION' as const,
      accuracy: 94.2,
      lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      dataPoints: 15847,
      status: 'ACTIVE' as const,
      version: '3.2.1',
      performance: {
        precision: 93.5,
        recall: 91.8,
        f1Score: 92.6
      }
    },
    {
      id: 'model_002',
      name: 'Response Score Classifier',
      type: 'CLASSIFICATION' as const,
      accuracy: 89.7,
      lastTrained: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      dataPoints: 8934,
      status: 'ACTIVE' as const,
      version: '2.1.5',
      performance: {
        precision: 88.2,
        recall: 90.3,
        f1Score: 89.2
      }
    }
  ]);
  
  const [predictiveAnalyses] = useState([
    {
      animalId: 'AN-2024-001',
      animalName: 'Bella',
      predictions: {
        ovulationTiming: {
          predictedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          confidence: 94,
          optimalWindow: {
            start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString()
          }
        },
        responseScore: {
          predicted: 8.2,
          factors: [
            { factor: 'Age', weight: 0.35 },
            { factor: 'Previous Response', weight: 0.28 },
            { factor: 'Body Condition', weight: 0.22 },
            { factor: 'Season', weight: 0.15 }
          ]
        },
        successProbability: {
          et: 87,
          opu: 92,
          flushing: 78
        },
        riskFactors: [
          {
            factor: 'Mild Uterine Inflammation',
            severity: 'MEDIUM' as const,
            mitigation: 'Pre-treatment with anti-inflammatory therapy recommended'
          }
        ]
      },
      lastUpdated: new Date().toISOString()
    }
  ]);
  
  // Phase 4: Reporting Data
  const [reportTemplates] = useState([
    {
      id: 'template_001',
      name: 'Daily Performance Summary',
      description: 'Comprehensive daily operations report',
      category: 'PERFORMANCE' as const,
      parameters: {
        dateRange: true,
        animalFilter: true,
        locationFilter: true,
        procedureFilter: true,
        customFields: ['success_rate', 'response_time']
      },
      visualizations: ['CHART' as const, 'TABLE' as const],
      frequency: 'DAILY' as const,
      lastGenerated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      scheduled: true
    },
    {
      id: 'template_002',
      name: 'Monthly Clinical Analysis',
      description: 'Detailed clinical outcomes and trends',
      category: 'CLINICAL' as const,
      parameters: {
        dateRange: true,
        animalFilter: true,
        locationFilter: false,
        procedureFilter: true,
        customFields: ['success_rate', 'complications', 'follow_up']
      },
      visualizations: ['DASHBOARD' as const, 'CHART' as const],
      frequency: 'MONTHLY' as const,
      scheduled: false
    }
  ]);
  
  const [analyticsData] = useState({
    performanceMetrics: {
      totalProcedures: 1247,
      successRate: 87.3,
      averageResponseTime: 3.2,
      utilizationRate: 78.5,
      costPerProcedure: 245.60
    },
    trendsData: Array.from({ length: 12 }, (_, i) => ({
      period: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short' }),
      procedures: Math.floor(Math.random() * 50) + 80,
      successRate: Math.floor(Math.random() * 20) + 75,
      costs: Math.floor(Math.random() * 5000) + 15000
    })),
    complianceData: {
      totalRecords: 1847,
      compliantRecords: 1821,
      auditScore: 98.6,
      missingData: 26
    },
    resourceUtilization: {
      veterinarians: [
        { name: 'Dr. Sarah Ahmed', utilization: 92, procedures: 234 },
        { name: 'Dr. Ahmad Ali', utilization: 87, procedures: 198 },
        { name: 'Dr. Fatima Hassan', utilization: 78, procedures: 156 },
        { name: 'Dr. Omar Abdullah', utilization: 82, procedures: 167 }
      ],
      locations: [
        { name: 'Yard A', capacity: 100, usage: 85 },
        { name: 'Yard B', capacity: 80, usage: 92 },
        { name: 'Field 1', capacity: 60, usage: 67 },
        { name: 'Barn 1', capacity: 40, usage: 78 }
      ],
      equipment: [
        { name: 'Ultrasound Unit 1', hours: 156, efficiency: 94 },
        { name: 'Ultrasound Unit 2', hours: 134, efficiency: 87 }
      ]
    }
  });
  
  const [customReports] = useState([
    {
      id: 'custom_001',
      title: 'Weekly Performance Analysis',
      description: 'Custom analysis of weekly performance metrics',
      parameters: {
        dateRange: { start: '2024-12-01', end: '2024-12-07' },
        animalTypes: ['BOVINE', 'EQUINE'],
        locations: ['YARD_A', 'YARD_B'],
        procedures: ['ET', 'OPU'],
        metrics: ['success_rate', 'cost_analysis']
      },
      visualizations: [
        {
          type: 'BAR' as const,
          data: [],
          title: 'Success Rates by Location'
        }
      ],
      generatedAt: new Date().toISOString(),
      status: 'READY' as const
    }
  ]);

  // Get animals for today's injections and tomorrow's exams
  const todayInjections = useMemo(() => {
    if (!vipAnimals || !Array.isArray(vipAnimals)) return [];
    return vipAnimals.filter(animal => {
      // Logic to determine if animal has injection today
      return animal.vipUltrasound?.currentInjection?.nextInjectionDate &&
        new Date(animal.vipUltrasound.currentInjection.nextInjectionDate).toDateString() === new Date().toDateString();
    });
  }, [vipAnimals]);

  const tomorrowExams = useMemo(() => {
    if (!vipAnimals || !Array.isArray(vipAnimals)) return [];
    return vipAnimals.filter(animal => {
      // Logic to determine if animal has exam tomorrow
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      return animal.reproductiveCycles?.currentStatus?.expectedNextEvent &&
        new Date(animal.reproductiveCycles.currentStatus.expectedNextEvent.date).toDateString() === tomorrow.toDateString();
    });
  }, [vipAnimals]);

  // Computed statistics for the VIP dashboard
  const stats = useMemo(() => {
    if (!vipAnimals || !Array.isArray(vipAnimals)) {
      return {
        total: 0,
        withUltrasound: 0,
        scheduledToday: 0,
        scheduledTomorrow: 0,
        hasWarnings: 0,
        urgentWarnings: 0,
        activeCycles: 0,
        totalEmbryos: 0
      };
    }
    
    return {
      total: vipAnimals.length,
      withUltrasound: vipAnimals.filter(a => a.vipUltrasound).length,
      scheduledToday: todayInjections.length,
      scheduledTomorrow: tomorrowExams.length,
      hasWarnings: vipAnimals.filter(a => a.warningFlags && a.warningFlags.length > 0).length,
      urgentWarnings: vipAnimals.filter(a => a.warningFlags && a.warningFlags.some(w => w.type === 'URGENT')).length,
      activeCycles: vipAnimals.filter(a => a.reproductiveCycles?.currentStatus?.phase !== 'RESTING').length,
      totalEmbryos: vipAnimals.reduce((sum, a) => sum + (a.reproductiveCycles?.embryoData?.totalCollected || 0), 0)
    };
  }, [vipAnimals, todayInjections, tomorrowExams]);

  // Note: Daily schedules are now computed via useMemo from VIP animal data

  // Load initial data and setup real-time subscriptions
  useEffect(() => {
    loadWorkflowData();
    // Temporarily disabled until backend is running
    // setupRealTimeSubscriptions();
    
    return () => {
      // Cleanup subscriptions on unmount
      // realTimeService.disconnect();
    };
  }, []);

  const setupRealTimeSubscriptions = () => {
    // Temporarily disabled - real-time service calls commented out until backend is ready
    /*
    // Subscribe to animal updates
    const animalSubscription = realTimeService.subscribe('animal_updates', (data) => {
      console.log('🐄 Real-time animal update:', data);
      updateAnimalInState(data);
      setLastSyncTime(new Date().toISOString());
    });

    // Subscribe to workflow progress
    const workflowSubscription = realTimeService.subscribe('workflow_progress', (data) => {
      console.log('⚙️ Real-time workflow update:', data);
      updateWorkflowProgress(data);
      setLastSyncTime(new Date().toISOString());
    });

    // Subscribe to injection completions
    const injectionSubscription = realTimeService.subscribe('injection_complete', (data) => {
      console.log('💉 Injection completed:', data);
      updateInjectionStatus(data);
      setLastSyncTime(new Date().toISOString());
    });

    // Subscribe to scan results
    const scanSubscription = realTimeService.subscribe('scan_results', (data) => {
      console.log('🔬 Scan results received:', data);
      updateScanResults(data);
      setLastSyncTime(new Date().toISOString());
    });

    // Subscribe to system status updates
    const systemSubscription = realTimeService.subscribe('system_status', (data) => {
      console.log('⚡ System status update:', data);
      setIsOnline(data.status !== 'offline');
    });

    // Store subscription IDs for cleanup if needed
    return {
      animalSubscription,
      workflowSubscription,
      injectionSubscription,
      scanSubscription,
      systemSubscription
    };
    */
    
    // Placeholder return for now
    return {};
  };

  const updateAnimalInState = (animalData: any) => {
    setEnhancedAnimals(prev => 
      prev.map(animal => 
        animal.animalID === animalData.animalId 
          ? { ...animal, ...animalData.updates, lastActivity: new Date().toISOString() }
          : animal
      )
    );
    
    // Cache the updated data
    mainCache.cacheAnimalData(animalData.animalId, animalData);
    
    // Add to real-time updates log
    setRealTimeUpdates(prev => [
      {
        id: `update_${Date.now()}`,
        type: 'ANIMAL_UPDATE',
        data: animalData,
        timestamp: new Date().toISOString()
      },
      ...prev.slice(0, 19) // Keep only last 20 updates
    ]);
  };

  const updateWorkflowProgress = (workflowData: any) => {
    setEnhancedAnimals(prev => 
      prev.map(animal => 
        animal.animalID === workflowData.animalId 
          ? { 
              ...animal, 
              activeWorkflow: { 
                ...animal.activeWorkflow, 
                ...workflowData.progress 
              },
              lastActivity: new Date().toISOString()
            }
          : animal
      )
    );

    // Cache workflow data
    mainCache.cacheWorkflowData(workflowData.workflowId, workflowData);
  };

  const updateInjectionStatus = (injectionData: any) => {
    setEnhancedAnimals(prev => 
      prev.map(animal => 
        animal.animalID === injectionData.animalId 
          ? { 
              ...animal, 
              todayInjection: {
                ...animal.todayInjection,
                status: 'COMPLETED',
                actualGivenTime: injectionData.completedAt,
                actualDosage: injectionData.actualDosage
              },
              lastActivity: new Date().toISOString()
            }
          : animal
      )
    );
  };

  const updateScanResults = (scanData: any) => {
    const latestActivity = {
      type: 'EXAM' as const,
      date: scanData.examDate,
      description: `${scanData.examType} ultrasound examination`,
      outcome: 'SUCCESS' as const,
      performedBy: scanData.veterinarian,
      notes: scanData.notes || ''
    };

    setEnhancedAnimals(prev => 
      prev.map(animal => 
        animal.animalID === scanData.animalId 
          ? { 
              ...animal, 
              latestActivity,
              lastActivityDate: scanData.examDate
            }
          : animal
      )
    );

    // Cache ultrasound results
    mainCache.cacheUltrasoundResults(scanData.animalId, scanData.examId, scanData);
  };

  // Enhanced Warning Detection System
  const getEnhancedAnimalWarnings = (
    animal: Animal, 
    ultrasounds: any[], 
    injections: any[], 
    activeWorkflow?: ActiveWorkflow
  ) => {
    const warnings: Array<{
      type: string;
      message: string;
      severity: string;
      since: string;
    }> = [];

    const now = new Date();
    const lastUpdate = new Date(animal.updatedAt);
    const daysSinceUpdate = Math.floor((now.getTime() - lastUpdate.getTime()) / (24 * 60 * 60 * 1000));

    // 1. Check for missing ultrasound scans
    const lastUltrasound = ultrasounds.length > 0 ? new Date(ultrasounds[0].examDate) : null;
    const daysSinceLastScan = lastUltrasound ? Math.floor((now.getTime() - lastUltrasound.getTime()) / (24 * 60 * 60 * 1000)) : 999;

    if (!lastUltrasound) {
      warnings.push({
        type: 'DATA_MISSING',
        message: '⚠️ No ultrasound scans recorded - Initial scan required',
        severity: 'HIGH',
        since: animal.createdAt
      });
    } else if (daysSinceLastScan > 14) {
      warnings.push({
        type: 'SCHEDULING_ALERT', 
        message: `⏰ Last scan was ${daysSinceLastScan} days ago - Overdue for scan`,
        severity: daysSinceLastScan > 30 ? 'URGENT' : 'HIGH',
        since: ultrasounds[0].examDate
      });
    }

    // 2. Check for workflow status
    if (!activeWorkflow) {
      warnings.push({
        type: 'WORKFLOW_ALERT',
        message: '🔄 No active workflow assigned - Ready to start procedures',
        severity: 'MEDIUM',
        since: animal.updatedAt
      });
    }

    // 3. Check for injection scheduling
    const animalTodayInjections = injections.filter(inj => {
      const injDate = new Date(inj.scheduledDate);
      return injDate.toDateString() === now.toDateString();
    });

    if (animalTodayInjections.length === 0 && activeWorkflow) {
      warnings.push({
        type: 'SCHEDULING_ALERT',
        message: '💉 No injections scheduled for today - Check protocol',
        severity: 'MEDIUM',
        since: new Date().toISOString()
      });
    }

    // 4. Check for overdue injections
    const overdueInjections = injections.filter(inj => {
      const injDate = new Date(inj.scheduledDate);
      return injDate < now && (inj.status === 'PENDING' || inj.status === 'SCHEDULED');
    });

    if (overdueInjections.length > 0) {
      warnings.push({
        type: 'SCHEDULING_ALERT',
        message: `💉 ${overdueInjections.length} overdue injection(s) - Immediate attention required`,
        severity: 'URGENT',
        since: overdueInjections[0].scheduledDate
      });
    }

    // 5. Check for inactive status
    if (animal.status !== 'ACTIVE') {
      warnings.push({
        type: 'HEALTH_CONCERN',
        message: `🚫 Animal status: ${animal.status} - Review needed`,
        severity: 'HIGH',
        since: animal.updatedAt
      });
    }

    // 6. Check for missing roles
    const activeRoles = animal.roles?.filter(r => r.isActive) || [];
    if (activeRoles.length === 0) {
      warnings.push({
        type: 'DATA_MISSING',
        message: '👥 No active roles assigned - Define animal purpose',
        severity: 'MEDIUM',
        since: animal.updatedAt
      });
    }

    // 7. Check for long periods without activity
    if (daysSinceUpdate > 7) {
      warnings.push({
        type: 'SCHEDULING_ALERT',
        message: `📅 No updates for ${daysSinceUpdate} days - Schedule checkup`,
        severity: daysSinceUpdate > 30 ? 'HIGH' : 'MEDIUM',
        since: animal.updatedAt
      });
    }

    // 8. Species-specific warnings
    if (animal.species === 'CAMEL' && !lastUltrasound) {
      warnings.push({
        type: 'DATA_MISSING',
        message: '🐪 Camel donor needs baseline follicle assessment',
        severity: 'HIGH',
        since: animal.createdAt
      });
    }

    return warnings;
  };

  useEffect(() => {
    loadWorkflowData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vipAnimals, filters]);

  // Generate sample VIP data for testing the redesigned hub
  const generateSampleVIPData = (): VIPClinicalAnimal[] => {
    const sampleAnimals: VIPClinicalAnimal[] = [];
    
    for (let i = 1; i <= 25; i++) {
      const species = ['CAMEL', 'BOVINE', 'EQUINE', 'OVINE', 'CAPRINE'][Math.floor(Math.random() * 5)];
      const roles = [
        { roleType: 'DONOR' as const, isActive: Math.random() > 0.5 },
        { roleType: 'RECIPIENT' as const, isActive: Math.random() > 0.7 },
        { roleType: 'BREEDING' as const, isActive: Math.random() > 0.8 }
      ].filter(r => r.isActive);
      
      const hasUltrasound = Math.random() > 0.2; // 80% have ultrasound data
      const daysAgo = Math.floor(Math.random() * 14) + 1;
      
      const animal: VIPClinicalAnimal = {
        animalID: `AN-2024-${String(i).padStart(3, '0')}`,
        name: `Animal-${i}`,
        species: species as 'CAMEL' | 'BOVINE' | 'EQUINE' | 'OVINE' | 'CAPRINE',
        breed: species === 'CAMEL' ? 'Dromedary' : species === 'BOVINE' ? 'Holstein' : 'Arabian',
        sex: Math.random() > 0.5 ? 'FEMALE' : 'MALE',
        dateOfBirth: new Date(Date.now() - Math.random() * 8 * 365 * 24 * 60 * 60 * 1000).toISOString(),
        currentInternalNumber: {
          internalNumber: `INT-${String(i).padStart(4, '0')}`,
          internalNumber2: `REF-${String(i).padStart(3, '0')}`,
          assignedDate: new Date().toISOString(),
          isActive: true
        },
        roles: roles,
        status: 'ACTIVE' as const,
        
        // Enhanced VIP Ultrasound Data with individual follicle sizes
        vipUltrasound: hasUltrasound ? {
          id: `us_${i}`,
          date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
          daysAgo: daysAgo,
          examType: ['ROUTINE', 'FOLLICLE_MONITORING', 'SUPEROVULATION', 'PREGNANCY_CHECK'][Math.floor(Math.random() * 4)] as any,
          
          leftOvary: {
            follicleCount: 0, // Will be set based on follicles array
            follicles: Array.from({ length: Math.floor(Math.random() * 8) + 2 }, () => Math.floor(Math.random() * 20) + 12), // 12-32mm
            dominantFollicles: Math.floor(Math.random() * 3) + 1,
            largestFollicle: 0, // Will be calculated
            clPresence: Math.random() > 0.6
          },
          rightOvary: {
            follicleCount: 0, // Will be set based on follicles array
            follicles: Array.from({ length: Math.floor(Math.random() * 6) + 1 }, () => Math.floor(Math.random() * 18) + 14), // 14-32mm
            dominantFollicles: Math.floor(Math.random() * 2) + 1,
            largestFollicle: 0, // Will be calculated
            clPresence: Math.random() > 0.7
          },
          totalFollicles: 0, // Will be calculated
          
          // Enhanced medical conditions
          endometritis: ['NONE', 'MILD', 'MODERATE', 'SEVERE'][Math.floor(Math.random() * 4)] as any,
          endometrialThickness: Math.floor(Math.random() * 8) + 4, // 4-12mm
          
          responseScore: ['POOR', 'FAIR', 'GOOD', 'EXCELLENT'][Math.floor(Math.random() * 4)] as any,
          breedingReadiness: ['READY', 'NOT_READY', 'NEEDS_TREATMENT', 'MONITOR'][Math.floor(Math.random() * 4)] as any,
          recommendedAction: 'Continue monitoring follicle development',
          
          currentInjection: Math.random() > 0.4 ? {
            medication: ['GnRH', 'FSH', 'LH', 'Prostaglandin'][Math.floor(Math.random() * 4)],
            daysFromInjection: Math.floor(Math.random() * 7) + 1,
            nextInjectionDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
          } : undefined,
          
          veterinarian: veterinarians[Math.floor(Math.random() * veterinarians.length)],
          notes: `Scan performed on ${new Date().toLocaleDateString()}`
        } : undefined,
        
        // Enhanced reproductive tracking
        reproductiveCycles: {
          superovulationCycles: {
            total: Math.floor(Math.random() * 8) + 1,
            successful: Math.floor(Math.random() * 6) + 1,
            currentCycleNumber: Math.random() > 0.6 ? Math.floor(Math.random() * 3) + 1 : undefined,
            currentCycleDay: Math.random() > 0.6 ? Math.floor(Math.random() * 14) + 1 : undefined,
            lastCycleDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
          },
          
          opuProcedures: {
            total: Math.floor(Math.random() * 5) + 1,
            successful: Math.floor(Math.random() * 4) + 1,
            lastProcedureDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
            averageOocytes: Math.floor(Math.random() * 15) + 8
          },
          
          flushingProcedures: {
            total: Math.floor(Math.random() * 6) + 1,
            successful: Math.floor(Math.random() * 5) + 1,
            lastProcedureDate: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000).toISOString(),
            averageEmbryos: Math.floor(Math.random() * 12) + 3
          },
          
          embryoData: {
            totalCollected: Math.floor(Math.random() * 25) + 5,
            totalTransferred: Math.floor(Math.random() * 15) + 2,
            totalFrozen: Math.floor(Math.random() * 10) + 1,
            currentInventory: Math.floor(Math.random() * 8) + 1,
            successfulPregnancies: Math.floor(Math.random() * 8) + 1,
            collectionRate: Math.random() * 5 + 3,
            pregnancyRate: Math.random() * 40 + 45
          },
          
          currentStatus: {
            phase: ['RESTING', 'SYNCHRONIZATION', 'SUPEROVULATION', 'COLLECTION', 'BREEDING', 'PREGNANCY'][Math.floor(Math.random() * 6)] as any,
            dayInPhase: Math.floor(Math.random() * 21) + 1,
            expectedNextEvent: {
              type: ['SCAN', 'INJECTION', 'OPU', 'FLUSHING', 'BREEDING'][Math.floor(Math.random() * 5)],
              date: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
              description: 'Next scheduled intervention'
            }
          }
        },
        
        // Current workflow information
        currentWorkflow: Math.random() > 0.3 ? {
          templateName: ['Superovulation Protocol', 'OPU Sequence', 'Embryo Transfer Prep', 'Breeding Schedule'][Math.floor(Math.random() * 4)],
          currentStep: ['Initial Scan', 'Hormone Injection', 'Follow-up Scan', 'Procedure Prep', 'Recovery'][Math.floor(Math.random() * 5)],
          stepNumber: Math.floor(Math.random() * 5) + 1,
          totalSteps: Math.floor(Math.random() * 3) + 6,
          progress: Math.floor(Math.random() * 80) + 10,
          status: ['ACTIVE', 'PAUSED'][Math.floor(Math.random() * 2)] as any,
          nextAction: ['Schedule injection', 'Perform scan', 'Monitor follicles', 'Prepare for OPU'][Math.floor(Math.random() * 4)],
          expectedDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        } : undefined,
        
        // Current assignment data
        yard: yards[Math.floor(Math.random() * yards.length)],
        assignedVet: veterinarians[Math.floor(Math.random() * veterinarians.length)],
        clinicalStatus: ['ACTIVE', 'MONITORING', 'TREATMENT', 'RECOVERY', 'HOLD'][Math.floor(Math.random() * 5)] as any,
        
        // Warning system
        warningFlags: Math.random() > 0.7 ? [
          {
            type: ['URGENT', 'WARNING', 'INFO'][Math.floor(Math.random() * 3)] as any,
            message: 'Sample warning message',
            daysOverdue: Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : undefined
          }
        ] : [],
        
        // Last activity summary
        lastActivity: {
          type: ['SCAN', 'INJECTION', 'PROCEDURE', 'EXAMINATION'][Math.floor(Math.random() * 4)] as any,
          date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Sample activity description',
          outcome: ['SUCCESS', 'FAILED', 'PARTIAL'][Math.floor(Math.random() * 3)] as any
        }
      };
      
      // Calculate follicle counts and sizes from individual follicle arrays
      if (animal.vipUltrasound) {
        // Left ovary calculations
        animal.vipUltrasound.leftOvary.follicleCount = animal.vipUltrasound.leftOvary.follicles.length;
        animal.vipUltrasound.leftOvary.largestFollicle = animal.vipUltrasound.leftOvary.follicles.length > 0 
          ? Math.max(...animal.vipUltrasound.leftOvary.follicles) 
          : 0;
        
        // Right ovary calculations
        animal.vipUltrasound.rightOvary.follicleCount = animal.vipUltrasound.rightOvary.follicles.length;
        animal.vipUltrasound.rightOvary.largestFollicle = animal.vipUltrasound.rightOvary.follicles.length > 0 
          ? Math.max(...animal.vipUltrasound.rightOvary.follicles) 
          : 0;
        
        // Total follicles
        animal.vipUltrasound.totalFollicles = animal.vipUltrasound.leftOvary.follicleCount + animal.vipUltrasound.rightOvary.follicleCount;
      }
      
      sampleAnimals.push(animal);
    }
    
    return sampleAnimals;
  };

  const loadWorkflowData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading VIP Reproductive Tracking Data for Clinical Hub...');
      
      // For testing the redesigned hub, use sample VIP data
      // TODO: Replace with actual API call to load VIP cross-module data
      try {
        const vipAnimalData = generateSampleVIPData();
        setVipAnimals(vipAnimalData);
        setFilteredAnimals(vipAnimalData);
        
        console.log(`✅ Generated ${vipAnimalData.length} VIP animals with comprehensive reproductive tracking`);
        
      } catch (error) {
        console.warn('⚠️ Failed to load VIP data, using fallback:', error);
        setVipAnimals([]);
        setFilteredAnimals([]);
      }
      
    } catch (error) {
      console.error('Error loading VIP reproductive data:', error);
      setVipAnimals([]);
      setFilteredAnimals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflowData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [vipAnimals, filters]);

  const applyFilters = () => {
    let filtered = [...(vipAnimals || [])];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(animal =>
        animal.currentInternalNumber?.internalNumber?.toLowerCase().includes(searchLower) ||
        animal.animalID?.toLowerCase().includes(searchLower) ||
        animal.name?.toLowerCase().includes(searchLower)
      );
    }

    // Species filter
    if (filters.species?.length > 0) {
      filtered = filtered.filter(animal => filters.species.includes(animal.species));
    }

    // Roles filter
    if (filters.roles?.length > 0) {
      filtered = filtered.filter(animal =>
        animal.roles && filters.roles.some(role =>
          animal.roles.some(animalRole => animalRole.role === role && animalRole.isActive)
        )
      );
    }

    // Yards filter
    if (filters.yards?.length > 0) {
      filtered = filtered.filter(animal => animal.yard && filters.yards.includes(animal.yard));
    }

    // Veterinarians filter
    if (filters.veterinarians?.length > 0) {
      filtered = filtered.filter(animal => animal.assignedVet && filters.veterinarians.includes(animal.assignedVet));
    }

    // Clinical status filter
    if (filters.clinicalStatus?.length > 0) {
      filtered = filtered.filter(animal => filters.clinicalStatus.includes(animal.clinicalStatus));
    }

    // Warning flags filter
    if (filters.hasOverdueTask) {
      filtered = filtered.filter(animal => 
        animal.warningFlags && animal.warningFlags.some(flag => flag.type === 'URGENT' && flag.daysOverdue)
      );
    }

    // Enhanced CL presence filter
    if (filters.clPresence !== 'ANY') {
      filtered = filtered.filter(animal => {
        if (!animal.vipUltrasound) return false;
        const leftCL = animal.vipUltrasound.leftOvary.clPresence;
        const rightCL = animal.vipUltrasound.rightOvary.clPresence;
        
        switch (filters.clPresence) {
          case 'LEFT_ONLY': return leftCL && !rightCL;
          case 'RIGHT_ONLY': return !leftCL && rightCL;
          case 'BOTH': return leftCL && rightCL;
          case 'NONE': return !leftCL && !rightCL;
          default: return true;
        }
      });
    }

    // Follicle size filter
    if (filters.follicleSize !== 'ANY') {
      filtered = filtered.filter(animal => {
        if (!animal.vipUltrasound) return false;
        const allFollicles = [
          ...animal.vipUltrasound.leftOvary.follicles,
          ...animal.vipUltrasound.rightOvary.follicles
        ];
        
        switch (filters.follicleSize) {
          case 'ABOVE_25MM': return allFollicles.some(size => size > 25);
          case 'ABOVE_20MM': return allFollicles.some(size => size > 20);
          case 'BELOW_15MM': return allFollicles.some(size => size < 15);
          default: return true;
        }
      });
    }

    // Endometritis filter
    if (filters.endometritis !== 'ANY') {
      filtered = filtered.filter(animal => {
        if (!animal.vipUltrasound) return false;
        
        switch (filters.endometritis) {
          case 'NONE': return animal.vipUltrasound.endometritis === 'NONE';
          case 'MILD': return animal.vipUltrasound.endometritis === 'MILD';
          case 'MODERATE': return animal.vipUltrasound.endometritis === 'MODERATE';
          case 'SEVERE': return animal.vipUltrasound.endometritis === 'SEVERE';
          case 'ANY_CONDITION': return animal.vipUltrasound.endometritis !== 'NONE';
          default: return true;
        }
      });
    }

    setFilteredAnimals(filtered);
  };

  // Translation
  const t = currentLanguage === 'en' ? {
    title: 'Clinical Hub',
    tabs: {
      animalSummary: 'Animal Summary',
      workflowDesigner: 'Workflow Template Designer',
      dailyOperations: 'Daily Operations',
      calendarPlan: 'Calendar Plan',
      decisionLog: 'Decision Log',
      reports: 'Reports'
    },
    filters: {
      search: 'Search animals...',
      species: 'Species',
      roles: 'Roles',
      yards: 'Yards',
      veterinarians: 'Veterinarians',
      clinicalStatus: 'Clinical Status',
      hasOverdueTask: 'Has Overdue Task'
    },
    buttons: {
      refresh: 'Refresh',
      export: 'Export',
      assign: 'Assign',
      schedule: 'Schedule'
    }
  } : {
    title: 'المركز السريري',
    tabs: {
      animalSummary: 'ملخص الحيوانات',
      workflowDesigner: 'مصمم قوالب سير العمل',
      dailyOperations: 'العمليات اليومية',
      calendarPlan: 'خطة التقويم',
      decisionLog: 'سجل القرارات',
      reports: 'التقارير'
    },
    filters: {
      search: 'البحث عن الحيوانات...',
      species: 'النوع',
      roles: 'الأدوار',
      yards: 'الساحات',
      veterinarians: 'الأطباء البيطريين',
      clinicalStatus: 'الحالة السريرية',
      hasOverdueTask: 'له مهمة متأخرة'
    },
    buttons: {
      refresh: 'تحديث',
      export: 'تصدير',
      assign: 'تعيين',
      schedule: 'جدولة'
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Enhanced Header with VIP Status */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Monitor className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
                <p className="text-gray-500">VIP Command Center - Reproductive Management Hub</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <button
                onClick={() => setCurrentLanguage(currentLanguage === 'en' ? 'ar' : 'en')}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                {currentLanguage === 'en' ? 'عربي' : 'English'}
              </button>
              
              {/* Refresh Button */}
              <button
                onClick={loadWorkflowData}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* VIP Dashboard Statistics */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Animals</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active Cycles</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.activeCycles}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Today's Injections</p>
                  <p className="text-2xl font-bold text-orange-600">{todayInjections.length}</p>
                </div>
                <Syringe className="h-8 w-8 text-orange-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Tomorrow's Scans</p>
                  <p className="text-2xl font-bold text-green-600">{tomorrowExams.length}</p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Warnings</p>
                  <p className="text-2xl font-bold text-red-600">{stats.hasWarnings}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Embryos</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalEmbryos}</p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6">
          <div className="flex space-x-8 border-b">
            {[
              { key: 'animals', label: t.tabs.animalSummary, icon: Users },
              { key: 'designer', label: t.tabs.workflowDesigner, icon: Zap },
              { key: 'operations', label: t.tabs.dailyOperations, icon: Activity },
              { key: 'calendar', label: t.tabs.calendarPlan, icon: Calendar },
              { key: 'decisions', label: t.tabs.decisionLog, icon: History },
              { key: 'reports', label: t.tabs.reports, icon: FileText }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Enhanced Filtering System */}
        {activeTab === 'animals' && (
          <>
            <div className="bg-white rounded-lg shadow border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Smart Filters & View Controls</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">View:</span>
                  <button
                    onClick={() => setViewMode('CARDS')}
                    className={`px-3 py-1 rounded ${viewMode === 'CARDS' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                  >
                    Cards
                  </button>
                  <button
                    onClick={() => setViewMode('TABLE')}
                    className={`px-3 py-1 rounded ${viewMode === 'TABLE' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                  >
                    Table
                  </button>
                </div>
              </div>

              {/* Enhanced Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t.filters.search}
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Species Filter */}
                <select
                  multiple
                  value={filters.species}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    species: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="CAMEL">🐪 Camel</option>
                  <option value="BOVINE">🐄 Bovine</option>
                  <option value="EQUINE">🐎 Equine</option>
                  <option value="OVINE">🐑 Ovine</option>
                  <option value="CAPRINE">🐐 Caprine</option>
                </select>

                {/* Roles Filter */}
                <select
                  multiple
                  value={filters.roles}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    roles: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="DONOR">🎯 Donor</option>
                  <option value="RECIPIENT">📥 Recipient</option>
                  <option value="BREEDING">💕 Breeding</option>
                </select>

                {/* CL Presence Filter */}
                <select
                  value={filters.clPresence}
                  onChange={(e) => setFilters({ ...filters, clPresence: e.target.value as any })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ANY">🟣 Any CL</option>
                  <option value="LEFT_ONLY">🟣 Left Only</option>
                  <option value="RIGHT_ONLY">🟣 Right Only</option>
                  <option value="BOTH">🟣 Both Ovaries</option>
                  <option value="NONE">⚪ No CL</option>
                </select>

                {/* Follicle Size Filter */}
                <select
                  value={filters.follicleSize}
                  onChange={(e) => setFilters({ ...filters, follicleSize: e.target.value as any })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ANY">📏 Any Size</option>
                  <option value="ABOVE_25MM">📏 Above 25mm</option>
                  <option value="ABOVE_20MM">📏 Above 20mm</option>
                  <option value="BELOW_15MM">📏 Below 15mm</option>
                </select>

                {/* Endometritis Filter */}
                <select
                  value={filters.endometritis}
                  onChange={(e) => setFilters({ ...filters, endometritis: e.target.value as any })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ANY">🔬 Any Condition</option>
                  <option value="NONE">✅ No Endometritis</option>
                  <option value="MILD">🟡 Mild</option>
                  <option value="MODERATE">🟠 Moderate</option>
                  <option value="SEVERE">🔴 Severe</option>
                  <option value="ANY_CONDITION">⚠️ Any Endometritis</option>
                </select>

                {/* Clinical Status Filter */}
                <select
                  multiple
                  value={filters.clinicalStatus}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    clinicalStatus: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ACTIVE">🟢 Active</option>
                  <option value="MONITORING">🟡 Monitoring</option>
                  <option value="TREATMENT">🔴 Treatment</option>
                  <option value="RECOVERY">🔵 Recovery</option>
                  <option value="HOLD">⚫ Hold</option>
                </select>

                {/* Quick Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilters({ ...filters, hasOverdueTask: !filters.hasOverdueTask })}
                    className={`px-3 py-2 rounded-lg ${filters.hasOverdueTask ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}
                  >
                    Overdue Only
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Horizontal Row Cards / Table View */}
            {viewMode === 'CARDS' ? (
              // HORIZONTAL ROW-LIKE CARDS LAYOUT
              <div className="space-y-2">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mr-4" />
                    <span className="text-gray-500">Loading VIP reproductive data...</span>
                  </div>
                ) : filteredAnimals.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No animals found matching the filters</p>
                  </div>
                ) : (
                  <>
                    {/* Bulk Selection Controls */}
                    <div className="bg-white rounded-lg shadow border p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            checked={selectedAnimals.length === filteredAnimals.length && filteredAnimals.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAnimals(filteredAnimals.map(a => a.animalID));
                              } else {
                                setSelectedAnimals([]);
                              }
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {selectedAnimals.length > 0 ? `${selectedAnimals.length} selected` : 'Select all'}
                          </span>
                        </div>
                        {selectedAnimals.length > 0 && (
                          <div className="flex space-x-2">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                              Bulk Assign Template
                            </button>
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                              Export Selected
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Horizontal Row Cards */}
                    {filteredAnimals.map(animal => (
                      <div key={animal.animalID} className="bg-white rounded-lg shadow border hover:shadow-md transition-all duration-200">
                        <div className="p-4">
                          <div className="flex items-center space-x-6">
                            {/* Selection Checkbox */}
                            <input
                              type="checkbox"
                              checked={selectedAnimals.includes(animal.animalID)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAnimals([...selectedAnimals, animal.animalID]);
                                } else {
                                  setSelectedAnimals(selectedAnimals.filter(id => id !== animal.animalID));
                                }
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />

                            {/* Animal Info */}
                            <div className="flex-shrink-0 w-48">
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  animal.clinicalStatus === 'ACTIVE' ? 'bg-green-500' :
                                  animal.clinicalStatus === 'MONITORING' ? 'bg-yellow-500' :
                                  animal.clinicalStatus === 'TREATMENT' ? 'bg-red-500' :
                                  animal.clinicalStatus === 'RECOVERY' ? 'bg-blue-500' : 'bg-gray-500'
                                }`}></div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 text-sm">{animal.name}</h3>
                                  <p className="text-xs text-gray-500">{animal.currentInternalNumber?.internalNumber}</p>
                                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                    {animal.species}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* VIP Follicle Display */}
                            <div className="flex-grow max-w-md">
                              <h4 className="font-medium text-blue-900 text-sm mb-2 flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                Follicles & CL Status
                              </h4>
                              {animal.vipUltrasound ? (
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-600">
                                    <span className="font-medium">L: {animal.vipUltrasound.leftOvary.follicleCount}</span>
                                    <span className="text-gray-500 ml-1">
                                      [{animal.vipUltrasound.leftOvary.follicles.join(', ')}mm]
                                    </span>
                                    <span className={`ml-2 w-2 h-2 rounded-full inline-block ${
                                      animal.vipUltrasound.leftOvary.clPresence ? 'bg-red-500' : 'bg-gray-300'
                                    }`} title={animal.vipUltrasound.leftOvary.clPresence ? 'CL Present' : 'No CL'}></span>
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    <span className="font-medium">R: {animal.vipUltrasound.rightOvary.follicleCount}</span>
                                    <span className="text-gray-500 ml-1">
                                      [{animal.vipUltrasound.rightOvary.follicles.join(', ')}mm]
                                    </span>
                                    <span className={`ml-2 w-2 h-2 rounded-full inline-block ${
                                      animal.vipUltrasound.rightOvary.clPresence ? 'bg-red-500' : 'bg-gray-300'
                                    }`} title={animal.vipUltrasound.rightOvary.clPresence ? 'CL Present' : 'No CL'}></span>
                                  </div>
                                  {animal.vipUltrasound.endometritis !== 'NONE' && (
                                    <div className={`text-xs px-2 py-1 rounded ${
                                      animal.vipUltrasound.endometritis === 'MILD' ? 'bg-yellow-100 text-yellow-800' :
                                      animal.vipUltrasound.endometritis === 'MODERATE' ? 'bg-orange-100 text-orange-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      Endometritis: {animal.vipUltrasound.endometritis}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p className="text-xs text-gray-500 italic">No ultrasound data</p>
                              )}
                            </div>

                            {/* Current Workflow */}
                            <div className="flex-shrink-0 w-48">
                              <h4 className="font-medium text-gray-900 text-sm mb-2 flex items-center">
                                <Zap className="h-4 w-4 mr-1" />
                                Current Workflow
                              </h4>
                              {animal.currentWorkflow ? (
                                <div className="space-y-1">
                                  <div className="text-xs text-gray-600">
                                    <span className="font-medium">{animal.currentWorkflow.templateName}</span>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Step {animal.currentWorkflow.stepNumber}/{animal.currentWorkflow.totalSteps}: {animal.currentWorkflow.currentStep}
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{ width: `${animal.currentWorkflow.progress}%` }}
                                    ></div>
                                  </div>
                                  <div className="text-xs text-blue-600 font-medium">
                                    Next: {animal.currentWorkflow.nextAction}
                                  </div>
                                </div>
                              ) : (
                                <p className="text-xs text-gray-500 italic">No active workflow</p>
                              )}
                            </div>

                            {/* Reproductive Status */}
                            <div className="flex-shrink-0 w-40">
                              <div className="space-y-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  animal.reproductiveCycles.currentStatus.phase === 'SUPEROVULATION' ? 'bg-purple-100 text-purple-800' :
                                  animal.reproductiveCycles.currentStatus.phase === 'COLLECTION' ? 'bg-orange-100 text-orange-800' :
                                  animal.reproductiveCycles.currentStatus.phase === 'BREEDING' ? 'bg-pink-100 text-pink-800' :
                                  animal.reproductiveCycles.currentStatus.phase === 'PREGNANCY' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {animal.reproductiveCycles.currentStatus.phase}
                                </span>
                                <div className="text-xs text-gray-500">
                                  Day {animal.reproductiveCycles.currentStatus.dayInPhase}
                                </div>
                                <div className="text-xs text-gray-600">
                                  Embryos: {animal.reproductiveCycles.embryoData.totalCollected}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex-shrink-0 flex space-x-2">
                              <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                                Quick Scan
                              </button>
                              <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">
                                <Eye className="h-3 w-3" />
                              </button>
                              <button className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200">
                                <Syringe className="h-3 w-3" />
                              </button>
                              <button className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs hover:bg-orange-200">
                                <Edit className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ) : (
              // ENHANCED TABLE VIEW
              <div className="bg-white rounded-lg shadow border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VIP Ultrasound</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reproductive Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center">
                            <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
                            <p className="text-gray-500">Loading VIP data...</p>
                          </td>
                        </tr>
                      ) : filteredAnimals.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No animals found</p>
                          </td>
                        </tr>
                      ) : (
                        filteredAnimals.map(animal => (
                          <tr key={animal.animalID} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-3 ${
                                  animal.clinicalStatus === 'ACTIVE' ? 'bg-green-500' :
                                  animal.clinicalStatus === 'MONITORING' ? 'bg-yellow-500' :
                                  animal.clinicalStatus === 'TREATMENT' ? 'bg-red-500' :
                                  'bg-gray-500'
                                }`}></div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{animal.name}</div>
                                  <div className="text-sm text-gray-500">{animal.currentInternalNumber?.internalNumber}</div>
                                  <div className="text-xs text-gray-400">{animal.species} • {animal.breed}</div>
                                </div>
                              </div>
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap">
                              {animal.vipUltrasound ? (
                                <div className="text-sm">
                                  <div className="font-medium text-gray-900">{animal.vipUltrasound.daysAgo} days ago</div>
                                  <div className="text-gray-500">Follicles: {animal.vipUltrasound.totalFollicles}</div>
                                  <div className="text-gray-500">CL: L{animal.vipUltrasound.leftOvary.clPresence ? '✓' : '✗'} R{animal.vipUltrasound.rightOvary.clPresence ? '✓' : '✗'}</div>
                                  <div className={`inline-block px-2 py-1 rounded-full text-xs ${
                                    animal.vipUltrasound.responseScore === 'EXCELLENT' ? 'bg-green-100 text-green-800' :
                                    animal.vipUltrasound.responseScore === 'GOOD' ? 'bg-blue-100 text-blue-800' :
                                    animal.vipUltrasound.responseScore === 'FAIR' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {animal.vipUltrasound.responseScore}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400 italic">No scan data</span>
                              )}
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="grid grid-cols-2 gap-2">
                                <div>SOV: {animal.reproductiveCycles.superovulationCycles.successful}/{animal.reproductiveCycles.superovulationCycles.total}</div>
                                <div>OPU: {animal.reproductiveCycles.opuProcedures.successful}/{animal.reproductiveCycles.opuProcedures.total}</div>
                                <div>Embryos: {animal.reproductiveCycles.embryoData.totalCollected}</div>
                                <div>Transferred: {animal.reproductiveCycles.embryoData.totalTransferred}</div>
                              </div>
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm">
                                <div className={`inline-block px-2 py-1 rounded-full text-xs mb-1 ${
                                  animal.reproductiveCycles.currentStatus.phase === 'SUPEROVULATION' ? 'bg-purple-100 text-purple-800' :
                                  animal.reproductiveCycles.currentStatus.phase === 'COLLECTION' ? 'bg-orange-100 text-orange-800' :
                                  animal.reproductiveCycles.currentStatus.phase === 'BREEDING' ? 'bg-pink-100 text-pink-800' :
                                  animal.reproductiveCycles.currentStatus.phase === 'PREGNANCY' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {animal.reproductiveCycles.currentStatus.phase}
                                </div>
                                <div className="text-gray-500">Day {animal.reproductiveCycles.currentStatus.dayInPhase}</div>
                                {animal.warningFlags.length > 0 && (
                                  <div className="flex items-center mt-1">
                                    <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                                    <span className="text-xs text-red-600">{animal.warningFlags.length} alert(s)</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-900">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="text-green-600 hover:text-green-900">
                                  <Stethoscope className="h-4 w-4" />
                                </button>
                                <button className="text-purple-600 hover:text-purple-900">
                                  <Syringe className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Workflow Template Designer Tab - PLACEHOLDER */}
        {activeTab === 'designer' && (
          <div className="bg-white rounded-lg shadow border p-8 text-center">
            <Zap className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Workflow Template Designer</h2>
            <p className="text-gray-600 mb-6">
              Visual drag-and-drop workflow builder for creating species-specific reproductive protocols
            </p>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-blue-800 font-medium">🚧 Coming in Phase 2</p>
              <p className="text-blue-600 text-sm mt-2">
                This will include the visual workflow builder with species selection, module palette, 
                condition-based branching, and injection scheduling as specified in your requirements.
              </p>
            </div>
          </div>
        )}

        {/* Other tabs placeholders */}
        {activeTab === 'operations' && (
          <div className="bg-white rounded-lg shadow border p-8 text-center">
            <Activity className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Daily Operations</h2>
            <p className="text-gray-600">Daily task management and scheduling</p>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-white rounded-lg shadow border p-8 text-center">
            <Calendar className="h-16 w-16 text-purple-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Calendar Planning</h2>
            <p className="text-gray-600">Integrated calendar view across all modules</p>
          </div>
        )}

        {activeTab === 'decisions' && (
          <div className="bg-white rounded-lg shadow border p-8 text-center">
            <History className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Decision Log</h2>
            <p className="text-gray-600">Track all clinical decisions and outcomes</p>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow border p-8 text-center">
            <FileText className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Advanced Reports</h2>
            <p className="text-gray-600">Comprehensive analytics and reporting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalHubPage; 