import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  X, 
  Search, 
  Filter, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  User,
  Building,
  Mail,
  Calendar,
  Zap,
  Crown,
  Save,
  UserPlus,
  Eye,
  AlertCircle
} from 'lucide-react';
import { 
  TenderTeamMember, 
  TenderRole, 
  TeamMemberAvailability, 
  DepartmentWorkload 
} from '../types/tenderTypes';

interface TenderTeamAssignmentProps {
  tenderId: string;
  currentTeam: TenderTeamMember[];
  onTeamUpdate: (team: TenderTeamMember[]) => Promise<void>;
  onClose: () => void;
  className?: string;
}

// Mock HR data - in real implementation, this would come from HR module
const mockEmployees: TeamMemberAvailability[] = [
  {
    user_id: 'emp-001',
    user_name: 'Dr. Ahmed Hassan',
    department: 'Medical Devices',
    job_title: 'Senior Medical Engineer',
    current_workload: 75,
    available_hours_per_week: 40,
    vacation_dates: [],
    skills: ['Medical Equipment', 'Project Management', 'Regulatory Compliance'],
    experience_level: 'Senior',
    cost_per_hour: 85
  },
  {
    user_id: 'emp-002',
    user_name: 'Sarah Wilson',
    department: 'Finance',
    job_title: 'Financial Analyst',
    current_workload: 60,
    available_hours_per_week: 40,
    vacation_dates: ['2025-07-15', '2025-07-16'],
    skills: ['Financial Analysis', 'Budget Planning', 'Risk Assessment'],
    experience_level: 'Mid',
    cost_per_hour: 65
  },
  {
    user_id: 'emp-003',
    user_name: 'Michael Chen',
    department: 'Legal',
    job_title: 'Legal Advisor',
    current_workload: 45,
    available_hours_per_week: 40,
    vacation_dates: [],
    skills: ['Contract Law', 'Regulatory Compliance', 'Risk Management'],
    experience_level: 'Senior',
    cost_per_hour: 95
  },
  {
    user_id: 'emp-004',
    user_name: 'Lisa Rodriguez',
    department: 'Procurement',
    job_title: 'Procurement Specialist',
    current_workload: 80,
    available_hours_per_week: 40,
    vacation_dates: [],
    skills: ['Supplier Management', 'Contract Negotiation', 'Quality Assurance'],
    experience_level: 'Expert',
    cost_per_hour: 75
  },
  {
    user_id: 'emp-005',
    user_name: 'James Turner',
    department: 'Human Resources',
    job_title: 'HR Coordinator',
    current_workload: 55,
    available_hours_per_week: 40,
    vacation_dates: [],
    skills: ['Team Management', 'Resource Planning', 'Policy Development'],
    experience_level: 'Mid',
    cost_per_hour: 55
  },
  {
    user_id: 'emp-006',
    user_name: 'Anna Kowalski',
    department: 'Quality Assurance',
    job_title: 'QA Manager',
    current_workload: 70,
    available_hours_per_week: 40,
    vacation_dates: ['2025-08-01', '2025-08-02', '2025-08-03'],
    skills: ['Quality Management', 'Process Improvement', 'Documentation'],
    experience_level: 'Senior',
    cost_per_hour: 70
  }
];

const departmentWorkloads: DepartmentWorkload[] = [
  {
    department: 'Medical Devices',
    total_members: 8,
    available_members: 6,
    average_workload: 72,
    active_tenders: 4,
    capacity_status: 'At Capacity'
  },
  {
    department: 'Finance',
    total_members: 5,
    available_members: 4,
    average_workload: 65,
    active_tenders: 3,
    capacity_status: 'Under Capacity'
  },
  {
    department: 'Legal',
    total_members: 3,
    available_members: 3,
    average_workload: 55,
    active_tenders: 2,
    capacity_status: 'Under Capacity'
  },
  {
    department: 'Procurement',
    total_members: 6,
    available_members: 4,
    average_workload: 85,
    active_tenders: 5,
    capacity_status: 'Over Capacity'
  },
  {
    department: 'Human Resources',
    total_members: 4,
    available_members: 4,
    average_workload: 60,
    active_tenders: 2,
    capacity_status: 'Under Capacity'
  },
  {
    department: 'Quality Assurance',
    total_members: 4,
    available_members: 3,
    average_workload: 75,
    active_tenders: 3,
    capacity_status: 'At Capacity'
  }
];

const roleRequirements = {
  [TenderRole.PROJECT_LEAD]: {
    skills: ['Project Management', 'Leadership', 'Communication'],
    min_experience: 'Senior',
    max_workload: 70
  },
  [TenderRole.FINANCIAL_ANALYST]: {
    skills: ['Financial Analysis', 'Budget Planning'],
    min_experience: 'Mid',
    max_workload: 80
  },
  [TenderRole.TECHNICAL_LEAD]: {
    skills: ['Technical Expertise', 'Engineering'],
    min_experience: 'Senior',
    max_workload: 75
  },
  [TenderRole.HR_COORDINATOR]: {
    skills: ['Team Management', 'Resource Planning'],
    min_experience: 'Mid',
    max_workload: 70
  },
  [TenderRole.LEGAL_ADVISOR]: {
    skills: ['Contract Law', 'Regulatory Compliance'],
    min_experience: 'Senior',
    max_workload: 65
  },
  [TenderRole.LOGISTICS_MANAGER]: {
    skills: ['Supply Chain', 'Project Coordination'],
    min_experience: 'Mid',
    max_workload: 75
  }
};

