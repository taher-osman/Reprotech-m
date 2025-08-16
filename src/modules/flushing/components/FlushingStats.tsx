import React from 'react';
import { BarChart3, Zap, FlaskConical, TrendingUp, Award, Calendar } from 'lucide-react';
import { FlushingSessionStats } from '../pages/FlushingPage';

interface FlushingStatsProps {
  stats: FlushingSessionStats;
}

export const FlushingStats: React.FC<FlushingStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Sessions */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-pink-600" />
              <div className="text-2xl font-bold text-pink-600">{stats.totalSessions}</div>
            </div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>
          <div className="p-3 bg-pink-100 rounded-full">
            <Calendar className="h-6 w-6 text-pink-600" />
          </div>
        </div>
      </div>

      {/* Total Embryos */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <FlaskConical className="h-5 w-5 text-teal-600" />
              <div className="text-2xl font-bold text-teal-600">{stats.totalEmbryos}</div>
            </div>
            <div className="text-sm text-gray-600">Total Embryos</div>
          </div>
          <div className="p-3 bg-teal-100 rounded-full">
            <FlaskConical className="h-6 w-6 text-teal-600" />
          </div>
        </div>
      </div>

      {/* Average per Flush */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">
                {stats.averageEmbryosPerFlush.toFixed(1)}
              </div>
            </div>
            <div className="text-sm text-gray-600">Avg per Flush</div>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Success Rate */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div className="text-2xl font-bold text-green-600">
                {stats.successRate.toFixed(1)}%
              </div>
            </div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <Award className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white p-6 rounded-lg border shadow-sm col-span-1 md:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Trend</h3>
          <TrendingUp className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          {stats.monthlyTrend.map((month, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{month.month}</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-sm font-medium">{month.sessions} sessions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-sm font-medium">{month.embryos} embryos</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Donors */}
      <div className="bg-white p-6 rounded-lg border shadow-sm col-span-1 md:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
          <Award className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          {stats.topDonors.map((donor, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-pink-600">#{index + 1}</span>
                </div>
                <span className="font-medium text-gray-900">{donor.donor}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{donor.embryos} embryos</div>
                <div className="text-xs text-gray-500">{donor.sessions} sessions</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 