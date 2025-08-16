import React, { useState } from 'react';
import { 
  Users, 
  User,
  Clock, 
  Calendar, 
  DollarSign, 
  Shield, 
  UserCheck,
  Briefcase,
  FileText,
  BarChart3,
  CheckCircle,
  Zap,
  Flag,
  Calculator,
  Bell,
  FileSpreadsheet,
  UserCog,
  Settings,
  ClipboardCheck,
  TimerIcon,
  CalendarDays,
  CreditCard,
  ShieldCheck,
  TrendingUp,
  FileBarChart,
  AlertTriangle
} from 'lucide-react';

// Phase 1 Components
import EmployeeDashboard from '../components/EmployeeDashboard';
import EmployeeManagement from '../components/EmployeeManagement';
import JobPositions from '../components/JobPositions';
import ContractManagement from '../components/ContractManagement';

// Phase 2 Components
import AttendanceManagement from '../components/AttendanceManagement';
import LeaveManagement from '../components/LeaveManagement';

// Phase 3 Components - Enhanced with KSA Features
import PayrollManagement from '../components/PayrollManagement';
import BenefitsManagement from '../components/BenefitsManagement';
import KSAPayrollManagement from '../components/KSAPayrollManagement';

// Phase 4 Components
import HRAnalytics from '../components/HRAnalytics';

// Phase 5 Components - ESS/MSS
import ESSDashboard from '../components/ESSDashboard';
import MSSDashboard from '../components/MSSDashboard';

const HumanResourcesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Organized module groups with unique icons and distinct colors
  const moduleGroups = [
    {
      groupName: "Self-Service Portals",
      groupIcon: UserCog,
      groupColor: "emerald",
      description: "Employee and Manager self-service dashboards",
      modules: [
        {
          id: 'ess',
          name: 'Employee Portal',
          icon: User,
          description: 'Submit requests, access documents, manage profile',
          badge: 'ESS',
          status: 'NEW',
          color: 'emerald',
          ksaFeatures: ['Request Submission', 'Document Access', 'Leave Calendar']
        },
        {
          id: 'mss',
          name: 'Manager Portal',
          icon: UserCog,
          description: 'Team oversight, approvals, and workflow management',
          badge: 'MSS',
          status: 'NEW',
          color: 'violet',
          ksaFeatures: ['Team Overview', 'Approval Queue', 'Delegation']
        },
        {
          id: 'dashboard',
          name: 'HR Dashboard',
          icon: Settings,
          description: 'Comprehensive HR overview and quick access',
          badge: 'OVERVIEW',
          status: 'ACTIVE',
          color: 'slate',
          ksaFeatures: ['Quick Stats', 'System Overview', 'Navigation Hub']
        }
      ]
    },
    {
      groupName: "Employee Management",
      groupIcon: Users,
      groupColor: "blue",
      description: "Core employee data and organizational structure",
      modules: [
        {
          id: 'employees',
          name: 'Employee Database',
          icon: Users,
          description: 'Complete employee records with KSA compliance',
          badge: 'CORE',
          status: 'COMPLETED',
          color: 'blue',
          ksaFeatures: ['Iqama Numbers', 'Visa Status', 'GOSI Registration']
        },
        {
          id: 'positions',
          name: 'Job Positions',
          icon: Briefcase,
          description: 'Job roles with GOSI categories and requirements',
          badge: 'CORE',
          status: 'COMPLETED',
          color: 'sky',
          ksaFeatures: ['GOSI Categories', 'Salary Bands', 'Requirements']
        },
        {
          id: 'contracts',
          name: 'Contracts',
          icon: FileText,
          description: 'Labor law compliant contract management',
          badge: 'CORE',
          status: 'COMPLETED',
          color: 'cyan',
          ksaFeatures: ['Labor Law', 'Auto-Renewals', 'Sponsorship']
        }
      ]
    },
    {
      groupName: "Time & Attendance",
      groupIcon: ClipboardCheck,
      groupColor: "green",
      description: "Attendance tracking and leave management",
      modules: [
        {
          id: 'attendance',
          name: 'Attendance Tracking',
          icon: TimerIcon,
          description: 'Time tracking with Saudi working hours',
          badge: 'TIME',
          status: 'COMPLETED',
          color: 'green',
          ksaFeatures: ['Prayer Breaks', 'Overtime Rules', 'Shift Management']
        },
        {
          id: 'leave',
          name: 'Leave Management',
          icon: CalendarDays,
          description: 'Leave requests with Saudi holidays',
          badge: 'TIME',
          status: 'COMPLETED',
          color: 'lime',
          ksaFeatures: ['Hajj/Umrah', 'National Holidays', 'Balance Tracking']
        }
      ]
    },
    {
      groupName: "Payroll & Benefits",
      groupIcon: CreditCard,
      groupColor: "indigo",
      description: "Compensation, benefits, and financial management",
      modules: [
        {
          id: 'payroll',
          name: 'Payroll & GOSI',
          icon: DollarSign,
          description: 'Complete payroll with GOSI calculations',
          badge: 'FINANCE',
          status: 'COMPLETED',
          color: 'indigo',
          ksaFeatures: ['GOSI Auto-Calc', 'WPS Integration', 'Tax Compliance']
        },
        {
          id: 'benefits',
          name: 'Benefits & Insurance',
          icon: ShieldCheck,
          description: 'Employee benefits and insurance management',
          badge: 'FINANCE',
          status: 'COMPLETED',
          color: 'purple',
          ksaFeatures: ['Medical Insurance', 'GOSI Benefits', 'Allowances']
        },
        {
          id: 'eos-calculator',
          name: 'End-of-Service Calculator',
          icon: Calculator,
          description: 'Progressive EOS calculation per Saudi law',
          badge: 'FINANCE',
          status: 'ACTIVE',
          color: 'fuchsia',
          ksaFeatures: ['Progressive Rates', 'Leave Encashment', 'Final Settlement']
        }
      ]
    },
    {
      groupName: "KSA Compliance",
      groupIcon: Flag,
      groupColor: "teal",
      description: "Saudi-specific compliance and regulatory features",
      modules: [
        {
          id: 'wps-center',
          name: 'WPS Center',
          icon: FileSpreadsheet,
          description: 'Wage Protection System integration',
          badge: 'KSA',
          status: 'ACTIVE',
          color: 'teal',
          ksaFeatures: ['SAMA Integration', 'Bank Files', 'Payment Validation']
        },
        {
          id: 'compliance',
          name: 'Compliance Tracking',
          icon: AlertTriangle,
          description: 'Automated compliance monitoring',
          badge: 'KSA',
          status: 'COMPLETED',
          color: 'amber',
          ksaFeatures: ['Visa Renewals', 'Contract Alerts', 'Document Expiry']
        }
      ]
    },
    {
      groupName: "Analytics & Reports",
      groupIcon: TrendingUp,
      groupColor: "orange",
      description: "Performance analytics and business intelligence",
      modules: [
        {
          id: 'analytics',
          name: 'HR Analytics',
          icon: FileBarChart,
          description: 'Comprehensive HR analytics and insights',
          badge: 'ANALYTICS',
          status: 'COMPLETED',
          color: 'orange',
          ksaFeatures: ['Performance Metrics', 'Compliance Reports', 'Saudization']
        }
      ]
    }
  ];

  // Flatten modules for backward compatibility
  const tabs = moduleGroups.flatMap(group => group.modules);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <EmployeeDashboard />;
      case 'ess':
        return <ESSDashboard />;
      case 'mss':
        return <MSSDashboard />;
      case 'employees':
        return <EmployeeManagement />;
      case 'positions':
        return <JobPositions />;
      case 'contracts':
        return <ContractManagement />;
      case 'attendance':
        return <AttendanceManagement />;
      case 'leave':
        return <LeaveManagement />;
      case 'payroll':
      case 'wps-center':
      case 'eos-calculator':
        return <KSAPayrollManagement />;
      case 'benefits':
        return <BenefitsManagement />;
      case 'compliance':
        return <KSAPayrollManagement />; // Will show compliance tab
      case 'analytics':
        return <HRAnalytics />;
      default:
        return <EmployeeDashboard />;
    }
  };

  const getBadgeColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'sky': return 'bg-sky-100 text-sky-800';
      case 'cyan': return 'bg-cyan-100 text-cyan-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'lime': return 'bg-lime-100 text-lime-800';
      case 'purple': return 'bg-purple-100 text-purple-800';
      case 'violet': return 'bg-violet-100 text-violet-800';
      case 'fuchsia': return 'bg-fuchsia-100 text-fuchsia-800';
      case 'indigo': return 'bg-indigo-100 text-indigo-800';
      case 'orange': return 'bg-orange-100 text-orange-800';
      case 'amber': return 'bg-amber-100 text-amber-800';
      case 'teal': return 'bg-teal-100 text-teal-800';
      case 'emerald': return 'bg-emerald-100 text-emerald-800';
      case 'slate': return 'bg-slate-100 text-slate-800';
      case 'gray': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'ACTIVE':
        return <Zap className="w-4 h-4 text-teal-600" />;
      case 'NEW':
        return <Zap className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'ACTIVE':
        return 'bg-teal-100 text-teal-800';
      case 'NEW':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Count modules by status
  const completedModules = tabs.filter(tab => tab.status === 'COMPLETED').length;
  const activeModules = tabs.filter(tab => tab.status === 'ACTIVE').length;
  const newModules = tabs.filter(tab => tab.status === 'NEW').length;
  const totalModules = tabs.length;
  const totalGroups = moduleGroups.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Human Resources
                    {activeTab && (
                      <span className="text-lg font-normal text-gray-500 ml-2">
                        → {tabs.find(tab => tab.id === activeTab)?.name}
                      </span>
                    )}
                  </h1>
                  <p className="text-sm text-gray-600">KSA-Native HR Management System</p>
                </div>
              </div>
              
              {/* Quick Module Navigation */}
              <div className="flex items-center space-x-1 bg-gray-50 rounded-lg p-2">
                {tabs.map((module, index) => (
                  <button
                    key={module.id}
                    onClick={() => setActiveTab(module.id)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      activeTab === module.id
                        ? `bg-${module.color}-100 text-${module.color}-700 shadow-sm`
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                    title={module.name}
                  >
                    <module.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                🇸🇦 KSA COMPLIANT
              </span>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {completedModules + activeModules}/{totalModules} MODULES
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Module Access - Organized by Groups */}
        <div className="mb-6 space-y-4">
          {moduleGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {/* Group Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <group.groupIcon className={`w-4 h-4 text-${group.groupColor}-600`} />
                  <h3 className="font-medium text-gray-900">{group.groupName}</h3>
                  <span className="text-sm text-gray-500">({group.modules.length})</span>
                </div>
                <span className="text-xs text-gray-500">{group.description}</span>
              </div>
              
              {/* Group Modules - Horizontal Layout */}
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {group.modules.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => setActiveTab(module.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                        activeTab === module.id
                          ? `border-${group.groupColor}-300 bg-${group.groupColor}-50 text-${group.groupColor}-700`
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      <module.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{module.name}</span>
                      <span className={`px-1.5 py-0.5 text-xs rounded-full ${getBadgeColor(module.color)}`}>
                        {module.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>



        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default HumanResourcesPage; 