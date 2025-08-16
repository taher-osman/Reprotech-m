import React, { useState, useEffect, useCallback } from 'react';
import {
  User, Calendar, Clock, FileText, Download, Upload, Bell, CheckCircle, 
  XCircle, AlertTriangle, Plus, Search, Filter, Eye, Edit, Mail, Phone, 
  MapPin, Building, CreditCard, Shield, TrendingUp, RefreshCw, ExternalLink,
  Settings, Moon, Sun, Wifi, WifiOff, Database, Smartphone, Tablet, Monitor,
  Globe, Users, Target, Activity, BarChart3, PieChart, TrendingDown,
  Calendar as CalendarIcon, Clock as ClockIcon, DollarSign, Award,
  FileBarChart, Zap, Star, Heart, Home, Car, GraduationCap
} from 'lucide-react';
import { 
  ESSDashboardStats, 
  EmployeeRequest, 
  EmployeeDocument,
  MobileESSPreferences,
  QuickAction,
  DashboardWidget,
  AutomatedPayrollCalculation
} from '../types/hrTypes';
import { hrWorkflowEngine } from '../services/HRWorkflowEngine';
import { EnhancedPayrollService } from '../services/enhancedPayrollService';

interface EnhancedESSDashboardProps {
  employeeId?: string;
  isMobile?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  language?: 'ar' | 'en' | 'both';
}

