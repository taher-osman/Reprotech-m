import { Animal, AnimalRole, AnimalFilterOptions, AnimalSummaryStats } from '../types/animalTypes';
import { AnimalSpecies, AnimalStatus, SPECIES_CONFIG, ROLE_CONFIG, VALIDATION_RULES } from '../types/animalStatus';

/**
 * Generate a unique animal ID based on species and year
 */
export const generateAnimalID = (species: AnimalSpecies, existingIDs?: string[]): string => {
  const currentYear = new Date().getFullYear();
  const prefix = SPECIES_CONFIG[species].prefix;
  
  // Find the highest existing number for this species and year
  let maxNumber = 0;
  if (existingIDs) {
    const pattern = new RegExp(`^${prefix}-${currentYear}-(\\d+)$`);
    existingIDs.forEach(id => {
      const match = id.match(pattern);
      if (match) {
        const number = parseInt(match[1]);
        if (number > maxNumber) {
          maxNumber = number;
        }
      }
    });
  }
  
  const nextNumber = (maxNumber + 1).toString().padStart(3, '0');
  return `${prefix}-${currentYear}-${nextNumber}`;
};

/**
 * Generate internal number with collision detection
 */
export const generateInternalNumber = (existingNumbers?: string[]): string => {
  const currentYear = new Date().getFullYear();
  
  let maxNumber = 0;
  if (existingNumbers) {
    const pattern = new RegExp(`^INT-${currentYear}-(\\d+)$`);
    existingNumbers.forEach(number => {
      const match = number.match(pattern);
      if (match) {
        const num = parseInt(match[1]);
        if (num > maxNumber) {
          maxNumber = num;
        }
      }
    });
  }
  
  const nextNumber = (maxNumber + 1).toString().padStart(4, '0');
  return `INT-${currentYear}-${nextNumber}`;
};

/**
 * Generate QR code data for animal
 */
export const generateQRCode = (animal: Animal): string => {
  const qrData = {
    animalID: animal.animalID,
    name: animal.name,
    species: animal.species,
    internalNumber: animal.currentInternalNumber?.internalNumber,
    timestamp: new Date().toISOString()
  };
  return JSON.stringify(qrData);
};

/**
 * Filter animals by species and roles - used in module dropdowns
 */
export const filterAnimalsBySpeciesAndRole = (
  animals: Animal[],
  species?: string | string[],
  roles?: string | string[]
): Animal[] => {
  return animals.filter(animal => {
    // Species filter
    const speciesMatch = !species || 
      (Array.isArray(species) ? species.includes(animal.species) : animal.species === species);
    
    // Role filter
    const roleMatch = !roles || 
      (Array.isArray(roles) 
        ? roles.some(role => animal.roles?.some(animalRole => animalRole.role === role && animalRole.isActive))
        : animal.roles?.some(animalRole => animalRole.role === roles && animalRole.isActive));
    
    return speciesMatch && roleMatch;
  });
};

/**
 * Get animals suitable for specific modules
 */
export const getAnimalsForModule = (animals: Animal[], moduleName: string): Animal[] => {
  const moduleFilters: Record<string, { roles?: string[], statuses?: string[] }> = {
    'flushing': { roles: ['Donor'], statuses: ['ACTIVE'] },
    'embryo-transfer': { roles: ['Recipient'], statuses: ['ACTIVE'] },
    'breeding': { roles: ['Donor', 'Sire'], statuses: ['ACTIVE'] },
    'semen-collection': { roles: ['Sire'], statuses: ['ACTIVE'] },
    'laboratory': { roles: ['LabSample'], statuses: ['ACTIVE'] },
    'genomics': { roles: ['Reference', 'Donor'], statuses: ['ACTIVE'] },
    'ultrasound': { roles: ['Donor', 'Recipient'], statuses: ['ACTIVE'] },
    'vaccination': { statuses: ['ACTIVE'] },
    'phenotype': { statuses: ['ACTIVE'] }
  };

  const filter = moduleFilters[moduleName];
  if (!filter) return animals;

  return animals.filter(animal => {
    const statusMatch = !filter.statuses || filter.statuses.includes(animal.status);
    const roleMatch = !filter.roles || 
      filter.roles.some(role => 
        animal.roles?.some(animalRole => animalRole.role === role && animalRole.isActive)
      );
    
    return statusMatch && roleMatch;
  });
};

/**
 * Filter animals based on comprehensive filter options
 */
