import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';

// Import page components (will create these)
import DashboardPage from './pages/DashboardPage';
import AnimalsPage from './pages/animals/AnimalsPage';
import AnimalsDatabasePage from './pages/animals/AnimalsDatabasePage';
import AddAnimalPage from './pages/animals/AddAnimalPage';
import AnimalDetailPage from './pages/animals/AnimalDetailPage';
import PhenotypeAnalysisPage from './pages/animals/PhenotypeAnalysisPage';
import VaccinationsPage from './pages/animals/VaccinationsPage';
import ReproductionPage from './pages/reproduction/ReproductionPage';
import BreedingPage from './pages/reproduction/BreedingPage';
import OPUPage from './pages/reproduction/OPUPage';
import EmbryoDetailPage from './pages/reproduction/EmbryoDetailPage';
import CalendarPage from './modules/calendar/pages/CalendarPage';
import UltrasoundPage from './modules/ultrasound/pages/UltrasoundPage';
import { FlushingPage } from './modules/flushing/pages/FlushingPage';
import ClinicalPage from './pages/clinical/ClinicalPage';
import InternalMedicinePage from './pages/clinical/InternalMedicinePage';
import LaboratoryResultsPage from './pages/laboratory/LaboratoryResultsPage';
import GenomicsPage from './pages/genomics/GenomicsPage';
import GenomicsAdvancedPage from './pages/genomics/GenomicsAdvancedPage';
import CustomersPage from './pages/customers/CustomersPage';
import CustomersAdvancedPage from './pages/customers/CustomersAdvancedPage';
import BranchManagementPage from './pages/branches/BranchManagementPage';

// Import all module components
import EmbryoTransferPage from './modules/embryo-transfer/pages/EmbryoTransferPage';
import TransferDetailPage from './modules/embryo-transfer/pages/TransferDetailPage';
import SemenManagementPage from './modules/semen-management/pages/SemenManagementPage';
import FertilizationPage from './modules/fertilization/pages/FertilizationPage';
import ReproductionHubPage from './modules/reproduction-hub/pages/ReproductionHubPage';
import MediaPreparationPage from './modules/media-preparation/pages/MediaPreparationPage';
import GenomicIntelligencePage from './modules/genomic-intelligence/pages/GenomicIntelligencePage';
import SNPAnalysisPage from './modules/snp-analysis/pages/SNPAnalysisPage';
import BeadChipMappingsPage from './modules/beadchip-mappings/pages/BeadChipMappingsPage';
import ClinicalHubPage from './modules/clinical-hub/pages/ClinicalHubPage';
import ClinicalManagementPage from './modules/clinical-management/pages/ClinicalManagementPage';
import ClinicalSchedulingPage from './modules/clinical-scheduling/pages/ClinicalSchedulingPage';
import LabWorkflowPage from './modules/laboratory/pages/LabWorkflowPage';
import FinancePage from './modules/finance/pages/FinancePage';
import InventoryPage from './modules/inventory/pages/InventoryPage';
import InventoryAnalyticsPage from './modules/inventory-analytics/pages/InventoryAnalyticsPage';
import HumanResourcesPage from './modules/human-resources/pages/HumanResourcesPage';
import TenderManagementPage from './modules/tender-management/pages/TenderManagementPage';
import ProcurementManagementPage from './modules/procurement-management/pages/ProcurementManagementPage';
import ResearchPage from './modules/research/pages/ResearchPage';
import BiobankPage from './modules/biobank/pages/BiobankPage';
import BiobankIntegrationPage from './modules/biobank-integration/pages/BiobankIntegrationPage';
import SampleManagementPage from './modules/sample-management/pages/SampleManagementPage';
import AIAnalyticsPage from './modules/ai-analytics/pages/AIAnalyticsPage';
import DataIntegrationPage from './modules/data-integration/pages/DataIntegrationPage';

