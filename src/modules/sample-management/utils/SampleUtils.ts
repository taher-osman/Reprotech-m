import { Sample, SampleType, CollectionMethod, SampleStatus } from '../types/sampleTypes';

/**
 * Generate a unique sample ID
 */
export const generateSampleId = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `SMPL-${year}-${month}-${randomNum}`;
};

/**
 * Auto-create samples from flushing events
 */
export const generateSamplesFromFlush = (flushData: {
  id: string;
  donor_id: string;
  donor_name: string;
  date: string;
  embryoCount: number;
  oocyteCount?: number;
  quality?: string;
  operator?: string;
  notes?: string;
}): Sample[] => {
  const samples: Sample[] = [];
  
  // Create embryo samples
  for (let i = 0; i < flushData.embryoCount; i++) {
    samples.push({
      id: `${Date.now()}-${i}`,
      sample_id: generateSampleId(),
      animal_id: flushData.donor_id,
      animal_name: flushData.donor_name,
      sample_type: 'embryo',
      collection_method: 'Flushing',
      collection_date: flushData.date,
      parent_event_id: flushData.id,
      status: 'Fresh',
      location: 'Lab Processing Area',
      research_flag: false,
      genetic_status: 'Untested',
      quality_score: getQualityScore(flushData.quality),
      created_by: flushData.operator || 'System',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: `Auto-created from flush ${flushData.id}${flushData.notes ? ` - ${flushData.notes}` : ''}`
    });
  }
  
  // Create oocyte samples if any
  if (flushData.oocyteCount && flushData.oocyteCount > 0) {
    for (let i = 0; i < flushData.oocyteCount; i++) {
      samples.push({
        id: `${Date.now()}-ooc-${i}`,
        sample_id: generateSampleId(),
        animal_id: flushData.donor_id,
        animal_name: flushData.donor_name,
        sample_type: 'oocyte',
        collection_method: 'Flushing',
        collection_date: flushData.date,
        parent_event_id: flushData.id,
        status: 'Fresh',
        location: 'Lab Processing Area',
        research_flag: false,
        genetic_status: 'Untested',
        quality_score: getQualityScore(flushData.quality),
        cell_count: 1,
        created_by: flushData.operator || 'System',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        notes: `Auto-created oocyte from flush ${flushData.id}`
      });
    }
  }
  
  return samples;
};

/**
 * Auto-create samples from OPU events
 */
export const generateSamplesFromOPU = (opuData: {
  id: string;
  donor_id: string;
  donor_name: string;
  date: string;
  oocyteCount: number;
  quality?: string;
  operator?: string;
  notes?: string;
}): Sample[] => {
  const samples: Sample[] = [];
  
  for (let i = 0; i < opuData.oocyteCount; i++) {
    samples.push({
      id: `${Date.now()}-${i}`,
      sample_id: generateSampleId(),
      animal_id: opuData.donor_id,
      animal_name: opuData.donor_name,
      sample_type: 'oocyte',
      collection_method: 'OPU',
      collection_date: opuData.date,
      parent_event_id: opuData.id,
      status: 'Fresh',
      location: 'Quality Control Lab',
      research_flag: false,
      genetic_status: 'Untested',
      quality_score: getQualityScore(opuData.quality),
      cell_count: 1,
      created_by: opuData.operator || 'System',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: `Auto-created from OPU ${opuData.id}${opuData.notes ? ` - ${opuData.notes}` : ''}`
    });
  }
  
  return samples;
};

/**
 * Auto-create samples from semen collection events
 */
export const generateSamplesFromSemen = (semenData: {
  id: string;
  bull_id: string;
  bull_name: string;
  date: string;
  volume?: number;
  concentration?: number;
  motility?: number;
  quality?: string;
  operator?: string;
  notes?: string;
}): Sample => {
  return {
    id: Date.now().toString(),
    sample_id: generateSampleId(),
    animal_id: semenData.bull_id,
    animal_name: semenData.bull_name,
    sample_type: 'semen',
    collection_method: 'Semen Collection',
    collection_date: semenData.date,
    parent_event_id: semenData.id,
    status: 'Fresh',
    location: 'Sample Prep Station',
    research_flag: false,
    genetic_status: 'Untested',
    quality_score: getQualityScore(semenData.quality),
    volume_ml: semenData.volume,
    concentration: semenData.concentration,
    motility_percentage: semenData.motility,
    viability_percentage: semenData.motility ? semenData.motility + 15 : undefined, // Estimated
    created_by: semenData.operator || 'System',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    notes: `Auto-created from semen collection ${semenData.id}${semenData.notes ? ` - ${semenData.notes}` : ''}`
  };
};

/**
 * Convert quality text to numeric score
 */
const getQualityScore = (quality?: string): number | undefined => {
  if (!quality) return undefined;
  
  const qualityLower = quality.toLowerCase();
  if (qualityLower.includes('excellent')) return 9;
  if (qualityLower.includes('very good') || qualityLower.includes('very_good')) return 8;
  if (qualityLower.includes('good')) return 7;
  if (qualityLower.includes('fair') || qualityLower.includes('moderate')) return 6;
  if (qualityLower.includes('poor')) return 4;
  if (qualityLower.includes('very poor') || qualityLower.includes('very_poor')) return 3;
  
  return undefined;
};

/**
 * Get recommended storage location based on sample type and status
 */
export const getRecommendedStorage = (sampleType: SampleType, status: SampleStatus): string => {
  if (status === 'Research') return 'Research Lab';
  if (status === 'Fresh') return 'Quality Control Lab';
  if (status === 'Assigned to Biobank') return 'Lab Processing Area';
  if (status === 'Assigned') return 'Awaiting Processing';
  if (status === 'In Transfer') return 'Sample Prep Station';
  return 'Temporary Storage';
};

