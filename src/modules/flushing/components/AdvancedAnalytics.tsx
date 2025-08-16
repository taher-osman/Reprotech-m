import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Award } from 'lucide-react';

interface AdvancedAnalyticsProps {
  sessions: any[];
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ sessions }) => {
  const [selectedMetric, setSelectedMetric] = useState<'trends' | 'protocols'>('trends');

  const mockTrends = [
    { period: 'Week 1', rate: 82.5, sessions: 12 },
    { period: 'Week 2', rate: 85.3, sessions: 15 },
    { period: 'Week 3', rate: 87.1, sessions: 18 },
    { period: 'Week 4', rate: 89.2, sessions: 14 }
  ];

  const mockProtocols = [
    { protocol: 'MOET v3.0', avgEmbryos: 12.5, successRate: 92, sessions: 25 },
    { protocol: 'MOET v2.1', avgEmbryos: 10.8, successRate: 85, sessions: 30 },
    { protocol: 'Custom Protocol A', avgEmbryos: 11.2, successRate: 88, sessions: 15 }
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center space-x-4">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="trends">Success Trends</option>
            <option value="protocols">Protocol Comparison</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedMetric === 'trends' && (
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Success Rate Trends</h3>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="space-y-4">
              {mockTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{trend.period}</span>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{trend.rate}%</div>
                    <div className="text-sm text-gray-500">{trend.sessions} sessions</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedMetric === 'protocols' && (
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Protocol Effectiveness</h3>
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <div className="space-y-3">
              {mockProtocols.map((protocol, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{protocol.protocol}</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {protocol.successRate}% success
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {protocol.avgEmbryos} avg embryos • {protocol.sessions} sessions
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Analytics Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-gray-900">Top Protocol</span>
            </div>
            <div className="text-sm text-gray-600">
              MOET v3.0 with 92% success rate
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-medium text-gray-900">Trend Direction</span>
            </div>
            <div className="text-sm text-gray-600">
              Success rates trending <span className="text-green-600 font-medium">upward</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 