function AppComplete() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Dashboard Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Animal Management Routes */}
          <Route path="/animals" element={<AnimalsPage />} />
          <Route path="/animals/database" element={<AnimalsDatabasePage />} />
          <Route path="/animals/new" element={<AddAnimalPage />} />
          <Route path="/animals/:id" element={<AnimalDetailPage />} />
          <Route path="/animals/phenotype" element={<PhenotypeAnalysisPage />} />
          <Route path="/animals/vaccinations" element={<VaccinationsPage />} />
          
          {/* Reproduction Routes */}
          <Route path="/reproduction" element={<ReproductionPage />} />
          <Route path="/reproduction/*" element={<ReproductionPage />} />
          <Route path="/modules/breeding" element={<BreedingPage />} />
          <Route path="/modules/opu" element={<OPUPage />} />
          <Route path="/modules/embryo-detail" element={<EmbryoDetailPage />} />
          <Route path="/modules/calendar" element={<CalendarPage />} />
          <Route path="/modules/ultrasound" element={<UltrasoundPage />} />
          <Route path="/modules/flushing" element={<FlushingPage />} />
          <Route path="/modules/embryo-transfer" element={<EmbryoTransferPage />} />
          <Route path="/modules/transfer-detail" element={<TransferDetailPage />} />
          <Route path="/modules/semen-management" element={<SemenManagementPage />} />
          <Route path="/modules/fertilization" element={<FertilizationPage />} />
          <Route path="/modules/reproduction-hub" element={<ReproductionHubPage />} />
          <Route path="/modules/media-preparation" element={<MediaPreparationPage />} />
          
          {/* Clinical & Lab Routes */}
          <Route path="/clinical" element={<ClinicalPage />} />
          <Route path="/clinical/*" element={<ClinicalPage />} />
          <Route path="/modules/internal-medicine" element={<InternalMedicinePage />} />
          <Route path="/modules/lab-results" element={<LaboratoryResultsPage />} />
          <Route path="/modules/laboratory-results" element={<LaboratoryResultsPage />} />
          <Route path="/modules/clinical-management" element={<ClinicalManagementPage />} />
          <Route path="/modules/clinical-scheduling" element={<ClinicalSchedulingPage />} />
          <Route path="/modules/laboratory" element={<LaboratoryResultsPage />} />
          <Route path="/modules/clinical-hub" element={<ClinicalHubPage />} />
          <Route path="/modules/lab-workflow" element={<LabWorkflowPage />} />
          
          {/* Genomics Routes */}
          <Route path="/genomics" element={<GenomicsPage />} />
          <Route path="/genomics/*" element={<GenomicsPage />} />
          <Route path="/modules/genomics-advanced" element={<GenomicsAdvancedPage />} />
          <Route path="/modules/ai-analytics" element={<AIAnalyticsPage />} />
          <Route path="/modules/snp-analysis" element={<SNPAnalysisPage />} />
          <Route path="/modules/beadchip-mappings" element={<BeadChipMappingsPage />} />
          <Route path="/modules/genomic-intelligence" element={<GenomicIntelligencePage />} />
          <Route path="/modules/data-integration" element={<DataIntegrationPage />} />
          
          {/* Research & Studies Routes */}
          <Route path="/modules/research" element={<ResearchPage />} />
          <Route path="/modules/biobank" element={<BiobankPage />} />
          <Route path="/modules/biobank-integration" element={<BiobankIntegrationPage />} />
          <Route path="/modules/sample-management" element={<SampleManagementPage />} />
          
          {/* Business & Operations Routes */}
          <Route path="/modules/finance" element={<FinancePage />} />
          <Route path="/modules/inventory" element={<InventoryPage />} />
          <Route path="/modules/inventory-analytics" element={<InventoryAnalyticsPage />} />
          <Route path="/modules/human-resources" element={<HumanResourcesPage />} />
          <Route path="/modules/tender-management" element={<TenderManagementPage />} />
          <Route path="/modules/procurement-management" element={<ProcurementManagementPage />} />
          
          {/* Customer Routes */}
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/*" element={<CustomersPage />} />
          <Route path="/modules/customers-advanced" element={<CustomersAdvancedPage />} />
          
          {/* Branch Management Routes */}
          <Route path="/branches" element={<BranchManagementPage />} />
          <Route path="/modules/branch-management" element={<BranchManagementPage />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default AppComplete;

