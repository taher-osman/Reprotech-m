// Advanced Analytics & AI Intelligence Module - Comprehensive Type System
// Phase 5: AI-Powered Predictive Analytics & Machine Learning Insights

export interface AIModel {
  // Core Model Information
  id: string;
  name: string;
  type: 'PREDICTION' | 'CLASSIFICATION' | 'REGRESSION' | 'CLUSTERING' | 'DEEP_LEARNING';
  category: 'PREGNANCY_PREDICTION' | 'QUALITY_ASSESSMENT' | 'PROTOCOL_OPTIMIZATION' | 'GENETIC_ANALYSIS' | 'RISK_ASSESSMENT';
  
  // Model Specifications
  algorithm: 'RANDOM_FOREST' | 'SVM' | 'NEURAL_NETWORK' | 'LSTM' | 'CNN' | 'GRADIENT_BOOSTING' | 'LOGISTIC_REGRESSION';
  version: string;
  trainingDataSize: number;
  featuresCount: number;
  
  // Performance Metrics
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  
  // Model Status
  status: 'TRAINING' | 'READY' | 'DEPLOYED' | 'DEPRECATED' | 'FAILED';
  lastTrained: Date;
  nextRetraining?: Date;
  
  // Training Configuration
  hyperparameters: { [key: string]: any };
  validationMethod: 'K_FOLD' | 'HOLD_OUT' | 'TIME_SERIES' | 'BOOTSTRAP';
  
  // Deployment Information
  isActive: boolean;
  confidenceThreshold: number;
  usageCount: number;
  
  // Metadata
  description: string;
  targetVariable: string;
  inputFeatures: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface PredictionResult {
  // Prediction Details
  id: string;
  modelId: string;
  modelName: string;
  targetEntity: 'PREGNANCY' | 'EMBRYO_QUALITY' | 'PROTOCOL_SUCCESS' | 'GENETIC_TRAIT' | 'RISK_FACTOR';
  
  // Input Data
  inputData: { [feature: string]: any };
  entityId: string; // ID of the animal, embryo, session, etc.
  
  // Prediction Output
  prediction: any; // Can be boolean, number, string, or object
  confidence: number;
  probability?: number[];
  
  // Model Insights
  featureImportance: { [feature: string]: number };
  explanation: string;
  recommendations: string[];
  
  // Risk Assessment
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskFactors: string[];
  
  // Validation
  actualOutcome?: any;
  isCorrect?: boolean;
  
  // Metadata
  predictedAt: Date;
  expiresAt?: Date;
  notes?: string;
}

export interface AdvancedAnalytics {
  // Time-Series Analysis
  timeSeriesData: {
    metric: string;
    period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
    data: { timestamp: Date; value: number; trend?: number }[];
    seasonality: {
      detected: boolean;
      period?: number;
      strength?: number;
    };
    forecast: {
      nextPeriods: number;
      predictions: { timestamp: Date; value: number; confidence: number }[];
    };
  }[];
  
  // Statistical Analysis
  statisticalSummary: {
    metric: string;
    count: number;
    mean: number;
    median: number;
    mode: number;
    standardDeviation: number;
    variance: number;
    skewness: number;
    kurtosis: number;
    min: number;
    max: number;
    quartiles: { q1: number; q2: number; q3: number };
    outliers: number[];
  }[];
  
  // Correlation Analysis
  correlationMatrix: {
    variables: string[];
    correlations: number[][];
    significantCorrelations: {
      variable1: string;
      variable2: string;
      correlation: number;
      pValue: number;
      significance: 'HIGH' | 'MEDIUM' | 'LOW';
    }[];
  };
  
  // Multivariate Analysis
  multivariateAnalysis: {
    principalComponents: {
      component: number;
      eigenvalue: number;
      varianceExplained: number;
      cumulativeVariance: number;
      loadings: { [variable: string]: number };
    }[];
    clusters: {
      algorithm: 'K_MEANS' | 'HIERARCHICAL' | 'DBSCAN';
      clusterCount: number;
      silhouetteScore: number;
      clusters: {
        id: number;
        size: number;
        centroid: { [feature: string]: number };
        members: string[];
        characteristics: string[];
      }[];
    };
  };
  
