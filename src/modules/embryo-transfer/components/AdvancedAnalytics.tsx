import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Heart,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
  Printer,
  Search,
  RefreshCw,
  Target,
  Award,
  Activity,
  Zap,
  Eye,
  Settings,
  ChevronUp,
  Star,
  UserCog
} from 'lucide-react';
import api from '../services/api';

interface AnalyticsFilters {
  dateRange: string;
  species: string;
  technician: string;
  customer: string;
  embryoGrade: string;
  transferMethod: string;
}

interface DonorAnalytics {
  donorId: string;
  donorName: string;
  internalNumber: string;
  breed: string;
  totalTransfers: number;
  pregnancies: number;
  aborted: number;
  open: number;
  pregnancyRate: number;
  avgEmbryoGrade: number;
  lastTransfer: string;
  bestSeason: string;
}

interface SireAnalytics {
  sireId: string;
  sireName: string;
  internalNumber: string;
  breed: string;
  totalOffspring: number;
  pregnancies: number;
  aborted: number;
  open: number;
  pregnancyRate: number;
  avgEmbryoQuality: number;
  topPerformingDonors: string[];
}

interface CustomerAnalytics {
  customerId: string;
  customerName: string;
  totalTransfers: number;
  pregnancies: number;
  aborted: number;
  open: number;
  pregnancyRate: number;
  totalInvestment: number;
  avgCostPerPregnancy: number;
  preferredTechnician: string;
}

const AdvancedAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'donors' | 'sires' | 'customers' | 'technicians' | 'morphology' | 'seasonal' | 'months' | 'branches'>('overview');
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange: '12months',
    species: 'all',
    technician: 'all',
    customer: 'all',
    embryoGrade: 'all',
    transferMethod: 'all'
  });

  const [analytics, setAnalytics] = useState<any>({});
  const [donorAnalytics, setDonorAnalytics] = useState<DonorAnalytics[]>([]);
  const [sireAnalytics, setSireAnalytics] = useState<SireAnalytics[]>([]);
  const [customerAnalytics, setCustomerAnalytics] = useState<CustomerAnalytics[]>([]);
  const [technicianAnalytics, setTechnicianAnalytics] = useState<any>({});
  const [morphologyAnalytics, setMorphologyAnalytics] = useState<any>({});
  const [seasonalAnalytics, setSeasonalAnalytics] = useState<any>({});
  const [monthlyAnalytics, setMonthlyAnalytics] = useState<any>({});
  const [branchAnalytics, setBranchAnalytics] = useState<any>({});

  const [donorSortKey, setDonorSortKey] = useState<'donorName'|'totalTransfers'|'pregnancies'|'aborted'|'open'|'pregnancyRate'>('donorName');
  const [donorSortAsc, setDonorSortAsc] = useState(true);
  const [donorSearch, setDonorSearch] = useState('');
  
  const [sireSortKey, setSireSortKey] = useState<'sireName'|'totalOffspring'|'pregnancies'|'aborted'|'open'|'pregnancyRate'>('sireName');
  const [sireSortAsc, setSireSortAsc] = useState(true);
  const [sireSearch, setSireSearch] = useState('');

  const [customerSortKey, setCustomerSortKey] = useState<'customerName'|'totalAnimals'|'totalEmbryos'|'pregnancies'|'aborted'|'open'|'pregnancyRate'>('customerName');
  const [customerSortAsc, setCustomerSortAsc] = useState(true);
  const [customerSearch, setCustomerSearch] = useState('');

  // Add technician analytics state
  const [technicianType, setTechnicianType] = useState<'transfer'|'lab'|'flushing'>('transfer');
  const [technicianSortKey, setTechnicianSortKey] = useState<'name'|'totalProcedures'|'successRate'|'avgQuality'|'efficiency'>('name');
  const [technicianSortAsc, setTechnicianSortAsc] = useState(true);
  const [technicianSearch, setTechnicianSearch] = useState('');

  // Add month analytics state
  const [monthSortKey, setMonthSortKey] = useState<'month'|'totalTransfers'|'pregnancies'|'aborted'|'open'|'pregnancyRate'|'avgQuality'>('month');
  const [monthSortAsc, setMonthSortAsc] = useState(true);
  const [monthSearch, setMonthSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Add branch analytics state
  const [branchSortKey, setBranchSortKey] = useState<'branchName'|'totalTransfers'|'pregnancies'|'aborted'|'open'|'pregnancyRate'|'avgQuality'|'technicianCount'>('branchName');
  const [branchSortAsc, setBranchSortAsc] = useState(true);
  const [branchSearch, setBranchSearch] = useState('');

  useEffect(() => {
    loadAnalyticsData();
  }, [filters]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [
        overviewData, 
        donorData, 
        sireData, 
        customerData,
        technicianData,
        morphologyData,
        seasonalData,
        monthlyData,
        branchData
      ] = await Promise.all([
        api.getAdvancedTransferAnalytics(filters),
        api.getDonorPerformanceAnalytics(filters),
        api.getSirePerformanceAnalytics(filters),
        api.getCustomerAnalytics(filters),
        api.getTechnicianPerformanceAnalytics(filters),
        api.getMorphologyAnalytics(filters),
        api.getSeasonalAnalytics(filters),
        api.getMonthlyAnalytics(filters),
        api.getBranchAnalytics(filters)
      ]);
      
      setAnalytics(overviewData);
      setDonorAnalytics(donorData.donors || []);
      setSireAnalytics(sireData.sires || []);
      setCustomerAnalytics(customerData.customers || []);
      setTechnicianAnalytics(technicianData);
      setMorphologyAnalytics(morphologyData);
      setSeasonalAnalytics(seasonalData);
      setMonthlyAnalytics(monthlyData);
      setBranchAnalytics(branchData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof AnalyticsFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const exportAnalytics = async () => {
    try {
      const exportData = await api.exportAnalyticsReport(filters);
      // Handle export download
      console.log('Exporting analytics report:', exportData);
    } catch (error) {
      console.error('Error exporting analytics:', error);
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Transfers</p>
              <p className="text-3xl font-bold">{analytics.totalTransfers || 0}</p>
              <p className="text-blue-100 text-sm mt-1">
                +{analytics.transferGrowth || 0}% vs last period
              </p>
            </div>
            <Activity className="h-12 w-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Pregnancy Rate</p>
              <p className="text-3xl font-bold">{analytics.overallPregnancyRate || 0}%</p>
              <p className="text-green-100 text-sm mt-1">
                Industry avg: {analytics.industryAverage || 68}%
              </p>
            </div>
            <Heart className="h-12 w-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Avg Cost per Pregnancy</p>
              <p className="text-3xl font-bold">${analytics.avgCostPerPregnancy || 0}</p>
              <p className="text-purple-100 text-sm mt-1">
                Target: ${analytics.targetCost || 2500}
              </p>
            </div>
            <Target className="h-12 w-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Success by Grade A</p>
              <p className="text-3xl font-bold">{analytics.gradeASuccessRate || 0}%</p>
              <p className="text-orange-100 text-sm mt-1">
                {analytics.totalGradeA || 0} Grade A transfers
              </p>
            </div>
            <Award className="h-12 w-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Performance Trends</h3>
            <LineChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analytics.monthlyTrends?.map((month: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{month.month}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">{month.transfers} transfers</span>
                  <span className="text-sm text-green-600">{month.pregnancyRate}% success</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${month.pregnancyRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Embryo Grade Performance */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance by Embryo Grade</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analytics.gradePerformance?.map((grade: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Grade {grade.grade}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{grade.transfers} transfers</span>
                  <span className={`text-sm font-medium ${
                    grade.successRate >= 80 ? 'text-green-600' : 
                    grade.successRate >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {grade.successRate}%
                  </span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        grade.successRate >= 80 ? 'bg-green-500' : 
                        grade.successRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${grade.successRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Outcome Distribution */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Transfer Outcome Distribution</h3>
          <PieChart className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="text-2xl font-bold text-green-600">{analytics.pregnantCount || 0}</h4>
            <p className="text-sm text-gray-600">Confirmed Pregnant</p>
            <p className="text-xs text-gray-500 mt-1">{analytics.pregnantPercentage || 0}% of total</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-3">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h4 className="text-2xl font-bold text-red-600">{analytics.abortedCount || 0}</h4>
            <p className="text-sm text-gray-600">Pregnancy Lost</p>
            <p className="text-xs text-gray-500 mt-1">{analytics.abortedPercentage || 0}% of pregnant</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
              <Clock className="h-8 w-8 text-gray-600" />
            </div>
            <h4 className="text-2xl font-bold text-gray-600">{analytics.openCount || 0}</h4>
            <p className="text-sm text-gray-600">Open (Not Pregnant)</p>
            <p className="text-xs text-gray-500 mt-1">{analytics.openPercentage || 0}% of total</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDonorsTab = () => {
    const donorDetails = analytics.donorDetails || [];

    const sortedDonors = [...donorDetails].sort((a, b) => {
      if (donorSortKey === 'donorName') {
        return donorSortAsc ? a.donorName.localeCompare(b.donorName) : b.donorName.localeCompare(a.donorName);
      } else {
        return donorSortAsc ? (a[donorSortKey] - b[donorSortKey]) : (b[donorSortKey] - a[donorSortKey]);
      }
    });

    const filteredDonors = sortedDonors.filter(d => d.donorName.toLowerCase().includes(donorSearch.toLowerCase()) || d.donorId.toLowerCase().includes(donorSearch.toLowerCase()));

    const exportCSV = () => {
      let csv = 'Donor,Recipient,Embryo,Day 15,Day 30,Day 45,Day 60,Current Status\n';
      donorDetails.forEach(donor => {
        donor.embryos.forEach(e => {
          const checkpoints = e.pregnancyTracking?.checkpoints || [];
          const getStatus = (day) => {
            const cp = checkpoints.find(c => c.daysFromTransfer === day);
            return cp ? cp.result : '';
          };
          csv += `${donor.donorName},${e.recipientId},${e.embryoId},${getStatus(15)},${getStatus(30)},${getStatus(45)},${getStatus(60)},${e.status}\n`;
        });
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'donor_pivot.csv';
      a.click();
      URL.revokeObjectURL(url);
    };

    const statusCounts = { PREGNANT: 0, OPEN: 0, ABORTED: 0, UNDER_TRANSFER: 0 };
    donorDetails.forEach(donor => donor.embryos.forEach(e => { statusCounts[e.status] = (statusCounts[e.status]||0)+1; }));

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Donor Embryo/Recipient Pivot Table</h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search donors..."
                value={donorSearch}
                onChange={e => setDonorSearch(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <button onClick={exportCSV} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"><Download className="h-4 w-4 mr-1"/>Export CSV</button>
            </div>
          </div>
          <div className="flex gap-6 mb-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex flex-col items-center">
                <span className="text-xs text-gray-500 mb-1">{status}</span>
                <div className="w-8 h-20 bg-gray-100 flex items-end">
                  <div style={{height: `${count*4}px`}} className={`w-8 ${status==='PREGNANT'?'bg-green-400':status==='OPEN'?'bg-red-400':status==='ABORTED'?'bg-yellow-400':'bg-blue-400'}`}></div>
                </div>
                <span className="text-sm font-bold mt-1">{count}</span>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Donor</th>
                  <th className="px-4 py-2">Recipient</th>
                  <th className="px-4 py-2">Embryo</th>
                  <th className="px-4 py-2">Day 15</th>
                  <th className="px-4 py-2">Day 30</th>
                  <th className="px-4 py-2">Day 45</th>
                  <th className="px-4 py-2">Day 60</th>
                  <th className="px-4 py-2">Current Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonors.map(donor => donor.embryos.map(e => {
                  const checkpoints = e.pregnancyTracking?.checkpoints || [];
                  const getStatus = (day) => {
                    const cp = checkpoints.find(c => c.daysFromTransfer === day);
                    return cp ? cp.result : '';
                  };
                  return (
                    <tr key={donor.donorId + e.embryoId + e.recipientId} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{donor.donorName}</td>
                      <td className="px-4 py-2">{e.recipientId}</td>
                      <td className="px-4 py-2">{e.embryoId}</td>
                      <td className="px-4 py-2">{getStatus(15)}</td>
                      <td className="px-4 py-2">{getStatus(30)}</td>
                      <td className="px-4 py-2">{getStatus(45)}</td>
                      <td className="px-4 py-2">{getStatus(60)}</td>
                      <td className="px-4 py-2">{e.status}</td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderSiresTab = () => {
    const sireDetails = analytics.sireDetails || [];

    const sortedSires = [...sireDetails].sort((a, b) => {
      if (sireSortKey === 'sireName') {
        return sireSortAsc ? a.sireName.localeCompare(b.sireName) : b.sireName.localeCompare(a.sireName);
      } else {
        return sireSortAsc ? (a[sireSortKey] - b[sireSortKey]) : (b[sireSortKey] - a[sireSortKey]);
      }
    });

    const filteredSires = sortedSires.filter(s => s.sireName.toLowerCase().includes(sireSearch.toLowerCase()) || s.sireId.toLowerCase().includes(sireSearch.toLowerCase()));

    const exportCSV = () => {
      let csv = 'Sire,Recipient,Embryo,Day 15,Day 30,Day 45,Day 60,Current Status\n';
      sireDetails.forEach(sire => {
        sire.embryos.forEach(e => {
          const checkpoints = e.pregnancyTracking?.checkpoints || [];
          const getStatus = (day) => {
            const cp = checkpoints.find(c => c.daysFromTransfer === day);
            return cp ? cp.result : '';
          };
          csv += `${sire.sireName},${e.recipientId},${e.embryoId},${getStatus(15)},${getStatus(30)},${getStatus(45)},${getStatus(60)},${e.status}\n`;
        });
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sire_pivot.csv';
      a.click();
      URL.revokeObjectURL(url);
    };

    const statusCounts = { PREGNANT: 0, OPEN: 0, ABORTED: 0, UNDER_TRANSFER: 0 };
    sireDetails.forEach(sire => sire.embryos.forEach(e => { statusCounts[e.status] = (statusCounts[e.status]||0)+1; }));

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sire Embryo/Recipient Pivot Table</h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search sires..."
                value={sireSearch}
                onChange={e => setSireSearch(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <button onClick={exportCSV} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"><Download className="h-4 w-4 mr-1"/>Export CSV</button>
            </div>
          </div>
          <div className="flex gap-6 mb-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex flex-col items-center">
                <span className="text-xs text-gray-500 mb-1">{status}</span>
                <div className="w-8 h-20 bg-gray-100 flex items-end">
                  <div style={{height: `${count*4}px`}} className={`w-8 ${status==='PREGNANT'?'bg-green-400':status==='OPEN'?'bg-red-400':status==='ABORTED'?'bg-yellow-400':'bg-blue-400'}`}></div>
                </div>
                <span className="text-sm font-bold mt-1">{count}</span>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Sire</th>
                  <th className="px-4 py-2">Recipient</th>
                  <th className="px-4 py-2">Embryo</th>
                  <th className="px-4 py-2">Day 15</th>
                  <th className="px-4 py-2">Day 30</th>
                  <th className="px-4 py-2">Day 45</th>
                  <th className="px-4 py-2">Day 60</th>
                  <th className="px-4 py-2">Current Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSires.map(sire => sire.embryos.map(e => {
                  const checkpoints = e.pregnancyTracking?.checkpoints || [];
                  const getStatus = (day) => {
                    const cp = checkpoints.find(c => c.daysFromTransfer === day);
                    return cp ? cp.result : '';
                  };
                  return (
                    <tr key={sire.sireId + e.embryoId + e.recipientId} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{sire.sireName}</td>
                      <td className="px-4 py-2">{e.recipientId}</td>
                      <td className="px-4 py-2">{e.embryoId}</td>
                      <td className="px-4 py-2">{getStatus(15)}</td>
                      <td className="px-4 py-2">{getStatus(30)}</td>
                      <td className="px-4 py-2">{getStatus(45)}</td>
                      <td className="px-4 py-2">{getStatus(60)}</td>
                      <td className="px-4 py-2">{e.status}</td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderCustomersTab = () => {
    // Group by customer, then by animal/embryo
    const customerDetails = analytics.customerDetails || [];

    const filteredCustomers = customerDetails.filter(customer =>
      customer.customerName.toLowerCase().includes(customerSearch.toLowerCase())
    );

    const sortedCustomers = [...filteredCustomers].sort((a, b) => {
      const aValue = a[customerSortKey];
      const bValue = b[customerSortKey];
      
      if (customerSortAsc) {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    const exportCustomerData = () => {
      const csvData = sortedCustomers.map(customer => {
        const totalEmbryos = customer.animals.reduce((sum, animal) => sum + animal.embryos.length, 0);
        const pregnancies = customer.animals.reduce((sum, animal) => 
          sum + animal.embryos.filter(e => e.status === 'pregnant').length, 0);
        const aborted = customer.animals.reduce((sum, animal) => 
          sum + animal.embryos.filter(e => e.status === 'aborted').length, 0);
        const open = customer.animals.reduce((sum, animal) => 
          sum + animal.embryos.filter(e => e.status === 'open').length, 0);
        const pregnancyRate = totalEmbryos > 0 ? ((pregnancies / totalEmbryos) * 100).toFixed(1) : '0.0';

        return {
          'Customer Name': customer.customerName,
          'Total Animals': customer.animals.length,
          'Total Embryos': totalEmbryos,
          'Pregnancies': pregnancies,
          'Aborted': aborted,
          'Open': open,
          'Pregnancy Rate (%)': pregnancyRate
        };
      });

      const csv = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customer_analytics_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    };

    // Calculate pregnancy status distribution for histogram
    const pregnancyStatusData = {
      pregnant: sortedCustomers.reduce((sum, customer) => 
        sum + customer.animals.reduce((s, animal) => 
          s + animal.embryos.filter(e => e.status === 'pregnant').length, 0), 0),
      aborted: sortedCustomers.reduce((sum, customer) => 
        sum + customer.animals.reduce((s, animal) => 
          s + animal.embryos.filter(e => e.status === 'aborted').length, 0), 0),
      open: sortedCustomers.reduce((sum, customer) => 
        sum + customer.animals.reduce((s, animal) => 
          s + animal.embryos.filter(e => e.status === 'open').length, 0), 0),
      underTransfer: sortedCustomers.reduce((sum, customer) => 
        sum + customer.animals.reduce((s, animal) => 
          s + animal.embryos.filter(e => e.status === 'under_transfer').length, 0), 0)
    };

    return (
      <div className="space-y-6">
        {/* Header with search and export */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search customers..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={exportCustomerData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Pregnancy Status Histogram */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pregnancy Status Distribution</h3>
          <div className="flex items-end gap-4 h-32">
            {Object.entries(pregnancyStatusData).map(([status, count]) => {
              const maxCount = Math.max(...Object.values(pregnancyStatusData));
              const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
              const colors = {
                pregnant: 'bg-green-500',
                aborted: 'bg-red-500',
                open: 'bg-yellow-500',
                underTransfer: 'bg-blue-500'
              };
              
              return (
                <div key={status} className="flex-1 flex flex-col items-center">
                  <div 
                    className={`${colors[status as keyof typeof colors]} w-full rounded-t transition-all duration-300`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-600 mt-2 text-center">
                    {status.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                  <span className="text-xs font-medium text-gray-900">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer Summary Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Customer Performance Summary</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { key: 'customerName', label: 'Customer Name' },
                    { key: 'totalAnimals', label: 'Animals' },
                    { key: 'totalEmbryos', label: 'Embryos' },
                    { key: 'pregnancies', label: 'Pregnant' },
                    { key: 'aborted', label: 'Aborted' },
                    { key: 'open', label: 'Open' },
                    { key: 'pregnancyRate', label: 'Success Rate' }
                  ].map(column => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setCustomerSortKey(column.key as any);
                        setCustomerSortAsc(customerSortKey === column.key ? !customerSortAsc : true);
                      }}
                    >
                      <div className="flex items-center gap-1">
                        {column.label}
                        {customerSortKey === column.key && (
                          <ChevronUp className={`w-4 h-4 ${customerSortAsc ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCustomers.map(customer => {
                  const totalEmbryos = customer.animals.reduce((sum, animal) => sum + animal.embryos.length, 0);
                  const pregnancies = customer.animals.reduce((sum, animal) => 
                    sum + animal.embryos.filter(e => e.status === 'pregnant').length, 0);
                  const aborted = customer.animals.reduce((sum, animal) => 
                    sum + animal.embryos.filter(e => e.status === 'aborted').length, 0);
                  const open = customer.animals.reduce((sum, animal) => 
                    sum + animal.embryos.filter(e => e.status === 'open').length, 0);
                  const pregnancyRate = totalEmbryos > 0 ? ((pregnancies / totalEmbryos) * 100).toFixed(1) : '0.0';

                  return (
                    <tr key={customer.customerId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {customer.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.animals.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {totalEmbryos}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-green-600 font-medium">{pregnancies}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-red-600 font-medium">{aborted}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-yellow-600 font-medium">{open}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{pregnancyRate}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${pregnancyRate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Customer Pivot Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Detailed Customer Analysis</h3>
            <p className="text-sm text-gray-600 mt-1">Expand each customer to see individual animal and embryo details</p>
          </div>
          <div className="divide-y divide-gray-200">
            {sortedCustomers.map(customer => (
              <div key={customer.customerId} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">{customer.customerName}</h4>
                  <span className="text-sm text-gray-500">
                    {customer.animals.length} animals, {customer.animals.reduce((sum, animal) => sum + animal.embryos.length, 0)} embryos
                  </span>
                </div>
                
                <div className="space-y-4">
                  {customer.animals.map(animal => (
                    <div key={animal.animalId} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">Animal ID: {animal.animalId}</h5>
                        <span className="text-sm text-gray-500">{animal.embryos.length} embryos</span>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2">Embryo ID</th>
                              <th className="text-left py-2">Day 15</th>
                              <th className="text-left py-2">Day 30</th>
                              <th className="text-left py-2">Day 45</th>
                              <th className="text-left py-2">Day 60</th>
                              <th className="text-left py-2">Current Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {animal.embryos.map(embryo => (
                              <tr key={embryo.embryoId} className="border-b border-gray-100">
                                <td className="py-2 font-medium">{embryo.embryoId}</td>
                                <td className="py-2">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    embryo.pregnancyTracking?.day15 === 'positive' 
                                      ? 'bg-green-100 text-green-800' 
                                      : embryo.pregnancyTracking?.day15 === 'negative'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {embryo.pregnancyTracking?.day15 || 'N/A'}
                                  </span>
                                </td>
                                <td className="py-2">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    embryo.pregnancyTracking?.day30 === 'positive' 
                                      ? 'bg-green-100 text-green-800' 
                                      : embryo.pregnancyTracking?.day30 === 'negative'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {embryo.pregnancyTracking?.day30 || 'N/A'}
                                  </span>
                                </td>
                                <td className="py-2">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    embryo.pregnancyTracking?.day45 === 'positive' 
                                      ? 'bg-green-100 text-green-800' 
                                      : embryo.pregnancyTracking?.day45 === 'negative'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {embryo.pregnancyTracking?.day45 || 'N/A'}
                                  </span>
                                </td>
                                <td className="py-2">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    embryo.pregnancyTracking?.day60 === 'positive' 
                                      ? 'bg-green-100 text-green-800' 
                                      : embryo.pregnancyTracking?.day60 === 'negative'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {embryo.pregnancyTracking?.day60 || 'N/A'}
                                  </span>
                                </td>
                                <td className="py-2">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    embryo.status === 'pregnant' 
                                      ? 'bg-green-100 text-green-800' 
                                      : embryo.status === 'aborted'
                                      ? 'bg-red-100 text-red-800'
                                      : embryo.status === 'open'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {embryo.status.replace('_', ' ')}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTechniciansTab = () => {
    // Assume analytics.technicianDetails is an object with transfer, lab, flushing arrays
    const technicianDetails = analytics.technicianDetails || { transfer: [], lab: [], flushing: [] };
    const currentTechnicians = technicianDetails[technicianType] || [];

    const filteredTechnicians = currentTechnicians.filter(tech =>
      tech.name.toLowerCase().includes(technicianSearch.toLowerCase())
    );

    const sortedTechnicians = [...filteredTechnicians].sort((a, b) => {
      const aValue = a[technicianSortKey];
      const bValue = b[technicianSortKey];
      
      if (technicianSortAsc) {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    const exportTechnicianData = () => {
      const csvData = sortedTechnicians.map(tech => ({
        'Technician Name': tech.name,
        'Total Procedures': tech.totalProcedures,
        'Success Rate (%)': tech.successRate.toFixed(1),
        'Average Quality Score': tech.avgQuality.toFixed(1),
        'Efficiency Score': tech.efficiency.toFixed(1),
        'Pregnancies': tech.pregnancies,
        'Aborted': tech.aborted,
        'Open': tech.open,
        'Under Transfer': tech.underTransfer
      }));

      const csv = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${technicianType}_technician_analytics_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    };

    // Calculate performance distribution for histograms
    const successRateData = sortedTechnicians.reduce((acc, tech) => {
      const range = Math.floor(tech.successRate / 10) * 10;
      const key = `${range}-${range + 9}%`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const qualityData = sortedTechnicians.reduce((acc, tech) => {
      const range = Math.floor(tech.avgQuality / 10) * 10;
      const key = `${range}-${range + 9}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusData = {
      pregnant: sortedTechnicians.reduce((sum, tech) => sum + tech.pregnancies, 0),
      aborted: sortedTechnicians.reduce((sum, tech) => sum + tech.aborted, 0),
      open: sortedTechnicians.reduce((sum, tech) => sum + tech.open, 0),
      underTransfer: sortedTechnicians.reduce((sum, tech) => sum + tech.underTransfer, 0)
    };

    const getTechnicianTypeLabel = (type: string) => {
      switch (type) {
        case 'transfer': return 'Transfer Technicians';
        case 'lab': return 'Lab Technicians';
        case 'flushing': return 'Flushing Technicians';
        default: return 'Technicians';
      }
    };

    return (
      <div className="space-y-6">
        {/* Header with type selector, search and export */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Technician Type:</label>
              <select
                value={technicianType}
                onChange={(e) => setTechnicianType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="transfer">Transfer Technicians</option>
                <option value="lab">Lab Technicians</option>
                <option value="flushing">Flushing Technicians</option>
              </select>
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search technicians..."
                value={technicianSearch}
                onChange={(e) => setTechnicianSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={exportTechnicianData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Performance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Technicians</p>
                <p className="text-2xl font-bold text-gray-900">{sortedTechnicians.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sortedTechnicians.length > 0 
                    ? (sortedTechnicians.reduce((sum, tech) => sum + tech.successRate, 0) / sortedTechnicians.length).toFixed(1)
                    : '0.0'}%
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Quality Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sortedTechnicians.length > 0 
                    ? (sortedTechnicians.reduce((sum, tech) => sum + tech.avgQuality, 0) / sortedTechnicians.length).toFixed(1)
                    : '0.0'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Efficiency</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sortedTechnicians.length > 0 
                    ? (sortedTechnicians.reduce((sum, tech) => sum + tech.efficiency, 0) / sortedTechnicians.length).toFixed(1)
                    : '0.0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Histograms */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Success Rate Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Rate Distribution</h3>
            <div className="space-y-2">
              {Object.entries(successRateData).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([range, count]) => {
                const maxCount = Math.max(...Object.values(successRateData));
                const width = maxCount > 0 ? (count / maxCount) * 100 : 0;
                return (
                  <div key={range} className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 w-12">{range}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-green-500 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-900 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quality Score Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Score Distribution</h3>
            <div className="space-y-2">
              {Object.entries(qualityData).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([range, count]) => {
                const maxCount = Math.max(...Object.values(qualityData));
                const width = maxCount > 0 ? (count / maxCount) * 100 : 0;
                return (
                  <div key={range} className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 w-12">{range}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-purple-500 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-900 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Outcome Distribution</h3>
            <div className="flex items-end gap-4 h-32">
              {Object.entries(statusData).map(([status, count]) => {
                const maxCount = Math.max(...Object.values(statusData));
                const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                const colors = {
                  pregnant: 'bg-green-500',
                  aborted: 'bg-red-500',
                  open: 'bg-yellow-500',
                  underTransfer: 'bg-blue-500'
                };
                
                return (
                  <div key={status} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`${colors[status as keyof typeof colors]} w-full rounded-t transition-all duration-300`}
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-gray-600 mt-2 text-center">
                      {status.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                    <span className="text-xs font-medium text-gray-900">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Technician Performance Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{getTechnicianTypeLabel(technicianType)} Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { key: 'name', label: 'Technician Name' },
                    { key: 'totalProcedures', label: 'Total Procedures' },
                    { key: 'successRate', label: 'Success Rate' },
                    { key: 'avgQuality', label: 'Avg Quality' },
                    { key: 'efficiency', label: 'Efficiency' },
                    { key: 'pregnancies', label: 'Pregnant' },
                    { key: 'aborted', label: 'Aborted' },
                    { key: 'open', label: 'Open' },
                    { key: 'underTransfer', label: 'Under Transfer' }
                  ].map(column => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setTechnicianSortKey(column.key as any);
                        setTechnicianSortAsc(technicianSortKey === column.key ? !technicianSortAsc : true);
                      }}
                    >
                      <div className="flex items-center gap-1">
                        {column.label}
                        {technicianSortKey === column.key && (
                          <ChevronUp className={`w-4 h-4 ${technicianSortAsc ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedTechnicians.map(technician => (
                  <tr key={technician.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {technician.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {technician.totalProcedures}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {technician.successRate.toFixed(1)}%
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              technician.successRate >= 80 ? 'bg-green-500' : 
                              technician.successRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${technician.successRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">
                          {technician.avgQuality.toFixed(1)}
                        </span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                              key={star} 
                              className={`w-3 h-3 ${
                                star <= Math.round(technician.avgQuality) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {technician.efficiency.toFixed(1)}
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${technician.efficiency}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="text-green-600 font-medium">{technician.pregnancies}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="text-red-600 font-medium">{technician.aborted}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="text-yellow-600 font-medium">{technician.open}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="text-blue-600 font-medium">{technician.underTransfer}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderMonthsTab = () => {
    // Use actual API data
    const monthlyData = monthlyAnalytics.monthlyData || [];
    const summary = monthlyAnalytics.summary || {};

    const filteredData = monthlyData
      .filter(item => item.month.toLowerCase().includes(monthSearch.toLowerCase()))
      .sort((a, b) => {
        const aValue = a[monthSortKey as keyof typeof a];
        const bValue = b[monthSortKey as keyof typeof b];
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return monthSortAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return monthSortAsc ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
      });

    const exportMonthlyData = () => {
      const csvContent = [
        ['Month', 'Total Transfers', 'Pregnancies', 'Aborted', 'Open', 'Pregnancy Rate (%)', 'Average Quality', 'Transfer ID', 'Donor ID', 'Recipient ID', 'Technician', 'Embryo Grade', 'Transfer Method', 'Status', 'Transfer Date', 'Cost'],
        ...filteredData.flatMap(month => 
          month.transfers?.map(transfer => [
            month.monthName,
            month.totalTransfers,
            month.pregnancies,
            month.aborted,
            month.open,
            month.pregnancyRate?.toFixed(1) || 0,
            month.avgQuality?.toFixed(1) || 0,
            transfer.transferId,
            transfer.donorId,
            transfer.recipientId,
            transfer.technician,
            transfer.embryoGrade,
            transfer.transferMethod,
            transfer.status,
            transfer.transferDate,
            transfer.cost
          ]) || []
        )
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `monthly_analytics_${selectedYear}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'pregnant': return 'text-green-600 bg-green-100';
        case 'aborted': return 'text-red-600 bg-red-100';
        case 'open': return 'text-yellow-600 bg-yellow-100';
        case 'under_transfer': return 'text-blue-600 bg-blue-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Monthly Analytics</h3>
            <p className="text-sm text-gray-600">Comprehensive monthly transfer performance analysis</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <button
              onClick={exportMonthlyData}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search months..."
              value={monthSearch}
              onChange={(e) => setMonthSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-indigo-600">{summary.totalTransfers || 0}</div>
            <div className="text-sm text-gray-600">Total Transfers</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{summary.totalPregnancies || 0}</div>
            <div className="text-sm text-gray-600">Total Pregnancies</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{summary.overallPregnancyRate || 0}%</div>
            <div className="text-sm text-gray-600">Overall Success Rate</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">{(summary.avgQuality || 0).toFixed(1)}</div>
            <div className="text-sm text-gray-600">Average Quality</div>
          </div>
        </div>

        {/* Monthly Performance Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance Trends</h4>
          <div className="grid grid-cols-12 gap-2 h-32">
            {filteredData.map((month) => {
              const successRate = month.pregnancyRate || 0;
              const height = Math.max(20, (successRate / 100) * 100);
              return (
                <div key={month.monthName} className="flex flex-col items-center">
                  <div className="text-xs text-gray-600 mb-1">{month.monthName.slice(0, 3)}</div>
                  <div 
                    className="w-full bg-indigo-500 rounded-t"
                    style={{ height: `${height}%` }}
                    title={`${month.monthName}: ${successRate.toFixed(1)}% success rate`}
                  />
                  <div className="text-xs text-gray-500 mt-1">{successRate.toFixed(0)}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transfer ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technician</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Embryo Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pregnancy Checks</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.flatMap((month) =>
                  month.transfers?.map((transfer) => (
                    <tr key={transfer.transferId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {month.monthName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transfer.transferId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transfer.donorId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transfer.recipientId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transfer.technician}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transfer.embryoGrade}/10
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transfer.status)}`}>
                          {transfer.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex gap-1">
                          <span className={`px-1 rounded text-xs ${transfer.pregnancyDay15 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>15</span>
                          <span className={`px-1 rounded text-xs ${transfer.pregnancyDay30 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>30</span>
                          <span className={`px-1 rounded text-xs ${transfer.pregnancyDay45 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>45</span>
                          <span className={`px-1 rounded text-xs ${transfer.pregnancyDay60 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>60</span>
                        </div>
                      </td>
                    </tr>
                  )) || []
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderBranchesTab = () => {
    // Use actual API data
    const branchData = branchAnalytics.branches || [];
    const summary = branchAnalytics.summary || {};

    const filteredData = branchData
      .filter(item => item.branchName.toLowerCase().includes(branchSearch.toLowerCase()))
      .sort((a, b) => {
        const aValue = a[branchSortKey as keyof typeof a];
        const bValue = b[branchSortKey as keyof typeof b];
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return branchSortAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return branchSortAsc ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
      });

    const exportBranchData = () => {
      const csvContent = [
        ['Branch ID', 'Branch Name', 'Location', 'Total Transfers', 'Pregnancies', 'Aborted', 'Open', 'Pregnancy Rate (%)', 'Average Quality', 'Technician Count', 'Total Revenue', 'Technician Name', 'Technician Transfers', 'Technician Success Rate (%)'],
        ...filteredData.flatMap(branch => 
          branch.technicians?.map(technician => [
            branch.branchId,
            branch.branchName,
            branch.location,
            branch.totalTransfers,
            branch.pregnancies,
            branch.aborted,
            branch.open,
            branch.pregnancyRate?.toFixed(1) || 0,
            branch.avgQuality,
            branch.technicianCount,
            branch.totalRevenue?.toLocaleString() || 0,
            technician.name,
            technician.transfers,
            technician.successRate.toFixed(1)
          ]) || []
        )
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `branch_analytics_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'pregnant': return 'text-green-600 bg-green-100';
        case 'aborted': return 'text-red-600 bg-red-100';
        case 'open': return 'text-yellow-600 bg-yellow-100';
        case 'under_transfer': return 'text-blue-600 bg-blue-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };

    // Calculate performance distribution for histograms
    const successRateData = filteredData.reduce((acc, branch) => {
      const rate = branch.pregnancyRate || 0;
      const range = Math.floor(rate / 10) * 10;
      const key = `${range}-${range + 9}%`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const qualityData = filteredData.reduce((acc, branch) => {
      const quality = branch.avgQuality || 0;
      const range = Math.floor(quality / 10) * 10;
      const key = `${range}-${range + 9}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Branch Analytics</h3>
            <p className="text-sm text-gray-600">Comprehensive branch performance analysis and comparison</p>
          </div>
          <button
            onClick={exportBranchData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Export CSV
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search branches..."
              value={branchSearch}
              onChange={(e) => setBranchSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-indigo-600">{summary.totalBranches || 0}</div>
            <div className="text-sm text-gray-600">Total Branches</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{summary.totalTransfers || 0}</div>
            <div className="text-sm text-gray-600">Total Transfers</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{summary.overallPregnancyRate || 0}%</div>
            <div className="text-sm text-gray-600">Overall Success Rate</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">{summary.totalTechnicians || 0}</div>
            <div className="text-sm text-gray-600">Total Technicians</div>
          </div>
        </div>

        {/* Performance Histograms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Success Rate Distribution */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Success Rate Distribution</h4>
            <div className="space-y-2">
              {Object.entries(successRateData).map(([range, count]) => (
                <div key={range} className="flex items-center gap-3">
                  <div className="w-20 text-sm text-gray-600">{range}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-green-500 h-4 rounded-full"
                      style={{ width: `${(count / filteredData.length) * 100}%` }}
                    />
                  </div>
                  <div className="w-8 text-sm text-gray-600">{count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality Distribution */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Quality Score Distribution</h4>
            <div className="space-y-2">
              {Object.entries(qualityData).map(([range, count]) => (
                <div key={range} className="flex items-center gap-3">
                  <div className="w-20 text-sm text-gray-600">{range}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-blue-500 h-4 rounded-full"
                      style={{ width: `${(count / filteredData.length) * 100}%` }}
                    />
                  </div>
                  <div className="w-8 text-sm text-gray-600">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Branch Performance Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Branch Performance Comparison</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((branch) => {
              const successRate = branch.pregnancyRate || 0;
              return (
                <div key={branch.branchId} className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">{branch.branchName}</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Success Rate:</span>
                      <span className="font-medium">{successRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${successRate}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Transfers: {branch.totalTransfers}</span>
                      <span>Techs: {branch.technicianCount}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { key: 'branchName', label: 'Branch Name' },
                    { key: 'totalTransfers', label: 'Total Transfers' },
                    { key: 'pregnancies', label: 'Pregnancies' },
                    { key: 'aborted', label: 'Aborted' },
                    { key: 'open', label: 'Open' },
                    { key: 'pregnancyRate', label: 'Success Rate' },
                    { key: 'avgQuality', label: 'Avg Quality' },
                    { key: 'technicianCount', label: 'Technicians' }
                  ].map((column) => (
                    <th
                      key={column.key}
                      onClick={() => {
                        setBranchSortKey(column.key as any);
                        setBranchSortAsc(branchSortKey === column.key ? !branchSortAsc : true);
                      }}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-1">
                        {column.label}
                        {branchSortKey === column.key && (
                          <span>{branchSortAsc ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((branch) => (
                  <tr key={branch.branchId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {branch.branchName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {branch.totalTransfers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {branch.pregnancies}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {branch.aborted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                      {branch.open}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {branch.pregnancyRate?.toFixed(1) || 0}%
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${branch.pregnancyRate || 0}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {branch.avgQuality}/10
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {branch.technicianCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Branch Technician Performance */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900">Branch Technician Performance</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Branch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technician</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transfers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Success Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.flatMap((branch) =>
                  branch.technicians?.map((technician) => (
                    <tr key={`${branch.branchId}-${technician.name}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {branch.branchName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {technician.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {technician.transfers}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{technician.successRate.toFixed(1)}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${technician.successRate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          technician.successRate >= 80 ? 'bg-green-100 text-green-800' :
                          technician.successRate >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {technician.successRate >= 80 ? 'Excellent' :
                           technician.successRate >= 70 ? 'Good' : 'Needs Improvement'}
                        </span>
                      </td>
                    </tr>
                  )) || []
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
          <span className="text-gray-600">Loading advanced analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Advanced ET Analytics</h2>
            <p className="text-gray-600">Comprehensive embryo transfer performance analysis</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={exportAnalytics}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
              <option value="24months">Last 24 Months</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
            <select
              value={filters.species}
              onChange={(e) => handleFilterChange('species', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Species</option>
              <option value="bovine">Bovine</option>
              <option value="equine">Equine</option>
              <option value="camel">Camel</option>
              <option value="ovine">Ovine</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Technician</label>
            <select
              value={filters.technician}
              onChange={(e) => handleFilterChange('technician', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Technicians</option>
              <option value="dr-ahmed">Dr. Ahmed</option>
              <option value="dr-ali">Dr. Ali</option>
              <option value="dr-hassan">Dr. Hassan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <select
              value={filters.customer}
              onChange={(e) => handleFilterChange('customer', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Customers</option>
              <option value="al-majd">Al-Majd Farm</option>
              <option value="royal">Royal Stables</option>
              <option value="desert">Desert Racing</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Embryo Grade</label>
            <select
              value={filters.embryoGrade}
              onChange={(e) => handleFilterChange('embryoGrade', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Grades</option>
              <option value="A">Grade A</option>
              <option value="B">Grade B</option>
              <option value="C">Grade C</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transfer Method</label>
            <select
              value={filters.transferMethod}
              onChange={(e) => handleFilterChange('transferMethod', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Methods</option>
              <option value="surgical">Surgical</option>
              <option value="non-surgical">Non-Surgical</option>
              <option value="transcervical">Transcervical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'donors', name: 'Donors', icon: Users },
              { id: 'sires', name: 'Sires', icon: Award },
              { id: 'customers', name: 'Customers', icon: Users },
              { id: 'technicians', name: 'Technicians', icon: UserCog },
              { id: 'months', name: 'Monthly Analytics', icon: Calendar },
              { id: 'branches', name: 'Branch Analytics', icon: Target }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'donors' && renderDonorsTab()}
          {activeTab === 'sires' && renderSiresTab()}
          {activeTab === 'customers' && renderCustomersTab()}
          {activeTab === 'technicians' && renderTechniciansTab()}
          {activeTab === 'months' && renderMonthsTab()}
          {activeTab === 'branches' && renderBranchesTab()}
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics; 