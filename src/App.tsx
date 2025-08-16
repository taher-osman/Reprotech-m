import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { ToastProvider } from './components/ui/Toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Dashboard modules
import { AnalyticsDashboardPage } from './modules/analytics-dashboard/pages/AnalyticsDashboardPage';
import { RealtimeMonitoringPage } from './modules/realtime-monitoring/pages/RealtimeMonitoringPage';

// Animal Management modules
import { AnimalsPage } from './modules/animals/pages/AnimalsPage';
import { PhenotypePage } from './modules/phenotype/pages/PhenotypePage';
import UltrasoundPage from './modules/ultrasound/pages/UltrasoundPage';
import VaccinationsPage from './modules/vaccinations/pages/VaccinationsPage';

// Reproduction modules
import IntegrationHubPage from './modules/integration-hub/pages/IntegrationHubPage';
import { BreedingPage } from './modules/breeding/pages/BreedingPage';
import OPUPage from './modules/opu/pages/OPUPage';
import EmbryoDetailPage from './modules/embryo-detail/pages/EmbryoDetailPage';
import { FlushingPage } from './modules/flushing/pages/FlushingPage';
import { EmbryoTransferPage } from './modules/embryo-transfer/pages/EmbryoTransferPage';
import TransferDetailPage from './modules/embryo-transfer/pages/TransferDetailPage';
import { SemenManagementPage } from './modules/semen-management/pages/SemenManagementPage';
import FertilizationPage from './modules/fertilization/pages/FertilizationPage';

// Clinical & Lab modules
import { InternalMedicinePage } from './modules/internal-medicine/pages/InternalMedicinePage';
import { ClinicalManagementPage } from './modules/clinical-management/pages/ClinicalManagementPage';
import ReproductionHubPage from './modules/reproduction-hub/pages/ReproductionHubPage';
import { ClinicalSchedulingPage } from './modules/clinical-scheduling/pages/ClinicalSchedulingPage';
import { LaboratoryPage } from './modules/laboratory/pages/LaboratoryPage';
import { LabResultsPage } from './modules/lab-results/pages/LabResultsPage';
import MediaPreparationPage from './modules/media-preparation/pages/MediaPreparationPage';

// Genomics & Intelligence modules
import AIAnalyticsPage from './modules/ai-analytics/pages/AIAnalyticsPage';
import SNPAnalysisPage from './modules/snp-analysis/pages/SNPAnalysisPage';
import { BeadChipMappingsPage } from './modules/beadchip-mappings/pages/BeadChipMappingsPage';
import GenomicIntelligencePage from './modules/genomic-intelligence/pages/GenomicIntelligencePage';
import DataIntegrationPage from './modules/data-integration/pages/DataIntegrationPage';

// Research & Studies modules
import ResearchPage from './modules/research/pages/ResearchPage';

// Customer & CRM modules
import { CustomersPage } from './modules/customers/pages/CustomersPage';
import CalendarPage from './modules/calendar/pages/CalendarPage';

// Finance & Cost Centers modules
import FinancePage from './modules/finance/pages/FinancePage';

// Biobank & Samples modules
import { SampleManagementPage } from './modules/sample-management/pages/SampleManagementPage';
import { BiobankPage } from './modules/biobank/pages/BiobankPage';

// Inventory Management modules
import { InventoryPage } from './modules/inventory/pages/InventoryPage';
import { ModuleIntegrationPage } from './modules/module-integration/pages/ModuleIntegrationPage';
import { BiobankIntegrationPage } from './modules/biobank-integration/pages/BiobankIntegrationPage';
import { ProcurementManagementPage } from './modules/procurement-management/pages/ProcurementManagementPage';
import { InventoryAnalyticsPage } from './modules/inventory-analytics/pages/InventoryAnalyticsPage';

// Human Resources modules
import HumanResourcesPage from './modules/human-resources/pages/HumanResourcesPage';

