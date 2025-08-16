import React, { useState, useEffect } from 'react';
import { Shield, Plus, Search, Filter, Edit, Trash2, Eye, Calendar, AlertTriangle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import LoadingSpinner from './components/common/LoadingSpinner';
import VaccinationsForm from '../components/VaccinationsForm';
import apiService from './services/api';

interface Vaccination {
  id: string;
  animalId: string;
  animalName: string;
  animalType: string;
  vaccineType: string;
  administrationDate: string;
  nextDueDate?: string;
  technician: string;
  batchNumber: string;
  dosage?: string;
  status: string;
  site?: string;
  notes?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const VaccinationsPage: React.FC = () => {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVaccination, setSelectedVaccination] = useState<Vaccination | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    fetchVaccinations();
  }, [currentPage, pageSize, searchTerm, selectedStatus]);

  const fetchVaccinations = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const data = await apiService.getVaccinations();
      setVaccinations(data.vaccinations || []);
      setPagination(data.pagination);
      setError(null);
    } catch (error) {
      console.error('Error fetching vaccination records:', error);
      setError('Failed to fetch vaccination records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1); // Reset to first page on filter
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const renderPaginationButton = (page: number | string, isActive: boolean = false, isDisabled: boolean = false) => (
    <button
      key={page}
      onClick={() => typeof page === 'number' && handlePageChange(page)}
      disabled={isDisabled}
      className={`px-3 py-2 text-sm font-medium border ${
        isActive
          ? 'bg-emerald-600 text-white border-emerald-600'
          : isDisabled
          ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
      } ${typeof page === 'number' ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {page}
    </button>
  );

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const pages = [];
    const { page, totalPages, hasPreviousPage, hasNextPage } = pagination;

    // First page and previous
    pages.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={!hasPreviousPage}
        className="px-3 py-2 text-sm font-medium border bg-white text-gray-700 border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>
    );

    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(page - 1)}
        disabled={!hasPreviousPage}
        className="px-3 py-2 text-sm font-medium border bg-white text-gray-700 border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    );

    // Page numbers
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    if (startPage > 1) {
      pages.push(renderPaginationButton(1));
      if (startPage > 2) {
        pages.push(renderPaginationButton('...', false, true));
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(renderPaginationButton(i, i === page));
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(renderPaginationButton('...', false, true));
      }
      pages.push(renderPaginationButton(totalPages));
    }

    // Next and last page
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(page + 1)}
        disabled={!hasNextPage}
        className="px-3 py-2 text-sm font-medium border bg-white text-gray-700 border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    );

    pages.push(
      <button
        key="last"
        onClick={() => handlePageChange(totalPages)}
        disabled={!hasNextPage}
        className="px-3 py-2 text-sm font-medium border bg-white text-gray-700 border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        <ChevronsRight className="h-4 w-4" />
      </button>
    );

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t">
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
          <span>per page</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Page {page} of {totalPages} ({pagination.total} total records)
          </span>
          <div className="flex -space-x-px">
            {pages}
          </div>
        </div>
      </div>
    );
  };

  const handleAddNew = () => {
    setSelectedVaccination(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEdit = (vaccination: Vaccination) => {
    setSelectedVaccination(vaccination);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleView = (vaccination: Vaccination) => {
    alert(`Vaccination Details:\n\nVaccination ID: ${vaccination.id}\nAnimal: ${vaccination.animalName}\nVaccine Type: ${vaccination.vaccineType}\nDate: ${vaccination.administrationDate}\nBatch Number: ${vaccination.batchNumber}\nNext Dose: ${vaccination.nextDueDate || 'N/A'}\nStatus: ${vaccination.status}\nTechnician: ${vaccination.technician}\nDosage: ${vaccination.dosage || 'N/A'}\nSite: ${vaccination.site || 'N/A'}\nNotes: ${vaccination.notes || 'None'}`);
  };

  const handleDelete = async (vaccination: Vaccination) => {
    if (window.confirm(`Are you sure you want to delete vaccination record ${vaccination.id}?`)) {
      try {
        await apiService.deleteVaccination(vaccination.id);
        await fetchVaccinations(); // Refresh the list
      } catch (error) {
        console.error('Error deleting vaccination record:', error);
        alert('Failed to delete vaccination record');
      }
    }
  };

  const handleScheduleNext = (vaccination: Vaccination) => {
    alert(`Schedule Next Dose for ${vaccination.animalName}\nVaccine: ${vaccination.vaccineType}\nNext Due: ${vaccination.nextDueDate || 'Not scheduled'}\n\nCalendar integration feature coming soon!`);
  };

  const handleFormSave = async (vaccinationData: any) => {
    try {
      if (formMode === 'edit') {
        await apiService.updateVaccination(selectedVaccination!.id, vaccinationData);
      } else {
        await apiService.createVaccination(vaccinationData);
      }
      await fetchVaccinations(); // Refresh the list
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving vaccination record:', error);
      alert('Failed to save vaccination record');
    }
  };

  const getDueStatus = (nextDoseDate: string | undefined) => {
    if (!nextDoseDate) return null;
    const today = new Date();
    const dueDate = new Date(nextDoseDate);
    const diff = (dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
    if (diff < 0) return <span className="text-red-600">Overdue</span>;
    if (diff < 7) return <span className="text-yellow-600">Due Soon</span>;
    return <span className="text-green-600">On Schedule</span>;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-7 w-7 text-emerald-600" />
          Vaccination Records
        </h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Vaccination
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by animal, vaccine, batch, technician..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="Due">Due</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-red-600 font-medium">{error}</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaccination ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaccine Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Dose</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vaccinations
                .filter(v =>
                  (!searchTerm ||
                    v.animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    v.vaccineType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    v.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    v.technician.toLowerCase().includes(searchTerm.toLowerCase())
                  ) &&
                  (!selectedStatus || v.status === selectedStatus)
                )
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{v.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{v.animalName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{v.vaccineType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{v.administrationDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{v.batchNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{v.nextDueDate || 'N/A'} {getDueStatus(v.nextDueDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        v.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        v.status === 'Due' ? 'bg-yellow-100 text-yellow-800' :
                        v.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{v.technician}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button onClick={() => handleView(v)} className="text-blue-600 hover:text-blue-800" title="View"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => handleEdit(v)} className="text-green-600 hover:text-green-800" title="Edit"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(v)} className="text-red-600 hover:text-red-800" title="Delete"><Trash2 className="h-4 w-4" /></button>
                        <button onClick={() => handleScheduleNext(v)} className="text-yellow-600 hover:text-yellow-800" title="Schedule Next"><Calendar className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      {renderPagination()}
      {isFormOpen && (
        <VaccinationsForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleFormSave}
          initialData={selectedVaccination}
          mode={formMode}
        />
      )}
    </div>
  );
};

export default VaccinationsPage; 