import React, { useState, useEffect } from 'react';
import { Camera, Plus, Search, Filter, Edit, Trash2, Eye, Image, Upload, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import LoadingSpinner from './components/common/LoadingSpinner';
import PhenotypeForm from '../components/PhenotypeForm';
import apiService from './services/api';

interface PhenotypeRecord {
  id: string;
  phenotypeID: string;
  animalId: string;
  animalName: string;
  featureType: string;
  score?: number;
  measurement?: number;
  unit?: string;
  description?: string;
  attachmentPath?: string;
  analysisDate: string;
  analyst?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const PhenotypePage: React.FC = () => {
  const [phenotypes, setPhenotypes] = useState<PhenotypeRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeature, setSelectedFeature] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  
  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPhenotype, setSelectedPhenotype] = useState<PhenotypeRecord | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    fetchPhenotypes();
  }, [currentPage, pageSize, searchTerm, selectedFeature]);

  const fetchPhenotypes = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const data = await apiService.getPhenotypes();
      setPhenotypes(data.records || []);
      setPagination(data.pagination);
      setError(null);
    } catch (error) {
      console.error('Error fetching phenotype records:', error);
      setError('Failed to fetch phenotype records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFeatureFilter = (feature: string) => {
    setSelectedFeature(feature);
    setCurrentPage(1);
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
          ? 'bg-violet-600 text-white border-violet-600'
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

  const uniqueFeatures = [...new Set(phenotypes.map(p => p.featureType))];

  const handleAddNew = () => {
    setSelectedPhenotype(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEdit = (phenotype: PhenotypeRecord) => {
    setSelectedPhenotype(phenotype);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleView = (phenotype: PhenotypeRecord) => {
    alert(`Phenotype Analysis Details:\n\nPhenotype ID: ${phenotype.phenotypeID}\nAnimal: ${phenotype.animalName}\nFeature Type: ${phenotype.featureType}\nScore: ${phenotype.score || 'N/A'}\nMeasurement: ${phenotype.measurement ? `${phenotype.measurement} ${phenotype.unit || ''}` : 'N/A'}\nAnalyst: ${phenotype.analyst || 'N/A'}\nAnalysis Date: ${phenotype.analysisDate}\nDescription: ${phenotype.description || 'None'}\nAttachment: ${phenotype.attachmentPath ? 'Yes' : 'No'}\nNotes: ${phenotype.notes || 'None'}`);
  };

  const handleDelete = async (phenotype: PhenotypeRecord) => {
    if (window.confirm(`Are you sure you want to delete phenotype analysis ${phenotype.phenotypeID}?`)) {
      try {
        await apiService.deletePhenotype(phenotype.id);
        await fetchPhenotypes(); // Refresh the list
      } catch (error) {
        console.error('Error deleting phenotype record:', error);
        alert('Failed to delete phenotype record');
      }
    }
  };

  const handleSavePhenotype = async (phenotypeData: any) => {
    try {
      if (formMode === 'edit') {
        await apiService.updatePhenotype(selectedPhenotype!.id, phenotypeData);
      } else {
        await apiService.createPhenotype(phenotypeData);
      }
      await fetchPhenotypes(); // Refresh the list
      setIsFormOpen(false);
      setSelectedPhenotype(null);
    } catch (error) {
      console.error('Error saving phenotype record:', error);
      alert('Failed to save phenotype record');
    }
  };

  const handleViewAttachment = (phenotype: PhenotypeRecord) => {
    if (phenotype.attachmentPath) {
      window.open(phenotype.attachmentPath, '_blank');
    } else {
      alert('No attachment available for this record');
    }
  };

  const handleUploadAttachment = (phenotype: PhenotypeRecord) => {
    alert(`Upload attachment for ${phenotype.animalName}\nPhenotype: ${phenotype.featureType}\n\nFile upload feature coming soon!`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Camera className="h-7 w-7 text-violet-600" />
          Phenotype Analysis
        </h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Analysis
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by animal, feature type, analyst..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedFeature}
            onChange={(e) => handleFeatureFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            <option value="">All Features</option>
            {uniqueFeatures.map(feature => (
              <option key={feature} value={feature}>{feature}</option>
            ))}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phenotype ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Measurement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Analysis Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Analyst</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attachment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {phenotypes
                .filter(p =>
                  (!searchTerm ||
                    p.animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.featureType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (p.analyst && p.analyst.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
                  ) &&
                  (!selectedFeature || p.featureType === selectedFeature)
                )
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.phenotypeID}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.animalName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.featureType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.score || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {p.measurement ? `${p.measurement} ${p.unit || ''}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.analysisDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.analyst || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {p.attachmentPath ? (
                        <button 
                          onClick={() => handleViewAttachment(p)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Attachment"
                        >
                          <Image className="h-4 w-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleUploadAttachment(p)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Upload Attachment"
                        >
                          <Upload className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button onClick={() => handleView(p)} className="text-blue-600 hover:text-blue-800" title="View"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => handleEdit(p)} className="text-green-600 hover:text-green-800" title="Edit"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(p)} className="text-red-600 hover:text-red-800" title="Delete"><Trash2 className="h-4 w-4" /></button>
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
        <PhenotypeForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSavePhenotype}
          initialData={selectedPhenotype}
          mode={formMode}
        />
      )}
    </div>
  );
}; 