  // Advanced Insights
  insights: {
    type: 'TREND' | 'ANOMALY' | 'PATTERN' | 'OPTIMIZATION' | 'PREDICTION';
    title: string;
    description: string;
    confidence: number;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    actionable: boolean;
    recommendations: string[];
    supportingData: any;
  }[];
}

export interface ResearchAnalytics {
  // Study Configuration
  studyId: string;
  studyName: string;
  studyType: 'OBSERVATIONAL' | 'EXPERIMENTAL' | 'LONGITUDINAL' | 'CROSS_SECTIONAL' | 'META_ANALYSIS';
  researchQuestion: string;
  hypothesis: string;
  
  // Sample Information
  sampleSize: number;
  inclusionCriteria: string[];
  exclusionCriteria: string[];
  demographics: {
    species: { [species: string]: number };
    breeds: { [breed: string]: number };
    ageGroups: { [group: string]: number };
    facilities: { [facility: string]: number };
  };
  
  // Experimental Design
  groups: {
    id: string;
    name: string;
    description: string;
    size: number;
    treatment?: string;
    controls: string[];
  }[];
  
  // Variables
  variables: {
    name: string;
    type: 'DEPENDENT' | 'INDEPENDENT' | 'CONFOUNDING' | 'MEDIATING' | 'MODERATING';
    dataType: 'CONTINUOUS' | 'CATEGORICAL' | 'ORDINAL' | 'BINARY';
    description: string;
    measuringUnit?: string;
  }[];
  
  // Statistical Tests
  statisticalTests: {
    testName: string;
    testType: 'PARAMETRIC' | 'NON_PARAMETRIC';
    variables: string[];
    assumptions: { [assumption: string]: boolean };
    results: {
      statistic: number;
      pValue: number;
      criticalValue?: number;
      degreesOfFreedom?: number;
      effectSize?: number;
      confidenceInterval?: { lower: number; upper: number };
    };
    interpretation: string;
    conclusion: string;
  }[];
  
  // Power Analysis
  powerAnalysis: {
    alpha: number;
    power: number;
    effectSize: number;
    requiredSampleSize: number;
    actualSampleSize: number;
    powerAchieved: number;
  };
  
  // Results Summary
  primaryOutcomes: {
    outcome: string;
    result: any;
    significance: boolean;
    clinicalRelevance: 'HIGH' | 'MEDIUM' | 'LOW';
    interpretation: string;
  }[];
  
  secondaryOutcomes: {
    outcome: string;
    result: any;
    significance: boolean;
    interpretation: string;
  }[];
  
  // Quality Metrics
  dataQuality: {
    completeness: number;
    accuracy: number;
    consistency: number;
    validity: number;
    reliability: number;
  };
  
  // Publication Readiness
  manuscriptElements: {
    title: string;
    abstract: string;
    keywords: string[];
    methodology: string;
    results: string;
    discussion: string;
    limitations: string[];
    futureWork: string[];
  };
}

export interface OptimizationRecommendation {
  // Recommendation Details
  id: string;
  type: 'PROTOCOL' | 'RESOURCE' | 'TIMING' | 'SELECTION' | 'PROCEDURE';
  category: 'DONOR_SELECTION' | 'RECIPIENT_PREPARATION' | 'OPU_PROTOCOL' | 'CULTURE_CONDITIONS' | 'TRANSFER_TIMING';
  
  // Current vs Recommended
  currentApproach: {
    description: string;
    parameters: { [key: string]: any };
    performance: {
      successRate: number;
      efficiency: number;
      cost: number;
    };
  };
  
  recommendedApproach: {
    description: string;
    parameters: { [key: string]: any };
    predictedPerformance: {
      successRate: number;
      efficiency: number;
      cost: number;
    };
  };
  
  // Impact Assessment
  expectedImprovement: {
    successRateIncrease: number;
    efficiencyGain: number;
    costReduction: number;
    timeReduction: number;
  };
  
  // Implementation
  implementationSteps: {
    step: number;
    description: string;
    duration: number;
    resources: string[];
    risks: string[];
  }[];
  
  // Evidence
  evidenceLevel: 'STRONG' | 'MODERATE' | 'WEAK' | 'EXPERIMENTAL';
  supportingStudies: {
    studyId?: string;
    title: string;
    sampleSize: number;
    findings: string;
    relevance: number;
  }[];
  
  // Confidence and Risk
  confidence: number;
  risks: {
    type: 'TECHNICAL' | 'FINANCIAL' | 'OPERATIONAL' | 'REGULATORY';
    description: string;
    probability: number;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    mitigation: string;
  }[];
  
