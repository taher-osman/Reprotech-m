import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Filter,
  Download,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Shield,
  Moon,
  MapPin,
  Wifi,
  FileBarChart,
  Calculator,
  Zap
} from 'lucide-react';
import { 
  AttendanceRecord, 
  AttendanceStats, 
  AttendanceFilter, 
  EnhancedAttendanceRecord,
  KSALaborLawRule 
} from '../types/hrTypes';

const AttendanceManagement: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [enhancedRecords, setEnhancedRecords] = useState<EnhancedAttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats>({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    averageAttendance: 0
  });
  const [filters, setFilters] = useState<AttendanceFilter>({
    dateRange: 'today',
    department: '',
    employee: '',
    status: ''
  });
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isTimeClockOpen, setIsTimeClockOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Saudi Labor Law Compliance Features
  const [complianceMode, setComplianceMode] = useState(true);
  const [laborLawRules, setLaborLawRules] = useState<KSALaborLawRule[]>([]);
  const [complianceViolations, setComplianceViolations] = useState<any[]>([]);
  const [isRamadanPeriod, setIsRamadanPeriod] = useState(false);
  const [showComplianceReport, setShowComplianceReport] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [gpsTrackingEnabled, setGpsTrackingEnabled] = useState(true);

  // Mock data with Saudi Labor Law Compliance
  useEffect(() => {
    // Load Saudi Labor Law Rules
    const mockLaborRules: KSALaborLawRule[] = [
      {
        id: 'KSA-001',
        ruleType: 'Working_Hours',
        title: 'Maximum Daily Working Hours',
        description: 'Maximum 8 hours per day, 48 hours per week',
        applicableFrom: '2024-01-01',
        isActive: true,
        configuration: {
          maxDailyHours: 8,
          maxWeeklyHours: 48,
          overtimeRate: 1.5,
          prayerBreakMinutes: 15,
          ramadanHours: 6,
          weekendDays: ['Friday', 'Saturday'],
          nationalHolidays: ['2024-09-23', '2024-12-02']
        },
        autoEnforcement: true,
        notificationRules: [{
          triggerCondition: 'overtime > 2 hours',
          recipients: ['manager', 'hr'],
          channels: ['email', 'sms'],
          template: 'overtime_alert',
          escalationLevels: []
        }],
        auditRequired: true,
        updatedAt: '2024-01-01'
      }
    ];

    const mockEnhancedRecords: EnhancedAttendanceRecord[] = [
      {
        id: '1',
        employeeId: 'EMP001',
        employeeName: 'Ahmed Al-Mansouri',
        department: 'Information Technology',
        date: '2025-01-15',
        clockIn: '08:00',
        clockOut: '17:30',
        totalHours: 9.5,
        regularHours: 8,
        overtimeHours: 1.5,
        status: 'present',
        location: 'Main Office',
        gpsLocation: {
          latitude: 24.7136,
          longitude: 46.6753,
          accuracy: 5
        },
        deviceInfo: {
          deviceId: 'DEVICE-001',
          ipAddress: '192.168.1.100',
          userAgent: 'Mobile App v2.1'
        },
        biometricVerified: true,
        supervisorApproved: true,
        prayerBreaks: [
          {
            prayerName: 'Dhuhr',
            startTime: '12:15',
            endTime: '12:30',
            duration: 15,
            location: 'Prayer Room'
          },
          {
            prayerName: 'Asr',
            startTime: '15:30',
            endTime: '15:45',
            duration: 15,
            location: 'Prayer Room'
          }
        ],
        ramadanAdjustment: isRamadanPeriod,
        ramadanHours: isRamadanPeriod ? 6 : undefined,
        weekendWork: false,
        holidayWork: false,
        nightShiftAllowance: 0,
        laborLawCompliant: true,
        complianceNotes: 'All requirements met',
        overtimeApproved: true,
        overtimeApprovedBy: 'MANAGER-001',
        maxHoursViolation: false,
        notes: 'Regular attendance with approved overtime',
        createdAt: '2025-01-15T08:00:00Z',
        updatedAt: '2025-01-15T17:30:00Z'
      },
      {
        id: '2',
        employeeId: 'EMP002',
        employeeName: 'Fatima Al-Zahra',
        department: 'Human Resources',
        date: '2025-01-15',
        clockIn: '08:15',
        clockOut: '17:00',
        totalHours: 8.75,
        regularHours: 8,
        overtimeHours: 0.75,
        status: 'late',
        location: 'HR Office',
        biometricVerified: true,
        supervisorApproved: false,
        prayerBreaks: [
          {
            prayerName: 'Dhuhr',
            startTime: '12:20',
            endTime: '12:35',
            duration: 15,
            location: 'Prayer Room'
          }
        ],
        ramadanAdjustment: isRamadanPeriod,
        weekendWork: false,
        holidayWork: false,
        nightShiftAllowance: 0,
        laborLawCompliant: false,
        complianceNotes: 'Late arrival without approval',
        overtimeApproved: false,
        maxHoursViolation: false,
        notes: '15 minutes late - requires supervisor approval',
        createdAt: '2025-01-15T08:15:00Z',
        updatedAt: '2025-01-15T17:00:00Z'
      }
    ];

    const mockViolations = [
      {
        id: 'VIO-001',
        employeeId: 'EMP002',
        violationType: 'Late Arrival',
        severity: 'Medium',
        description: 'Employee arrived 15 minutes late without prior approval',
        date: '2025-01-15',
        status: 'Open',
        actionRequired: 'Supervisor approval needed'
      }
    ];

    setLaborLawRules(mockLaborRules);
    setEnhancedRecords(mockEnhancedRecords);
    setComplianceViolations(mockViolations);
    
    // Legacy records for compatibility
    const mockRecords: AttendanceRecord[] = mockEnhancedRecords.map(record => ({
      id: record.id,
      employeeId: record.employeeId,
      employeeName: record.employeeName,
      department: record.department,
      date: record.date,
      clockIn: record.clockIn,
      clockOut: record.clockOut,
      totalHours: record.totalHours,
      status: record.status,
      location: record.location,
      notes: record.notes
    }));

    setAttendanceRecords(mockRecords);
    setStats({
      totalEmployees: 5,
      presentToday: 4,
      absentToday: 0,
      lateToday: 1,
      averageAttendance: 88.5
    });
  }, [isRamadanPeriod]);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRecordSelection = (recordId: string) => {
    const newSelection = new Set(selectedRecords);
    if (newSelection.has(recordId)) {
      newSelection.delete(recordId);
    } else {
      newSelection.add(recordId);
    }
    setSelectedRecords(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedRecords.size === attendanceRecords.length) {
      setSelectedRecords(new Set());
    } else {
      setSelectedRecords(new Set(attendanceRecords.map(r => r.id)));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-100';
      case 'absent': return 'text-red-600 bg-red-100';
      case 'late': return 'text-yellow-600 bg-yellow-100';
      case 'half-day': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4" />;
      case 'absent': return <XCircle className="w-4 h-4" />;
      case 'late': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>
            {complianceMode && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                🇸🇦 KSA Compliant
              </span>
            )}
            {isRamadanPeriod && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <Moon className="w-3 h-3 mr-1" />
                Ramadan Hours
              </span>
            )}
          </div>
          <p className="text-gray-600">
            Saudi labor law compliant attendance tracking with automated compliance monitoring
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowComplianceReport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FileBarChart className="w-4 h-4" />
            Compliance Report
          </button>
          <button
            onClick={() => setIsTimeClockOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Clock className="w-4 h-4" />
            Time Clock
          </button>
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Saudi Labor Law Compliance Dashboard */}
      {complianceMode && (
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-600" />
              Saudi Labor Law Compliance Dashboard
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Compliance Score:</span>
              <span className="text-lg font-bold text-green-600">94.5%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Compliant Records</p>
                  <p className="text-2xl font-bold text-green-600">
                    {enhancedRecords.filter(r => r.laborLawCompliant).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-800">Violations</p>
                  <p className="text-2xl font-bold text-orange-600">{complianceViolations.length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Prayer Breaks</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {enhancedRecords.reduce((sum, r) => sum + r.prayerBreaks.length, 0)}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-800">Overtime Hours</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {enhancedRecords.reduce((sum, r) => sum + r.overtimeHours, 0).toFixed(1)}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Active Violations Alert */}
          {complianceViolations.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-orange-800">Active Compliance Issues</h4>
                  <div className="mt-2 space-y-1">
                    {complianceViolations.map((violation) => (
                      <div key={violation.id} className="text-sm text-orange-700">
                        <span className="font-medium">{violation.violationType}:</span> {violation.description}
                        <span className="ml-2 px-2 py-0.5 bg-orange-200 text-orange-800 rounded text-xs">
                          {violation.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Labor Law Settings */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ramadan-mode"
                  checked={isRamadanPeriod}
                  onChange={(e) => setIsRamadanPeriod(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="ramadan-mode" className="flex items-center">
                  <Moon className="w-4 h-4 mr-1" />
                  Ramadan Working Hours (6h/day)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Wifi className={`w-4 h-4 ${biometricEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                <span>Biometric: {biometricEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className={`w-4 h-4 ${gpsTrackingEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                <span>GPS Tracking: {gpsTrackingEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
            <button
              onClick={() => setComplianceMode(!complianceMode)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {complianceMode ? 'Disable' : 'Enable'} Compliance Mode
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Present Today</p>
              <p className="text-2xl font-bold text-green-600">{stats.presentToday}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Absent Today</p>
              <p className="text-2xl font-bold text-red-600">{stats.absentToday}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Late Today</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.lateToday}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Attendance</p>
              <p className="text-2xl font-bold text-blue-600">{stats.averageAttendance}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {isFilterPanelOpen && (
        <div className="bg-white p-4 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Departments</option>
                <option value="veterinary">Veterinary Services</option>
                <option value="laboratory">Laboratory</option>
                <option value="administration">Administration</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="half-day">Half Day</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Employee</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={filters.employee}
                  onChange={(e) => setFilters({...filters, employee: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Records Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Records</h3>
            <div className="flex gap-2">
              {selectedRecords.size > 0 && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {selectedRecords.size} selected
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRecords.size === attendanceRecords.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Employee</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Department</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Clock In</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Clock Out</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hours</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Location</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRecords.has(record.id)}
                      onChange={() => handleRecordSelection(record.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{record.employeeName}</p>
                      <p className="text-sm text-gray-500">{record.employeeId}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{record.department}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{record.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{record.clockIn || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{record.clockOut || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{record.totalHours}h</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{record.location || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-green-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Time Clock Modal */}
      {isTimeClockOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Time Clock</h3>
              <button
                onClick={() => setIsTimeClockOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-gray-600">
                {currentTime.toLocaleDateString()}
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Employee ID or Card"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="grid grid-cols-2 gap-3">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Clock In
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Clock Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement; 