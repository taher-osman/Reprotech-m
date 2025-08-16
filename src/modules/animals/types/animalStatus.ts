export enum AnimalSpecies {
  BOVINE = 'BOVINE',
  EQUINE = 'EQUINE',
  CAMEL = 'CAMEL',
  OVINE = 'OVINE',
  CAPRINE = 'CAPRINE',
  SWINE = 'SWINE'
}

export enum AnimalSex {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export enum AnimalStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DECEASED = 'DECEASED',
  SOLD = 'SOLD',
  TRANSFERRED = 'TRANSFERRED'
}

export enum AnimalRole {
  DONOR = 'Donor',
  RECIPIENT = 'Recipient',
  SIRE = 'Sire',
  LAB_SAMPLE = 'LabSample',
  REFERENCE = 'Reference'
}

export enum AnimalPurpose {
  BREEDING = 'Breeding',
  RACING = 'Racing',
  DAIRY = 'Dairy',
  MEAT = 'Meat',
  SHOW = 'Show',
  RESEARCH = 'Research'
}

export enum CustomerCategory {
  STANDARD = 'Standard',
  PREMIUM = 'Premium',
  VIP = 'VIP',
  RESEARCH = 'Research'
}

// Species-specific configuration
export const SPECIES_CONFIG = {
  [AnimalSpecies.BOVINE]: {
    label: 'Bovine (Cattle)',
    prefix: 'BV',
    defaultBreeds: ['Holstein', 'Angus', 'Hereford', 'Brahman', 'Simmental', 'Charolais'],
    colors: ['Black & White', 'Brown', 'Red', 'White', 'Black', 'Tan'],
    maxAge: 25,
    weightRange: { min: 200, max: 1200 }
  },
  [AnimalSpecies.EQUINE]: {
    label: 'Equine (Horse)',
    prefix: 'EQ',
    defaultBreeds: ['Arabian', 'Thoroughbred', 'Quarter Horse', 'Friesian', 'Clydesdale', 'Mustang'],
    colors: ['Chestnut', 'Bay', 'Black', 'Gray', 'Palomino', 'Pinto'],
    maxAge: 30,
    weightRange: { min: 300, max: 1000 }
  },
  [AnimalSpecies.CAMEL]: {
    label: 'Camel',
    prefix: 'CM',
    defaultBreeds: ['Dromedary', 'Bactrian', 'Hybrid', 'Racing Camel', 'Dairy Camel'],
    colors: ['Light Brown', 'Dark Brown', 'Tan', 'Cream', 'Golden'],
    maxAge: 40,
    weightRange: { min: 400, max: 800 }
  },
  [AnimalSpecies.OVINE]: {
    label: 'Ovine (Sheep)',
    prefix: 'OV',
    defaultBreeds: ['Merino', 'Suffolk', 'Dorper', 'Romney', 'Leicester', 'Corriedale'],
    colors: ['White', 'Black', 'Brown', 'Gray', 'Mixed'],
    maxAge: 15,
    weightRange: { min: 40, max: 150 }
  },
  [AnimalSpecies.CAPRINE]: {
    label: 'Caprine (Goat)',
    prefix: 'CP',
    defaultBreeds: ['Nubian', 'Boer', 'Alpine', 'Saanen', 'Toggenburg', 'Nigerian Dwarf'],
    colors: ['White', 'Brown', 'Black', 'Mixed', 'Tan'],
    maxAge: 15,
    weightRange: { min: 20, max: 100 }
  },
  [AnimalSpecies.SWINE]: {
    label: 'Swine (Pig)',
    prefix: 'SW',
    defaultBreeds: ['Yorkshire', 'Hampshire', 'Duroc', 'Landrace', 'Pietrain', 'Chester White'],
    colors: ['Pink', 'Black', 'White', 'Spotted', 'Red'],
    maxAge: 12,
    weightRange: { min: 50, max: 400 }
  }
};

// Role configuration with colors and module associations
export const ROLE_CONFIG = {
  [AnimalRole.DONOR]: {
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: '🫀',
    description: 'Animal used for genetic material donation',
    associatedModules: ['flushing', 'embryo-collection', 'breeding']
  },
  [AnimalRole.RECIPIENT]: {
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: '🤱',
    description: 'Animal receiving embryos or genetic material',
    associatedModules: ['embryo-transfer', 'pregnancy-monitoring']
  },
  [AnimalRole.SIRE]: {
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: '♂️',
    description: 'Male breeding animal',
    associatedModules: ['semen-collection', 'breeding', 'genomics']
  },
  [AnimalRole.LAB_SAMPLE]: {
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: '🧪',
    description: 'Animal providing samples for laboratory analysis',
    associatedModules: ['laboratory', 'lab-results', 'biobank']
  },
  [AnimalRole.REFERENCE]: {
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: '📊',
    description: 'Reference animal for genomic and research studies',
    associatedModules: ['genomics', 'snp-analysis', 'phenotype']
  }
};

// Status configuration with colors and workflows
export const STATUS_CONFIG = {
  [AnimalStatus.ACTIVE]: {
    color: 'bg-green-100 text-green-800',
    icon: '✅',
    description: 'Animal is currently active in the system'
  },
  [AnimalStatus.INACTIVE]: {
    color: 'bg-gray-100 text-gray-800',
    icon: '⏸️',
    description: 'Animal is temporarily inactive'
  },
  [AnimalStatus.DECEASED]: {
    color: 'bg-red-100 text-red-800',
    icon: '💀',
    description: 'Animal is deceased'
  },
  [AnimalStatus.SOLD]: {
    color: 'bg-blue-100 text-blue-800',
    icon: '💰',
    description: 'Animal has been sold'
  },
  [AnimalStatus.TRANSFERRED]: {
    color: 'bg-indigo-100 text-indigo-800',
    icon: '🔄',
    description: 'Animal has been transferred to another facility'
  }
};

// Validation rules
export const VALIDATION_RULES = {
  animalID: {
    pattern: /^[A-Z]{2}-\d{4}-\d{3,4}$/,
    example: 'BV-2025-001'
  },
  internalNumber: {
    pattern: /^INT-\d{4}-\d{4}$/,
    example: 'INT-2025-0001'
  },
  microchip: {
    minLength: 10,
    maxLength: 20
  },
  age: {
    min: 0,
    max: 50
  },
  weight: {
    min: 0,
    max: 5000
  }
};

// Default values for new animals
export const DEFAULT_VALUES = {
  status: AnimalStatus.ACTIVE,
  sex: AnimalSex.FEMALE,
  species: AnimalSpecies.BOVINE,
  registrationDate: () => new Date().toISOString().split('T')[0],
  roles: [] as string[],
  internalNumberHistory: [] as any[]
}; 