  // Validation
  pilotStudyRecommended: boolean;
  validationCriteria: string[];
  successMetrics: { [metric: string]: number };
  
  // Metadata
  generatedAt: Date;
  validUntil: Date;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'APPROVED' | 'IMPLEMENTED' | 'REJECTED';
}

export interface AIInsight {
  // Insight Details
  id: string;
  title: string;
  type: 'PATTERN_DISCOVERY' | 'ANOMALY_DETECTION' | 'PREDICTIVE_ALERT' | 'OPTIMIZATION_OPPORTUNITY' | 'RESEARCH_FINDING';
  category: 'CLINICAL' | 'OPERATIONAL' | 'FINANCIAL' | 'RESEARCH' | 'QUALITY';
  
  // Content
  summary: string;
  description: string;
  keyFindings: string[];
  
  // Supporting Data
  dataSource: string[];
  analysisMethod: string;
  sampleSize: number;
  timeframe: {
    start: Date;
    end: Date;
  };
  
  // Statistical Significance
  pValue?: number;
  effectSize?: number;
  confidenceInterval?: { lower: number; upper: number };
  
  // Business Impact
  impact: {
    domain: 'SUCCESS_RATE' | 'EFFICIENCY' | 'COST' | 'QUALITY' | 'SAFETY';
    quantification: number;
    unit: string;
    timeframe: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM';
  }[];
  
  // Actionability
  actionable: boolean;
  recommendedActions: string[];
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  
  // Validation
  validated: boolean;
  validationMethod?: string;
  validationResults?: any;
  
  // Visualization
  chartType: 'LINE' | 'BAR' | 'SCATTER' | 'HEATMAP' | 'DISTRIBUTION' | 'NETWORK';
  chartData: any;
  
  // Metadata
  discoveredAt: Date;
  discoveryMethod: 'AUTOMATED' | 'SEMI_AUTOMATED' | 'MANUAL';
  relevanceScore: number;
  tags: string[];
}

export interface ModelPerformanceMetrics {
  // Model Identification
  modelId: string;
  modelName: string;
  evaluationDate: Date;
  
  // Performance Scores
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  
  // Confusion Matrix (for classification)
  confusionMatrix?: {
    truePositive: number;
    falsePositive: number;
    trueNegative: number;
    falseNegative: number;
  };
  
  // Regression Metrics
  meanSquaredError?: number;
  rootMeanSquaredError?: number;
  meanAbsoluteError?: number;
  rSquared?: number;
  
  // Cross-Validation Results
  crossValidation: {
    folds: number;
    scores: number[];
    mean: number;
    standardDeviation: number;
  };
  
  // Feature Importance
  featureImportance: {
    feature: string;
    importance: number;
    rank: number;
  }[];
  
  // Model Drift Detection
  drift: {
    detected: boolean;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    affectedFeatures: string[];
    recommendations: string[];
  };
  
  // Prediction Distribution
  predictionDistribution: {
    class?: string;
    count: number;
    percentage: number;
  }[];
  
  // Error Analysis
  errorAnalysis: {
    systematicErrors: string[];
    commonMisclassifications: {
      predicted: string;
      actual: string;
      frequency: number;
      possibleCauses: string[];
    }[];
    recommendations: string[];
  };
}

// Constants
export const AI_MODEL_TYPES = [
  'PREDICTION',
  'CLASSIFICATION', 
  'REGRESSION',
  'CLUSTERING',
  'DEEP_LEARNING'
] as const;

export const AI_MODEL_CATEGORIES = [
  'PREGNANCY_PREDICTION',
  'QUALITY_ASSESSMENT',
  'PROTOCOL_OPTIMIZATION', 
  'GENETIC_ANALYSIS',
  'RISK_ASSESSMENT'
] as const;

export const ALGORITHMS = [
  'RANDOM_FOREST',
  'SVM',
  'NEURAL_NETWORK',
  'LSTM',
  'CNN',
  'GRADIENT_BOOSTING',
  'LOGISTIC_REGRESSION'
] as const;

export const INSIGHT_TYPES = [
  'PATTERN_DISCOVERY',
  'ANOMALY_DETECTION',
  'PREDICTIVE_ALERT',
  'OPTIMIZATION_OPPORTUNITY',
  'RESEARCH_FINDING'
] as const;

export const RECOMMENDATION_TYPES = [
  'PROTOCOL',
  'RESOURCE',
  'TIMING',
  'SELECTION',
  'PROCEDURE'
] as const; 