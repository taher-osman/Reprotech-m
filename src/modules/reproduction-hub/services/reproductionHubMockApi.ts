// Mock API Service for Reproduction Hub Module
// TODO: Replace all mock functions with real API calls when backend is ready

import { 
  EnhancedReproductiveAnimal,
  WorkflowTemplate,
  ActiveWorkflow,
  DailyInjection,
  NextDayExam,
  BulkWorkflowAssignment,
  DailyOperationsOverview,
  ReproductionHubApiService,
  MockReproductiveData
} from '../types/workflowTypes';

// Mock Data Generation with Complete Reproductive Information
const generateMockAnimals = (): EnhancedReproductiveAnimal[] => {
  const species = ['CAMEL', 'BOVINE', 'EQUINE', 'OVINE'];
  const breeds = {
    'CAMEL': ['Dromedary', 'Bactrian', 'Arabian'],
    'BOVINE': ['Holstein', 'Angus', 'Hereford', 'Brahman'],
    'EQUINE': ['Arabian', 'Thoroughbred', 'Quarter Horse'],
    'OVINE': ['Merino', 'Suffolk', 'Dorset']
  };
  const roles = ['DONOR', 'RECIPIENT', 'BREEDING'];
  const yards = ['A1', 'A2', 'B1', 'B2', 'C1'];
  const vets = ['Dr. Ahmed Al-Rashid', 'Dr. Sarah Johnson', 'Dr. Mohammed Hassan', 'Dr. Fatima Al-Zahra'];
  const statuses = ['ACTIVE', 'MONITORING', 'TREATMENT', 'RECOVERY'] as const;
  const medications = ['FSH', 'LH', 'GnRH', 'PGF2α', 'Estradiol', 'Progesterone'];
  const workflowTemplates = ['Camel Superovulation Protocol', 'Bovine MOET Program', 'Equine Embryo Transfer', 'Ovine Synchronization'];
  const steps = ['Pre-treatment Exam', 'FSH Injection Day 1', 'FSH Injection Day 2', 'FSH Injection Day 3', 'LH Injection', 'Ovulation Check', 'Embryo Collection', 'Transfer Preparation'];

  return Array.from({ length: 30 }, (_, i) => {
    const animalSpecies = species[i % species.length];
    const animalRole = roles[i % roles.length];
    const daysAgoUltrasound = Math.floor(Math.random() * 10) + 1;
    const daysAgoInjection = Math.floor(Math.random() * 5) + 1;
    const hasActiveWorkflow = Math.random() > 0.3;
    
    // Generate follicle data based on realistic ranges
    const generateFollicles = () => {
      const count = Math.floor(Math.random() * 8) + 2; // 2-9 follicles
      const follicles = [];
      for (let j = 0; j < count; j++) {
        // Generate realistic follicle sizes
        const size = Math.random() > 0.3 ? 
          Math.floor(Math.random() * 20) + 5 : // 5-25mm
          Math.floor(Math.random() * 15) + 25; // 25-40mm for dominant
        follicles.push(size);
      }
      return follicles.sort((a, b) => b - a);
    };

    const leftFollicles = generateFollicles();
    const rightFollicles = generateFollicles();
    const hasLeftCL = Math.random() > 0.6;
    const hasRightCL = Math.random() > 0.7;

    return {
      // Base Animal Data
      animalID: `ANM-${(i + 1).toString().padStart(3, '0')}`,
      name: `${animalSpecies.charAt(0)}${animalRole.charAt(0)}-${(i + 1).toString().padStart(2, '0')}`,
      species: animalSpecies,
      breed: breeds[animalSpecies as keyof typeof breeds][Math.floor(Math.random() * breeds[animalSpecies as keyof typeof breeds].length)],
      sex: animalRole === 'BREEDING' ? (Math.random() > 0.5 ? 'MALE' : 'FEMALE') : 'FEMALE',
      age: Math.floor(Math.random() * 8) + 3, // 3-10 years
      currentInternalNumber: { internalNumber: `RT-${Date.now()}-${(i + 1).toString().padStart(3, '0')}` },
      roles: [{ 
        role: animalRole, 
        isActive: true 
      }],
      yard: yards[i % yards.length],
      assignedVet: vets[i % vets.length],

      // Current Workflow Information - CRITICAL
      activeWorkflow: hasActiveWorkflow ? {
        id: `WF-${i + 1}`,
        templateName: workflowTemplates[Math.floor(i / 7) % workflowTemplates.length],
        currentStep: steps[Math.floor(Math.random() * steps.length)],
        stepNumber: Math.floor(Math.random() * 6) + 2,
        totalSteps: 8,
        progress: Math.floor(Math.random() * 80) + 10,
        status: ['ACTIVE', 'PAUSED'][Math.floor(Math.random() * 2)] as any,
        startedDate: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
        daysInWorkflow: Math.floor(Math.random() * 14) + 1,
        nextAction: Math.random() > 0.5 ? 'Schedule ultrasound examination' : 'Administer FSH injection',
        expectedNextDate: new Date(Date.now() + Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString()
      } : undefined,

      // Last Ultrasound - CRITICAL
      lastUltrasound: {
        id: `US-${i + 1}`,
        examDate: new Date(Date.now() - daysAgoUltrasound * 24 * 60 * 60 * 1000).toISOString(),
        daysAgo: daysAgoUltrasound,
        examType: ['ROUTINE', 'FOLLICLE_MONITORING', 'PREGNANCY_CHECK', 'POST_PROCEDURE'][Math.floor(Math.random() * 4)] as any,
        
        leftCL: {
          present: hasLeftCL,
          size: hasLeftCL ? Math.floor(Math.random() * 10) + 15 : undefined, // 15-25mm
          quality: hasLeftCL ? ['FAIR', 'GOOD', 'EXCELLENT'][Math.floor(Math.random() * 3)] as any : undefined
        },
        rightCL: {
          present: hasRightCL,
          size: hasRightCL ? Math.floor(Math.random() * 10) + 15 : undefined,
          quality: hasRightCL ? ['FAIR', 'GOOD', 'EXCELLENT'][Math.floor(Math.random() * 3)] as any : undefined
        },
        
        leftOvary: {
          follicleCount: leftFollicles.length,
          follicles: leftFollicles,
          dominantFollicle: leftFollicles[0]
        },
        rightOvary: {
          follicleCount: rightFollicles.length,
          follicles: rightFollicles,
          dominantFollicle: rightFollicles[0]
        },
        
        uterineStatus: {
          endometritis: ['NONE', 'MILD', 'MODERATE'][Math.floor(Math.random() * 3)] as any,
          endometrialThickness: Math.floor(Math.random() * 8) + 3, // 3-10mm
          tone: ['FAIR', 'GOOD', 'EXCELLENT'][Math.floor(Math.random() * 3)] as any,
          fluid: Math.random() > 0.8
        },
        
        overallAssessment: ['FAIR', 'GOOD', 'EXCELLENT'][Math.floor(Math.random() * 3)] as any,
        breedingReadiness: ['NOT_READY', 'MONITOR', 'READY', 'OPTIMAL'][Math.floor(Math.random() * 4)] as any,
        recommendations: Math.random() > 0.5 ? ['Continue monitoring follicle development', 'Schedule LH injection in 2 days'] : ['Check for signs of estrus', 'Repeat examination in 3 days'],
        
        veterinarian: vets[i % vets.length],
        notes: Math.random() > 0.7 ? 'Good ovarian response, multiple follicles developing well' : undefined
      },

      // Last Injection - CRITICAL
      lastInjection: Math.random() > 0.2 ? {
        id: `INJ-${i + 1}`,
        date: new Date(Date.now() - daysAgoInjection * 24 * 60 * 60 * 1000).toISOString(),
        daysAgo: daysAgoInjection,
        medication: medications[Math.floor(Math.random() * medications.length)],
        dosage: `${Math.floor(Math.random() * 4) + 1}.${Math.floor(Math.random() * 9)}ml`,
        route: ['IM', 'IV', 'SC'][Math.floor(Math.random() * 3)] as any,
        givenBy: vets[Math.floor(Math.random() * vets.length)],
        workflowRelated: hasActiveWorkflow && Math.random() > 0.3,
        nextInjectionDue: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        notes: Math.random() > 0.8 ? 'No adverse reactions observed' : undefined
      } : undefined,

      // Reproductive History - CRITICAL
      reproductiveHistory: {
        totalCycles: Math.floor(Math.random() * 15) + 3,
        successfulCycles: Math.floor(Math.random() * 12) + 2,
        totalTransfers: animalRole === 'RECIPIENT' ? Math.floor(Math.random() * 8) + 1 : 0,
        successfulTransfers: animalRole === 'RECIPIENT' ? Math.floor(Math.random() * 6) + 1 : 0,
        totalOPUProcedures: animalRole === 'DONOR' ? Math.floor(Math.random() * 12) + 2 : 0,
        successfulOPUProcedures: animalRole === 'DONOR' ? Math.floor(Math.random() * 10) + 1 : 0,
        totalFlushingProcedures: animalRole === 'DONOR' ? Math.floor(Math.random() * 8) + 1 : 0,
        successfulFlushingProcedures: animalRole === 'DONOR' ? Math.floor(Math.random() * 6) + 1 : 0,
        lastProcedureDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        lastProcedureType: animalRole === 'DONOR' ? (Math.random() > 0.5 ? 'OPU' : 'Flushing') : 'Embryo Transfer',
        successRate: Math.floor(Math.random() * 40) + 50 // 50-90%
      },

      // Next Scheduled Examination - CRITICAL
      nextExamination: Math.random() > 0.3 ? {
        date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        daysUntil: Math.floor(Math.random() * 7) + 1,
        type: ['ROUTINE', 'FOLLICLE_MONITORING', 'PREGNANCY_CHECK'][Math.floor(Math.random() * 3)] as any,
        assignedVet: vets[Math.floor(Math.random() * vets.length)],
        room: `Room ${Math.floor(Math.random() * 3) + 1}`,
        isOverdue: Math.random() > 0.85
      } : undefined,

      // Warning Flags - CRITICAL
      warningFlags: (() => {
        const warnings = [];
        if (Math.random() > 0.7) {
          warnings.push({
            id: `W-${i + 1}-1`,
            type: ['CRITICAL', 'WARNING', 'INFO'][Math.floor(Math.random() * 3)] as any,
            category: ['HEALTH', 'SCHEDULING', 'WORKFLOW', 'BREEDING', 'MEDICATION'][Math.floor(Math.random() * 5)] as any,
            message: [
              'Ultrasound examination overdue by 3 days',
              'Low follicle response detected',
              'Next injection due tomorrow',
              'Breeding readiness declining',
              'Uterine inflammation detected'
            ][Math.floor(Math.random() * 5)],
            severity: ['MEDIUM', 'HIGH', 'CRITICAL'][Math.floor(Math.random() * 3)] as any,
            since: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
            daysOverdue: Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : undefined,
            actionRequired: 'Schedule immediate examination'
          });
        }
        return warnings;
      })(),

      // Additional Status Information
      reproductiveStatus: statuses[i % statuses.length],
      breedingReadiness: ['NOT_READY', 'MONITOR', 'READY', 'OPTIMAL'][Math.floor(Math.random() * 4)] as any,
      lastActivityDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),

      // Workflow and scheduling data
      workflowHistory: [],
      todayInjection: Math.random() > 0.7 ? {
        id: `INJ-TODAY-${i + 1}`,
        animalId: `ANM-${(i + 1).toString().padStart(3, '0')}`,
        animalName: `${animalSpecies.charAt(0)}${animalRole.charAt(0)}-${(i + 1).toString().padStart(2, '0')}`,
        internalNumber: `RT-${Date.now()}-${(i + 1).toString().padStart(3, '0')}`,
        species: animalSpecies,
        medication: medications[Math.floor(Math.random() * medications.length)],
        dosage: `${Math.floor(Math.random() * 4) + 1}.${Math.floor(Math.random() * 9)}ml`,
        route: ['IM', 'IV', 'SC'][Math.floor(Math.random() * 3)] as any,
        scheduledTime: `${Math.floor(Math.random() * 4) + 8}:00`,
        status: ['SCHEDULED', 'COMPLETED', 'OVERDUE'][Math.floor(Math.random() * 3)] as any,
        isNullAssignment: false,
        assignedBy: vets[i % vets.length],
        yard: yards[i % yards.length],
        assignedTechnician: `Tech ${Math.floor(Math.random() * 3) + 1}`,
        estimatedDuration: 15
      } : undefined,
      injectionHistory: [],
      nextDayExam: undefined,
      examHistory: [],

      // Performance Metrics
      workflowSuccessRate: Math.floor(Math.random() * 40) + 60,
      totalProcedures: Math.floor(Math.random() * 25) + 5,
      successfulProcedures: Math.floor(Math.random() * 20) + 3,

      // Latest Activity
      latestActivity: {
        type: ['EXAM', 'INJECTION', 'PROCEDURE'][Math.floor(Math.random() * 3)] as any,
        date: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
        description: [
          'Ultrasound examination completed',
          'FSH injection administered',
          'Follicle monitoring performed',
          'Pregnancy check completed'
        ][Math.floor(Math.random() * 4)],
        outcome: ['SUCCESS', 'PARTIAL'][Math.floor(Math.random() * 2)] as any,
        performedBy: vets[i % vets.length]
      },

      // Suggested Actions
      suggestedAction: Math.random() > 0.6 ? {
        type: ['SCHEDULE_EXAM', 'SCHEDULE_INJECTION', 'START_WORKFLOW', 'MANUAL_REVIEW'][Math.floor(Math.random() * 4)] as any,
        description: [
          'Schedule follicle monitoring examination',
          'Administer next FSH injection',
          'Begin superovulation protocol',
          'Review breeding readiness status'
        ][Math.floor(Math.random() * 4)],
        urgency: ['MEDIUM', 'HIGH'][Math.floor(Math.random() * 2)] as any,
        deadline: new Date(Date.now() + Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString()
      } : undefined
    };
  });
};

const generateMockWorkflowTemplates = (): WorkflowTemplate[] => {
  return [
    {
      id: 'WT-001',
      name: 'Camel Superovulation Protocol - Complete',
      description: 'Advanced superovulation protocol for camel donors with conditional logic and module integration',
      category: 'DONOR_COMPLETE',
      applicableRoles: ['DONOR'],
      applicableSpecies: ['CAMEL'],
      steps: [
        {
          id: 'step-1',
          name: 'Initial Assessment & Uterine Preparation',
          description: 'Comprehensive health evaluation, ultrasound examination, and uterine lavage preparation',
          stepType: 'EXAM',
          order: 1,
          entryConditions: [{
            id: 'entry-1',
            field: 'days_since_last_calving',
            operator: '>=',
            value: 60,
            logicalOperator: 'AND'
          }],
          onStartActions: [{
            id: 'action-1',
            type: 'SCHEDULE_EXAM',
            targetModule: 'ULTRASOUND',
            parameters: { examType: 'COMPREHENSIVE_BASELINE', room: 'Ultrasound Room 1' }
          }],
          exitConditions: [{
            id: 'exit-1',
            field: 'uterine_inflammation',
            operator: '==',
            value: 'NONE',
            logicalOperator: 'AND'
          }, {
            id: 'exit-2',
            field: 'follicle_count',
            operator: '>=',
            value: 3,
            logicalOperator: 'AND'
          }],
          onSuccessActions: [{
            id: 'success-1',
            type: 'SCHEDULE_PROCEDURE',
            targetModule: 'CALENDAR',
            parameters: { procedureType: 'UTERINE_LAVAGE', scheduleDays: 1 }
          }],
          onFailureActions: [{
            id: 'failure-1',
            type: 'SCHEDULE_PROCEDURE',
            targetModule: 'CALENDAR',
            parameters: { procedureType: 'TREATMENT_PLAN', scheduleDays: 7 }
          }],
          successNextStep: 'step-2',
          failureNextStep: 'step-treatment',
          estimatedDuration: 1,
          isManualStep: false,
          displayInDashboard: true,
          notificationRequired: true
        },
        {
          id: 'step-2',
          name: 'GnRH Injection - Follicle Size Dependent',
          description: 'GnRH injection when follicles reach 10-19mm diameter with ovulation monitoring',
          stepType: 'INJECTION',
          order: 2,
          entryConditions: [{
            id: 'follicle-size',
            field: 'dominant_follicle_size',
            operator: '>=',
            value: 10,
            logicalOperator: 'AND'
          }, {
            id: 'follicle-max',
            field: 'dominant_follicle_size',
            operator: '<=',
            value: 19,
            logicalOperator: 'AND'
          }],
          onStartActions: [{
            id: 'gnrh-injection',
            type: 'SCHEDULE_INJECTION',
            targetModule: 'INJECTION',
            parameters: { medication: 'GnRH', dosage: '100μg', route: 'IM' }
          }],
          exitConditions: [{
            id: 'injection-completed',
            field: 'injection_status',
            operator: '==',
            value: 'COMPLETED',
            logicalOperator: 'AND'
          }],
          onSuccessActions: [{
            id: 'schedule-followup',
            type: 'SCHEDULE_EXAM',
            targetModule: 'ULTRASOUND',
            parameters: { examType: 'OVULATION_CHECK', scheduleDays: 4 }
          }],
          onFailureActions: [{
            id: 'retry-injection',
            type: 'SCHEDULE_INJECTION',
            targetModule: 'INJECTION',
            parameters: { medication: 'GnRH', dosage: '100μg', route: 'IM', scheduleDays: 1 }
          }],
          successNextStep: 'step-3',
          failureNextStep: 'step-2', // Retry
          estimatedDuration: 1,
          maxWaitDays: 2,
          isManualStep: true,
          displayInDashboard: true,
          notificationRequired: true
        },
        {
          id: 'step-3',
          name: 'Ovulation Confirmation (Day 4)',
          description: 'Ultrasound examination to confirm ovulation (CL presence) and absence of large follicles',
          stepType: 'EXAM',
          order: 3,
          entryConditions: [{
            id: 'time-since-gnrh',
            field: 'days_since_gnrh',
            operator: '>=',
            value: 4,
            logicalOperator: 'AND'
          }],
          onStartActions: [{
            id: 'ovulation-check',
            type: 'SCHEDULE_EXAM',
            targetModule: 'ULTRASOUND',
            parameters: { examType: 'OVULATION_MONITORING' }
          }],
          exitConditions: [{
            id: 'cl-present',
            field: 'cl_presence',
            operator: '==',
            value: true,
            logicalOperator: 'AND'
          }, {
            id: 'no-large-follicles',
            field: 'large_follicles_count',
            operator: '==',
            value: 0,
            logicalOperator: 'AND'
          }],
          onSuccessActions: [{
            id: 'start-superovulation',
            type: 'SCHEDULE_INJECTION',
            targetModule: 'INJECTION',
            parameters: { medication: 'FSH', dosage: '5ml', route: 'IM', scheduleDays: 1 }
          }],
          onFailureActions: [{
            id: 'delay-protocol',
            type: 'WAIT_DAYS',
            targetModule: 'CALENDAR',
            parameters: { days: 3, reason: 'AWAITING_OVULATION' }
          }],
          successNextStep: 'step-4',
          failureNextStep: 'step-3-retry',
          estimatedDuration: 1,
          maxWaitDays: 3,
          isManualStep: false,
          displayInDashboard: true,
          notificationRequired: true
        },
        {
          id: 'step-4',
          name: 'Superovulation Injection Program',
          description: 'FSH injection series for 4 days with decreasing doses to stimulate multiple ovulation',
          stepType: 'INJECTION',
          order: 4,
          onStartActions: [{
            id: 'fsh-day1',
            type: 'SCHEDULE_INJECTION',
            targetModule: 'INJECTION',
            parameters: { medication: 'FSH', dosage: '5ml', route: 'IM', scheduleDays: 0, time: '08:00' }
          }, {
            id: 'fsh-day1-pm',
            type: 'SCHEDULE_INJECTION',
            targetModule: 'INJECTION',
            parameters: { medication: 'FSH', dosage: '5ml', route: 'IM', scheduleDays: 0, time: '20:00' }
          }],
          exitConditions: [{
            id: 'all-injections-completed',
            field: 'fsh_injection_series_status',
            operator: '==',
            value: 'COMPLETED',
            logicalOperator: 'AND'
          }],
          onSuccessActions: [{
            id: 'follicle-monitoring',
            type: 'SCHEDULE_EXAM',
            targetModule: 'ULTRASOUND',
            parameters: { examType: 'FOLLICLE_DEVELOPMENT_CHECK', scheduleDays: 6 }
          }],
          onFailureActions: [{
            id: 'injection-problem',
            type: 'NOTIFY',
            targetModule: 'INTERNAL',
            parameters: { message: 'FSH injection series incomplete - veterinary review required' }
          }],
          successNextStep: 'step-5',
          failureNextStep: 'step-manual-review',
          estimatedDuration: 6,
          maxWaitDays: 8,
          isManualStep: true,
          displayInDashboard: true,
          notificationRequired: true
        },
        {
          id: 'step-5',
          name: 'Pre-Breeding Follicle Assessment',
          description: 'Final ultrasound to count follicles and confirm readiness for breeding',
          stepType: 'EXAM',
          order: 5,
          entryConditions: [{
            id: 'fsh-series-complete',
            field: 'fsh_series_completed',
            operator: '==',
            value: true,
            logicalOperator: 'AND'
          }],
          onStartActions: [{
            id: 'final-follicle-count',
            type: 'SCHEDULE_EXAM',
            targetModule: 'ULTRASOUND',
            parameters: { examType: 'PRE_BREEDING_ASSESSMENT' }
          }],
          exitConditions: [{
            id: 'adequate-follicles',
            field: 'follicle_count',
            operator: '>=',
            value: 6,
            logicalOperator: 'AND'
          }, {
            id: 'no-cl-present',
            field: 'cl_presence',
            operator: '==',
            value: false,
            logicalOperator: 'AND'
          }],
          onSuccessActions: [{
            id: 'assign-to-breeding',
            type: 'UPDATE_STATUS',
            targetModule: 'INTERNAL',
            parameters: { status: 'READY_FOR_BREEDING', module: 'BREEDING' }
          }],
          onFailureActions: [{
            id: 'poor-response',
            type: 'NOTIFY',
            targetModule: 'INTERNAL',
            parameters: { message: 'Poor superovulation response - consider rescue protocol' }
          }],
          successNextStep: 'step-6',
          failureNextStep: 'step-rescue-protocol',
          estimatedDuration: 1,
          isManualStep: false,
          displayInDashboard: true,
          notificationRequired: true
        },
        {
          id: 'step-6',
          name: 'Breeding Assignment & Male Selection',
          description: 'Animal ready for breeding - assign to breeding module for male selection based on availability',
          stepType: 'PROCEDURE',
          order: 6,
          entryConditions: [{
            id: 'breeding-ready',
            field: 'breeding_readiness',
            operator: '==',
            value: 'READY',
            logicalOperator: 'AND'
          }],
          onStartActions: [{
            id: 'breeding-assignment',
            type: 'SCHEDULE_PROCEDURE',
            targetModule: 'BREEDING',
            parameters: { procedureType: 'NATURAL_BREEDING', priority: 'HIGH' }
          }],
          exitConditions: [{
            id: 'breeding-completed',
            field: 'breeding_status',
            operator: '==',
            value: 'COMPLETED',
            logicalOperator: 'AND'
          }],
          onSuccessActions: [{
            id: 'schedule-flushing',
            type: 'SCHEDULE_PROCEDURE',
            targetModule: 'FLUSHING',
            parameters: { procedureType: 'EMBRYO_COLLECTION', scheduleDays: 9 }
          }],
          onFailureActions: [{
            id: 'breeding-failed',
            type: 'NOTIFY',
            targetModule: 'INTERNAL',
            parameters: { message: 'Breeding assignment failed - manual intervention required' }
          }],
          successNextStep: 'step-7',
          failureNextStep: 'step-manual-review',
          estimatedDuration: 2,
          maxWaitDays: 3,
          isManualStep: true,
          displayInDashboard: true,
          notificationRequired: true
        },
        {
          id: 'step-7',
          name: 'Embryo Collection (Flushing)',
          description: 'Embryo collection procedure 9 days post-breeding',
          stepType: 'PROCEDURE',
          order: 7,
          entryConditions: [{
            id: 'days-post-breeding',
            field: 'days_since_breeding',
            operator: '>=',
            value: 9,
            logicalOperator: 'AND'
          }],
          onStartActions: [{
            id: 'embryo-collection',
            type: 'SCHEDULE_PROCEDURE',
            targetModule: 'FLUSHING',
            parameters: { procedureType: 'UTERINE_FLUSHING' }
          }],
          exitConditions: [{
            id: 'flushing-completed',
            field: 'flushing_status',
            operator: '==',
            value: 'COMPLETED',
            logicalOperator: 'AND'
          }],
          onSuccessActions: [{
            id: 'recycle-ultrasound',
            type: 'SCHEDULE_EXAM',
            targetModule: 'ULTRASOUND',
            parameters: { examType: 'POST_FLUSHING_ASSESSMENT', scheduleDays: 1 }
          }],
          onFailureActions: [{
            id: 'flushing-complications',
            type: 'NOTIFY',
            targetModule: 'INTERNAL',
            parameters: { message: 'Flushing procedure complications - veterinary review required' }
          }],
          successNextStep: 'step-8',
          failureNextStep: 'step-manual-review',
          estimatedDuration: 1,
          isManualStep: true,
          displayInDashboard: true,
          notificationRequired: true
        },
        {
          id: 'step-8',
          name: 'Post-Procedure Recovery & Recycling',
          description: 'Final ultrasound assessment and preparation for next cycle if needed',
          stepType: 'EXAM',
          order: 8,
          entryConditions: [{
            id: 'flushing-complete',
            field: 'flushing_completed',
            operator: '==',
            value: true,
            logicalOperator: 'AND'
          }],
          onStartActions: [{
            id: 'recovery-assessment',
            type: 'SCHEDULE_EXAM',
            targetModule: 'ULTRASOUND',
            parameters: { examType: 'RECOVERY_ASSESSMENT' }
          }],
          exitConditions: [{
            id: 'recovery-complete',
            field: 'recovery_status',
            operator: '==',
            value: 'NORMAL',
            logicalOperator: 'AND'
          }],
          onSuccessActions: [{
            id: 'workflow-complete',
            type: 'UPDATE_STATUS',
            targetModule: 'INTERNAL',
            parameters: { status: 'WORKFLOW_COMPLETED' }
          }],
          onFailureActions: [{
            id: 'extended-recovery',
            type: 'SCHEDULE_EXAM',
            targetModule: 'ULTRASOUND',
            parameters: { examType: 'FOLLOW_UP_ASSESSMENT', scheduleDays: 7 }
          }],
          successNextStep: 'workflow-complete',
          failureNextStep: 'step-extended-recovery',
          estimatedDuration: 1,
          isManualStep: false,
          displayInDashboard: true,
          notificationRequired: true
        }
      ],
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
      usageCount: 15,
      successCount: 13
    },
    {
      id: 'WT-002',
      name: 'Bovine Estrus Synchronization',
      description: 'Estrus synchronization for bovine recipients',
      category: 'RECIPIENT_SYNC',
      applicableRoles: ['RECIPIENT'],
      applicableSpecies: ['BOVINE'],
      steps: [{
        id: 'bovine-step-1',
        name: 'CIDR Insertion',
        description: 'Insert CIDR device for progesterone supplementation',
        stepType: 'PROCEDURE',
        order: 1,
        onStartActions: [{
          id: 'cidr-insert',
          type: 'SCHEDULE_PROCEDURE',
          targetModule: 'CALENDAR',
          parameters: { procedureType: 'CIDR_INSERTION' }
        }],
        onSuccessActions: [{
          id: 'schedule-removal',
          type: 'SCHEDULE_PROCEDURE',
          targetModule: 'CALENDAR',
          parameters: { procedureType: 'CIDR_REMOVAL', scheduleDays: 9 }
        }],
        onFailureActions: [],
        estimatedDuration: 1,
        isManualStep: true,
        displayInDashboard: true,
        notificationRequired: true
      }],
      startingStep: 'bovine-step-1',
      maxDuration: 14,
      priority: 'MEDIUM',
      autoStart: true,
      expectedSuccessRate: 78,
      averageDuration: 10,
      createdBy: 'Dr. Sarah Johnson',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      isActive: true,
      usageCount: 22,
      successCount: 17
    },
    {
      id: 'WT-003',
      name: 'Camel Recipient Synchronization',
      description: 'Synchronization protocol for camel recipients with conditional branching',
      category: 'RECIPIENT_SYNC',
      applicableRoles: ['RECIPIENT'],
      applicableSpecies: ['CAMEL'],
      steps: [{
        id: 'camel-sync-1',
        name: 'Baseline Assessment',
        description: 'Initial examination to assess recipient suitability',
        stepType: 'EXAM',
        order: 1,
        entryConditions: [{
          id: 'age-check',
          field: 'age',
          operator: '>=',
          value: 3,
          logicalOperator: 'AND'
        }],
        exitConditions: [{
          id: 'body-condition',
          field: 'body_condition_score',
          operator: '>=',
          value: 3,
          logicalOperator: 'AND'
        }],
        onStartActions: [{
          id: 'baseline-exam',
          type: 'SCHEDULE_EXAM',
          targetModule: 'ULTRASOUND',
          parameters: { examType: 'RECIPIENT_BASELINE' }
        }],
        onSuccessActions: [{
          id: 'sync-injection',
          type: 'SCHEDULE_INJECTION',
          targetModule: 'INJECTION',
          parameters: { medication: 'GnRH', dosage: '100μg', scheduleDays: 1 }
        }],
        onFailureActions: [{
          id: 'defer-recipient',
          type: 'UPDATE_STATUS',
          targetModule: 'INTERNAL',
          parameters: { status: 'DEFERRED', reason: 'POOR_CONDITION' }
        }],
        successNextStep: 'camel-sync-2',
        failureNextStep: 'workflow-deferred',
        estimatedDuration: 1,
        isManualStep: false,
        displayInDashboard: true,
        notificationRequired: true
      }],
      startingStep: 'camel-sync-1',
      maxDuration: 12,
      priority: 'MEDIUM',
      autoStart: false,
      expectedSuccessRate: 92,
      averageDuration: 8,
      createdBy: 'Dr. Mohammed Hassan',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '2.1',
      isActive: true,
      usageCount: 8,
      successCount: 7
    },
    {
      id: 'WT-004',
      name: 'Camel Emergency Treatment Protocol',
      description: 'Emergency treatment protocol for reproductive complications',
      category: 'CUSTOM',
      applicableRoles: ['DONOR', 'RECIPIENT'],
      applicableSpecies: ['CAMEL'],
      steps: [{
        id: 'emergency-1',
        name: 'Emergency Assessment',
        description: 'Immediate examination and stabilization',
        stepType: 'EXAM',
        order: 1,
        onStartActions: [{
          id: 'emergency-exam',
          type: 'SCHEDULE_EXAM',
          targetModule: 'ULTRASOUND',
          parameters: { examType: 'EMERGENCY', priority: 'URGENT' }
        }],
        onSuccessActions: [{
          id: 'treatment-plan',
          type: 'SCHEDULE_PROCEDURE',
          targetModule: 'CALENDAR',
          parameters: { procedureType: 'EMERGENCY_TREATMENT' }
        }],
        onFailureActions: [],
        estimatedDuration: 1,
        isManualStep: true,
        displayInDashboard: true,
        notificationRequired: true
      }],
      startingStep: 'emergency-1',
      maxDuration: 7,
      priority: 'URGENT',
      autoStart: false,
      expectedSuccessRate: 95,
      averageDuration: 3,
      createdBy: 'Dr. Fatima Al-Zahra',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      isActive: true,
      usageCount: 2,
      successCount: 2
    }
  ];
};

const generateMockDailyOperationsOverview = (): DailyOperationsOverview => {
  return {
    date: new Date().toISOString().split('T')[0],
    injections: {
      total: 18,
      scheduled: 12,
      completed: 4,
      overdue: 2,
      cancelled: 0,
      noInjectionToday: 8,
      byMedication: { 'FSH': 6, 'LH': 4, 'GnRH': 3, 'PGF2α': 5 },
      byYard: { 'A1': 4, 'A2': 5, 'B1': 3, 'B2': 4, 'C1': 2 },
      byTechnician: { 'Tech 1': 6, 'Tech 2': 7, 'Tech 3': 5 }
    },
    nextDayExams: {
      total: 15,
      byType: { 'ROUTINE': 8, 'PREGNANCY_CHECK': 4, 'FOLLICLE_MONITORING': 3 },
      byVet: { 'Dr. Ahmed': 5, 'Dr. Sarah': 4, 'Dr. Mohammed': 3, 'Dr. Fatima': 3 },
      byRoom: { 'Room 1': 6, 'Room 2': 5, 'Room 3': 4 },
      estimatedTotalHours: 7.5
    },
    workflows: {
      active: 12,
      completing: 3,
      starting: 2,
      blocked: 1,
      byTemplate: { 'Camel Superovulation': 7, 'Bovine Estrus Sync': 5 },
      byPhase: { 'PREPARATION': 4, 'EXECUTION': 6, 'MONITORING': 2 }
    },
    animals: {
      total: 25,
      inWorkflow: 12,
      donors: 8,
      recipients: 12,
      breeding: 5,
      scheduledToday: 18,
      scheduledTomorrow: 15
    }
  };
};

// Mock API Implementation
class MockReproductionHubApiService implements ReproductionHubApiService {
  private mockData: MockReproductiveData;

  constructor() {
    this.mockData = {
      animals: generateMockAnimals(),
      workflowTemplates: generateMockWorkflowTemplates(),
      activeWorkflows: [],
      dailyInjections: [],
      nextDayExams: []
    };
  }

  // Animal Management
  async getAnimals(): Promise<EnhancedReproductiveAnimal[]> {
    // TODO: Replace with real API call
    // return apiService.get('/reproduction-hub/animals');
    return new Promise(resolve => {
      setTimeout(() => resolve(this.mockData.animals), 500);
    });
  }

  async updateAnimal(id: string, data: Partial<EnhancedReproductiveAnimal>): Promise<EnhancedReproductiveAnimal> {
    // TODO: Replace with real API call
    // return apiService.put(`/reproduction-hub/animals/${id}`, data);
    return new Promise(resolve => {
      setTimeout(() => {
        const animalIndex = this.mockData.animals.findIndex(a => a.animalID === id);
        if (animalIndex !== -1) {
          this.mockData.animals[animalIndex] = { ...this.mockData.animals[animalIndex], ...data };
          resolve(this.mockData.animals[animalIndex]);
        }
      }, 300);
    });
  }

  async bulkUpdateAnimals(ids: string[], data: Partial<EnhancedReproductiveAnimal>): Promise<EnhancedReproductiveAnimal[]> {
    // TODO: Replace with real API call
    // return apiService.post('/reproduction-hub/animals/bulk-update', { ids, data });
    return new Promise(resolve => {
      setTimeout(() => {
        const updatedAnimals = this.mockData.animals.filter(a => ids.includes(a.animalID))
          .map(animal => ({ ...animal, ...data }));
        
        // Update the animals in mock data
        ids.forEach(id => {
          const animalIndex = this.mockData.animals.findIndex(a => a.animalID === id);
          if (animalIndex !== -1) {
            this.mockData.animals[animalIndex] = { ...this.mockData.animals[animalIndex], ...data };
          }
        });
        
        resolve(updatedAnimals);
      }, 800);
    });
  }

  // Workflow Management
  async getWorkflowTemplates(): Promise<WorkflowTemplate[]> {
    // TODO: Replace with real API call
    // return apiService.get('/reproduction-hub/workflow-templates');
    return new Promise(resolve => {
      setTimeout(() => resolve(this.mockData.workflowTemplates), 400);
    });
  }

  async createWorkflowTemplate(template: Omit<WorkflowTemplate, 'id'>): Promise<WorkflowTemplate> {
    // TODO: Replace with real API call
    // return apiService.post('/reproduction-hub/workflow-templates', template);
    return new Promise(resolve => {
      setTimeout(() => {
        const newTemplate: WorkflowTemplate = {
          ...template,
          id: `WT-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          usageCount: 0,
          successCount: 0
        };
        this.mockData.workflowTemplates.push(newTemplate);
        resolve(newTemplate);
      }, 600);
    });
  }

  async updateWorkflowTemplate(id: string, template: Partial<WorkflowTemplate>): Promise<WorkflowTemplate> {
    // TODO: Replace with real API call
    // return apiService.put(`/reproduction-hub/workflow-templates/${id}`, template);
    return new Promise(resolve => {
      setTimeout(() => {
        const templateIndex = this.mockData.workflowTemplates.findIndex(t => t.id === id);
        if (templateIndex !== -1) {
          this.mockData.workflowTemplates[templateIndex] = {
            ...this.mockData.workflowTemplates[templateIndex],
            ...template,
            updatedAt: new Date().toISOString()
          };
          resolve(this.mockData.workflowTemplates[templateIndex]);
        }
      }, 400);
    });
  }

  async deleteWorkflowTemplate(id: string): Promise<void> {
    // TODO: Replace with real API call
    // return apiService.delete(`/reproduction-hub/workflow-templates/${id}`);
    return new Promise(resolve => {
      setTimeout(() => {
        this.mockData.workflowTemplates = this.mockData.workflowTemplates.filter(t => t.id !== id);
        resolve();
      }, 300);
    });
  }

  // Workflow Assignment
  async assignWorkflowToAnimals(assignment: BulkWorkflowAssignment): Promise<ActiveWorkflow[]> {
    // TODO: Replace with real API call
    // return apiService.post('/reproduction-hub/workflows/bulk-assign', assignment);
    return new Promise(resolve => {
      setTimeout(() => {
        const newWorkflows: ActiveWorkflow[] = assignment.selectedAnimalIds.map(animalId => {
          const animal = this.mockData.animals.find(a => a.animalID === animalId);
          return {
            id: `WF-${Date.now()}-${animalId}`,
            templateId: assignment.templateId,
            templateName: assignment.templateName,
            animalId,
            animalName: animal?.name || 'Unknown',
            currentStepId: 'step-1',
            currentStepName: 'Initial Step',
            stepNumber: 1,
            totalSteps: 5,
            progressPercentage: 0,
            startedAt: assignment.startDate,
            expectedCompletionAt: new Date(new Date(assignment.startDate).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            lastActivityAt: assignment.startDate,
            status: 'ACTIVE',
            currentPhase: 'PREPARATION',
            completedSteps: [],
            failedSteps: [],
            skippedSteps: [],
            assignedVet: assignment.assignedVet,
            priority: assignment.priority,
            notes: [assignment.reasoning]
          };
        });
        
        this.mockData.activeWorkflows.push(...newWorkflows);
        resolve(newWorkflows);
      }, 1000);
    });
  }

  async getActiveWorkflows(): Promise<ActiveWorkflow[]> {
    // TODO: Replace with real API call
    // return apiService.get('/reproduction-hub/workflows/active');
    return new Promise(resolve => {
      setTimeout(() => resolve(this.mockData.activeWorkflows), 400);
    });
  }

  async updateWorkflowStatus(workflowId: string, status: ActiveWorkflow['status']): Promise<ActiveWorkflow> {
    // TODO: Replace with real API call
    // return apiService.patch(`/reproduction-hub/workflows/${workflowId}/status`, { status });
    return new Promise(resolve => {
      setTimeout(() => {
        const workflowIndex = this.mockData.activeWorkflows.findIndex(w => w.id === workflowId);
        if (workflowIndex !== -1) {
          this.mockData.activeWorkflows[workflowIndex].status = status;
          this.mockData.activeWorkflows[workflowIndex].lastActivityAt = new Date().toISOString();
          resolve(this.mockData.activeWorkflows[workflowIndex]);
        }
      }, 300);
    });
  }

  // Daily Operations
  async getDailyOverview(date: string): Promise<DailyOperationsOverview> {
    // TODO: Replace with real API call
    // return apiService.get(`/reproduction-hub/daily-overview?date=${date}`);
    return new Promise(resolve => {
      setTimeout(() => resolve(generateMockDailyOperationsOverview()), 500);
    });
  }

  async getDailyInjections(date: string): Promise<DailyInjection[]> {
    // TODO: Replace with real API call
    // return apiService.get(`/reproduction-hub/daily-injections?date=${date}`);
    return new Promise(resolve => {
      setTimeout(() => {
        const injections = this.mockData.animals
          .filter(animal => animal.todayInjection)
          .map(animal => animal.todayInjection!);
        resolve(injections);
      }, 400);
    });
  }

  async getNextDayExams(date: string): Promise<NextDayExam[]> {
    // TODO: Replace with real API call
    // return apiService.get(`/reproduction-hub/next-day-exams?date=${date}`);
    return new Promise(resolve => {
      setTimeout(() => resolve(this.mockData.nextDayExams), 400);
    });
  }
}

// Export singleton instance
export const reproductionHubApi = new MockReproductionHubApiService();

// Enhanced Filtering System for Reproductive Data
export const filterReproductiveAnimals = (
  animals: EnhancedReproductiveAnimal[],
  filters: any
): EnhancedReproductiveAnimal[] => {
  return animals.filter(animal => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        animal.name.toLowerCase().includes(searchTerm) ||
        animal.animalID.toLowerCase().includes(searchTerm) ||
        animal.currentInternalNumber?.internalNumber.toLowerCase().includes(searchTerm) ||
        animal.breed?.toLowerCase().includes(searchTerm);
      
      if (!matchesSearch) return false;
    }

    // Species filter
    if (filters.species?.length > 0 && !filters.species.includes(animal.species)) {
      return false;
    }

    // Animal type (roles) filter
    if (filters.animalType?.length > 0) {
      const hasMatchingRole = animal.roles.some(role => 
        filters.animalType.includes(role.role)
      );
      if (!hasMatchingRole) return false;
    }

    // Yard filter
    if (filters.yards?.length > 0 && (!animal.yard || !filters.yards.includes(animal.yard))) {
      return false;
    }

    // Veterinarian filter
    if (filters.veterinarians?.length > 0 && 
        (!animal.assignedVet || !filters.veterinarians.includes(animal.assignedVet))) {
      return false;
    }

    // Days since last exam filter
    if (filters.daysSinceLastExam && filters.daysSinceLastExam !== 'ANY' && animal.lastUltrasound) {
      const daysAgo = animal.lastUltrasound.daysAgo;
      switch (filters.daysSinceLastExam) {
        case '0-7':
          if (daysAgo > 7) return false;
          break;
        case '7-14':
          if (daysAgo < 7 || daysAgo > 14) return false;
          break;
        case '14-30':
          if (daysAgo < 14 || daysAgo > 30) return false;
          break;
        case '30+':
          if (daysAgo < 30) return false;
          break;
        case 'overdue':
          if (animal.nextExamination && !animal.nextExamination.isOverdue) return false;
          break;
      }
    }

    // Next exam days filter
    if (filters.nextExamDays && filters.nextExamDays !== 'ANY' && animal.nextExamination) {
      const daysUntil = animal.nextExamination.daysUntil;
      switch (filters.nextExamDays) {
        case 'today':
          if (daysUntil !== 0) return false;
          break;
        case 'tomorrow':
          if (daysUntil !== 1) return false;
          break;
        case '2-7days':
          if (daysUntil < 2 || daysUntil > 7) return false;
          break;
        case 'overdue':
          if (!animal.nextExamination.isOverdue) return false;
          break;
      }
    }

    // CL Presence filter
    if (filters.clPresence && filters.clPresence !== 'ANY' && animal.lastUltrasound) {
      const { leftCL, rightCL } = animal.lastUltrasound;
      switch (filters.clPresence) {
        case 'LEFT':
          if (!leftCL.present) return false;
          break;
        case 'RIGHT':
          if (!rightCL.present) return false;
          break;
        case 'BOTH':
          if (!leftCL.present || !rightCL.present) return false;
          break;
        case 'NONE':
          if (leftCL.present || rightCL.present) return false;
          break;
      }
    }

    // Follicle size filter
    if (filters.follicleSize && filters.follicleSize !== 'ANY' && animal.lastUltrasound) {
      const { leftOvary, rightOvary } = animal.lastUltrasound;
      const allFollicles = [...leftOvary.follicles, ...rightOvary.follicles];
      const maxFollicle = Math.max(...allFollicles, 0);
      
      switch (filters.follicleSize) {
        case '5-9MM':
          if (!allFollicles.some(f => f >= 5 && f <= 9)) return false;
          break;
        case '9-12MM':
          if (!allFollicles.some(f => f >= 9 && f <= 12)) return false;
          break;
        case '12-19MM':
          if (!allFollicles.some(f => f >= 12 && f <= 19)) return false;
          break;
        case '19-25MM':
          if (!allFollicles.some(f => f >= 19 && f <= 25)) return false;
          break;
        case 'ABOVE_25MM':
          if (maxFollicle <= 25) return false;
          break;
        case 'NO_FOLLICLE':
          if (allFollicles.length > 0) return false;
          break;
      }
    }

    // Uterine status filter
    if (filters.uterineStatus && filters.uterineStatus !== 'ANY' && animal.lastUltrasound) {
      if (filters.uterineStatus !== animal.lastUltrasound.uterineStatus.endometritis) {
        return false;
      }
    }

    // Breeding readiness filter
    if (filters.breedingReadiness && filters.breedingReadiness !== 'ANY') {
      if (filters.breedingReadiness !== animal.breedingReadiness) {
        return false;
      }
    }

    // Current workflow type filter
    if (filters.currentWorkflowType?.length > 0) {
      if (!animal.activeWorkflow || 
          !filters.currentWorkflowType.includes(animal.activeWorkflow.templateName)) {
        return false;
      }
    }

    // Current step filter
    if (filters.currentStep?.length > 0) {
      if (!animal.activeWorkflow || 
          !filters.currentStep.includes(animal.activeWorkflow.currentStep)) {
        return false;
      }
    }

    // Workflow progress filter
    if (filters.workflowProgress && filters.workflowProgress !== 'ANY' && animal.activeWorkflow) {
      const progress = animal.activeWorkflow.progress;
      switch (filters.workflowProgress) {
        case '0-25%':
          if (progress > 25) return false;
          break;
        case '25-50%':
          if (progress < 25 || progress > 50) return false;
          break;
        case '50-75%':
          if (progress < 50 || progress > 75) return false;
          break;
        case '75-100%':
          if (progress < 75) return false;
          break;
      }
    }

    // Last injection filter
    if (filters.lastInjection && filters.lastInjection !== 'ANY' && animal.lastInjection) {
      const daysAgo = animal.lastInjection.daysAgo;
      switch (filters.lastInjection) {
        case 'today':
          if (daysAgo !== 0) return false;
          break;
        case 'yesterday':
          if (daysAgo !== 1) return false;
          break;
        case '2-7days':
          if (daysAgo < 2 || daysAgo > 7) return false;
          break;
        case '7-14days':
          if (daysAgo < 7 || daysAgo > 14) return false;
          break;
        case '14+days':
          if (daysAgo < 14) return false;
          break;
      }
    }

    // Injection medication filter
    if (filters.injectionMedication?.length > 0) {
      if (!animal.lastInjection || 
          !filters.injectionMedication.includes(animal.lastInjection.medication)) {
        return false;
      }
    }

    // Warning level filter
    if (filters.warningLevel && filters.warningLevel !== 'ANY') {
      const hasMatchingWarning = animal.warningFlags.some(warning => {
        switch (filters.warningLevel) {
          case 'CRITICAL':
            return warning.severity === 'CRITICAL';
          case 'WARNING':
            return warning.severity === 'HIGH' || warning.severity === 'MEDIUM';
          case 'INFO':
            return warning.severity === 'LOW';
          default:
            return false;
        }
      });
      if (!hasMatchingWarning) return false;
    }

    // Reproductive status filter
    if (filters.reproductiveStatus?.length > 0 && 
        !filters.reproductiveStatus.includes(animal.reproductiveStatus)) {
      return false;
    }

    // Quick filters
    if (filters.hasActiveWorkflow && !animal.activeWorkflow) {
      return false;
    }

    if (filters.hasWarnings && animal.warningFlags.length === 0) {
      return false;
    }

    if (filters.hasInjectionToday && !animal.todayInjection) {
      return false;
    }

    if (filters.hasExamTomorrow && 
        (!animal.nextExamination || animal.nextExamination.daysUntil !== 1)) {
      return false;
    }

    if (filters.readyForBreeding && 
        (animal.breedingReadiness !== 'READY' && animal.breedingReadiness !== 'OPTIMAL')) {
      return false;
    }

    return true;
  });
};

export default reproductionHubApi; 