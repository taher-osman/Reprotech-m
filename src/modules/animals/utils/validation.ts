import { Animal, AnimalFormData } from '../types/animalTypes';
import { 
  AnimalSpecies, 
  AnimalStatus, 
  AnimalRole, 
  SPECIES_CONFIG, 
  VALIDATION_RULES 
} from '../types/animalStatus';

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  code?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  fieldErrors: Record<string, ValidationError>;
}

export interface ValidationRule {
  field: string;
  required?: boolean;
  validator: (value: any, formData?: AnimalFormData) => ValidationError | null;
  dependencies?: string[];
}

// Real-time validation configuration
export const VALIDATION_RULES_CONFIG: ValidationRule[] = [
  {
    field: 'animalID',
    required: true,
    validator: (value: string, formData) => {
      if (!value?.trim()) {
        return {
          field: 'animalID',
          message: 'Animal ID is required',
          severity: 'error',
          code: 'REQUIRED'
        };
      }

      // Check format
      if (!VALIDATION_RULES.animalID.pattern.test(value)) {
        return {
          field: 'animalID',
          message: `Animal ID format should be ${VALIDATION_RULES.animalID.example}`,
          severity: 'error',
          code: 'INVALID_FORMAT'
        };
      }

      // Check species consistency
      if (formData?.species) {
        const expectedPrefix = SPECIES_CONFIG[formData.species].prefix;
        if (!value.startsWith(expectedPrefix)) {
          return {
            field: 'animalID',
            message: `Animal ID should start with ${expectedPrefix} for ${formData.species}`,
            severity: 'warning',
            code: 'SPECIES_MISMATCH'
          };
        }
      }

      return null;
    }
  },
  {
    field: 'name',
    required: true,
    validator: (value: string) => {
      if (!value?.trim()) {
        return {
          field: 'name',
          message: 'Animal name is required',
          severity: 'error',
          code: 'REQUIRED'
        };
      }

      if (value.length < 2) {
        return {
          field: 'name',
          message: 'Name must be at least 2 characters long',
          severity: 'error',
          code: 'MIN_LENGTH'
        };
      }

      if (value.length > 50) {
        return {
          field: 'name',
          message: 'Name cannot exceed 50 characters',
          severity: 'error',
          code: 'MAX_LENGTH'
        };
      }

      // Check for special characters
      if (!/^[a-zA-Z0-9\s\-'\.]+$/.test(value)) {
        return {
          field: 'name',
          message: 'Name contains invalid characters',
          severity: 'warning',
          code: 'INVALID_CHARACTERS'
        };
      }

      return null;
    }
  },
  {
    field: 'species',
    required: true,
    validator: (value: string) => {
      if (!value) {
        return {
          field: 'species',
          message: 'Species is required',
          severity: 'error',
          code: 'REQUIRED'
        };
      }

      if (!Object.values(AnimalSpecies).includes(value as AnimalSpecies)) {
        return {
          field: 'species',
          message: 'Invalid species selected',
          severity: 'error',
          code: 'INVALID_VALUE'
        };
      }

      return null;
    }
  },
  {
    field: 'sex',
    required: true,
    validator: (value: string) => {
      if (!value) {
        return {
          field: 'sex',
          message: 'Sex is required',
          severity: 'error',
          code: 'REQUIRED'
        };
      }

      if (!['MALE', 'FEMALE'].includes(value)) {
        return {
          field: 'sex',
          message: 'Sex must be either MALE or FEMALE',
          severity: 'error',
          code: 'INVALID_VALUE'
        };
      }

      return null;
    }
  },
  {
    field: 'age',
    validator: (value: number, formData) => {
      if (value === undefined || value === null) return null;

      if (isNaN(value) || value < 0) {
        return {
          field: 'age',
          message: 'Age must be a positive number',
          severity: 'error',
          code: 'INVALID_NUMBER'
        };
      }

      const speciesConfig = formData?.species ? SPECIES_CONFIG[formData.species] : null;
      const maxAge = speciesConfig?.maxAge || 50;

      if (value > maxAge) {
        return {
          field: 'age',
          message: `Age cannot exceed ${maxAge} years for ${formData?.species}`,
          severity: 'error',
          code: 'EXCEEDS_MAX'
        };
      }

      // Warning for very young or old animals
      if (value < 0.5) {
        return {
          field: 'age',
          message: 'Very young animal - verify age is correct',
          severity: 'warning',
          code: 'VERY_YOUNG'
        };
      }

      if (value > maxAge * 0.8) {
        return {
          field: 'age',
          message: 'Elderly animal - consider health monitoring',
          severity: 'info',
          code: 'ELDERLY'
        };
      }

      return null;
    },
    dependencies: ['species']
  },
  {
    field: 'weight',
    validator: (value: number, formData) => {
      if (value === undefined || value === null) return null;

      if (isNaN(value) || value <= 0) {
        return {
          field: 'weight',
          message: 'Weight must be a positive number',
          severity: 'error',
          code: 'INVALID_NUMBER'
        };
      }

      const speciesConfig = formData?.species ? SPECIES_CONFIG[formData.species] : null;
      if (speciesConfig) {
        const { min, max } = speciesConfig.weightRange;
        
        if (value < min || value > max) {
          return {
            field: 'weight',
            message: `Weight should be between ${min}-${max}kg for ${formData.species}`,
            severity: 'warning',
            code: 'OUT_OF_RANGE'
          };
        }
      }

      return null;
    },
    dependencies: ['species']
  },
  {
    field: 'microchip',
    validator: (value: string) => {
      if (!value) return null;

      if (value.length < VALIDATION_RULES.microchip.minLength) {
        return {
          field: 'microchip',
          message: `Microchip must be at least ${VALIDATION_RULES.microchip.minLength} characters`,
          severity: 'error',
          code: 'MIN_LENGTH'
        };
      }

      if (value.length > VALIDATION_RULES.microchip.maxLength) {
        return {
          field: 'microchip',
          message: `Microchip cannot exceed ${VALIDATION_RULES.microchip.maxLength} characters`,
          severity: 'error',
          code: 'MAX_LENGTH'
        };
      }

      // Check for valid microchip format (numbers and letters)
      if (!/^[A-Z0-9]+$/i.test(value)) {
        return {
          field: 'microchip',
          message: 'Microchip should contain only letters and numbers',
          severity: 'warning',
          code: 'INVALID_FORMAT'
        };
      }

      return null;
    }
  },
  {
    field: 'dateOfBirth',
    validator: (value: string, formData) => {
      if (!value) return null;

      const birthDate = new Date(value);
      const today = new Date();

      if (isNaN(birthDate.getTime())) {
        return {
          field: 'dateOfBirth',
          message: 'Invalid date format',
          severity: 'error',
          code: 'INVALID_DATE'
        };
      }

      if (birthDate > today) {
        return {
          field: 'dateOfBirth',
          message: 'Date of birth cannot be in the future',
          severity: 'error',
          code: 'FUTURE_DATE'
        };
      }

      // Calculate age and compare with provided age
      if (formData?.age) {
        const calculatedAge = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        const ageDiff = Math.abs(calculatedAge - formData.age);
        
        if (ageDiff > 1) {
          return {
            field: 'dateOfBirth',
            message: `Calculated age (${calculatedAge}) doesn't match provided age (${formData.age})`,
            severity: 'warning',
            code: 'AGE_MISMATCH'
          };
        }
      }

      return null;
    },
    dependencies: ['age']
  },
  {
    field: 'selectedRoles',
    required: true,
    validator: (value: string[]) => {
      if (!value || value.length === 0) {
        return {
          field: 'selectedRoles',
          message: 'At least one role must be selected',
          severity: 'error',
          code: 'REQUIRED'
        };
      }

      // Check for invalid roles
      const validRoles = Object.values(AnimalRole);
      const invalidRoles = value.filter(role => !validRoles.includes(role as AnimalRole));
      
      if (invalidRoles.length > 0) {
        return {
          field: 'selectedRoles',
          message: `Invalid roles: ${invalidRoles.join(', ')}`,
          severity: 'error',
          code: 'INVALID_VALUE'
        };
      }

      // Check for conflicting roles
      if (value.includes('Donor') && value.includes('Recipient')) {
        return {
          field: 'selectedRoles',
          message: 'Animal cannot be both Donor and Recipient simultaneously',
          severity: 'warning',
          code: 'ROLE_CONFLICT'
        };
      }

      return null;
    }
  },
  {
    field: 'customerEmail',
    validator: (value: string) => {
      if (!value) return null;

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        return {
          field: 'customerEmail',
          message: 'Invalid email format',
          severity: 'error',
          code: 'INVALID_EMAIL'
        };
      }

      return null;
    }
  },
  {
    field: 'customerPhone',
    validator: (value: string) => {
      if (!value) return null;

      // Basic phone validation (international format)
      const phonePattern = /^\+?[\d\s\-\(\)]{10,}$/;
      if (!phonePattern.test(value)) {
        return {
          field: 'customerPhone',
          message: 'Invalid phone number format',
          severity: 'warning',
          code: 'INVALID_PHONE'
        };
      }

      return null;
    }
  }
];