export const filterAnimals = (animals: Animal[], filters: AnimalFilterOptions): Animal[] => {
  return animals.filter(animal => {
    // Species filter
    if (filters.species && filters.species.length > 0) {
      if (!filters.species.includes(animal.species)) return false;
    }

    // Role filter
    if (filters.roles && filters.roles.length > 0) {
      const hasMatchingRole = filters.roles.some(role =>
        animal.roles?.some(animalRole => animalRole.role === role && animalRole.isActive)
      );
      if (!hasMatchingRole) return false;
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(animal.status)) return false;
    }

    // Purpose filter
    if (filters.purpose && filters.purpose.length > 0) {
      if (!animal.purpose || !filters.purpose.includes(animal.purpose)) return false;
    }

    // Internal number filter
    if (filters.hasInternalNumber !== undefined) {
      const hasInternalNumber = !!(animal.currentInternalNumber?.isActive);
      if (filters.hasInternalNumber !== hasInternalNumber) return false;
    }

    // Active workflow filter
    if (filters.hasActiveWorkflow !== undefined) {
      const hasActiveWorkflow = !!(animal.workflowData?.activeWorkflows && animal.workflowData.activeWorkflows > 0);
      if (filters.hasActiveWorkflow !== hasActiveWorkflow) return false;
    }

    // Genomic data filter
    if (filters.hasGenomicData !== undefined) {
      const hasGenomicData = !!(animal.genomicData?.hasSNPData || animal.genomicData?.hasBeadChip);
      if (filters.hasGenomicData !== hasGenomicData) return false;
    }

    // Age range filter
    if (filters.ageRange && animal.age !== undefined) {
      if (animal.age < filters.ageRange.min || animal.age > filters.ageRange.max) return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const animalDate = new Date(animal.registrationDate);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      if (animalDate < startDate || animalDate > endDate) return false;
    }

    // Customer filter
    if (filters.customer) {
      if (!animal.customer?.name.toLowerCase().includes(filters.customer.toLowerCase())) return false;
    }

    // Location filter
    if (filters.location) {
      if (!animal.currentLocation?.toLowerCase().includes(filters.location.toLowerCase())) return false;
    }

    return true;
  });
};

/**
 * Calculate summary statistics for animals
 */
export const calculateAnimalStats = (animals: Animal[]): AnimalSummaryStats => {
  const stats: AnimalSummaryStats = {
    total: animals.length,
    active: animals.filter(a => a.status === 'ACTIVE').length,
    bySpecies: {},
    byRole: {},
    byStatus: {},
    withInternalNumbers: animals.filter(a => a.currentInternalNumber?.isActive).length,
    withActiveWorkflows: animals.filter(a => a.workflowData?.activeWorkflows && a.workflowData.activeWorkflows > 0).length,
    withGenomicData: animals.filter(a => a.genomicData?.hasSNPData || a.genomicData?.hasBeadChip).length,
    recentlyAdded: animals.filter(a => {
      const createdDate = new Date(a.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate > weekAgo;
    }).length
  };

  // Calculate by species
  Object.values(AnimalSpecies).forEach(species => {
    stats.bySpecies[species] = animals.filter(a => a.species === species).length;
  });

  // Calculate by role
  Object.values(['Donor', 'Recipient', 'Sire', 'LabSample', 'Reference']).forEach(role => {
    stats.byRole[role] = animals.filter(a => 
      a.roles?.some(r => r.role === role && r.isActive)
    ).length;
  });

  // Calculate by status
  Object.values(AnimalStatus).forEach(status => {
    stats.byStatus[status] = animals.filter(a => a.status === status).length;
  });

  return stats;
};

/**
 * Validate animal data
 */
export const validateAnimal = (animal: Partial<Animal>): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Required fields
  if (!animal.animalID?.trim()) {
    errors.animalID = 'Animal ID is required';
  } else if (!VALIDATION_RULES.animalID.pattern.test(animal.animalID)) {
    errors.animalID = `Animal ID format should be ${VALIDATION_RULES.animalID.example}`;
  }

  if (!animal.name?.trim()) {
    errors.name = 'Name is required';
  }

  if (!animal.species) {
    errors.species = 'Species is required';
  }

  if (!animal.sex) {
    errors.sex = 'Sex is required';
  }

  if (!animal.status) {
    errors.status = 'Status is required';
  }

  // Age validation
  if (animal.age !== undefined) {
    if (animal.age < VALIDATION_RULES.age.min || animal.age > VALIDATION_RULES.age.max) {
      errors.age = `Age must be between ${VALIDATION_RULES.age.min} and ${VALIDATION_RULES.age.max}`;
    }
  }

  // Weight validation
  if (animal.weight !== undefined) {
    if (animal.weight < VALIDATION_RULES.weight.min || animal.weight > VALIDATION_RULES.weight.max) {
      errors.weight = `Weight must be between ${VALIDATION_RULES.weight.min} and ${VALIDATION_RULES.weight.max} kg`;
    }
  }

  // Microchip validation
  if (animal.microchip) {
    if (animal.microchip.length < VALIDATION_RULES.microchip.minLength) {
      errors.microchip = `Microchip must be at least ${VALIDATION_RULES.microchip.minLength} characters`;
    }
  }

  // Email validation
  if (animal.customer?.email) {
    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(animal.customer.email)) {
      errors.customerEmail = 'Invalid email format';
    }
  }

  return errors;
};