/**
 * Get recommended container type based on sample type
 */
export const getRecommendedContainer = (sampleType: SampleType): string => {
  switch (sampleType) {
    case 'embryo':
    case 'oocyte':
      return '0.25ml Straw';
    case 'semen':
      return '0.5ml Straw';
    case 'blood':
      return '5ml Tube';
    case 'DNA':
      return '1ml Vial';
    default:
      return 'Cryovial';
  }
};

/**
 * Validate sample data before saving
 */
export const validateSample = (sample: Partial<Sample>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!sample.animal_id) errors.push('Animal selection is required');
  if (!sample.sample_type) errors.push('Sample type is required');
  if (!sample.collection_date) errors.push('Collection date is required');
  if (!sample.location) errors.push('Storage location is required');
  
  if (sample.quality_score && (sample.quality_score < 1 || sample.quality_score > 10)) {
    errors.push('Quality score must be between 1 and 10');
  }
  
  if (sample.motility_percentage && (sample.motility_percentage < 0 || sample.motility_percentage > 100)) {
    errors.push('Motility percentage must be between 0 and 100');
  }
  
  if (sample.viability_percentage && (sample.viability_percentage < 0 || sample.viability_percentage > 100)) {
    errors.push('Viability percentage must be between 0 and 100');
  }
  
  if (sample.collection_date && new Date(sample.collection_date) > new Date()) {
    errors.push('Collection date cannot be in the future');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Calculate sample age in days
 */
export const getSampleAge = (collectionDate: string): number => {
  const collection = new Date(collectionDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - collection.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Check if sample is suitable for transfer based on age and quality
 */
export const isSampleSuitableForTransfer = (sample: Sample): boolean => {
  if (sample.status !== 'Assigned to Biobank' && sample.status !== 'Fresh') return false;
  if (sample.sample_type !== 'embryo') return false;
  
  const age = getSampleAge(sample.collection_date);
  if (age > 365) return false; // Older than 1 year
  
  if (sample.quality_score && sample.quality_score < 6) return false;
  
  return true;
};

/**
 * Format sample details for display
 */
export const formatSampleDetails = (sample: Sample): string => {
  const details: string[] = [];
  
  if (sample.cell_count) details.push(`${sample.cell_count} cells`);
  if (sample.volume_ml) details.push(`${sample.volume_ml}ml`);
  if (sample.concentration) details.push(`${sample.concentration} conc.`);
  if (sample.motility_percentage) details.push(`${sample.motility_percentage}% motility`);
  if (sample.viability_percentage) details.push(`${sample.viability_percentage}% viable`);
  if (sample.quality_score) details.push(`Quality: ${sample.quality_score}/10`);
  
  return details.join(' • ');
};

/**
 * Export samples to CSV format
 */
export const exportSamplesToCSV = (samples: Sample[]): string => {
  const headers = [
    'Sample ID',
    'Animal Name',
    'Sample Type',
    'Collection Method',
    'Collection Date',
    'Status',
    'Location',
    'Quality Score',
    'Research Flag',
    'Genetic Status',
    'Cell Count',
    'Volume (ml)',
    'Concentration',
    'Motility (%)',
    'Viability (%)',
    'Storage Temp (°C)',
    'Container Type',
    'Created By',
    'Created At',
    'Notes'
  ];
  
  const rows = samples.map(sample => [
    sample.sample_id,
    sample.animal_name || '',
    sample.sample_type,
    sample.collection_method,
    sample.collection_date,
    sample.status,
    sample.location,
    sample.quality_score || '',
    sample.research_flag ? 'Yes' : 'No',
    sample.genetic_status,
    sample.cell_count || '',
    sample.volume_ml || '',
    sample.concentration || '',
    sample.motility_percentage || '',
    sample.viability_percentage || '',
    sample.storage_temperature || '',
    sample.container_type || '',
    sample.created_by,
    sample.created_at,
    sample.notes || ''
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
  
  return csvContent;
};

/**
 * Alias functions for AutoImportPanel compatibility
 */
export const generateSampleFromFlushing = (flushData: {
  id: string;
  animalName: string;
  date: string;
  embryoCount: number;
  quality?: string;
}): Sample[] => {
  return generateSamplesFromFlush({
    id: flushData.id,
    donor_id: `${Date.now()}`, // Generate ID
    donor_name: flushData.animalName,
    date: flushData.date,
    embryoCount: flushData.embryoCount,
    quality: flushData.quality,
    operator: 'Auto-Import'
  });
};

export const generateSampleFromOPU = (opuData: {
  id: string;
  animalName: string;
  date: string;
  oocyteCount: number;
  quality?: string;
}): Sample[] => {
  return generateSamplesFromOPU({
    id: opuData.id,
    donor_id: `${Date.now()}`, // Generate ID
    donor_name: opuData.animalName,
    date: opuData.date,
    oocyteCount: opuData.oocyteCount,
    quality: opuData.quality,
    operator: 'Auto-Import'
  });
};

export const generateSampleFromSemen = (semenData: {
  id: string;
  animalName: string;
  date: string;
  volume: number;
  motility: number;
}): Sample[] => {
  const sample = generateSamplesFromSemen({
    id: semenData.id,
    bull_id: `${Date.now()}`, // Generate ID
    bull_name: semenData.animalName,
    date: semenData.date,
    volume: semenData.volume,
    motility: semenData.motility,
    operator: 'Auto-Import'
  });
  
  return [sample]; // Return as array for consistency
}; 