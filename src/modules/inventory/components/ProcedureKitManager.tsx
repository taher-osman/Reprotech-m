import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Package, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  Search, 
  Filter,
  TestTube,
  Microscope,
  Brain,
  Syringe,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { 
  ProcedureKit, 
  ProcedureTemplate, 
  KitItem,
  inventoryIntegrationService 
} from '../services/inventoryIntegrationService';

interface ProcedureKitManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProcedureKitManager: React.FC<ProcedureKitManagerProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('kits');
  const [procedureKits, setProcedureKits] = useState<ProcedureKit[]>([]);
  const [procedureTemplates, setProcedureTemplates] = useState<ProcedureTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  
  // Form states
  const [showKitForm, setShowKitForm] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingKit, setEditingKit] = useState<ProcedureKit | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<ProcedureTemplate | null>(null);

  const procedureTypes = [
    { value: 'IVF', label: 'IVF', icon: TestTube, color: 'bg-blue-500' },
    { value: 'ICSI', label: 'ICSI', icon: Microscope, color: 'bg-green-500' },
    { value: 'SCNT', label: 'SCNT', icon: Brain, color: 'bg-purple-500' },
    { value: 'EMBRYO_TRANSFER', label: 'Embryo Transfer', icon: Syringe, color: 'bg-orange-500' },
    { value: 'OPU', label: 'OPU', icon: Package, color: 'bg-teal-500' },
    { value: 'LABORATORY', label: 'Laboratory', icon: TestTube, color: 'bg-indigo-500' }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [kits, templates] = await Promise.all([
        inventoryIntegrationService.getProcedureKits(),
        inventoryIntegrationService.getProcedureTemplates()
      ]);
      setProcedureKits(kits);
      setProcedureTemplates(templates);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredKits = procedureKits.filter(kit => {
    const matchesSearch = !searchTerm || 
      kit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kit.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || kit.procedureType === filterType;
    return matchesSearch && matchesType;
  });

  const filteredTemplates = procedureTemplates.filter(template => {
    const matchesSearch = !searchTerm || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || template.procedureType === filterType;
    return matchesSearch && matchesType;
  });

  const getProcedureTypeInfo = (type: string) => {
    return procedureTypes.find(pt => pt.value === type) || procedureTypes[0];
  };

  const renderKits = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Procedure Kits</h3>
          <p className="text-sm text-gray-500">Manage pre-configured inventory kits for procedures</p>
        </div>
        <button
          onClick={() => setShowKitForm(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Kit</span>
        </button>
      </div>

      {/* Kit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredKits.map(kit => {
          const typeInfo = getProcedureTypeInfo(kit.procedureType);
          const Icon = typeInfo.icon;
          
          return (
            <div key={kit.id} className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${typeInfo.color} bg-opacity-10`}>
                    <Icon className={`h-5 w-5 text-${typeInfo.color.replace('bg-', '')}`} />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">{kit.name}</h4>
                    <p className="text-sm text-gray-500">{typeInfo.label}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  kit.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {kit.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">{kit.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{kit.items.length}</p>
                  <p className="text-xs text-gray-500">Items</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">${kit.estimatedCost.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Est. Cost</p>
                </div>
              </div>

              {/* Items Preview */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Items:</p>
                <div className="space-y-1">
                  {kit.items.slice(0, 3).map(item => (
                    <div key={item.itemId} className="flex justify-between text-xs">
                      <span className="text-gray-600 truncate">{item.itemName}</span>
                      <span className="text-gray-500">{item.quantity} {item.unitOfMeasure}</span>
                    </div>
                  ))}
                  {kit.items.length > 3 && (
                    <p className="text-xs text-gray-400">+{kit.items.length - 3} more items</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 flex items-center justify-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>View</span>
                </button>
                <button 
                  onClick={() => {
                    setEditingKit(kit);
                    setShowKitForm(true);
                  }}
                  className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 flex items-center justify-center space-x-1"
                >
                  <Edit className="h-3 w-3" />
                  <span>Edit</span>
                </button>
                <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200">
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredKits.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No procedure kits found</h3>
          <p className="mt-1 text-sm text-gray-500">Create your first kit to get started</p>
        </div>
      )}
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Procedure Templates</h3>
          <p className="text-sm text-gray-500">Complete procedure workflows with default kits</p>
        </div>
        <button
          onClick={() => setShowTemplateForm(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Template</span>
        </button>
      </div>

      {/* Templates Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTemplates.map(template => {
              const typeInfo = getProcedureTypeInfo(template.procedureType);
              const Icon = typeInfo.icon;
              
              return (
                <tr key={template.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${typeInfo.color} bg-opacity-10`}>
                        <Icon className={`h-4 w-4 text-${typeInfo.color.replace('bg-', '')}`} />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{template.name}</div>
                        <div className="text-sm text-gray-500">{template.defaultKit.items.length} items in default kit</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeInfo.color} bg-opacity-10 text-${typeInfo.color.replace('bg-', '')}`}>
                      {typeInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      {template.estimatedDuration} min
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                      ${template.defaultKit.estimatedCost.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {template.species.slice(0, 2).map(species => (
                        <span key={species} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                          {species}
                        </span>
                      ))}
                      {template.species.length > 2 && (
                        <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          +{template.species.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {template.requiredStaff.length} roles
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-teal-600 hover:text-teal-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setEditingTemplate(template);
                          setShowTemplateForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <TestTube className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No procedure templates found</h3>
          <p className="mt-1 text-sm text-gray-500">Create your first template to get started</p>
        </div>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Procedure Kit Manager</h2>
              <p className="text-sm text-gray-500 mt-1">Manage inventory kits and procedure templates</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <Plus className="h-6 w-6 transform rotate-45" />
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-4">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('kits')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'kits'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Procedure Kits ({procedureKits.length})
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'templates'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Procedure Templates ({procedureTemplates.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search kits and templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Procedure Types</option>
              {procedureTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            <button
              onClick={fetchData}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading...</p>
            </div>
          ) : (
            <>
              {activeTab === 'kits' && renderKits()}
              {activeTab === 'templates' && renderTemplates()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 