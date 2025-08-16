import React from 'react';
import { AlertTriangle, Activity, Calendar, TrendingUp, Zap } from 'lucide-react';

interface BreedingRecord {
  id: string;
  bullId: string;
  bullName: string;
  breedingDate: string;
  status: 'COMPLETED' | 'FAILED' | 'INCOMPLETE' | 'SCHEDULED';
}

interface BullUsageStats {
  bullId: string;
  bullName: string;
  dailyUsage: number;
  weeklyUsage: number;
  consecutiveDays: number;
  lastUsedDate: string;
  usageHistory: { date: string; count: number }[];
  alerts: BullAlert[];
}

interface BullAlert {
  type: 'DAILY_OVERUSE' | 'WEEKLY_OVERUSE' | 'CONSECUTIVE_DAYS' | 'WARNING';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  icon: React.ReactNode;
}

interface BullUsageTrackerProps {
  records: BreedingRecord[];
  selectedBullId?: string;
  compact?: boolean;
}

export const BullUsageTracker: React.FC<BullUsageTrackerProps> = ({
  records,
  selectedBullId,
  compact = false
}) => {
  // Calculate bull usage statistics
  const calculateBullUsage = (): BullUsageStats[] => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
    
    const bullUsageMap = new Map<string, BullUsageStats>();

    // Initialize stats for all bulls
    const uniqueBulls = Array.from(new Set(records.map(r => r.bullId)));
    uniqueBulls.forEach(bullId => {
      const bullName = records.find(r => r.bullId === bullId)?.bullName || '';
      bullUsageMap.set(bullId, {
        bullId,
        bullName,
        dailyUsage: 0,
        weeklyUsage: 0,
        consecutiveDays: 0,
        lastUsedDate: '',
        usageHistory: [],
        alerts: []
      });
    });

    // Calculate daily and weekly usage
    records.forEach(record => {
      const recordDate = new Date(record.breedingDate);
      const isToday = recordDate.toDateString() === today.toDateString();
      const isThisWeek = recordDate >= startOfWeek && recordDate <= today;
      
      if (record.status === 'COMPLETED' || record.status === 'SCHEDULED') {
        const stats = bullUsageMap.get(record.bullId);
        if (stats) {
          if (isToday) {
            stats.dailyUsage++;
          }
          if (isThisWeek) {
            stats.weeklyUsage++;
          }
          
          // Update last used date
          if (!stats.lastUsedDate || recordDate > new Date(stats.lastUsedDate)) {
            stats.lastUsedDate = record.breedingDate;
          }
        }
      }
    });

    // Calculate consecutive days and build usage history
    bullUsageMap.forEach((stats, bullId) => {
      const bullRecords = records
        .filter(r => r.bullId === bullId && (r.status === 'COMPLETED' || r.status === 'SCHEDULED'))
        .sort((a, b) => new Date(a.breedingDate).getTime() - new Date(b.breedingDate).getTime());

      // Build usage history (last 7 days)
      const usageByDate = new Map<string, number>();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        usageByDate.set(dateStr, 0);
      }

      bullRecords.forEach(record => {
        const dateStr = record.breedingDate;
        if (usageByDate.has(dateStr)) {
          usageByDate.set(dateStr, (usageByDate.get(dateStr) || 0) + 1);
        }
      });

      stats.usageHistory = Array.from(usageByDate.entries()).map(([date, count]) => ({
        date,
        count
      }));

      // Calculate consecutive days
      let consecutiveDays = 0;
      const sortedDates = Array.from(usageByDate.keys()).reverse();
      
      for (const dateStr of sortedDates) {
        if (usageByDate.get(dateStr)! > 0) {
          consecutiveDays++;
        } else {
          break;
        }
      }
      stats.consecutiveDays = consecutiveDays;

      // Generate alerts
      const alerts: BullAlert[] = [];

      if (stats.dailyUsage > 1) {
        alerts.push({
          type: 'DAILY_OVERUSE',
          severity: 'HIGH',
          message: `Used ${stats.dailyUsage} times today (maximum 1 recommended)`,
          icon: <AlertTriangle className="h-4 w-4" />
        });
      }

      if (stats.weeklyUsage > 5) {
        alerts.push({
          type: 'WEEKLY_OVERUSE',
          severity: 'HIGH',
          message: `Used ${stats.weeklyUsage} times this week (maximum 5 recommended)`,
          icon: <TrendingUp className="h-4 w-4" />
        });
      }

      if (stats.consecutiveDays >= 3) {
        alerts.push({
          type: 'CONSECUTIVE_DAYS',
          severity: 'MEDIUM',
          message: `Used for ${stats.consecutiveDays} consecutive days (rest recommended)`,
          icon: <Calendar className="h-4 w-4" />
        });
      }

      if (stats.weeklyUsage >= 4 && stats.weeklyUsage <= 5) {
        alerts.push({
          type: 'WARNING',
          severity: 'LOW',
          message: `Approaching weekly limit (${stats.weeklyUsage}/5 uses)`,
          icon: <Zap className="h-4 w-4" />
        });
      }

      stats.alerts = alerts;
    });

    return Array.from(bullUsageMap.values());
  };

  const bullStats = calculateBullUsage();
  const selectedBullStats = selectedBullId ? bullStats.find(s => s.bullId === selectedBullId) : null;

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'text-red-600 bg-red-50 border-red-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUsageStatusColor = (stats: BullUsageStats) => {
    if (stats.alerts.some(a => a.severity === 'HIGH')) return 'text-red-600';
    if (stats.alerts.some(a => a.severity === 'MEDIUM')) return 'text-yellow-600';
    if (stats.alerts.some(a => a.severity === 'LOW')) return 'text-blue-600';
    return 'text-green-600';
  };

  if (compact && selectedBullStats) {
    return (
      <div className="space-y-2">
        {selectedBullStats.alerts.length > 0 && (
          <div className="space-y-1">
            {selectedBullStats.alerts.map((alert, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 p-2 rounded border text-xs ${getAlertColor(alert.severity)}`}
              >
                {alert.icon}
                <span>{alert.message}</span>
              </div>
            ))}
          </div>
        )}
        
        {selectedBullStats.alerts.length === 0 && (
          <div className="flex items-center space-x-2 text-green-600 text-xs">
            <Activity className="h-3 w-3" />
            <span>Bull usage within recommended limits</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <Activity className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Bull Usage Tracking</h3>
      </div>

      {bullStats.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Activity className="mx-auto h-12 w-12 text-gray-300 mb-2" />
          <p>No breeding records found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="text-red-600 text-sm font-medium">High Risk Bulls</div>
              <div className="text-2xl font-bold text-red-700">
                {bullStats.filter(s => s.alerts.some(a => a.severity === 'HIGH')).length}
              </div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <div className="text-yellow-600 text-sm font-medium">Moderate Risk Bulls</div>
              <div className="text-2xl font-bold text-yellow-700">
                {bullStats.filter(s => s.alerts.some(a => a.severity === 'MEDIUM')).length}
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="text-green-600 text-sm font-medium">Healthy Bulls</div>
              <div className="text-2xl font-bold text-green-700">
                {bullStats.filter(s => s.alerts.length === 0).length}
              </div>
            </div>
          </div>

          {/* Bull Usage Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bull
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Today
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    This Week
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Consecutive Days
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage History
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bullStats.map((stats) => (
                  <tr key={stats.bullId} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{stats.bullName}</div>
                      <div className="text-sm text-gray-500">ID: {stats.bullId}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        stats.dailyUsage > 1 ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {stats.dailyUsage}
                      </span>
                      <span className="text-xs text-gray-500">/1</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        stats.weeklyUsage > 5 ? 'text-red-600' : 
                        stats.weeklyUsage >= 4 ? 'text-yellow-600' : 'text-gray-900'
                      }`}>
                        {stats.weeklyUsage}
                      </span>
                      <span className="text-xs text-gray-500">/5</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        stats.consecutiveDays >= 3 ? 'text-yellow-600' : 'text-gray-900'
                      }`}>
                        {stats.consecutiveDays} days
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {stats.alerts.length === 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Healthy
                          </span>
                        ) : (
                          stats.alerts.slice(0, 2).map((alert, index) => (
                            <div
                              key={index}
                              className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-medium ${
                                alert.severity === 'HIGH' ? 'bg-red-100 text-red-800' :
                                alert.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {alert.icon}
                              <span className="truncate max-w-20">{alert.type.replace('_', ' ')}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        {stats.usageHistory.map((day, index) => (
                          <div
                            key={index}
                            className={`w-3 h-3 rounded-sm ${
                              day.count === 0 ? 'bg-gray-200' :
                              day.count === 1 ? 'bg-green-400' :
                              day.count === 2 ? 'bg-yellow-400' :
                              'bg-red-400'
                            }`}
                            title={`${day.date}: ${day.count} uses`}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Last 7 days</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Usage History Legend</h4>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-sm bg-gray-200"></div>
                <span>No use</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-sm bg-green-400"></div>
                <span>1 use (normal)</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-sm bg-yellow-400"></div>
                <span>2 uses (caution)</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-sm bg-red-400"></div>
                <span>3+ uses (overuse)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 