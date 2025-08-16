import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, QrCode, Download, Share2, Copy, Clock, Calendar, 
  TestTube, Baby, Syringe, Microscope, Heart, BarChart3, FlaskConical, 
  Activity, User, Hash, MapPin, AlertTriangle, CheckCircle, XCircle,
  Camera, FileText, Workflow, Database, Info, Settings
} from 'lucide-react';
import { Button } from './components/ui/Button';
import { Animal } from '../types/animalTypes';
import { SPECIES_CONFIG, ROLE_CONFIG, STATUS_CONFIG } from '../types/animalStatus';
import { 
  getActiveRoles, 
  getRoleDisplayInfo, 
  getAnimalWarnings, 
  generateQRCode 
} from '../utils/animalUtils';

interface AnimalProfilePageProps {
  animal?: Animal;
  onEdit?: (animal: Animal) => void;
  onClose?: () => void;
}

export const AnimalProfilePage: React.FC<AnimalProfilePageProps> = ({
  animal,
  onEdit,
  onClose
}) => {
  const { animalId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(animal || null);

  // Mock data for demonstration - in real app, fetch from API
  useEffect(() => {
    if (!animal && animalId) {
      // Fetch animal by ID
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockAnimal: Animal = {
          id: animalId,
          animalID: 'CM-2025-015',
          name: 'Desert Star',
          species: 'CAMEL',
          sex: 'FEMALE',
          age: 5,
          dateOfBirth: '2020-03-15',
          registrationDate: '2025-01-15',
          breed: 'Dromedary',
          color: 'Light Brown',
          weight: 550,
          microchip: 'MC123456789012345',
          purpose: 'Breeding',
          status: 'ACTIVE',
          owner: 'Al-Majd Farm',
          roles: [
            {
              role: 'Donor',
              assignedAt: '2025-01-15T10:00:00Z',
              assignedBy: 'Dr. Sarah Ahmed',
              isActive: true,
              notes: 'Exceptional breeding stock'
            },
            {
              role: 'Reference',
              assignedAt: '2025-01-20T14:30:00Z',
              assignedBy: 'Research Team',
              isActive: true,
              notes: 'Genomic reference for camel breeding program'
            }
          ],
          currentInternalNumber: {
            id: 'int-015',
            internalNumber: 'INT-2025-0015',
            isActive: true,
            assignedDate: '2025-01-15'
          },
          internalNumberHistory: [
            {
              id: 'int-015',
              internalNumber: 'INT-2025-0015',
              assignedAt: '2025-01-15T10:00:00Z',
              assignedBy: 'System Admin',
              reason: 'Initial registration',
              isActive: true
            }
          ],
          customer: {
            name: 'Al-Majd Farm',
            customerID: 'CUS-001',
            region: 'Riyadh',
            contactNumber: '+966501234567',
            email: 'contact@almajd.com',
            category: 'Premium'
          },
          currentLocation: 'Breeding Facility A - Section 2',
          genomicData: {
            hasSNPData: true,
            hasSNPIndex: true,
            hasBeadChip: true,
            hasParentInfo: true,
            missingParents: false,
            snpCount: 45230,
            beadChipId: 'BC-015',
            fileSize: 2500000,
            qualityScore: 0.94,
            lastUpdated: '2025-01-10T15:30:00Z'
          },
          activityData: {
            hasUltrasound: true,
            hasEmbryoTransfer: false,
            hasBreeding: true,
            hasLabResults: true,
            hasVaccinations: true,
            hasPhenotype: true,
            hasInternalMedicine: false,
            hasFlushing: true,
            hasSemenCollection: false,
            totalRecords: 15,
            lastActivity: '2025-01-28T09:15:00Z'
          },
          workflowData: {
            currentWorkflow: {
              id: 'wf-001',
              name: 'Breeding Program Phase 2',
              step: 'Ovarian Assessment',
              progress: 65,
              nextAction: 'Schedule ultrasound examination',
              dueDate: '2025-02-05'
            },
            activeWorkflows: 2,
            completedWorkflows: 8,
            lastWorkflowUpdate: '2025-01-28T14:00:00Z'
          },
          notes: 'Exceptional breeding performance. High embryo quality consistently. Excellent temperament for handling.',
          images: ['/api/animals/CM-2025-015/image1.jpg', '/api/animals/CM-2025-015/image2.jpg'],
          qrCode: generateQRCode({} as Animal),
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-28T14:00:00Z'
        };
        setCurrentAnimal(mockAnimal);
        setLoading(false);
      }, 1000);
    }
  }, [animalId, animal]);

  const handleEdit = () => {
    if (currentAnimal && onEdit) {
      onEdit(currentAnimal);
    }
  };

  const handleGoBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/animals');
    }
  };

  const handleCopyAnimalID = () => {
    if (currentAnimal) {
      navigator.clipboard.writeText(currentAnimal.animalID);
      alert('Animal ID copied to clipboard');
    }
  };

  const handleDownloadQR = () => {
    if (currentAnimal) {
      const qrData = generateQRCode(currentAnimal);
      const blob = new Blob([qrData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentAnimal.animalID}_QR.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading animal profile...</p>
        </div>
      </div>
    );
  }

  if (!currentAnimal) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Animal Not Found</h2>
        <p className="text-gray-600 mb-4">The requested animal could not be found.</p>
        <Button onClick={handleGoBack} className="bg-blue-600 hover:bg-blue-700 text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Animals
        </Button>
      </div>
    );
  }

  const warnings = getAnimalWarnings(currentAnimal);
  const activeRoles = getActiveRoles(currentAnimal);
  const speciesConfig = SPECIES_CONFIG[currentAnimal.species];
  const statusConfig = STATUS_CONFIG[currentAnimal.status];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'reproduction', label: 'Reproduction', icon: Baby },
    { id: 'clinical', label: 'Clinical History', icon: TestTube },
    { id: 'workflow', label: 'Workflow Tracker', icon: Workflow },
    { id: 'genomic', label: 'Genomic Index', icon: Database },
    { id: 'biobank', label: 'Biobank Samples', icon: FlaskConical },
    { id: 'timeline', label: 'Timeline', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleGoBack}
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Animals
              </Button>
              
              <div className="h-8 w-px bg-gray-300" />
              
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-gray-900">{currentAnimal.name}</h1>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                    {statusConfig.icon} {currentAnimal.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <Hash className="h-4 w-4 mr-1" />
                    <button onClick={handleCopyAnimalID} className="hover:text-blue-600">
                      {currentAnimal.animalID}
                    </button>
                    <Copy className="h-3 w-3 ml-1 opacity-50" />
                  </div>
                  <div className="text-sm text-gray-600">
                    {speciesConfig.label}
                  </div>
                  {currentAnimal.currentInternalNumber && (
                    <div className="text-sm text-gray-600">
                      Internal: {currentAnimal.currentInternalNumber.internalNumber}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {warnings.length > 0 && (
                <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-md">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span className="text-sm">{warnings.length} warning{warnings.length > 1 ? 's' : ''}</span>
                </div>
              )}
              
              <Button onClick={handleDownloadQR} variant="outline">
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
              
              <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Animal Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
              {/* Animal Image */}
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mt-2">No image available</p>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Age</span>
                  <span className="text-sm font-medium">{currentAnimal.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sex</span>
                  <span className="text-sm font-medium">{currentAnimal.sex}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Breed</span>
                  <span className="text-sm font-medium">{currentAnimal.breed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Weight</span>
                  <span className="text-sm font-medium">{currentAnimal.weight} kg</span>
                </div>
              </div>

              {/* Active Roles */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Active Roles</h3>
                <div className="space-y-2">
                  {activeRoles.map((role, index) => {
                    const roleConfig = getRoleDisplayInfo(role.role);
                    return (
                      <div
                        key={index}
                        className={`inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium ${roleConfig.color} w-full`}
                      >
                        <span className="mr-2">{roleConfig.icon}</span>
                        {role.role}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Warnings */}
              {warnings.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Warnings</h3>
                  <div className="space-y-2">
                    {warnings.map((warning, index) => (
                      <div key={index} className="flex items-center text-xs text-amber-700 bg-amber-50 p-2 rounded">
                        <AlertTriangle className="h-3 w-3 mr-2 flex-shrink-0" />
                        {warning}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Workflow */}
              {currentAnimal.workflowData?.currentWorkflow && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Current Workflow</h3>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-blue-900">
                      {currentAnimal.workflowData.currentWorkflow.name}
                    </div>
                    <div className="text-xs text-blue-700 mt-1">
                      {currentAnimal.workflowData.currentWorkflow.step}
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-blue-700 mb-1">
                        <span>Progress</span>
                        <span>{currentAnimal.workflowData.currentWorkflow.progress}%</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${currentAnimal.workflowData.currentWorkflow.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm text-gray-600">Animal ID</label>
                          <p className="font-medium">{currentAnimal.animalID}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Name</label>
                          <p className="font-medium">{currentAnimal.name}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Species</label>
                          <p className="font-medium">{speciesConfig.label}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Breed</label>
                          <p className="font-medium">{currentAnimal.breed}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Sex</label>
                          <p className="font-medium">{currentAnimal.sex}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Age</label>
                          <p className="font-medium">{currentAnimal.age} years</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Date of Birth</label>
                          <p className="font-medium">{currentAnimal.dateOfBirth || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Registration Date</label>
                          <p className="font-medium">{currentAnimal.registrationDate}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Color</label>
                          <p className="font-medium">{currentAnimal.color}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Weight</label>
                          <p className="font-medium">{currentAnimal.weight} kg</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Microchip</label>
                          <p className="font-medium">{currentAnimal.microchip}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Purpose</label>
                          <p className="font-medium">{currentAnimal.purpose}</p>
                        </div>
                      </div>
                    </div>

                    {/* Customer Information */}
                    {currentAnimal.customer && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Owner Information</h3>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm text-gray-600">Customer Name</label>
                            <p className="font-medium">{currentAnimal.customer.name}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Customer ID</label>
                            <p className="font-medium">{currentAnimal.customer.customerID}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Region</label>
                            <p className="font-medium">{currentAnimal.customer.region}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Category</label>
                            <p className="font-medium">{currentAnimal.customer.category}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Contact</label>
                            <p className="font-medium">{currentAnimal.customer.contactNumber}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Email</label>
                            <p className="font-medium">{currentAnimal.customer.email}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {currentAnimal.notes && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{currentAnimal.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reproduction' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Reproduction History</h3>
                    <div className="text-center py-12">
                      <Baby className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Reproduction data integration coming soon</p>
                      <p className="text-sm text-gray-400 mt-2">
                        This will show flushing, embryo transfer, breeding records, and pregnancy monitoring
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'clinical' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Clinical History</h3>
                    <div className="text-center py-12">
                      <TestTube className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Clinical data integration coming soon</p>
                      <p className="text-sm text-gray-400 mt-2">
                        This will show ultrasound, lab results, vaccinations, and medical history
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'workflow' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Workflow Tracker</h3>
                    <div className="text-center py-12">
                      <Workflow className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Workflow integration coming soon</p>
                      <p className="text-sm text-gray-400 mt-2">
                        This will show active workflows, completed tasks, and upcoming actions
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'genomic' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Genomic Index</h3>
                    {currentAnimal.genomicData ? (
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-green-700">SNP Data</span>
                            {currentAnimal.genomicData.hasSNPData ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          {currentAnimal.genomicData.hasSNPData && (
                            <div className="mt-2">
                              <p className="text-lg font-bold text-green-900">
                                {currentAnimal.genomicData.snpCount.toLocaleString()}
                              </p>
                              <p className="text-xs text-green-700">SNP markers</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-700">BeadChip</span>
                            {currentAnimal.genomicData.hasBeadChip ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          {currentAnimal.genomicData.beadChipId && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-blue-900">
                                {currentAnimal.genomicData.beadChipId}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-purple-700">Quality Score</span>
                          </div>
                          {currentAnimal.genomicData.qualityScore && (
                            <div className="mt-2">
                              <p className="text-lg font-bold text-purple-900">
                                {(currentAnimal.genomicData.qualityScore * 100).toFixed(1)}%
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="bg-orange-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-orange-700">Parent Info</span>
                            {currentAnimal.genomicData.hasParentInfo ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          {currentAnimal.genomicData.missingParents && (
                            <div className="mt-2">
                              <p className="text-xs text-orange-700">Some parent data missing</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Database className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No genomic data available</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'biobank' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Biobank Samples</h3>
                    <div className="text-center py-12">
                      <FlaskConical className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Biobank integration coming soon</p>
                      <p className="text-sm text-gray-400 mt-2">
                        This will show tissue samples, DNA extracts, and storage information
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Internal Number Timeline</h3>
                    <div className="space-y-4">
                      {currentAnimal.internalNumberHistory.map((record, index) => (
                        <div key={record.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className={`w-3 h-3 rounded-full mt-2 ${record.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-sm font-medium">{record.internalNumber}</span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                record.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {record.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Assigned by {record.assignedBy} on {new Date(record.assignedAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{record.reason}</div>
                            {record.endedAt && (
                              <div className="text-xs text-gray-500 mt-1">
                                Ended on {new Date(record.endedAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 