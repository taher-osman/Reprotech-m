import { 
  LucideIcon, 
  BarChart3, 
  Activity,
  Dog, 
  Dna, 
  Stethoscope, 
  Syringe,
  Heart,
  Microscope,
  TestTube,
  Beaker,
  FlaskConical,
  Zap,
  Database,
  Computer,
  Calendar,
  Users,
  Package,
  Settings,
  Monitor,
  Brain,
  Sparkles,
  HelpCircle,
  Building,
  Clock,
  Workflow,
  UserCheck,
  FileText,
  DollarSign,
  BookOpen,
  Target,
  Droplets
} from 'lucide-react';

export interface NavItem {
  id: string;
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  disabled?: boolean;
  badge?: string;
}

export interface NavGroup {
  id: string;
  title: string;
  icon: LucideIcon;
  items: NavItem[];
  color?: string;
}

export const navigationConfig: NavGroup[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: BarChart3,
    color: 'blue',
    items: [
      {
        id: 'analytics-dashboard',
        title: 'Analytics Dashboard',
        href: '/dashboard',
        icon: BarChart3,
        description: 'Comprehensive analytics and reporting'
      },
      {
        id: 'realtime-monitoring',
        title: 'Real-time Monitoring',
        href: '/dashboard/monitoring',
        icon: Activity,
        description: 'Live system monitoring and alerts'
      }
    ]
  },
  {
    id: 'animal-management',
    title: 'Animal Management',
    icon: Dog,
    color: 'green',
    items: [
      {
        id: 'animals',
        title: 'Animals Database',
        href: '/animals',
        icon: Dog,
        description: 'Animal records and management'
      },
      {
        id: 'phenotype',
        title: 'Phenotype Analysis',
        href: '/animals/phenotype',
        icon: Dna,
        description: 'Phenotypic data and analysis'
      },
      {
        id: 'vaccinations',
        title: 'Vaccinations',
        href: '/animals/vaccinations',
        icon: Syringe,
        description: 'Vaccination records and schedules'
      }
    ]
  },
  {
    id: 'reproduction',
    title: 'Reproduction',
    icon: Heart,
    color: 'pink',
    items: [
      {
        id: 'integration-hub',
        title: 'Integration Hub',
        href: '/modules/integration-hub',
        icon: Workflow,
        description: 'Unified workflow management & cross-module analytics',
        badge: 'PHASE 4'
      },
      {
        id: 'calendar',
        title: 'Reproduction Calendar',
        href: '/modules/calendar',
        icon: Calendar,
        description: 'Unified reproductive activity calendar'
      },
      {
        id: 'ultrasound',
        title: 'Ultrasound',
        href: '/modules/ultrasound',
        icon: Monitor,
        description: 'Ultrasound examinations and reproductive monitoring'
      },
      {
        id: 'breeding',
        title: 'Breeding',
        href: '/modules/breeding',
        icon: Heart,
        description: 'Breeding programs and genetics'
      },
      {
        id: 'opu',
        title: 'OPU (Ovum Pick-Up)',
        href: '/modules/opu',
        icon: Microscope,
        description: 'Ovum pick-up sessions and oocyte collection',
        badge: 'NEW'
      },
      {
        id: 'embryo-detail',
        title: 'Embryo Detail',
        href: '/modules/embryo-detail',
        icon: FlaskConical,
        description: 'Comprehensive embryo tracking and quality assessment',
        badge: 'NEW'
      },
      {
        id: 'flushing',
        title: 'Flushing',
        href: '/modules/flushing',
        icon: Zap,
        description: 'Embryo flushing procedures'
      },
      {
        id: 'embryo-transfer',
        title: 'Embryo Transfer',
        href: '/modules/embryo-transfer',
        icon: Sparkles,
        description: 'Embryo transfer management'
      },
      {
        id: 'semen-management',
        title: 'Semen Management',
        href: '/modules/semen-management',
        icon: TestTube,
        description: 'Semen collection and analysis'
      },
      {
        id: 'fertilization',
        title: 'Fertilization',
        href: '/modules/fertilization',
        icon: Zap,
        description: 'IVF, ICSI, and SCNT fertilization management',
        badge: 'PHASE 2'
      },
      {
        id: 'reproduction-hub',
        title: 'Reproduction Hub',
        href: '/modules/reproduction-hub',
        icon: Brain,
        description: 'Central Intelligence & Control for Reproductive Management'
      }
    ]
  },
  {
    id: 'clinical-lab',
    title: 'Clinical & Lab',
    icon: Stethoscope,
    color: 'purple',
    items: [
      {
        id: 'internal-medicine',
        title: 'Internal Medicine',
        href: '/modules/internal-medicine',
        icon: Stethoscope,
        description: 'Internal medicine and diagnostics'
      },
      {
        id: 'clinical-management',
        title: 'Clinical Management',
        href: '/modules/clinical-management',
        icon: Building,
        description: 'Clinical workflow management'
      },
      {
        id: 'clinical-scheduling',
        title: 'Clinical Scheduling',
        href: '/modules/clinical-scheduling',
        icon: Clock,
        description: 'Appointment and procedure scheduling'
      },
      {
        id: 'laboratory',
        title: 'Laboratory',
        href: '/modules/laboratory',
        icon: FlaskConical,
        description: 'Laboratory management and testing'
      },
      {
        id: 'lab-results',
        title: 'Lab Results',
        href: '/modules/lab-results',
        icon: Beaker,
        description: 'Laboratory results and analysis'
      },
      {
        id: 'media-preparation',
        title: 'Media Preparation',
        href: '/modules/media-preparation',
        icon: Droplets,
        description: 'Media formula management, batch preparation, and quality control',
        badge: 'NEW'
      }
    ]
  },
  {
    id: 'genomics-intelligence',
    title: 'Genomics & Intelligence',
    icon: Dna,
    color: 'indigo',
    items: [
      {
        id: 'genomics-advanced',
        title: 'Genomics Advanced',
        href: '/modules/genomics-advanced',
        icon: Brain,
        description: 'Advanced genomic analysis with AI intelligence'
      },
      {
        id: 'ai-analytics',
        title: 'AI Analytics & Intelligence',
        href: '/modules/ai-analytics',
        icon: Brain,
        description: 'AI-powered predictive analytics & machine learning insights',
        badge: 'PHASE 5'
      },
      {
        id: 'snp-analysis',
        title: 'SNP Analysis',
        href: '/modules/snp-analysis',
        icon: Dna,
        description: 'Single nucleotide polymorphism analysis'
      },
      {
        id: 'beadchip-mappings',
        title: 'BeadChip Mappings',
        href: '/modules/beadchip-mappings',
        icon: Computer,
        description: 'BeadChip array mappings and data'
      },
      {
        id: 'genomic-intelligence',
        title: 'Genomic Intelligence',
        href: '/modules/genomic-intelligence',
        icon: Brain,
        description: 'AI-powered genomic analysis'
      },
      {
        id: 'data-integration',
        title: 'Data Integration',
        href: '/modules/data-integration',
        icon: Database,
        description: 'Data integration and harmonization'
      }
    ]
  },
  {
    id: 'research-studies',
    title: 'Research & Studies',
    icon: FlaskConical,
    color: 'violet',
    items: [
      {
        id: 'research',
        title: 'Research Management',
        href: '/modules/research',
        icon: FlaskConical,
        description: 'Comprehensive research lifecycle management',
        badge: 'NEW'
      }
    ]
  },
  {
    id: 'customer-crm',
    title: 'Customer & CRM',
    icon: Users,
    color: 'orange',
    items: [
      {
        id: 'customers',
        title: 'Customers',
        href: '/modules/customers',
        icon: Users,
        description: 'Customer relationship management'
      },
      {
        id: 'customers-advanced',
        title: 'Customers Advanced',
        href: '/modules/customers-advanced',
        icon: Users,
        description: 'Advanced customer & CRM management with analytics'
      }
    ]
  },
  {
    id: 'branch-management',
    title: 'Branch Management',
    icon: Building,
    color: 'blue',
    items: [
      {
        id: 'branch-management',
        title: 'Branch Management',
        href: '/modules/branch-management',
        icon: Building,
        description: 'Manage farms, laboratories, clinics, and research centers',
        badge: 'NEW'
      }
    ]
  },
  {
    id: 'finance-cost-centers',
    title: 'Finance & Cost Centers',
    icon: DollarSign,
    color: 'emerald',
    items: [
      {
        id: 'finance',
        title: 'Finance Management',
        href: '/modules/finance',
        icon: DollarSign,
        description: 'Comprehensive financial management with cost center analysis',
        badge: 'COMPREHENSIVE'
      }
    ]
  },
  {
    id: 'inventory-management',
    title: 'Inventory Management',
    icon: Package,
    color: 'teal',
    items: [
      {
        id: 'inventory',
        title: 'Inventory Control',
        href: '/modules/inventory',
        icon: Package,
        description: 'Complete inventory and stock management system',
        badge: 'PHASE 1'
      },
      {
        id: 'module-integration',
        title: 'Module Integration',
        href: '/modules/module-integration',
        icon: Workflow,
        description: 'Cross-module integration and procedure kit management',
        badge: 'PHASE 3'
      },
      {
        id: 'biobank-integration',
        title: 'Biobank Integration',
        href: '/modules/biobank-integration',
        icon: FlaskConical,
        description: 'LN₂ tank management and biobank sample tracking',
        badge: 'PHASE 4'
      },
      {
        id: 'procurement-management',
        title: 'Procurement Management',
        href: '/modules/procurement-management',
        icon: Building,
        description: 'Supplier management and purchase order automation',
        badge: 'PHASE 5'
      },
      {
        id: 'inventory-analytics',
        title: 'Inventory Analytics',
        href: '/modules/inventory-analytics',
        icon: BarChart3,
        description: 'AI-powered analytics and predictive insights',
        badge: 'PHASE 6'
      }
    ]
  },
  {
    id: 'biobank-samples',
    title: 'Biobank & Samples',
    icon: FlaskConical,
    color: 'cyan',
    items: [
      {
        id: 'sample-management',
        title: 'Sample Management',
        href: '/modules/sample-management',
        icon: FlaskConical,
        description: 'Comprehensive biological sample tracking and management',
        badge: 'NEW'
      },
      {
        id: 'biobank',
        title: 'Biobank',
        href: '/modules/biobank',
        icon: Database,
        description: 'Biobank sample management'
      }
    ]
  },
  {
    id: 'human-resources',
    title: 'Human Resources',
    icon: UserCheck,
    color: 'amber',
    items: [
      {
        id: 'human-resources',
        title: 'HR Management',
        href: '/modules/human-resources',
        icon: UserCheck,
        description: 'Employee management, attendance, and leave tracking',
        badge: 'PHASE 2'
      }
    ]
  },
  {
    id: 'tender-management',
    title: 'Tender Management',
    icon: FileText,
    color: 'slate',
    items: [
      {
        id: 'tender-management',
        title: 'Tender Management',
        href: '/modules/tender-management',
        icon: FileText,
        description: 'Government and institutional tender management system',
        badge: 'PHASE 1'
      }
    ]
  }
];

export const getNavItemByHref = (href: string): NavItem | null => {
  for (const group of navigationConfig) {
    const item = group.items.find(item => item.href === href);
    if (item) return item;
  }
  return null;
};

export const getNavGroupByItemId = (itemId: string): NavGroup | null => {
  for (const group of navigationConfig) {
    const item = group.items.find(item => item.id === itemId);
    if (item) return group;
  }
  return null;
}; 