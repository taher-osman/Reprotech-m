import React, { useState, useEffect } from 'react';
import { 
  Atom, 
  Target, 
  Brain, 
  Users, 
  Zap, 
  Activity,
  BarChart3,
  ChevronRight,
  Sparkles,
  Microscope,
  TreePine,
  AlertTriangle,
  Heart,
  GitBranch
} from 'lucide-react';
import SNPPanelBuilder from '../components/SNPPanelBuilder';
import ParentFinder from '../components/ParentFinder';
import KinshipAnalysis from '../components/KinshipAnalysis';
import SNPPanelDatasets from '../components/SNPPanelDatasets';
import PopulationPCA from '../components/PopulationPCA';
import GWASAnalysis from '../components/GWASAnalysis';
import QualityControl from '../components/QualityControl';
import GenomicPrediction from '../components/GenomicPrediction';
import FamilyTreeVisualization from '../components/FamilyTreeVisualization';
import InbreedingAnalysis from '../components/InbreedingAnalysis';
import BreedingOptimization from '../components/BreedingOptimization';
import AIGenomicModel from '../components/AIGenomicModel';

const GenomicIntelligencePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('panel-builder');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSNPs: 0,
    totalAnimals: 0,
    totalPanels: 0,
    species: []
  });

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        // Use mock data instead of API call
        const mockStats = {
          totalSNPs: 145000,
          totalAnimals: 2847,
          totalPanels: 12,
          species: ['BOVINE', 'OVINE', 'CAPRINE', 'EQUINE', 'CAMEL']
        };
        
        setStats(mockStats);
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardStats();
  }, []);

  const moduleFeatures = [
    {
      icon: <Target className="h-5 w-5" />,
      title: "SNP Panel Builder",
      description: "Create custom reference panels with advanced filtering",
      tab: "panel-builder",
      status: "Available",
      color: "bg-blue-500"
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "SNP Panel Datasets",
      description: "Manage pre-filtered datasets for efficient analysis",
      tab: "datasets",
      status: "Available",
      color: "bg-teal-500"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Parent Finder AI",
      description: "AI-powered parentage assignment and verification",
      tab: "parent-finder",
      status: "Available",
      color: "bg-purple-500"
    },
    {
      icon: <Activity className="h-5 w-5" />,
      title: "Kinship Analysis",
      description: "Relationship matrix and population structure",
      tab: "kinship",
      status: "Available",
      color: "bg-green-500"
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Population PCA",
      description: "Principal component analysis for genetic diversity",
      tab: "pca",
      status: "Available",
      color: "bg-orange-500"
    },
    {
      icon: <Brain className="h-5 w-5" />,
      title: "Genomic Prediction",
      description: "Machine learning for trait prediction",
      tab: "prediction",
      status: "Available",
      color: "bg-red-500"
    },
    {
      icon: <Microscope className="h-5 w-5" />,
      title: "GWAS Analysis",
      description: "Genome-wide association studies",
      tab: "gwas",
      status: "Available",
      color: "bg-indigo-500"
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Quality Control",
      description: "SNP data quality assessment and filtering",
      tab: "quality-control",
      status: "Available",
      color: "bg-pink-500"
    },
    {
      icon: <TreePine className="h-5 w-5" />,
      title: "Family Tree Visualization",
      description: "Interactive pedigree charts and lineage analysis",
      tab: "family-tree",
      status: "Available",
      color: "bg-green-600"
    },
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      title: "Inbreeding Analysis",
      description: "Comprehensive inbreeding assessment and health impact",
      tab: "inbreeding",
      status: "Available",
      color: "bg-orange-600"
    },
    {
      icon: <Heart className="h-5 w-5" />,
      title: "Breeding Optimization",
      description: "AI-powered mate selection and breeding strategies",
      tab: "breeding-optimization",
      status: "Available",
      color: "bg-red-600"
    },
    {
      icon: <Brain className="h-5 w-5" />,
      title: "AI Genomic Model",
      description: "Advanced machine learning models for genomic analysis",
      tab: "ai-model",
      status: "Available",
      color: "bg-purple-600"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Atom className="h-8 w-8 text-blue-600" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              🧬 Genomic Intelligence Platform
            </h1>
            <p className="text-gray-600">
              Advanced genomic analysis and AI-powered insights for livestock breeding
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 rounded-lg p-4 border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Atom className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600">Available Species</p>
                <p className="text-2xl font-bold text-blue-900">
                  {stats.species.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 rounded-lg p-4 border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600">SNP Panels</p>
                <p className="text-2xl font-bold text-green-900">
                  {stats.totalPanels}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 rounded-lg p-4 border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600">Animals</p>
                <p className="text-2xl font-bold text-purple-900">
                  {stats.totalAnimals}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 rounded-lg p-4 border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-600">AI Models</p>
                <p className="text-2xl font-bold text-orange-900">
                  Coming Soon
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Species */}
        {stats.species.length > 0 && (
          <div className="bg-white rounded-lg shadow border p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Atom className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Available Species for Analysis</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.species.map((species: string) => (
                <span 
                  key={species} 
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {species}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Module Features Grid */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Zap className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Available Analysis Modules</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Comprehensive genomic analysis tools for livestock breeding optimization
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {moduleFeatures.map((feature) => (
            <div 
              key={feature.tab}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 p-4 rounded-lg border ${
                activeTab === feature.tab ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'
              } ${feature.status === 'Coming Soon' ? 'opacity-75' : ''}`}
              onClick={() => feature.status === 'Available' && setActiveTab(feature.tab)}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${feature.color} ${feature.status === 'Coming Soon' ? 'opacity-50' : ''}`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {feature.title}
                    </h4>
                    <span 
                      className={`px-2 py-1 text-xs rounded-full ${
                        feature.status === 'Available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {feature.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {feature.description}
                  </p>
                  {feature.status === 'Available' && (
                    <div className="flex items-center space-x-1 text-blue-600 text-sm">
                      <span>Launch Module</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('panel-builder')}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'panel-builder'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Target className="h-4 w-4" />
            <span>SNP Panel Builder</span>
          </button>
          <button
            onClick={() => setActiveTab('datasets')}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'datasets'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Datasets</span>
          </button>
          <button
            onClick={() => setActiveTab('parent-finder')}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'parent-finder'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Parent Finder</span>
          </button>
          <button
            onClick={() => setActiveTab('kinship')}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'kinship'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Kinship</span>
          </button>
          <button
            onClick={() => setActiveTab('pca')}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'pca'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>PCA</span>
          </button>
          <button
            onClick={() => setActiveTab('prediction')}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'prediction'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Brain className="h-4 w-4" />
            <span>Prediction</span>
          </button>
          <button
            onClick={() => setActiveTab('gwas')}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'gwas'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Microscope className="h-4 w-4" />
            <span>GWAS</span>
          </button>
          <button
            onClick={() => setActiveTab('quality-control')}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'quality-control'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Quality Control</span>
          </button>
          <button
            onClick={() => setActiveTab('family-tree')}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'family-tree'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <TreePine className="h-4 w-4" />
            <span>Family Tree</span>
          </button>
          <button
            onClick={() => setActiveTab('inbreeding')}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'inbreeding'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Inbreeding</span>
          </button>
          <button
            onClick={() => setActiveTab('breeding-optimization')}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'breeding-optimization'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Heart className="h-4 w-4" />
            <span>Breeding Optimization</span>
          </button>
          <button
            onClick={() => setActiveTab('ai-model')}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'ai-model'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Brain className="h-4 w-4" />
            <span>AI Model</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'panel-builder' && (
          <SNPPanelBuilder />
        )}

        {activeTab === 'datasets' && (
          <SNPPanelDatasets />
        )}

        {activeTab === 'parent-finder' && (
          <ParentFinder />
        )}

        {activeTab === 'kinship' && (
          <KinshipAnalysis />
        )}

        {activeTab === 'pca' && (
          <PopulationPCA />
        )}

        {activeTab === 'prediction' && (
          <GenomicPrediction />
        )}

        {activeTab === 'gwas' && (
          <GWASAnalysis />
        )}

        {activeTab === 'quality-control' && (
          <QualityControl />
        )}

        {activeTab === 'family-tree' && (
          <FamilyTreeVisualization />
        )}

        {activeTab === 'inbreeding' && (
          <InbreedingAnalysis />
        )}

        {activeTab === 'breeding-optimization' && (
          <BreedingOptimization />
        )}

        {activeTab === 'ai-model' && (
          <AIGenomicModel />
        )}
      </div>
    </div>
  );
};

export default GenomicIntelligencePage; 