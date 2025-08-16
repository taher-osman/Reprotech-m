import {
  FertilizationSession,
  FertilizationSetupData,
  DevelopmentTrackingData,
  EmbryoGenerationData,
  SelectedSample,
  GeneratedEmbryo,
  FertilizationStats,
  EmbryoSummary,
  Laboratory,
  Technician,
  FertilizationSessionStatus,
  EmbryoDevelopmentStage,
  FERTILIZATION_VALIDATION,
  DEVELOPMENT_STAGES_ORDER
} from '../types/fertilizationTypes';
import { 
  FertilizationType, 
  CleavageStatus, 
  BlastocystDay,
  BLASTOCYST_GRADES 
} from '../../sample-management/types/sampleTypes';

/**
 * Generate a unique fertilization session ID
 */
export const generateSessionId = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `FERT-${year}-${month}-${randomNum}`;
};

/**
 * Generate a unique embryo ID
 */
export const generateEmbryoId = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `EMB-${year}-${month}-${randomNum}`;
};

/**
 * Validate fertilization setup data
 */
export const validateFertilizationSetup = (data: FertilizationSetupData): { 
  isValid: boolean; 
  errors: string[] 
} => {
  const errors: string[] = [];

  // Basic required fields
  if (!data.fertilizationType) errors.push('Fertilization type is required');
  if (!data.fertilizationDate) errors.push('Fertilization date is required');
  if (!data.technician) errors.push('Technician selection is required');
  if (!data.recipientLab) errors.push('Recipient lab is required');
  if (!data.targetEmbryoCount || data.targetEmbryoCount < 1) {
    errors.push('Target embryo count must be at least 1');
  }

  // Date validation
  if (data.fertilizationDate && new Date(data.fertilizationDate) > new Date()) {
    errors.push('Fertilization date cannot be in the future');
  }

  // Sample validation based on fertilization type
  if (data.fertilizationType) {
    const requiredFields = FERTILIZATION_VALIDATION.REQUIRED_FIELDS[data.fertilizationType];
    
    if (requiredFields.includes('oocytes') && (!data.selectedOocyteIds || data.selectedOocyteIds.length === 0)) {
      errors.push('At least one oocyte must be selected');
    }

    if (requiredFields.includes('semen') && (!data.selectedSemenIds || data.selectedSemenIds.length === 0)) {
      errors.push('At least one semen sample must be selected for IVF/ICSI');
    }

    if (requiredFields.includes('fibroblasts') && (!data.selectedFibroblastIds || data.selectedFibroblastIds.length === 0)) {
      errors.push('At least one fibroblast sample must be selected for SCNT');
    }

    // Oocyte count validation
    const minOocytes = FERTILIZATION_VALIDATION[`MIN_OOCYTES_${data.fertilizationType}` as keyof typeof FERTILIZATION_VALIDATION] as number;
    if (data.selectedOocyteIds && data.selectedOocyteIds.length < minOocytes) {
      errors.push(`At least ${minOocytes} oocyte(s) required for ${data.fertilizationType}`);
    }

    if (data.selectedOocyteIds && data.selectedOocyteIds.length > FERTILIZATION_VALIDATION.MAX_OOCYTES_PER_SESSION) {
      errors.push(`Maximum ${FERTILIZATION_VALIDATION.MAX_OOCYTES_PER_SESSION} oocytes allowed per session`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate development tracking data
 */
export const validateDevelopmentTracking = (data: DevelopmentTrackingData): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!data.sessionId) errors.push('Session ID is required');

  // Cleavage validation
  if (data.cleavageObserved && !data.cleavageDate) {
    errors.push('Cleavage date is required when cleavage is observed');
  }

  if (data.cleavageDate && new Date(data.cleavageDate) > new Date()) {
    errors.push('Cleavage date cannot be in the future');
  }

  // Blastocyst validation
  if (data.blastocystStage) {
    if (!data.blastocystDay) {
      errors.push('Blastocyst day is required when blastocyst stage is reached');
    }
    if (!data.blastocystGrade) {
      errors.push('Blastocyst grade is required when blastocyst stage is reached');
    }
    if (data.blastocystGrade && !BLASTOCYST_GRADES.includes(data.blastocystGrade)) {
      errors.push('Invalid blastocyst grade');
    }
  }

  // Logic validation
  if (data.blastocystStage && !data.cleavageObserved) {
    errors.push('Cleavage must be observed before blastocyst stage');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate embryo generation data
 */
export const validateEmbryoGeneration = (data: EmbryoGenerationData): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!data.sessionId) errors.push('Session ID is required');
  if (!data.embryos || data.embryos.length === 0) {
    errors.push('At least one embryo must be generated');
  }

  data.embryos.forEach((embryo, index) => {
    const prefix = `Embryo ${index + 1}: `;

    if (!embryo.parentOocyteId) {
      errors.push(prefix + 'Parent oocyte ID is required');
    }

    if (embryo.quality < FERTILIZATION_VALIDATION.MIN_QUALITY_SCORE || 
        embryo.quality > FERTILIZATION_VALIDATION.MAX_QUALITY_SCORE) {
      errors.push(prefix + `Quality score must be between ${FERTILIZATION_VALIDATION.MIN_QUALITY_SCORE} and ${FERTILIZATION_VALIDATION.MAX_QUALITY_SCORE}`);
    }

    if (!embryo.morphologyGrade) {
      errors.push(prefix + 'Morphology grade is required');
    }

    if (!embryo.cellCount || embryo.cellCount < 1) {
      errors.push(prefix + 'Cell count must be at least 1');
    }

    if (!embryo.developmentStage) {
      errors.push(prefix + 'Development stage is required');
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Check single sample compatibility for fertilization selection
 */
export const checkSingleSampleCompatibility = (
  sample: any,
  selectedOocyteIds: string[],
  fertilizationType: FertilizationType
): string | null => {
  // Simple compatibility check for sample selection modal
  if (!sample) return null;

  // Check quality - handle both old and new property names
  const qualityScore = sample.quality_score || sample.qualityScore;
  if (qualityScore && qualityScore < 3) {
    return 'Low quality sample (score < 3)';
  }

  // Check status
  if (sample.status === 'Used' || sample.status === 'Depleted') {
    return 'Sample not available';
  }

  // Additional checks could be added here
  return null;
};

/**
 * Check sample compatibility for fertilization
 */
export const checkSampleCompatibility = (
  oocytes: SelectedSample[], 
  sperm: SelectedSample[], 
  fibroblasts: SelectedSample[], 
  fertilizationType: FertilizationType
): {
  compatible: boolean;
  issues: string[];
} => {
  const issues: string[] = [];

  // Species compatibility check (simplified - would be more complex in reality)
  const oocyteSpecies = new Set(oocytes.map(o => o.animalName?.split(' ')[0] || 'Unknown'));
  const spermSpecies = new Set(sperm.map(s => s.animalName?.split(' ')[0] || 'Unknown'));
  const fibroblastSpecies = new Set(fibroblasts.map(f => f.animalName?.split(' ')[0] || 'Unknown'));

  if (fertilizationType !== 'SCNT' && oocyteSpecies.size > 0 && spermSpecies.size > 0) {
    const commonSpecies = [...oocyteSpecies].filter(species => spermSpecies.has(species));
    if (commonSpecies.length === 0) {
      issues.push('No compatible species between oocytes and sperm samples');
    }
  }

  if (fertilizationType === 'SCNT' && oocyteSpecies.size > 0 && fibroblastSpecies.size > 0) {
    const commonSpecies = [...oocyteSpecies].filter(species => fibroblastSpecies.has(species));
    if (commonSpecies.length === 0) {
      issues.push('No compatible species between oocytes and fibroblast samples');
    }
  }

  // Quality checks
  const lowQualityOocytes = oocytes.filter(o => (o.qualityScore || 0) < 5);
  if (lowQualityOocytes.length > 0) {
    issues.push(`${lowQualityOocytes.length} oocyte(s) have quality score below 5`);
  }

  const lowQualitySperm = sperm.filter(s => (s.qualityScore || 0) < 5);
  if (lowQualitySperm.length > 0) {
    issues.push(`${lowQualitySperm.length} sperm sample(s) have quality score below 5`);
  }

  return {
    compatible: issues.length === 0,
    issues
  };
};

/**
 * Calculate estimated success rate based on sample quality and fertilization type
 */
export const calculateEstimatedSuccessRate = (
  oocytes: SelectedSample[],
  sperm: SelectedSample[],
  fibroblasts: SelectedSample[],
  fertilizationType: FertilizationType
): number => {
  // Base success rates by type
  const baseRates = {
    IVF: 75,
    ICSI: 85,
    SCNT: 45
  };

  let baseRate = baseRates[fertilizationType];

  // Adjust based on oocyte quality
  const avgOocyteQuality = oocytes.reduce((sum, o) => sum + (o.qualityScore || 5), 0) / oocytes.length;
  const oocyteModifier = (avgOocyteQuality - 5) * 2; // +/- 2% per quality point from average

  // Adjust based on sperm quality (for IVF/ICSI)
  let spermModifier = 0;
  if (fertilizationType !== 'SCNT' && sperm.length > 0) {
    const avgSpermQuality = sperm.reduce((sum, s) => sum + (s.qualityScore || 5), 0) / sperm.length;
    spermModifier = (avgSpermQuality - 5) * 1.5; // +/- 1.5% per quality point
  }

  // Adjust based on fibroblast quality (for SCNT)
  let fibroblastModifier = 0;
  if (fertilizationType === 'SCNT' && fibroblasts.length > 0) {
    const avgFibroblastQuality = fibroblasts.reduce((sum, f) => sum + (f.qualityScore || 5), 0) / fibroblasts.length;
    fibroblastModifier = (avgFibroblastQuality - 5) * 1; // +/- 1% per quality point
  }

  const finalRate = baseRate + oocyteModifier + spermModifier + fibroblastModifier;
  return Math.max(10, Math.min(95, Math.round(finalRate))); // Clamp between 10-95%
};

/**
 * Calculate fertilization statistics
 */
export const calculateFertilizationStats = (sessions: FertilizationSession[]): FertilizationStats => {
  const totalSessions = sessions.length;
  const activeSessions = sessions.filter(s => 
    s.status !== 'Completed' && s.status !== 'Failed'
  ).length;
  const completedSessions = sessions.filter(s => s.status === 'Completed').length;
  const totalEmbryosGenerated = sessions.reduce((sum, s) => sum + (s.actualEmbryoCount || 0), 0);
  
  const successRate = totalSessions > 0 
    ? Math.round((completedSessions / totalSessions) * 100 * 100) / 100 
    : 0;

  // Group by fertilization type
  const byType: Record<FertilizationType, { sessions: number; embryos: number; successRate: number }> = {
    IVF: { sessions: 0, embryos: 0, successRate: 0 },
    ICSI: { sessions: 0, embryos: 0, successRate: 0 },
    SCNT: { sessions: 0, embryos: 0, successRate: 0 }
  };

  sessions.forEach(session => {
    byType[session.fertilizationType].sessions++;
    byType[session.fertilizationType].embryos += session.actualEmbryoCount || 0;
  });

  // Calculate success rates by type
  Object.keys(byType).forEach(type => {
    const typeKey = type as FertilizationType;
    const typeSessions = sessions.filter(s => s.fertilizationType === typeKey);
    const completedType = typeSessions.filter(s => s.status === 'Completed').length;
    byType[typeKey].successRate = typeSessions.length > 0 
      ? Math.round((completedType / typeSessions.length) * 100 * 100) / 100 
      : 0;
  });

  // Group by technician
  const technicianMap = new Map<string, { sessions: number; embryos: number; completed: number }>();
  sessions.forEach(session => {
    if (!technicianMap.has(session.technician)) {
      technicianMap.set(session.technician, { sessions: 0, embryos: 0, completed: 0 });
    }
    const tech = technicianMap.get(session.technician)!;
    tech.sessions++;
    tech.embryos += session.actualEmbryoCount || 0;
    if (session.status === 'Completed') tech.completed++;
  });

  const byTechnician: Record<string, { sessions: number; embryos: number; successRate: number }> = {};
  technicianMap.forEach((data, technician) => {
    byTechnician[technician] = {
      sessions: data.sessions,
      embryos: data.embryos,
      successRate: data.sessions > 0 
        ? Math.round((data.completed / data.sessions) * 100 * 100) / 100 
        : 0
    };
  });

  return {
    totalSessions,
    activeSessions,
    completedSessions,
    totalEmbryosGenerated,
    successRate,
    byType,
    byTechnician
  };
};

/**
 * Calculate embryo summary for a session
 */
export const calculateEmbryoSummary = (session: FertilizationSession): EmbryoSummary => {
  const totalOocytes = session.selectedOocytes.length;
  const totalEmbryos = session.actualEmbryoCount || 0;
  const cleavageRate = session.cleavageObserved && totalOocytes > 0 
    ? Math.round((totalEmbryos / totalOocytes) * 100 * 100) / 100 
    : 0;
  const blastocystRate = session.blastocystStage && totalEmbryos > 0 
    ? Math.round((session.generatedEmbryos.filter(e => 
        e.developmentStage.includes('Blastocyst')
      ).length / totalEmbryos) * 100 * 100) / 100 
    : 0;

  // Grade distribution
  const gradeDistribution: Record<string, number> = {};
  session.generatedEmbryos.forEach(embryo => {
    gradeDistribution[embryo.morphologyGrade] = (gradeDistribution[embryo.morphologyGrade] || 0) + 1;
  });

  // Development stage distribution
  const developmentStages: Record<EmbryoDevelopmentStage, number> = {
    'Fertilized': 0,
    'Cleavage': 0,
    'Morula': 0,
    'Early Blastocyst': 0,
    'Blastocyst': 0,
    'Hatched Blastocyst': 0,
    'Arrested': 0
  };

  session.generatedEmbryos.forEach(embryo => {
    developmentStages[embryo.developmentStage]++;
  });

  return {
    totalOocytes,
    totalEmbryos,
    cleavageRate,
    blastocystRate,
    gradeDistribution,
    developmentStages
  };
};

/**
 * Get session status display information
 */
export const getSessionStatusInfo = (status: FertilizationSessionStatus): {
  label: string;
  color: string;
  description: string;
} => {
  const statusMap = {
    'Setup': {
      label: 'Setup',
      color: 'gray',
      description: 'Session created, ready for sample selection'
    },
    'In Progress': {
      label: 'In Progress',
      color: 'blue',
      description: 'Fertilization procedure in progress'
    },
    'Development Tracking': {
      label: 'Tracking',
      color: 'yellow',
      description: 'Monitoring embryo development'
    },
    'Embryos Generated': {
      label: 'Generated',
      color: 'green',
      description: 'Embryos successfully generated'
    },
    'Completed': {
      label: 'Completed',
      color: 'green',
      description: 'Session completed successfully'
    },
    'Failed': {
      label: 'Failed',
      color: 'red',
      description: 'Session failed or cancelled'
    }
  };

  return statusMap[status];
};

/**
 * Format development stage for display
 */
export const formatDevelopmentStage = (stage: EmbryoDevelopmentStage): string => {
  const stageMap = {
    'Fertilized': 'Fertilized (2PN)',
    'Cleavage': 'Cleavage (2-8 cells)',
    'Morula': 'Morula (16+ cells)',
    'Early Blastocyst': 'Early Blastocyst',
    'Blastocyst': 'Blastocyst',
    'Hatched Blastocyst': 'Hatched Blastocyst',
    'Arrested': 'Development Arrested'
  };

  return stageMap[stage] || stage;
};

/**
 * Get next recommended development stage
 */
export const getNextDevelopmentStage = (currentStage: EmbryoDevelopmentStage): EmbryoDevelopmentStage | null => {
  const currentOrder = DEVELOPMENT_STAGES_ORDER[currentStage];
  const nextOrder = currentOrder + 1;
  
  const nextStage = Object.entries(DEVELOPMENT_STAGES_ORDER)
    .find(([_, order]) => order === nextOrder);
  
  return nextStage ? nextStage[0] as EmbryoDevelopmentStage : null;
};

/**
 * Calculate session age in days
 */
export const getSessionAge = (createdAt: string): number => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Calculate fertilization age in days
 */
export const getFertilizationAge = (fertilizationDate: string): number => {
  const fertilization = new Date(fertilizationDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - fertilization.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Format session ID for display
 */
export const formatSessionId = (sessionId: string): string => {
  if (!sessionId) return 'N/A';
  return sessionId;
};

/**
 * Format date for display
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return 'Not specified';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Get status color classes for display
 */
export const getStatusColor = (status: FertilizationSessionStatus): string => {
  const statusColors = {
    'Setup': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Development Tracking': 'bg-yellow-100 text-yellow-800',
    'Embryos Generated': 'bg-green-100 text-green-800',
    'Completed': 'bg-green-100 text-green-800',
    'Failed': 'bg-red-100 text-red-800'
  };

  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Format fertilization type for display
 */
export const formatFertilizationType = (type: FertilizationType): string => {
  const typeMap = {
    'IVF': 'In Vitro Fertilization (IVF)',
    'ICSI': 'Intracytoplasmic Sperm Injection (ICSI)',
    'SCNT': 'Somatic Cell Nuclear Transfer (SCNT)'
  };

  return typeMap[type] || type;
};

/**
 * Get recommended container type for embryo
 */
export const getRecommendedEmbryoContainer = (developmentStage: EmbryoDevelopmentStage): string => {
  const stageContainerMap = {
    'Fertilized': '0.25ml Straw',
    'Cleavage': '0.25ml Straw',
    'Morula': '0.25ml Straw',
    'Early Blastocyst': '0.25ml Straw',
    'Blastocyst': '0.5ml Straw',
    'Hatched Blastocyst': '0.5ml Straw',
    'Arrested': '0.25ml Straw'
  };

  return stageContainerMap[developmentStage] || '0.25ml Straw';
};

/**
 * Check if session can proceed to next step
 */
export const canProceedToNextStep = (session: FertilizationSession): {
  canProceed: boolean;
  nextStep: string;
  requirements: string[];
} => {
  const requirements: string[] = [];
  let nextStep = '';
  let canProceed = false;

  switch (session.status) {
    case 'Setup':
      nextStep = 'Sample Selection';
      if (session.selectedOocytes.length === 0) requirements.push('Select oocyte samples');
      if (session.fertilizationType !== 'SCNT' && (!session.selectedSemen || session.selectedSemen.length === 0)) {
        requirements.push('Select semen samples');
      }
      if (session.fertilizationType === 'SCNT' && (!session.selectedFibroblasts || session.selectedFibroblasts.length === 0)) {
        requirements.push('Select fibroblast samples');
      }
      canProceed = requirements.length === 0;
      break;

    case 'In Progress':
      nextStep = 'Development Tracking';
      if (!session.cleavageObserved) requirements.push('Record cleavage observation');
      canProceed = requirements.length === 0;
      break;

    case 'Development Tracking':
      nextStep = 'Embryo Generation';
      if (!session.blastocystStage) requirements.push('Record blastocyst development');
      canProceed = requirements.length === 0;
      break;

    case 'Embryos Generated':
      nextStep = 'Complete Session';
      canProceed = true;
      break;

    default:
      nextStep = 'N/A';
      canProceed = false;
  }

  return { canProceed, nextStep, requirements };
}; 