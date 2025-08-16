export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'date' | 'email' | 'select';
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any, formData: any) => string | null;
  dependsOn?: string[];
  errorMessage?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
  warnings: { [key: string]: string };
  suggestions: { [key: string]: string };
}

export interface FormField {
  name: string;
  value: any;
  type: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
}

class FormValidator {
  private rules: ValidationRule[] = [];
  private realTimeValidation = true;
  private validationHistory: { [key: string]: string[] } = {};

  setRules(rules: ValidationRule[]): void {
    this.rules = rules;
  }

  addRule(rule: ValidationRule): void {
    this.rules.push(rule);
  }

  setRealTimeValidation(enabled: boolean): void {
    this.realTimeValidation = enabled;
  }

  validateField(fieldName: string, value: any, formData: any = {}): string | null {
    const rule = this.rules.find(r => r.field === fieldName);
    if (!rule) return null;

    // Required validation
    if (rule.required && (value === '' || value === null || value === undefined)) {
      return rule.errorMessage || `${fieldName} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!rule.required && (value === '' || value === null || value === undefined)) {
      return null;
    }

    // Type validation
    if (rule.type) {
      const typeError = this.validateType(rule.type, value, fieldName);
      if (typeError) return typeError;
    }

    // Min/Max validation for numbers
    if (rule.type === 'number' && typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        return `${fieldName} must be at least ${rule.min}`;
      }
      if (rule.max !== undefined && value > rule.max) {
        return `${fieldName} must be at most ${rule.max}`;
      }
    }

    // String length validation
    if (rule.type === 'string' && typeof value === 'string') {
      if (rule.minLength !== undefined && value.length < rule.minLength) {
        return `${fieldName} must be at least ${rule.minLength} characters`;
      }
      if (rule.maxLength !== undefined && value.length > rule.maxLength) {
        return `${fieldName} must be at most ${rule.maxLength} characters`;
      }
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string') {
      if (!rule.pattern.test(value)) {
        return rule.errorMessage || `${fieldName} format is invalid`;
      }
    }

    // Date validation
    if (rule.type === 'date') {
      const dateError = this.validateDate(value, fieldName);
      if (dateError) return dateError;
    }

    // Custom validation
    if (rule.customValidator) {
      const customError = rule.customValidator(value, formData);
      if (customError) return customError;
    }

    // Dependency validation
    if (rule.dependsOn) {
      const dependencyError = this.validateDependencies(rule, formData);
      if (dependencyError) return dependencyError;
    }

    return null;
  }

  validateForm(formData: any): ValidationResult {
    const errors: { [key: string]: string } = {};
    const warnings: { [key: string]: string } = {};
    const suggestions: { [key: string]: string } = {};

    // Validate each field
    for (const rule of this.rules) {
      const value = formData[rule.field];
      const error = this.validateField(rule.field, value, formData);
      
      if (error) {
        errors[rule.field] = error;
      }
    }

    // Cross-field validations
    const crossFieldErrors = this.validateCrossFields(formData);
    Object.assign(errors, crossFieldErrors);

    // Generate warnings and suggestions
    const warningsAndSuggestions = this.generateWarningsAndSuggestions(formData);
    Object.assign(warnings, warningsAndSuggestions.warnings);
    Object.assign(suggestions, warningsAndSuggestions.suggestions);

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  private validateType(type: string, value: any, fieldName: string): string | null {
    switch (type) {
      case 'string':
        if (typeof value !== 'string') {
          return `${fieldName} must be a string`;
        }
        break;
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          return `${fieldName} must be a valid number`;
        }
        break;
      case 'email':
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          return `${fieldName} must be a valid email address`;
        }
        break;
      case 'date':
        if (!(value instanceof Date) && !this.isValidDateString(value)) {
          return `${fieldName} must be a valid date`;
        }
        break;
    }
    return null;
  }

  private validateDate(value: any, fieldName: string): string | null {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return `${fieldName} must be a valid date`;
    }

    // Check if date is in the past (for future dates)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (fieldName.toLowerCase().includes('future') && date < today) {
      return `${fieldName} cannot be in the past`;
    }

    return null;
  }

  private validateDependencies(rule: ValidationRule, formData: any): string | null {
    if (!rule.dependsOn) return null;

    for (const dependency of rule.dependsOn) {
      if (!formData[dependency]) {
        return `${rule.field} requires ${dependency} to be set`;
      }
    }

    return null;
  }

  private validateCrossFields(formData: any): { [key: string]: string } {
    const errors: { [key: string]: string } = {};

    // Example cross-field validations
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) {
        errors.endDate = 'End date must be after start date';
      }
    }

    return errors;
  }

  private generateWarningsAndSuggestions(formData: any): { 
    warnings: { [key: string]: string }; 
    suggestions: { [key: string]: string };
  } {
    const warnings: { [key: string]: string } = {};
    const suggestions: { [key: string]: string } = {};

    // Add specific warnings and suggestions based on field values
    if (formData.embryoGrade && formData.embryoGrade === 'C') {
      warnings.embryoGrade = 'Grade C embryos have lower success rates';
      suggestions.embryoGrade = 'Consider discussing transfer timing with veterinarian';
    }

    if (formData.targetEmbryoCount && formData.targetEmbryoCount > 20) {
      warnings.targetEmbryoCount = 'High target count may affect quality';
      suggestions.targetEmbryoCount = 'Consider splitting into multiple sessions';
    }

    return { warnings, suggestions };
  }

  private isValidDateString(value: string): boolean {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }

  // Real-time validation for individual fields
  validateFieldRealTime(fieldName: string, value: any, formData: any = {}): {
    error: string | null;
    warning: string | null;
    suggestion: string | null;
  } {
    const error = this.validateField(fieldName, value, formData);
    const result = this.validateForm({ ...formData, [fieldName]: value });
    
    return {
      error,
      warning: result.warnings[fieldName] || null,
      suggestion: result.suggestions[fieldName] || null
    };
  }

  // Track validation history for analytics
  trackValidation(fieldName: string, error: string | null): void {
    if (!this.validationHistory[fieldName]) {
      this.validationHistory[fieldName] = [];
    }
    
    if (error) {
      this.validationHistory[fieldName].push(error);
    }
  }

  getValidationHistory(): { [key: string]: string[] } {
    return { ...this.validationHistory };
  }

  clearValidationHistory(): void {
    this.validationHistory = {};
  }
}

// Pre-configured validators for specific forms

export const createTransferFormValidator = (): FormValidator => {
  const validator = new FormValidator();
  
  validator.setRules([
    {
      field: 'embryoId',
      required: true,
      type: 'string',
      errorMessage: 'Please select an embryo'
    },
    {
      field: 'recipientId',
      required: true,
      type: 'string',
      errorMessage: 'Please select a recipient'
    },
    {
      field: 'transferDate',
      required: true,
      type: 'date',
      customValidator: (value, formData) => {
        const date = new Date(value);
        const today = new Date();
        const maxFutureDate = new Date();
        maxFutureDate.setDate(today.getDate() + 30);
        
        if (date < today) {
          return 'Transfer date cannot be in the past';
        }
        if (date > maxFutureDate) {
          return 'Transfer date cannot be more than 30 days in the future';
        }
        return null;
      }
    },
    {
      field: 'transferTime',
      required: true,
      type: 'string',
      pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      errorMessage: 'Please enter a valid time (HH:MM)'
    },
    {
      field: 'veterinarian',
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 100,
      errorMessage: 'Veterinarian name is required'
    },
    {
      field: 'technician',
      required: true,
      type: 'string',
      errorMessage: 'Please select a technician'
    },
    {
      field: 'embryoGrade',
      required: true,
      type: 'string',
      customValidator: (value) => {
        const validGrades = ['A', 'B', 'C'];
        if (!validGrades.includes(value)) {
          return 'Please select a valid embryo grade';
        }
        return null;
      }
    },
    {
      field: 'specialNotes',
      type: 'string',
      maxLength: 500,
      errorMessage: 'Notes cannot exceed 500 characters'
    }
  ]);

  return validator;
};

export const createFertilizationFormValidator = (): FormValidator => {
  const validator = new FormValidator();
  
  validator.setRules([
    {
      field: 'fertilizationType',
      required: true,
      type: 'string',
      customValidator: (value) => {
        const validTypes = ['IVF', 'ICSI', 'SCNT'];
        if (!validTypes.includes(value)) {
          return 'Please select a valid fertilization type';
        }
        return null;
      }
    },
    {
      field: 'fertilizationDate',
      required: true,
      type: 'date',
      customValidator: (value) => {
        const date = new Date(value);
        const today = new Date();
        const maxFutureDate = new Date();
        maxFutureDate.setDate(today.getDate() + 7);
        
        if (date > maxFutureDate) {
          return 'Fertilization date cannot be more than 7 days in the future';
        }
        return null;
      }
    },
    {
      field: 'technician',
      required: true,
      type: 'string',
      errorMessage: 'Please select a technician'
    },
    {
      field: 'recipientLab',
      required: true,
      type: 'string',
      errorMessage: 'Please select a laboratory'
    },
    {
      field: 'targetEmbryoCount',
      required: true,
      type: 'number',
      min: 1,
      max: 50,
      customValidator: (value, formData) => {
        if (value > 30) {
          return 'Consider splitting large sessions for better quality control';
        }
        return null;
      }
    },
    {
      field: 'notes',
      type: 'string',
      maxLength: 1000,
      errorMessage: 'Notes cannot exceed 1000 characters'
    }
  ]);

  return validator;
};

// Enhanced validation hook for React components
export const useEnhancedValidation = (formType: 'transfer' | 'fertilization') => {
  const validator = formType === 'transfer' 
    ? createTransferFormValidator() 
    : createFertilizationFormValidator();

  const validateField = (fieldName: string, value: any, formData: any = {}) => {
    return validator.validateFieldRealTime(fieldName, value, formData);
  };

  const validateForm = (formData: any) => {
    return validator.validateForm(formData);
  };

  const trackValidation = (fieldName: string, error: string | null) => {
    validator.trackValidation(fieldName, error);
  };

  return {
    validateField,
    validateForm,
    trackValidation,
    getValidationHistory: () => validator.getValidationHistory(),
    clearValidationHistory: () => validator.clearValidationHistory()
  };
};

export default FormValidator; 