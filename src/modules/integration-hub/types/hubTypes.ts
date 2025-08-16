// Integration Hub Module - Comprehensive Type System
// Phase 4: Unified Workflow Management & Cross-Module Analytics

export interface WorkflowSession {
  // Core Identification
  id: string;
  sessionId: string;
  workflowType: 'COMPLETE_REPRODUCTION' | 'OPU_ONLY' | 'EMBRYO_TRANSFER_ONLY' | 'RESEARCH_PROTOCOL';
  
  // Timeline & Status
  startDate: Date;
  estimatedCompletion?: Date;
  actualCompletion?: Date;
  currentPhase: 'OPU' | 'EMBRYO_CULTURE' | 'TRANSFER_PREP' | 'TRANSFER' | 'PREGNANCY_MONITORING' | 'COMPLETED';
  overallStatus: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  
  // Participant Information
  donorId: string;
  donorInfo: {
    animalId: string;
    name: string;
    species: string;
    breed: string;
    age: number;
  };
  
  recipientIds: string[];
  recipientInfo: {
    animalId: string;
    name: string;
    species: string;
    breed: string;
    readinessScore: number;
  }[];
  
  // Phase-Specific Data
  opuData?: {
    sessionId: string;
    sessionDate: Date;
    oocytesRetrieved: number;
    oocytesGradeA: number;
    oocytesGradeB: number;
    oocytesGradeC: number;
    successRate: number;
    complications?: string[];
  };
  
  embryoData?: {
    totalEmbryos: number;
    viableEmbryos: number;
    frozenEmbryos: number;
    transferredEmbryos: number;
    embryoDetails: {
      id: string;
      stage: string;
      quality: string;
      status: 'IN_CULTURE' | 'FROZEN' | 'TRANSFERRED' | 'DISCARDED';
    }[];
  };
  
  transferData?: {
    totalTransfers: number;
    completedTransfers: number;
    successfulTransfers: number;
    pendingResults: number;
    transferDetails: {
      id: string;
      embryoId: string;
      recipientId: string;
      transferDate: Date;
      pregnancyStatus: string;
    }[];
  };
  
  // Performance Metrics
  metrics: {
    overallSuccessRate: number;
    timeToCompletion: number;
    costEfficiency: number;
    qualityScore: number;
    complianceScore: number;
  };
  
  // Team & Resources
  primaryVeterinarian: string;
  technicians: string[];
  facilitiesUsed: string[];
  equipmentUsed: string[];
  