/**
 * Validate a single field
 */
export const validateField = (
  field: string, 
  value: any, 
  formData?: AnimalFormData
): ValidationError | null => {
  const rule = VALIDATION_RULES_CONFIG.find(r => r.field === field);
  if (!rule) return null;

  return rule.validator(value, formData);
};

/**
 * Validate entire form
 */
export const validateAnimalForm = (formData: AnimalFormData): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const fieldErrors: Record<string, ValidationError> = {};

  // Validate each field
  VALIDATION_RULES_CONFIG.forEach(rule => {
    const value = getFieldValue(formData, rule.field);
    const error = rule.validator(value, formData);
    
    if (error) {
      switch (error.severity) {
        case 'error':
          errors.push(error);
          fieldErrors[error.field] = error;
          break;
        case 'warning':
          warnings.push(error);
          if (!fieldErrors[error.field] || fieldErrors[error.field].severity !== 'error') {
            fieldErrors[error.field] = error;
          }
          break;
        case 'info':
          warnings.push(error);
          break;
      }
    }
  });

  // Cross-field validations
  const crossFieldErrors = validateCrossFields(formData);
  errors.push(...crossFieldErrors.filter(e => e.severity === 'error'));
  warnings.push(...crossFieldErrors.filter(e => e.severity === 'warning'));

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    fieldErrors
  };
};

