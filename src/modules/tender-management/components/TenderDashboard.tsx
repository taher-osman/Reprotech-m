import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Eye,
  Edit3,
  Trash2,
  Download,
  Upload,
  BarChart3
} from 'lucide-react';
import { Tender, TenderFilter, TenderStats, TenderStatus, TenderSource, TenderCategory } from '../types/tenderTypes';
import TenderStatusBadge from './TenderStatusBadge';
import DeadlineCountdown from './DeadlineCountdown';

interface TenderDashboardProps {
  tenders: Tender[];
  stats: TenderStats;
  filters: TenderFilter;
  onFilterChange: (filters: TenderFilter) => void;
  onViewChange: (view: 'table' | 'kanban') => void;
  onTenderClick: (tender: Tender) => void;
  onEditTender: (tender: Tender) => void;
  onDeleteTender: (tenderId: string) => Promise<void>;
  onExport: (format: 'csv' | 'excel' | 'pdf') => Promise<void>;
  onImport: (file: File) => Promise<void>;
  className?: string;
}

interface KanbanColumn {
  status: TenderStatus;
  title: string;
  color: string;
  tenders: Tender[];
}

const kanbanColumns: KanbanColumn[] = [
  { status: TenderStatus.DRAFT, title: 'Draft', color: 'bg-gray-100', tenders: [] },
  { status: TenderStatus.OPEN, title: 'Open', color: 'bg-green-100', tenders: [] },
  { status: TenderStatus.SUBMITTED, title: 'Submitted', color: 'bg-blue-100', tenders: [] },
  { status: TenderStatus.EVALUATING, title: 'Evaluating', color: 'bg-yellow-100', tenders: [] },
  { status: TenderStatus.AWARDED, title: 'Awarded', color: 'bg-emerald-100', tenders: [] }
];

export const TenderDashboard: React.FC<TenderDashboardProps> = ({
  tenders,
  stats,
  filters,
  onFilterChange,
  onViewChange,
  onTenderClick,
  onEditTender,
  onDeleteTender,
  onExport,
  onImport,
  className = ''
}) => {
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTenders, setSelectedTenders] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<string>('');

  useEffect(() => {
    // Update kanban columns with filtered tenders
    kanbanColumns.forEach(column => {
      column.tenders = tenders.filter(tender => tender.status === column.status);
    });
  }, [tenders]);

  const handleViewChange = (newView: 'table' | 'kanban') => {
    setView(newView);
    onViewChange(newView);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic here
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedTenders.size === 0) return;

    try {
      switch (bulkAction) {
        case 'delete':
          // Implement bulk delete
          break;
        case 'export':
          await onExport('excel');
          break;
        default:
          break;
      }
      setSelectedTenders(new Set());
      setBulkAction('');
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const toggleTenderSelection = (tenderId: string) => {
    const newSelected = new Set(selectedTenders);
    if (newSelected.has(tenderId)) {
      newSelected.delete(tenderId);
    } else {
      newSelected.add(tenderId);
    }
    setSelectedTenders(newSelected);
  };

  const selectAllTenders = () => {
    if (selectedTenders.size === tenders.length) {
      setSelectedTenders(new Set());
    } else {
      setSelectedTenders(new Set(tenders.map(t => t.tender_id)));
    }
  };

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Tenders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total_tenders}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Open Tenders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.open_tenders}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Urgent Deadlines</p>
            <p className="text-2xl font-bold text-gray-900">{stats.urgent_deadlines}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Success Rate</p>
            <p className="text-2xl font-bold text-gray-900">{stats.success_rate}%</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <Filter className="h-4 w-4" />
          <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              multiple
              value={filters.status || []}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value as TenderStatus);
                onFilterChange({ ...filters, status: values });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(TenderStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
            <select
              multiple
              value={filters.source || []}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value as TenderSource);
                onFilterChange({ ...filters, source: values });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(TenderSource).map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              multiple
              value={filters.category || []}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value as TenderCategory);
                onFilterChange({ ...filters, category: values });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(TenderCategory).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Urgent Deadlines</label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.deadline_urgent || false}
                onChange={(e) => onFilterChange({ ...filters, deadline_urgent: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-600">Show urgent only</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );

  const renderTable = () => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Bulk Actions */}
      {selectedTenders.size > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedTenders.size} tender(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Select action</option>
                <option value="delete">Delete</option>
                <option value="export">Export</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={selectedTenders.size === tenders.length && tenders.length > 0}
                onChange={selectAllTenders}
                className="rounded border-gray-300"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tender
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Deadline
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Source
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Manager
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tenders.map((tender) => (
            <tr key={tender.tender_id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedTenders.has(tender.tender_id)}
                  onChange={() => toggleTenderSelection(tender.tender_id)}
                  className="rounded border-gray-300"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <button
                    onClick={() => onTenderClick(tender)}
                    className="text-left text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    {tender.title}
                  </button>
                  <p className="text-sm text-gray-500">{tender.reference_number}</p>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <TenderStatusBadge status={tender.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <DeadlineCountdown deadline={tender.submission_deadline} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {tender.source}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {tender.assigned_manager_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onTenderClick(tender)}
                    className="text-gray-400 hover:text-gray-600"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEditTender(tender)}
                    className="text-gray-400 hover:text-blue-600"
                    title="Edit"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteTender(tender.tender_id)}
                    className="text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderKanban = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {kanbanColumns.map((column) => (
        <div key={column.status} className="space-y-4">
          <div className={`${column.color} rounded-lg p-4`}>
            <h3 className="font-medium text-gray-900">{column.title}</h3>
            <p className="text-sm text-gray-600">{column.tenders.length} tenders</p>
          </div>
          
          <div className="space-y-3">
            {column.tenders.map((tender) => (
              <div
                key={tender.tender_id}
                className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onTenderClick(tender)}
              >
                <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                  {tender.title}
                </h4>
                <p className="text-xs text-gray-500 mb-2">{tender.reference_number}</p>
                <DeadlineCountdown deadline={tender.submission_deadline} size="sm" />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{tender.source}</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTender(tender);
                      }}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      <Edit3 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTender(tender.tender_id);
                      }}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tender Management</h1>
          <p className="text-gray-600">Manage and track all tender activities</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onImport(new File([], 'dummy'))}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </button>
          
          <button
            onClick={() => onExport('excel')}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Tender</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      {renderStats()}

      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tenders..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewChange('table')}
            className={`p-2 rounded ${view === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleViewChange('kanban')}
            className={`p-2 rounded ${view === 'kanban' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      {renderFilters()}

      {/* Content */}
      {view === 'table' ? renderTable() : renderKanban()}
    </div>
  );
};

export default TenderDashboard; 