  // Notes & Documentation
  notes: string;
  milestones: {
    phase: string;
    completedDate: Date;
    outcome: 'SUCCESS' | 'PARTIAL_SUCCESS' | 'FAILURE';
    notes: string;
  }[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CrossModuleAnalytics {
  // Module Performance
  modulePerformance: {
    opu: {
      totalSessions: number;
      successRate: number;
      averageOocytes: number;
      averageQuality: number;
    };
    embryoDetail: {
      totalEmbryos: number;
      developmentRate: number;
      transferRate: number;
      cryosurvivalRate: number;
    };
    embryoTransfer: {
      totalTransfers: number;
      pregnancyRate: number;
      livebirthRate: number;
      averageCost: number;
    };
  };
  
  // Workflow Efficiency
  workflowMetrics: {
    averageTimeToTransfer: number;
    averageTimeToPregnancy: number;
    bottleneckPhases: string[];
    efficiencyScore: number;
  };
  
  // Quality Trends
  qualityTrends: {
    oocyteQuality: { month: string; score: number }[];
    embryoQuality: { month: string; score: number }[];
    transferSuccess: { month: string; rate: number }[];
  };
  
  // Resource Utilization
  resourceUtilization: {
    equipmentUsage: { [key: string]: number };
    facilityUsage: { [key: string]: number };
    teamEfficiency: { [key: string]: number };
  };
  
  // Financial Analytics
  financialMetrics: {
    totalRevenue: number;
    totalCosts: number;
    profitMargin: number;
    costPerPregnancy: number;
    roi: number;
  };
}

export interface IntegrationDashboard {
  // Real-time Status
  activeWorkflows: number;
  pendingTransfers: number;
  pregnanciesThisMonth: number;
  todaysActivities: number;
  
  // Performance Summary
  overallSuccessRate: number;
  monthlyTargetProgress: number;
  qualityMetrics: {
    oocyteQuality: number;
    embryoQuality: number;
    transferSuccess: number;
  };
  
  // Recent Activities
  recentActivities: {
    type: 'OPU' | 'EMBRYO_UPDATE' | 'TRANSFER' | 'PREGNANCY_CHECK';
    description: string;
    timestamp: Date;
    status: 'SUCCESS' | 'WARNING' | 'ERROR';
  }[];
  
  // Alerts & Notifications
  criticalAlerts: {
    type: 'EQUIPMENT_FAILURE' | 'OVERDUE_TRANSFER' | 'QUALITY_DECLINE' | 'RESOURCE_SHORTAGE';
    message: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    timestamp: Date;
  }[];
  
  // Upcoming Schedule
  upcomingEvents: {
    type: 'OPU_SESSION' | 'TRANSFER_PROCEDURE' | 'PREGNANCY_CHECK' | 'MILESTONE_REVIEW';
    title: string;
    scheduledDate: Date;
    participants: string[];
  }[];
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  workflowType: string;
  estimatedDuration: number; // days
  targetSpecies: string[];
  
  phases: {
    id: string;
    name: string;
    description: string;
    estimatedDuration: number;
    dependencies: string[];
    requiredResources: string[];
    qualityCriteria: string[];
    successMetrics: {
      metric: string;
      target: number;
      threshold: number;
    }[];
  }[];
  
  isActive: boolean;
  successRate: number;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourceManagement {
  // Equipment Status
  equipment: {
    id: string;
    name: string;
    type: 'ULTRASOUND' | 'INCUBATOR' | 'MICROSCOPE' | 'CENTRIFUGE' | 'FREEZER';
    status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'OFFLINE';
    currentUser?: string;
    nextMaintenance: Date;
    utilizationRate: number;
  }[];
  
  // Facility Availability
  facilities: {
    id: string;
    name: string;
    type: 'OPU_ROOM' | 'LAB' | 'TRANSFER_ROOM' | 'STORAGE';
    capacity: number;
    currentOccupancy: number;
    schedule: {
      date: Date;
      bookings: {
        startTime: string;
        endTime: string;
        workflowId: string;
        type: string;
      }[];
    }[];
  }[];
  
  // Team Availability
  team: {
    id: string;
    name: string;
    role: 'VETERINARIAN' | 'TECHNICIAN' | 'RESEARCHER' | 'MANAGER';
    specializations: string[];
    workload: number; // 0-100%
    currentAssignments: string[];
    schedule: {
      date: Date;
      availability: {
        startTime: string;
        endTime: string;
        status: 'AVAILABLE' | 'BUSY' | 'OFF_DUTY';
      }[];
    }[];
  }[];
}

export interface QualityControlMetrics {
  // Module-Specific Quality
  moduleQuality: {
    opu: {
      oocyteRecoveryRate: number;
      gradeAPercentage: number;
      complicationRate: number;
      protocolCompliance: number;
    };
    embryoCulture: {
      developmentRate: number;
      blastocystRate: number;
      gradingAccuracy: number;
      cultureConsistency: number;
    };
    transfer: {
      transferEfficiency: number;
      pregnancyRate: number;
      complicationRate: number;
      protocolAdherence: number;
    };
  };
  
  // Cross-Module Quality
  workflowQuality: {
    dataIntegrity: number;
    processConsistency: number;
    outcomeReproducibility: number;
    standardCompliance: number;
  };
  
  // Continuous Improvement
  improvementTracking: {
    month: string;
    targetMetrics: { [key: string]: number };
    actualMetrics: { [key: string]: number };
    improvementRate: number;
  }[];
}

// Constants
export const WORKFLOW_TYPES = [
  'COMPLETE_REPRODUCTION',
  'OPU_ONLY',
  'EMBRYO_TRANSFER_ONLY',
  'RESEARCH_PROTOCOL'
] as const;

export const WORKFLOW_PHASES = [
  'OPU',
  'EMBRYO_CULTURE',
  'TRANSFER_PREP',
  'TRANSFER',
  'PREGNANCY_MONITORING',
  'COMPLETED'
] as const;

export const WORKFLOW_STATUSES = [
  'ACTIVE',
  'PAUSED',
  'COMPLETED',
  'FAILED',
  'CANCELLED'
] as const;

export const ALERT_TYPES = [
  'EQUIPMENT_FAILURE',
  'OVERDUE_TRANSFER',
  'QUALITY_DECLINE',
  'RESOURCE_SHORTAGE'
] as const;

export const ACTIVITY_TYPES = [
  'OPU',
  'EMBRYO_UPDATE',
  'TRANSFER',
  'PREGNANCY_CHECK'
] as const; 