/**
 * Cross-field validation
 */
const validateCrossFields = (formData: AnimalFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Check customer information consistency
  if (formData.customer?.name && !formData.owner) {
    errors.push({
      field: 'owner',
      message: 'Owner should match customer name',
      severity: 'warning',
      code: 'INCONSISTENT_OWNER'
    });
  }

  // Check role-specific requirements
  if (formData.selectedRoles?.includes('Sire') && formData.sex !== 'MALE') {
    errors.push({
      field: 'selectedRoles',
      message: 'Sire role requires male sex',
      severity: 'error',
      code: 'ROLE_SEX_MISMATCH'
    });
  }

  // Check breeding age appropriateness
  if (formData.selectedRoles?.includes('Donor') || formData.selectedRoles?.includes('Sire')) {
    if (formData.age !== undefined) {
      const speciesConfig = SPECIES_CONFIG[formData.species];
      const minBreedingAge = speciesConfig?.minBreedingAge || 2;
      
      if (formData.age < minBreedingAge) {
        errors.push({
          field: 'age',
          message: `Animal may be too young for breeding (minimum ${minBreedingAge} years)`,
          severity: 'warning',
          code: 'YOUNG_FOR_BREEDING'
        });
      }
    }
  }

  return errors;
};

/**
 * Get field value from form data
 */
const getFieldValue = (formData: AnimalFormData, field: string): any => {
  if (field.includes('.')) {
    const parts = field.split('.');
    let value = formData as any;
    for (const part of parts) {
      value = value?.[part];
    }
    return value;
  }
  return (formData as any)[field];
};

/**
 * Async validation for unique fields
 */
export const validateUniqueField = async (
  field: 'animalID' | 'microchip',
  value: string,
  excludeId?: string
): Promise<ValidationError | null> => {
  // Mock API call - replace with actual API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate checking for duplicates
      const isDuplicate = Math.random() < 0.1; // 10% chance of duplicate
      
      if (isDuplicate) {
        resolve({
          field,
          message: `${field === 'animalID' ? 'Animal ID' : 'Microchip'} already exists`,
          severity: 'error',
          code: 'DUPLICATE_VALUE'
        });
      } else {
        resolve(null);
      }
    }, 500);
  });
};

/**
 * Batch validation for bulk import
 */
export const validateBulkData = (
  records: any[],
  onProgress?: (progress: number) => void
): Promise<ValidationResult[]> => {
  return new Promise((resolve) => {
    const results: ValidationResult[] = [];
    let processed = 0;

    const processRecord = (record: any, index: number) => {
      return new Promise<ValidationResult>((recordResolve) => {
        setTimeout(() => {
          const formData = transformRecordToFormData(record);
          const result = validateAnimalForm(formData);
          processed++;
          
          if (onProgress) {
            onProgress((processed / records.length) * 100);
          }
          
          recordResolve(result);
        }, 10); // Small delay to prevent blocking
      });
    };

    Promise.all(records.map(processRecord)).then(resolve);
  });
};

/**
 * Transform import record to form data
 */
const transformRecordToFormData = (record: any): AnimalFormData => {
  return {
    animalID: record.animalID || '',
    name: record.name || '',
    species: record.species || 'BOVINE',
    sex: record.sex || 'FEMALE',
    age: parseInt(record.age) || undefined,
    weight: parseFloat(record.weight) || undefined,
    microchip: record.microchip || '',
    dateOfBirth: record.dateOfBirth || '',
    registrationDate: record.registrationDate || new Date().toISOString().split('T')[0],
    status: record.status || 'ACTIVE',
    selectedRoles: record.roles ? record.roles.split(',').map((r: string) => r.trim()) : [],
    generateInternalNumber: false,
    customer: {
      name: record.customerName || '',
      customerID: record.customerID || '',
      region: record.customerRegion || '',
      contactNumber: record.customerPhone || '',
      email: record.customerEmail || '',
      category: record.customerCategory || 'Standard'
    },
    owner: record.owner || record.customerName || '',
    purpose: record.purpose || '',
    breed: record.breed || '',
    color: record.color || '',
    notes: record.notes || '',
    internalNumberHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

/**
 * Get validation summary
 */
export const getValidationSummary = (results: ValidationResult[]): {
  total: number;
  valid: number;
  errors: number;
  warnings: number;
  errorMessages: string[];
} => {
  const summary = {
    total: results.length,
    valid: results.filter(r => r.isValid && r.warnings.length === 0).length,
    errors: results.filter(r => !r.isValid).length,
    warnings: results.filter(r => r.isValid && r.warnings.length > 0).length,
    errorMessages: []
  };

  // Collect unique error messages
  const errorSet = new Set<string>();
  results.forEach(result => {
    result.errors.forEach(error => errorSet.add(error.message));
  });
  
  summary.errorMessages = Array.from(errorSet);

  return summary;
}; 