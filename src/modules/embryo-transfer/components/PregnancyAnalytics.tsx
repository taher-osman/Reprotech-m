import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Target, Calendar, Award, AlertTriangle, Users, Heart } from 'lucide-react';
import { format, differenceInDays, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface BatchAnalytics {
  batchId: string;
  batchName: string;
  totalTransfers: number;
  pregnancies: number;
  pregnancyRate: number;
  avgDaysToConfirmation: number;
  successfulDeliveries: number;
  losses: number;
  pendingResults: number;
}

interface VeterinarianPerformance {
  veterinarian: string;
  totalTransfers: number;
  pregnancies: number;
  pregnancyRate: number;
  avgTransferQuality: number;
}

interface MonthlyTrends {
  month: string;
  transfers: number;
  pregnancies: number;
  pregnancyRate: number;
  deliveries: number;
}

interface PregnancyAnalyticsProps {
  transfers: any[]; // Would be properly typed TransferRecord[]
}

const PregnancyAnalytics: React.FC<PregnancyAnalyticsProps> = ({ transfers }) => {
  
  const analytics = useMemo(() => {
    // Overall Statistics
    const totalTransfers = transfers.length;
    const confirmedPregnancies = transfers.filter(t => 
      t.pregnancyTracking?.currentStatus === 'PREGNANT' || 
      t.pregnancyTracking?.currentStatus === 'DELIVERED'
    ).length;
    const overallPregnancyRate = totalTransfers > 0 ? (confirmedPregnancies / totalTransfers) * 100 : 0;
    
    const deliveries = transfers.filter(t => 
      t.pregnancyTracking?.currentStatus === 'DELIVERED'
    ).length;
    
    const losses = transfers.filter(t => 
      t.pregnancyTracking?.currentStatus === 'LOST'
    ).length;
    
    const pendingResults = transfers.filter(t => 
      t.pregnancyTracking?.currentStatus === 'PENDING'
    ).length;

    // Batch Analytics
    const batchMap = new Map<string, any[]>();
    transfers.forEach(transfer => {
      const batchId = transfer.batchId || `BATCH-${transfer.transferDate.getFullYear()}-${Math.floor(Math.random() * 100)}`;
      if (!batchMap.has(batchId)) {
        batchMap.set(batchId, []);
      }
      batchMap.get(batchId)!.push(transfer);
    });

    const batchAnalytics: BatchAnalytics[] = Array.from(batchMap.entries()).map(([batchId, batchTransfers]) => {
      const batchPregnancies = batchTransfers.filter(t => 
        t.pregnancyTracking?.currentStatus === 'PREGNANT' || 
        t.pregnancyTracking?.currentStatus === 'DELIVERED'
      ).length;
      
      const batchDeliveries = batchTransfers.filter(t => 
        t.pregnancyTracking?.currentStatus === 'DELIVERED'
      ).length;
      
      const batchLosses = batchTransfers.filter(t => 
        t.pregnancyTracking?.currentStatus === 'LOST'
      ).length;
      
      const batchPending = batchTransfers.filter(t => 
        t.pregnancyTracking?.currentStatus === 'PENDING'
      ).length;

      const avgDaysToConfirmation = batchTransfers
        .filter(t => t.pregnancyTracking?.pregnancyConfirmedDate)
        .reduce((sum, t) => {
          const days = differenceInDays(
            new Date(t.pregnancyTracking.pregnancyConfirmedDate!),
            new Date(t.transferDate)
          );
          return sum + days;
        }, 0) / Math.max(batchPregnancies, 1);

      return {
        batchId,
        batchName: `Batch ${batchId.split('-')[1] || 'Unknown'}`,
        totalTransfers: batchTransfers.length,
        pregnancies: batchPregnancies,
        pregnancyRate: (batchPregnancies / batchTransfers.length) * 100,
        avgDaysToConfirmation: Math.round(avgDaysToConfirmation),
        successfulDeliveries: batchDeliveries,
        losses: batchLosses,
        pendingResults: batchPending
      };
    }).sort((a, b) => b.pregnancyRate - a.pregnancyRate);

    // Veterinarian Performance
    const vetMap = new Map<string, any[]>();
    transfers.forEach(transfer => {
      const vet = transfer.veterinarian || 'Unknown';
      if (!vetMap.has(vet)) {
        vetMap.set(vet, []);
      }
      vetMap.get(vet)!.push(transfer);
    });

    const veterinarianPerformance: VeterinarianPerformance[] = Array.from(vetMap.entries()).map(([vet, vetTransfers]) => {
      const vetPregnancies = vetTransfers.filter(t => 
        t.pregnancyTracking?.currentStatus === 'PREGNANT' || 
        t.pregnancyTracking?.currentStatus === 'DELIVERED'
      ).length;
      
      const avgQuality = vetTransfers.reduce((sum, t) => {
        const qualityScore = t.transferQuality === 'OPTIMAL' ? 4 : 
                           t.transferQuality === 'GOOD' ? 3 : 
                           t.transferQuality === 'SUBOPTIMAL' ? 2 : 1;
        return sum + qualityScore;
      }, 0) / vetTransfers.length;

      return {
        veterinarian: vet,
        totalTransfers: vetTransfers.length,
        pregnancies: vetPregnancies,
        pregnancyRate: (vetPregnancies / vetTransfers.length) * 100,
        avgTransferQuality: avgQuality
      };
    }).sort((a, b) => b.pregnancyRate - a.pregnancyRate);

    // Monthly Trends (last 6 months)
    const monthlyTrends: MonthlyTrends[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthTransfers = transfers.filter(t => 
        isWithinInterval(new Date(t.transferDate), { start: monthStart, end: monthEnd })
      );
      
      const monthPregnancies = monthTransfers.filter(t => 
        t.pregnancyTracking?.currentStatus === 'PREGNANT' || 
        t.pregnancyTracking?.currentStatus === 'DELIVERED'
      ).length;
      
      const monthDeliveries = monthTransfers.filter(t => 
        t.pregnancyTracking?.currentStatus === 'DELIVERED'
      ).length;

      monthlyTrends.push({
        month: format(date, 'MMM yyyy'),
        transfers: monthTransfers.length,
        pregnancies: monthPregnancies,
        pregnancyRate: monthTransfers.length > 0 ? (monthPregnancies / monthTransfers.length) * 100 : 0,
        deliveries: monthDeliveries
      });
    }

    return {
      overall: {
        totalTransfers,
        confirmedPregnancies,
        overallPregnancyRate,
        deliveries,
        losses,
        pendingResults
      },
      batchAnalytics,
      veterinarianPerformance,
      monthlyTrends
    };
  }, [transfers]);

  const getPerformanceColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 bg-green-100';
    if (rate >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPerformanceIcon = (rate: number) => {
    if (rate >= 80) return TrendingUp;
    if (rate >= 60) return Target;
    return AlertTriangle;
  };

  return (
    <div className="space-y-8">
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Overall Pregnancy Rate</p>
              <p className="text-3xl font-bold text-blue-900">
                {analytics.overall.overallPregnancyRate.toFixed(1)}%
              </p>
              <p className="text-sm text-blue-700 mt-1">
                {analytics.overall.confirmedPregnancies} of {analytics.overall.totalTransfers} transfers
              </p>
            </div>
            <Heart className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Successful Deliveries</p>
              <p className="text-3xl font-bold text-green-900">{analytics.overall.deliveries}</p>
              <p className="text-sm text-green-700 mt-1">Live births recorded</p>
            </div>
            <Award className="h-12 w-12 text-green-500" />
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Pending Results</p>
              <p className="text-3xl font-bold text-yellow-900">{analytics.overall.pendingResults}</p>
              <p className="text-sm text-yellow-700 mt-1">Awaiting confirmation</p>
            </div>
            <Calendar className="h-12 w-12 text-yellow-500" />
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Pregnancy Losses</p>
              <p className="text-3xl font-bold text-red-900">{analytics.overall.losses}</p>
              <p className="text-sm text-red-700 mt-1">Recorded losses</p>
            </div>
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
        </div>
      </div>

      {/* Batch Performance Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
          Batch Performance Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Transfers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pregnancies
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Success Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Days to Confirm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deliveries
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.batchAnalytics.map((batch) => {
                const PerformanceIcon = getPerformanceIcon(batch.pregnancyRate);
                return (
                  <tr key={batch.batchId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{batch.batchName}</div>
                      <div className="text-xs text-gray-500">{batch.batchId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {batch.totalTransfers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {batch.pregnancies}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(batch.pregnancyRate)}`}>
                          {batch.pregnancyRate.toFixed(1)}%
                        </span>
                        <PerformanceIcon className="h-4 w-4 ml-2 text-gray-400" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {batch.avgDaysToConfirmation} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {batch.successfulDeliveries}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-gray-500">
                        <div>Pending: {batch.pendingResults}</div>
                        <div>Losses: {batch.losses}</div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Veterinarian Performance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Users className="h-5 w-5 mr-2 text-purple-600" />
          Veterinarian Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.veterinarianPerformance.map((vet) => {
            const PerformanceIcon = getPerformanceIcon(vet.pregnancyRate);
            return (
              <div key={vet.veterinarian} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{vet.veterinarian}</h4>
                  <PerformanceIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Success Rate:</span>
                    <span className={`font-medium ${
                      vet.pregnancyRate >= 80 ? 'text-green-600' :
                      vet.pregnancyRate >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {vet.pregnancyRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Transfers:</span>
                    <span className="font-medium text-gray-900">{vet.totalTransfers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pregnancies:</span>
                    <span className="font-medium text-gray-900">{vet.pregnancies}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avg Quality:</span>
                    <span className="font-medium text-gray-900">{vet.avgTransferQuality.toFixed(1)}/4</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
          Monthly Trends (Last 6 Months)
        </h3>
        <div className="space-y-4">
          {analytics.monthlyTrends.map((month, index) => (
            <div key={month.month} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-900 w-20">
                  {month.month}
                </div>
                <div className="flex space-x-6 text-sm text-gray-600">
                  <span>{month.transfers} transfers</span>
                  <span>{month.pregnancies} pregnancies</span>
                  <span>{month.deliveries} deliveries</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPerformanceColor(month.pregnancyRate)}`}>
                  {month.pregnancyRate.toFixed(1)}%
                </span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(month.pregnancyRate, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Key Insights & Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Performance Highlights</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Best performing batch: {analytics.batchAnalytics[0]?.batchName} ({analytics.batchAnalytics[0]?.pregnancyRate.toFixed(1)}%)</li>
              <li>• Top veterinarian: {analytics.veterinarianPerformance[0]?.veterinarian} ({analytics.veterinarianPerformance[0]?.pregnancyRate.toFixed(1)}%)</li>
              <li>• Current overall success rate: {analytics.overall.overallPregnancyRate.toFixed(1)}%</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Areas for Improvement</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Monitor batches with rates below 60%</li>
              <li>• Review protocols for low-performing periods</li>
              <li>• Consider additional training for consistency</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PregnancyAnalytics; 