/**
 * Check if animal is active in any role
 */
export const hasActiveRole = (animal: Animal, role?: string): boolean => {
  if (!animal.roles || !Array.isArray(animal.roles)) {
    return false;
  }
  
  if (!role) {
    return animal.roles.some(r => r.isActive);
  }
  return animal.roles.some(r => r.role === role && r.isActive);
};

/**
 * Get active roles for an animal
 */
export const getActiveRoles = (animal: Animal): AnimalRole[] => {
  if (!animal.roles || !Array.isArray(animal.roles)) {
    return [];
  }
  return animal.roles.filter(r => r.isActive);
};

/**
 * Get role display information
 */
export const getRoleDisplayInfo = (role: string) => {
  return ROLE_CONFIG[role as keyof typeof ROLE_CONFIG] || {
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: '📋',
    description: 'Unknown role'
  };
};

/**
 * Check if animal needs attention (warnings/alerts)
 */
export const getAnimalWarnings = (animal: Animal): string[] => {
  const warnings: string[] = [];

  // Missing internal number for active animal
  if (animal.status === 'ACTIVE' && !animal.currentInternalNumber?.isActive) {
    warnings.push('Missing internal number');
  }

  // Old animal without recent activity
  if (animal.activityData?.lastActivity) {
    const lastActivity = new Date(animal.activityData.lastActivity);
    const monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - 6);
    if (lastActivity < monthsAgo) {
      warnings.push('No recent activity (6+ months)');
    }
  }

  // Missing genomic data for reference animals
  if (hasActiveRole(animal, 'Reference') && !animal.genomicData?.hasSNPData) {
    warnings.push('Reference animal missing genomic data');
  }

  // Overdue workflow tasks
  if (animal.workflowData?.currentWorkflow?.dueDate) {
    const dueDate = new Date(animal.workflowData.currentWorkflow.dueDate);
    if (dueDate < new Date()) {
      warnings.push('Overdue workflow task');
    }
  }

  return warnings;
};

/**
 * Sort animals by different criteria
 */
export const sortAnimals = (animals: Animal[], sortBy: string, sortOrder: 'asc' | 'desc' = 'asc'): Animal[] => {
  return [...animals].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'animalID':
        comparison = a.animalID.localeCompare(b.animalID);
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'species':
        comparison = a.species.localeCompare(b.species);
        break;
      case 'age':
        comparison = (a.age || 0) - (b.age || 0);
        break;
      case 'registrationDate':
        comparison = new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime();
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'customer':
        comparison = (a.customer?.name || '').localeCompare(b.customer?.name || '');
        break;
      default:
        comparison = a.animalID.localeCompare(b.animalID);
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });
};

/**
 * Export animal data to different formats
 */
export const exportAnimals = (animals: Animal[], format: 'json' | 'csv'): string => {
  if (format === 'json') {
    return JSON.stringify(animals, null, 2);
  }

  // CSV format
  const headers = [
    'Animal ID', 'Name', 'Species', 'Sex', 'Age', 'Status', 'Roles', 
    'Internal Number', 'Customer', 'Registration Date', 'Purpose'
  ];
  
  const rows = animals.map(animal => [
    animal.animalID,
    animal.name,
    animal.species,
    animal.sex,
    animal.age || '',
    animal.status,
    getActiveRoles(animal).map(r => r.role).join('; '),
    animal.currentInternalNumber?.internalNumber || '',
    animal.customer?.name || '',
    animal.registrationDate,
    animal.purpose || ''
  ]);

  return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}; 