export const TenderTeamAssignment: React.FC<TenderTeamAssignmentProps> = ({
  tenderId,
  currentTeam,
  onTeamUpdate,
  onClose,
  className = ''
}) => {
  const [team, setTeam] = useState<TenderTeamMember[]>(currentTeam);
  const [availableEmployees, setAvailableEmployees] = useState<TeamMemberAvailability[]>(mockEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<TenderRole | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<TeamMemberAvailability | null>(null);
  const [assigningRole, setAssigningRole] = useState<TenderRole>(TenderRole.PROJECT_LEAD);
  const [saving, setSaving] = useState(false);

  const filteredEmployees = availableEmployees.filter(employee => {
    const matchesSearch = employee.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.job_title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    
    const notAlreadyAssigned = !team.some(member => member.user_id === employee.user_id);
    
    return matchesSearch && matchesDepartment && notAlreadyAssigned;
  });

  const getAvailabilityStatus = (employee: TeamMemberAvailability) => {
    if (employee.vacation_dates.length > 0) {
      const today = new Date();
      const hasUpcomingVacation = employee.vacation_dates.some(date => new Date(date) >= today);
      if (hasUpcomingVacation) return 'On Leave';
    }
    
    if (employee.current_workload >= 90) return 'Unavailable';
    if (employee.current_workload >= 75) return 'Busy';
    return 'Available';
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return 'text-red-600 bg-red-100';
    if (workload >= 75) return 'text-yellow-600 bg-yellow-100';
    if (workload >= 50) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  };

  const getRoleColor = (role: TenderRole) => {
    const colors = {
      [TenderRole.PROJECT_LEAD]: 'bg-purple-100 text-purple-800',
      [TenderRole.FINANCIAL_ANALYST]: 'bg-green-100 text-green-800',
      [TenderRole.TECHNICAL_LEAD]: 'bg-blue-100 text-blue-800',
      [TenderRole.HR_COORDINATOR]: 'bg-orange-100 text-orange-800',
      [TenderRole.LEGAL_ADVISOR]: 'bg-red-100 text-red-800',
      [TenderRole.LOGISTICS_MANAGER]: 'bg-indigo-100 text-indigo-800',
      [TenderRole.QUALITY_ASSURANCE]: 'bg-teal-100 text-teal-800',
      [TenderRole.PROCUREMENT_SPECIALIST]: 'bg-cyan-100 text-cyan-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const hasRequiredSkills = (employee: TeamMemberAvailability, role: TenderRole) => {
    const requirements = roleRequirements[role];
    if (!requirements) return true;
    
    return requirements.skills.some(skill => 
      employee.skills.some(empSkill => 
        empSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
  };

  const getWorkloadWarning = (employee: TeamMemberAvailability, role: TenderRole) => {
    const requirements = roleRequirements[role];
    if (!requirements) return null;
    
    if (employee.current_workload > requirements.max_workload) {
      return `Workload ${employee.current_workload}% exceeds recommended ${requirements.max_workload}% for this role`;
    }
    return null;
  };

  const handleAddMember = async (employee: TeamMemberAvailability, role: TenderRole) => {
    const newMember: TenderTeamMember = {
      user_id: employee.user_id,
      user_name: employee.user_name,
      email: `${employee.user_name.toLowerCase().replace(' ', '.')}@company.com`,
      role_in_tender: role,
      department: employee.department,
      job_title: employee.job_title,
      availability_status: getAvailabilityStatus(employee) as any,
      workload_percentage: employee.current_workload,
      assigned_by: 'current_user',
      assigned_at: new Date().toISOString(),
      is_lead: role === TenderRole.PROJECT_LEAD
    };

    setTeam(prev => [...prev, newMember]);
    setShowAddModal(false);
    setSelectedEmployee(null);
  };

  const handleRemoveMember = (userId: string) => {
    setTeam(prev => prev.filter(member => member.user_id !== userId));
  };

  const handleRoleChange = (userId: string, newRole: TenderRole) => {
    setTeam(prev => prev.map(member => 
      member.user_id === userId 
        ? { ...member, role_in_tender: newRole, is_lead: newRole === TenderRole.PROJECT_LEAD }
        : { ...member, is_lead: newRole === TenderRole.PROJECT_LEAD ? false : member.is_lead }
    ));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onTeamUpdate(team);
      onClose();
    } catch (error) {
      console.error('Failed to save team:', error);
    } finally {
      setSaving(false);
    }
  };

  const getDepartmentCapacity = (department: string) => {
    const dept = departmentWorkloads.find(d => d.department === department);
    return dept || null;
  };

  const renderEmployeeCard = (employee: TeamMemberAvailability) => {
    const availabilityStatus = getAvailabilityStatus(employee);
    const workloadColor = getWorkloadColor(employee.current_workload);
    const departmentCapacity = getDepartmentCapacity(employee.department);

    return (
      <div
        key={employee.user_id}
        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => {
          setSelectedEmployee(employee);
          setShowAddModal(true);
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{employee.user_name}</h3>
              <p className="text-sm text-gray-600">{employee.job_title}</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${workloadColor}`}>
            {employee.current_workload}%
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Building className="h-4 w-4" />
            <span>{employee.department}</span>
            {departmentCapacity && (
              <span className={`px-2 py-0.5 rounded text-xs ${
                departmentCapacity.capacity_status === 'Over Capacity' ? 'bg-red-100 text-red-700' :
                departmentCapacity.capacity_status === 'At Capacity' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {departmentCapacity.capacity_status}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{availabilityStatus}</span>
            {employee.vacation_dates.length > 0 && (
              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                {employee.vacation_dates.length} vacation days
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Zap className="h-4 w-4" />
            <span>{employee.experience_level}</span>
            <span>•</span>
            <span>${employee.cost_per_hour}/hr</span>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {employee.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
              >
                {skill}
              </span>
            ))}
            {employee.skills.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                +{employee.skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTeamMember = (member: TenderTeamMember) => {
    const roleColor = getRoleColor(member.role_in_tender);
    const workloadColor = getWorkloadColor(member.workload_percentage);

    return (
      <div
        key={member.user_id}
        className={`bg-white border-2 rounded-lg p-4 ${
          member.is_lead ? 'border-purple-300 bg-purple-50' : 'border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              member.is_lead ? 'bg-purple-100' : 'bg-blue-100'
            }`}>
              {member.is_lead ? (
                <Crown className="h-5 w-5 text-purple-600" />
              ) : (
                <User className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                <span>{member.user_name}</span>
                {member.is_lead && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                    Lead
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-600">{member.job_title}</p>
            </div>
          </div>
          <button
            onClick={() => handleRemoveMember(member.user_id)}
            className="text-red-400 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <select
              value={member.role_in_tender}
              onChange={(e) => handleRoleChange(member.user_id, e.target.value as TenderRole)}
              className={`px-3 py-1 rounded-full text-sm font-medium border-0 ${roleColor}`}
            >
              {Object.values(TenderRole).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span>{member.department}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${workloadColor}`}>
              {member.workload_percentage}% workload
            </span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{member.email}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Assigned {new Date(member.assigned_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Team Assignment</h2>
          <p className="text-gray-600">Assign team members and define roles for this tender</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{saving ? 'Saving...' : 'Save Team'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Team */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Current Team ({team.length})</h3>
            <span className="text-sm text-gray-500">
              Estimated cost: ${team.reduce((sum, member) => {
                const employee = availableEmployees.find(e => e.user_id === member.user_id);
                return sum + (employee?.cost_per_hour || 0) * 10; // Estimate 10 hours/week
              }, 0)}/week
            </span>
          </div>

          {team.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No team members assigned</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add team members from the available employees list
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {team.map(renderTeamMember)}
            </div>
          )}
        </div>

        {/* Available Employees */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Available Employees</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2 text-sm"
            >
              <UserPlus className="h-4 w-4" />
              <span>Quick Add</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-3">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                {Array.from(new Set(availableEmployees.map(e => e.department))).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Department Capacity Overview */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Department Capacity</h4>
            <div className="grid grid-cols-2 gap-2">
              {departmentWorkloads.map(dept => (
                <div key={dept.department} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{dept.department.split(' ')[0]}</span>
                  <span className={`px-2 py-0.5 rounded ${
                    dept.capacity_status === 'Over Capacity' ? 'bg-red-100 text-red-700' :
                    dept.capacity_status === 'At Capacity' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {dept.average_workload}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Employees List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredEmployees.map(renderEmployeeCard)}
            
            {filteredEmployees.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <User className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p>No employees match your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Role Assignment Modal */}
      {showAddModal && selectedEmployee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Assign Role</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedEmployee(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{selectedEmployee.user_name}</h4>
                  <p className="text-sm text-gray-600">{selectedEmployee.job_title}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Role
                </label>
                <select
                  value={assigningRole}
                  onChange={(e) => setAssigningRole(e.target.value as TenderRole)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.values(TenderRole).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Role Compatibility Check */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Compatibility Check</h4>
                
                <div className="flex items-center space-x-2">
                  {hasRequiredSkills(selectedEmployee, assigningRole) ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className="text-sm text-gray-600">
                    {hasRequiredSkills(selectedEmployee, assigningRole) 
                      ? 'Has required skills' 
                      : 'Limited skill match'
                    }
                  </span>
                </div>

                {getWorkloadWarning(selectedEmployee, assigningRole) && (
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <span className="text-sm text-orange-600">
                      {getWorkloadWarning(selectedEmployee, assigningRole)}
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    Current workload: {selectedEmployee.current_workload}%
                  </span>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedEmployee(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddMember(selectedEmployee, assigningRole)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add to Team
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenderTeamAssignment; 