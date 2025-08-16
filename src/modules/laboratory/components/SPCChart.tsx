import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  Filter,
  Download,
  Settings,
  Target,
  Activity,
  Zap,
  Eye,
  RefreshCw
} from 'lucide-react';

interface SPCDataPoint {
  id: string;
  date: string;
  time: string;
  value: number;
  controlMaterial: string;
  operator: string;
  instrument: string;
  lotNumber: string;
  temperature: number;
  humidity: number;
  isOutOfControl: boolean;
  westgardViolations: string[];
  comments?: string;
}

interface ControlLimits {
  mean: number;
  standardDeviation: number;
  upperControlLimit: number;
  lowerControlLimit: number;
  upperWarningLimit: number;
  lowerWarningLimit: number;
  target: number;
}

interface SPCChartProps {
  analyte: string;
  controlLevel: string;
  timeRange: '24h' | '7d' | '30d' | '90d';
  onDataPointClick?: (dataPoint: SPCDataPoint) => void;
}

const SPCChart: React.FC<SPCChartProps> = ({ analyte, controlLevel, timeRange, onDataPointClick }) => {
  const [data, setData] = useState<SPCDataPoint[]>([]);
  const [controlLimits, setControlLimits] = useState<ControlLimits>({
    mean: 12.5,
    standardDeviation: 0.8,
    upperControlLimit: 14.9,
    lowerControlLimit: 10.1,
    upperWarningLimit: 14.1,
    lowerWarningLimit: 10.9,
    target: 12.5
  });
  const [showViolations, setShowViolations] = useState(true);
  const [showTrends, setShowTrends] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);

  useEffect(() => {
    generateMockData();
  }, [analyte, controlLevel, timeRange]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        generateMockData();
      }, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const generateMockData = () => {
    const mockData: SPCDataPoint[] = [];
    const baseDate = new Date();
    const { mean, standardDeviation } = controlLimits;
    
    const getDataPoints = () => {
      switch (timeRange) {
        case '24h': return 24;
        case '7d': return 35;
        case '30d': return 90;
        case '90d': return 180;
        default: return 24;
      }
    };

    const getTimeIncrement = () => {
      switch (timeRange) {
        case '24h': return 60 * 60 * 1000; // 1 hour
        case '7d': return 4.8 * 60 * 60 * 1000; // ~5 hours
        case '30d': return 8 * 60 * 60 * 1000; // 8 hours
        case '90d': return 12 * 60 * 60 * 1000; // 12 hours
        default: return 60 * 60 * 1000;
      }
    };

    const operators = ['Dr. Ahmed', 'J. Smith', 'M. Wilson', 'S. Brown', 'Lab Tech A'];
    const instruments = ['Analyzer-01', 'Analyzer-02', 'Analyzer-03'];
    const lotNumbers = ['LOT-2025-001', 'LOT-2025-002', 'LOT-2025-003'];

    for (let i = 0; i < getDataPoints(); i++) {
      const currentDate = new Date(baseDate.getTime() - (i * getTimeIncrement()));
      
      // Generate value with some controlled variation
      let value = mean + (Math.random() - 0.5) * standardDeviation * 2;
      
      // Introduce some out-of-control points (5% chance)
      if (Math.random() < 0.05) {
        value = Math.random() < 0.5 
          ? controlLimits.upperControlLimit + Math.random() * 0.5
          : controlLimits.lowerControlLimit - Math.random() * 0.5;
      }

      // Introduce trending (3% chance)
      if (i > 5 && Math.random() < 0.03) {
        const trend = (Math.random() - 0.5) * 0.1;
        value += trend * i;
      }

      const westgardViolations = evaluateWestgardRules(value, controlLimits, i > 0 ? mockData[0] : null);
      
      const dataPoint: SPCDataPoint = {
        id: `spc-${i + 1}`,
        date: currentDate.toISOString().split('T')[0],
        time: currentDate.toTimeString().slice(0, 5),
        value: Math.round(value * 100) / 100,
        controlMaterial: `${controlLevel} Control`,
        operator: operators[Math.floor(Math.random() * operators.length)],
        instrument: instruments[Math.floor(Math.random() * instruments.length)],
        lotNumber: lotNumbers[Math.floor(Math.random() * lotNumbers.length)],
        temperature: 22 + (Math.random() - 0.5) * 2,
        humidity: 45 + (Math.random() - 0.5) * 10,
        isOutOfControl: westgardViolations.length > 0,
        westgardViolations,
        comments: westgardViolations.length > 0 ? 'Investigation required' : undefined
      };

      mockData.unshift(dataPoint);
    }

    setData(mockData);
  };

  const evaluateWestgardRules = (value: number, limits: ControlLimits, previousPoint: SPCDataPoint | null): string[] => {
    const violations = [];
    const { mean, upperControlLimit, lowerControlLimit, upperWarningLimit, lowerWarningLimit } = limits;

    // 1-3s rule
    if (value > upperControlLimit || value < lowerControlLimit) {
      violations.push('1-3s');
    }

    // 1-2s rule (warning)
    if ((value > upperWarningLimit && value <= upperControlLimit) || 
        (value < lowerWarningLimit && value >= lowerControlLimit)) {
      violations.push('1-2s');
    }

    // 2-2s rule (simplified - would need multiple consecutive points)
    if (previousPoint && 
        ((value > upperWarningLimit && previousPoint.value > upperWarningLimit) ||
         (value < lowerWarningLimit && previousPoint.value < lowerWarningLimit))) {
      violations.push('2-2s');
    }

    return violations;
  };

  const getPointColor = (point: SPCDataPoint): string => {
    if (point.westgardViolations.includes('1-3s')) return 'bg-red-500';
    if (point.westgardViolations.includes('2-2s')) return 'bg-orange-500';
    if (point.westgardViolations.includes('1-2s')) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getPointBorder = (point: SPCDataPoint): string => {
    if (point.westgardViolations.includes('1-3s')) return 'border-red-700';
    if (point.westgardViolations.includes('2-2s')) return 'border-orange-700';
    if (point.westgardViolations.includes('1-2s')) return 'border-yellow-700';
    return 'border-blue-700';
  };

  const calculateStatistics = () => {
    if (data.length === 0) return { cpk: 0, cv: 0, outOfControlRate: 0 };
    
    const values = data.map(d => d.value);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    // Process Capability Index (Cpk)
    const cpkUpper = (controlLimits.upperControlLimit - mean) / (3 * stdDev);
    const cpkLower = (mean - controlLimits.lowerControlLimit) / (3 * stdDev);
    const cpk = Math.min(cpkUpper, cpkLower);
    
    // Coefficient of Variation
    const cv = (stdDev / mean) * 100;
    
    // Out of Control Rate
    const outOfControlCount = data.filter(d => d.isOutOfControl).length;
    const outOfControlRate = (outOfControlCount / data.length) * 100;
    
    return { cpk: Math.round(cpk * 100) / 100, cv: Math.round(cv * 10) / 10, outOfControlRate: Math.round(outOfControlRate * 10) / 10 };
  };

  const stats = calculateStatistics();

  const exportData = () => {
    const csvData = [
      ['Date', 'Time', 'Value', 'Control Material', 'Operator', 'Instrument', 'Violations', 'Comments'],
      ...data.map(d => [
        d.date,
        d.time,
        d.value.toString(),
        d.controlMaterial,
        d.operator,
        d.instrument,
        d.westgardViolations.join('; '),
        d.comments || ''
      ])
    ];
    
    const csvString = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spc_chart_${analyte}_${controlLevel}_${timeRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Levey-Jennings Chart - {analyte}
            </h3>
            <p className="text-sm text-gray-500">{controlLevel} Control | {timeRange.toUpperCase()}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="mr-2 rounded focus:ring-blue-500"
            />
            Auto-refresh ({refreshInterval}s)
          </label>
          
          <button
            onClick={() => generateMockData()}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={exportData}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
            title="Export Data"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Process Capability</p>
              <p className="text-xl font-bold text-green-900">Cpk: {stats.cpk}</p>
            </div>
            <Target className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-xs text-green-600 mt-1">
            {stats.cpk >= 1.33 ? 'Capable' : stats.cpk >= 1.0 ? 'Marginally Capable' : 'Not Capable'}
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Precision</p>
              <p className="text-xl font-bold text-blue-900">CV: {stats.cv}%</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-xs text-blue-600 mt-1">
            {stats.cv <= 5 ? 'Excellent' : stats.cv <= 10 ? 'Good' : 'Needs Improvement'}
          </p>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Out of Control</p>
              <p className="text-xl font-bold text-orange-900">{stats.outOfControlRate}%</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-xs text-orange-600 mt-1">
            {stats.outOfControlRate <= 2 ? 'Acceptable' : 'Investigation Required'}
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Data Points</p>
              <p className="text-xl font-bold text-purple-900">{data.length}</p>
            </div>
            <Zap className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-xs text-purple-600 mt-1">
            {timeRange.toUpperCase()} Range
          </p>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={showViolations}
              onChange={(e) => setShowViolations(e.target.checked)}
              className="mr-2 rounded focus:ring-blue-500"
            />
            Show Westgard Violations
          </label>
          
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={showTrends}
              onChange={(e) => setShowTrends(e.target.checked)}
              className="mr-2 rounded focus:ring-blue-500"
            />
            Show Trend Lines
          </label>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span>1-3s Rule</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>
            <span>2-2s Rule</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
            <span>1-2s Rule</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span>In Control</span>
          </div>
        </div>
      </div>

      {/* SPC Chart */}
      <div className="relative h-80 bg-gray-50 rounded-lg border border-gray-200 p-4">
        {/* Y-axis labels */}
        <div className="absolute left-2 top-4 bottom-4 flex flex-col justify-between text-xs text-gray-500">
          <span>{controlLimits.upperControlLimit.toFixed(1)}</span>
          <span>{controlLimits.upperWarningLimit.toFixed(1)}</span>
          <span>{controlLimits.mean.toFixed(1)}</span>
          <span>{controlLimits.lowerWarningLimit.toFixed(1)}</span>
          <span>{controlLimits.lowerControlLimit.toFixed(1)}</span>
        </div>

        {/* Chart area */}
        <div className="ml-8 mr-4 h-full relative">
          {/* Control limit lines */}
          <div className="absolute inset-0">
            {/* Upper Control Limit */}
            <div className="absolute w-full border-t-2 border-red-500 border-dashed" style={{ top: '5%' }}>
              <span className="absolute right-0 -top-3 text-xs text-red-600 bg-white px-1">UCL</span>
            </div>
            
            {/* Upper Warning Limit */}
            <div className="absolute w-full border-t border-orange-400 border-dashed" style={{ top: '25%' }}>
              <span className="absolute right-0 -top-3 text-xs text-orange-600 bg-white px-1">+2σ</span>
            </div>
            
            {/* Mean Line */}
            <div className="absolute w-full border-t-2 border-green-600" style={{ top: '50%' }}>
              <span className="absolute right-0 -top-3 text-xs text-green-600 bg-white px-1">Mean</span>
            </div>
            
            {/* Lower Warning Limit */}
            <div className="absolute w-full border-t border-orange-400 border-dashed" style={{ top: '75%' }}>
              <span className="absolute right-0 -top-3 text-xs text-orange-600 bg-white px-1">-2σ</span>
            </div>
            
            {/* Lower Control Limit */}
            <div className="absolute w-full border-t-2 border-red-500 border-dashed" style={{ top: '95%' }}>
              <span className="absolute right-0 -top-3 text-xs text-red-600 bg-white px-1">LCL</span>
            </div>
          </div>

          {/* Data points */}
          <div className="absolute inset-0 flex items-end">
            {data.slice(-20).map((point, index) => {
              const range = controlLimits.upperControlLimit - controlLimits.lowerControlLimit;
              const yPosition = ((controlLimits.upperControlLimit - point.value) / range) * 100;
              const xPosition = (index / 19) * 100;

              return (
                <div
                  key={point.id}
                  className="absolute transform -translate-x-1/2 cursor-pointer group"
                  style={{ 
                    left: `${xPosition}%`, 
                    bottom: `${100 - yPosition}%` 
                  }}
                  onClick={() => onDataPointClick && onDataPointClick(point)}
                >
                  <div className={`w-3 h-3 rounded-full border-2 ${getPointColor(point)} ${getPointBorder(point)} hover:scale-150 transition-transform`}>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    <div>Value: {point.value}</div>
                    <div>Date: {point.date} {point.time}</div>
                    <div>Operator: {point.operator}</div>
                    {point.westgardViolations.length > 0 && (
                      <div className="text-red-300">Violations: {point.westgardViolations.join(', ')}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trend line */}
          {showTrends && data.length > 5 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <polyline
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                strokeDasharray="5,5"
                points={data.slice(-20).map((point, index) => {
                  const range = controlLimits.upperControlLimit - controlLimits.lowerControlLimit;
                  const yPosition = ((controlLimits.upperControlLimit - point.value) / range) * 100;
                  const xPosition = (index / 19) * 100;
                  return `${xPosition}%,${yPosition}%`;
                }).join(' ')}
              />
            </svg>
          )}
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-8 right-4 flex justify-between text-xs text-gray-500">
          {data.slice(-5).map((point, index) => (
            <span key={index}>{point.time}</span>
          ))}
        </div>
      </div>

      {/* Violation Summary */}
      {showViolations && data.filter(d => d.isOutOfControl).length > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-900 mb-2 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Recent Westgard Rule Violations
          </h4>
          <div className="space-y-2">
            {data.filter(d => d.isOutOfControl).slice(0, 3).map(point => (
              <div key={point.id} className="text-sm text-red-800">
                <span className="font-medium">{point.date} {point.time}</span> - 
                Value: {point.value} | Violations: {point.westgardViolations.join(', ')} | 
                Operator: {point.operator}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SPCChart; 