const EnhancedESSDashboard: React.FC<EnhancedESSDashboardProps> = ({
  employeeId = 'EMP-001',
  isMobile = false,
  theme = 'auto',
  language = 'en'
}) => {
  // State Management
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState<ESSDashboardStats | null>(null);
  const [preferences, setPreferences] = useState<MobileESSPreferences | null>(null);
  const [myRequests, setMyRequests] = useState<EmployeeRequest[]>([]);
  const [myDocuments, setMyDocuments] = useState<EmployeeDocument[]>([]);
  const [payrollData, setPayrollData] = useState<AutomatedPayrollCalculation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // UI State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<EmployeeRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Effects
  useEffect(() => {
    detectDeviceType();
    loadDashboardData();
    loadUserPreferences();
    setupOfflineHandling();
    setupAutoSync();
  }, [employeeId]);

  // Device Detection
  const detectDeviceType = useCallback(() => {
    const width = window.innerWidth;
    if (width < 768) setDeviceType('mobile');
    else if (width < 1024) setDeviceType('tablet');
    else setDeviceType('desktop');
  }, []);

  // Data Loading Functions
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load from cache first if offline
      if (isOffline) {
        const cachedData = localStorage.getItem(`ess-dashboard-${employeeId}`);
        if (cachedData) {
          const data = JSON.parse(cachedData);
          setDashboardStats(data.stats);
          setMyRequests(data.requests);
          setMyDocuments(data.documents);
          setNotifications(data.notifications);
          setLoading(false);
          return;
        }
      }

      // Enhanced dashboard statistics with Saudi compliance
      const mockStats: ESSDashboardStats = {
        personalInfo: {
          name: language === 'ar' ? 'أحمد المنصوري' : 'Ahmed Al-Mansouri',
          employeeId: 'EMP-001',
          department: language === 'ar' ? 'تكنولوجيا المعلومات' : 'Information Technology',
          position: language === 'ar' ? 'مطور أول' : 'Senior Developer',
          profileCompleteness: 95,
          photo: undefined
        },
        quickStats: {
          pendingRequests: 2,
          approvedRequests: 8,
          rejectedRequests: 1,
          documentsReady: 3,
          upcomingRenewals: 2
        },
        leaveBalance: {
          annual: 18,
          sick: 5,
          emergency: 2,
          used: 7,
          pending: 3
        },
        upcomingEvents: {
          contractExpiry: '2025-12-31',
          visaExpiry: '2025-08-15',
          idExpiry: '2026-05-20',
          appraisalDue: '2025-03-15'
        },
        recentActivity: [
          {
            type: language === 'ar' ? 'طلب موافق عليه' : 'Request Approved',
            description: language === 'ar' ? 'تم الموافقة على طلب شهادة راتب' : 'Salary Certificate request approved',
            date: '2025-01-02',
            status: 'approved'
          },
          {
            type: language === 'ar' ? 'مستند جاهز' : 'Document Ready',
            description: language === 'ar' ? 'تم إنشاء شهادة الإجازة السنوية' : 'Annual leave certificate generated',
            date: '2025-01-01',
            status: 'completed'
          }
        ]
      };

      setDashboardStats(mockStats);

      // Load payroll data with Saudi calculations
      const mockPayrollData = {
        basicSalary: 8000,
        allowances: { housing: 2000, transportation: 500, totalAllowances: 2500 },
        attendanceData: { regularHours: 176, overtimeHours: 8, averageDailyHours: 8.2 },
        contractInfo: { 
          startDate: '2020-01-15', 
          gosiExempt: false, 
          nationality: 'Egyptian',
          salary: 8000 
        }
      };

      const calculatedPayroll = EnhancedPayrollService.calculatePayroll(
        employeeId,
        mockPayrollData.basicSalary,
        mockPayrollData.allowances,
        mockPayrollData.attendanceData,
        mockPayrollData.contractInfo
      );

      setPayrollData(calculatedPayroll);

      // Load requests and documents
      const requests = hrWorkflowEngine.getEmployeeRequests(employeeId);
      setMyRequests(requests);

      const mockDocuments: EmployeeDocument[] = [
        {
          id: 'DOC-001',
          employeeId,
          categoryId: 'contracts',
          documentName: language === 'ar' ? 'عقد العمل' : 'Employment Contract',
          documentType: 'PDF',
          fileUrl: '/documents/contract-emp-001.pdf',
          uploadDate: '2024-01-15',
          expiryDate: '2025-12-31',
          isVerified: true,
          verifiedBy: 'HR Manager',
          verificationDate: '2024-01-16',
          accessCount: 5,
          lastAccessed: '2024-12-15',
          tags: ['contract', 'official'],
          version: 1,
          isConfidential: false,
          downloadAllowed: true,
          printAllowed: true
        }
      ];

      setMyDocuments(mockDocuments);

      // Enhanced notifications with Saudi compliance alerts
      const mockNotifications = [
        {
          id: 'NOT-001',
          type: 'compliance',
          title: language === 'ar' ? 'تجديد الإقامة' : 'Iqama Renewal Due',
          message: language === 'ar' ? 'تنتهي صلاحية الإقامة خلال 30 يوماً' : 'Iqama expires in 30 days',
          priority: 'high',
          date: '2025-01-15',
          isRead: false
        },
        {
          id: 'NOT-002',
          type: 'payroll',
          title: language === 'ar' ? 'كشف راتب جاهز' : 'Payslip Ready',
          message: language === 'ar' ? 'كشف راتب ديسمبر 2024 متاح للتحميل' : 'December 2024 payslip available for download',
          priority: 'medium',
          date: '2025-01-01',
          isRead: false
        }
      ];

      setNotifications(mockNotifications);

      // Cache data for offline use
      const cacheData = {
        stats: mockStats,
        requests,
        documents: mockDocuments,
        notifications: mockNotifications,
        payroll: calculatedPayroll,
        timestamp: Date.now()
      };
      localStorage.setItem(`ess-dashboard-${employeeId}`, JSON.stringify(cacheData));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPreferences = async () => {
    try {
      const savedPreferences = localStorage.getItem(`ess-preferences-${employeeId}`);
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      } else {
        // Default preferences
        const defaultPreferences: MobileESSPreferences = {
          id: `pref-${employeeId}`,
          employeeId,
          language: language as 'ar' | 'en' | 'both',
          notificationChannels: ['push', 'email'],
          biometricEnabled: false,
          darkModeEnabled: theme === 'dark',
          offlineAccessEnabled: true,
          maxOfflineDays: 7,
          quickActions: [
            { id: 'req-leave', actionType: 'request_leave', displayName: 'Request Leave', icon: 'calendar', isEnabled: true, order: 1 },
            { id: 'view-payslip', actionType: 'view_payslip', displayName: 'View Payslip', icon: 'file-text', isEnabled: true, order: 2 },
            { id: 'check-attendance', actionType: 'check_attendance', displayName: 'Check Attendance', icon: 'clock', isEnabled: true, order: 3 }
          ],
          dashboardLayout: [
            { id: 'stats', widgetType: 'stats', title: 'Quick Stats', size: 'large', position: { row: 1, col: 1 }, isVisible: true, refreshInterval: 300, dataSource: 'stats', configuration: {} }
          ],
          fontSize: 'medium',
          highContrastMode: false,
          dataUsageOptimized: deviceType === 'mobile',
          autoSyncEnabled: true,
          syncFrequency: 15,
          cacheSize: 100,
          updatedAt: new Date().toISOString()
        };
        setPreferences(defaultPreferences);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  // Offline and Sync Management
  const setupOfflineHandling = () => {
    const handleOnline = () => {
      setIsOffline(false);
      syncData();
    };
    
    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  };

  const setupAutoSync = () => {
    if (preferences?.autoSyncEnabled) {
      const interval = setInterval(() => {
        if (!isOffline) {
          syncData();
        }
      }, (preferences.syncFrequency || 15) * 60 * 1000);

      return () => clearInterval(interval);
    }
  };

  const syncData = async () => {
    if (isOffline) return;
    
    setSyncStatus('syncing');
    try {
      await loadDashboardData();
      setSyncStatus('synced');
    } catch (error) {
      setSyncStatus('error');
      console.error('Sync error:', error);
    }
  };

  // Quick Actions Handler
  const handleQuickAction = (action: QuickAction) => {
    switch (action.actionType) {
      case 'request_leave':
        setShowRequestModal(true);
        break;
      case 'view_payslip':
        if (payrollData?.payslipUrl) {
          window.open(payrollData.payslipUrl, '_blank');
        }
        break;
      case 'check_attendance':
        setActiveTab('attendance');
        break;
      case 'upload_document':
        // Handle document upload
        break;
      case 'emergency_contact':
        // Handle emergency contact
        break;
    }
  };

  // Render Functions
  const renderMobileHeader = () => (
    <div className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {dashboardStats?.personalInfo.name}
            </h1>
            <p className="text-sm text-gray-600">{dashboardStats?.personalInfo.position}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Offline Indicator */}
          {isOffline ? (
            <WifiOff className="w-5 h-5 text-red-500" />
          ) : (
            <Wifi className="w-5 h-5 text-green-500" />
          )}
          
          {/* Sync Status */}
          <div className="relative">
            {syncStatus === 'syncing' && <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />}
            {syncStatus === 'error' && <AlertTriangle className="w-5 h-5 text-red-500" />}
            {syncStatus === 'synced' && <CheckCircle className="w-5 h-5 text-green-500" />}
          </div>

          {/* Notifications */}
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-600" />
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </div>

          {/* Settings */}
          <button onClick={() => setShowPreferencesModal(true)}>
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderQuickActions = () => (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {preferences?.quickActions
          .filter(action => action.isEnabled)
          .sort((a, b) => a.order - b.order)
          .map((action) => (
            <button
              key={action.id}
              onClick={() => handleQuickAction(action)}
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                {action.icon === 'calendar' && <Calendar className="w-5 h-5 text-blue-600" />}
                {action.icon === 'file-text' && <FileText className="w-5 h-5 text-blue-600" />}
                {action.icon === 'clock' && <Clock className="w-5 h-5 text-blue-600" />}
                {action.icon === 'upload' && <Upload className="w-5 h-5 text-blue-600" />}
              </div>
              <span className="text-sm text-gray-700 text-center">{action.displayName}</span>
            </button>
          ))}
      </div>
    </div>
  );

  const renderPayrollSummary = () => {
    if (!payrollData) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
          {language === 'ar' ? 'ملخص الراتب' : 'Payroll Summary'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              SAR {payrollData.netPay.toLocaleString()}
            </div>
            <div className="text-sm text-green-800">
              {language === 'ar' ? 'صافي الراتب' : 'Net Salary'}
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-lg font-semibold text-blue-600">
              SAR {payrollData.gosiCalculation.employeeContribution.toFixed(2)}
            </div>
            <div className="text-sm text-blue-800">
              {language === 'ar' ? 'اشتراك الموظف في التأمينات' : 'GOSI Employee'}
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-lg font-semibold text-purple-600">
              SAR {payrollData.eosAccrual.totalAccrued.toFixed(2)}
            </div>
            <div className="text-sm text-purple-800">
              {language === 'ar' ? 'مكافأة نهاية الخدمة' : 'EOS Accrued'}
            </div>
          </div>
        </div>

        {/* Compliance Status */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {language === 'ar' ? 'حالة الامتثال' : 'Compliance Status'}
            </span>
            <div className="flex items-center space-x-2">
              {payrollData.complianceChecks.every(check => check.passed) ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">
                    {language === 'ar' ? 'متوافق' : 'Compliant'}
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-600">
                    {language === 'ar' ? 'يتطلب مراجعة' : 'Requires Review'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${preferences?.darkModeEnabled ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {deviceType === 'mobile' && renderMobileHeader()}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Actions */}
        {renderQuickActions()}
        
        {/* Payroll Summary */}
        {renderPayrollSummary()}
        
        {/* Main Dashboard Content */}
        <div className="space-y-6">
          {/* Continue with existing dashboard content... */}
          {/* This would include the enhanced overview, requests, documents tabs */}
        </div>
      </div>
    </div>
  );
};

export default EnhancedESSDashboard; 