// Tender Management modules
import TenderManagementPage from './modules/tender-management/pages/TenderManagementPage';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <ProtectedRoute>
            <MainLayout>
              <Routes>
          {/* Default route - redirect to analytics dashboard */}
          <Route path="/" element={<Navigate to="/modules/analytics-dashboard" replace />} />
          
          {/* Dashboard Routes */}
          <Route path="/modules/analytics-dashboard" element={<AnalyticsDashboardPage />} />
          <Route path="/modules/realtime-monitoring" element={<RealtimeMonitoringPage />} />
          
          {/* Animal Management Routes */}
          <Route path="/modules/animals" element={<AnimalsPage />} />
          <Route path="/modules/phenotype" element={<PhenotypePage />} />
          <Route path="/modules/ultrasound" element={<UltrasoundPage />} />
          <Route path="/modules/vaccinations" element={<VaccinationsPage />} />
          
          {/* Reproduction Routes */}
          <Route path="/modules/integration-hub" element={<IntegrationHubPage />} />
          <Route path="/modules/breeding" element={<BreedingPage />} />
          <Route path="/modules/opu" element={<OPUPage />} />
          <Route path="/modules/embryo-detail" element={<EmbryoDetailPage />} />
          <Route path="/modules/flushing" element={<FlushingPage />} />
          <Route path="/modules/embryo-transfer" element={<EmbryoTransferPage />} />
          <Route path="/modules/embryo-transfer/transfer/:transferId" element={<TransferDetailPage />} />
          <Route path="/modules/semen-management" element={<SemenManagementPage />} />
          <Route path="/modules/fertilization" element={<FertilizationPage />} />
          
          {/* Clinical & Lab Routes */}
          <Route path="/modules/internal-medicine" element={<InternalMedicinePage />} />
          <Route path="/modules/clinical-management" element={<ClinicalManagementPage />} />
          <Route path="/modules/reproduction-hub" element={<ReproductionHubPage />} />
          <Route path="/modules/clinical-scheduling" element={<ClinicalSchedulingPage />} />
          <Route path="/modules/laboratory" element={<LaboratoryPage />} />
          <Route path="/modules/lab-results" element={<LabResultsPage />} />
          <Route path="/modules/media-preparation" element={<MediaPreparationPage />} />
          
          {/* Genomics & Intelligence Routes */}
          <Route path="/modules/ai-analytics" element={<AIAnalyticsPage />} />
          <Route path="/modules/snp-analysis" element={<SNPAnalysisPage />} />
          <Route path="/modules/beadchip-mappings" element={<BeadChipMappingsPage />} />
          <Route path="/modules/genomic-intelligence" element={<GenomicIntelligencePage />} />
          <Route path="/modules/data-integration" element={<DataIntegrationPage />} />
          
          {/* Research & Studies Routes */}
          <Route path="/modules/research" element={<ResearchPage />} />
          
          {/* Customer & CRM Routes */}
          <Route path="/modules/customers" element={<CustomersPage />} />
          <Route path="/modules/calendar" element={<CalendarPage />} />
          
          {/* Finance & Cost Centers Routes */}
          <Route path="/modules/finance" element={<FinancePage />} />
          
          {/* Biobank & Samples Routes */}
          <Route path="/modules/sample-management" element={<SampleManagementPage />} />
          <Route path="/modules/biobank" element={<BiobankPage />} />
          
          {/* Inventory Management Routes */}
          <Route path="/modules/inventory" element={<InventoryPage />} />
          <Route path="/modules/module-integration" element={<ModuleIntegrationPage />} />
          <Route path="/modules/biobank-integration" element={<BiobankIntegrationPage />} />
          <Route path="/modules/procurement-management" element={<ProcurementManagementPage />} />
          <Route path="/modules/inventory-analytics" element={<InventoryAnalyticsPage />} />
          
          {/* Human Resources Routes */}
          <Route path="/modules/human-resources" element={<HumanResourcesPage />} />
          
          {/* Tender Management Routes */}
          <Route path="/modules/tender-management" element={<TenderManagementPage />} />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/modules/analytics-dashboard" replace />} />
        </Routes>
      </MainLayout>
          </ProtectedRoute>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
