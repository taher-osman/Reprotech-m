import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';

// Import page components (all working)
import DashboardPage from './pages/DashboardPage';
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

// Testing all confirmed working module components (including new SimpleClinicalSchedulingPage)
import EmbryoTransferPage from './modules/embryo-transfer/pages/EmbryoTransferPage';
import SemenManagementPage from './modules/semen-management/pages/SemenManagementPage';
import FertilizationPage from './modules/fertilization/pages/FertilizationPage';
import ReproductionHubPage from './modules/reproduction-hub/pages/ReproductionHubPage';
import SimpleMediaPreparationPage from './modules/media-preparation/pages/SimpleMediaPreparationPage';
import SimpleLaboratoryPage from './modules/laboratory/pages/SimpleLaboratoryPage';
import SimpleLabResultsPage from './modules/lab-results/pages/SimpleLabResultsPage';
import SimpleClinicalSchedulingPage from './modules/clinical-scheduling/pages/SimpleClinicalSchedulingPage';
import SimpleInternalMedicinePage from './modules/internal-medicine/pages/SimpleInternalMedicinePage';
import SimpleClinicalManagementPage from './modules/clinical-management/pages/SimpleClinicalManagementPage';
import EnhancedBreedingPage from './modules/breeding/pages/EnhancedBreedingPage';
import EnhancedEmbryoTransferPage from './modules/embryo-transfer/pages/EnhancedEmbryoTransferPage';
import EnhancedUltrasoundPage from './modules/ultrasound/pages/EnhancedUltrasoundPage';
import AdvancedGenomicsPage from './modules/genomics/pages/AdvancedGenomicsPage';

function AppIncrementalTest() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/animals" element={<AnimalsDatabasePage />} />
          <Route path="/animals/add" element={<AddAnimalPage />} />
          <Route path="/animals/:id" element={<AnimalDetailPage />} />
          <Route path="/animals/phenotype" element={<PhenotypeAnalysisPage />} />
          <Route path="/animals/vaccinations" element={<VaccinationsPage />} />
          <Route path="/reproduction" element={<ReproductionPage />} />
          <Route path="/reproduction/breeding" element={<BreedingPage />} />
          <Route path="/reproduction/opu" element={<OPUPage />} />
          <Route path="/reproduction/embryos/:id" element={<EmbryoDetailPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/ultrasound" element={<UltrasoundPage />} />
          <Route path="/flushing" element={<FlushingPage />} />
          <Route path="/clinical" element={<ClinicalPage />} />
          <Route path="/clinical/internal-medicine" element={<InternalMedicinePage />} />
          <Route path="/laboratory/results" element={<LaboratoryResultsPage />} />
          <Route path="/genomics" element={<GenomicsPage />} />
          <Route path="/genomics/advanced" element={<GenomicsAdvancedPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/advanced" element={<CustomersAdvancedPage />} />
          <Route path="/branches" element={<BranchManagementPage />} />
          
          {/* Testing all confirmed working components */}
          <Route path="/modules/embryo-transfer" element={<EmbryoTransferPage />} />
          <Route path="/modules/semen-management" element={<SemenManagementPage />} />
          <Route path="/modules/fertilization" element={<FertilizationPage />} />
          <Route path="/modules/reproduction-hub" element={<ReproductionHubPage />} />
          <Route path="/modules/media-preparation" element={<SimpleMediaPreparationPage />} />
          <Route path="/modules/laboratory" element={<SimpleLaboratoryPage />} />
          <Route path="/modules/lab-results" element={<SimpleLabResultsPage />} />
          <Route path="/modules/clinical-scheduling" element={<SimpleClinicalSchedulingPage />} />
          <Route path="/modules/internal-medicine" element={<SimpleInternalMedicinePage />} />
          <Route path="/modules/clinical-management" element={<SimpleClinicalManagementPage />} />
          <Route path="/modules/enhanced-breeding" element={<EnhancedBreedingPage />} />
          <Route path="/modules/enhanced-embryo-transfer" element={<EnhancedEmbryoTransferPage />} />
          <Route path="/modules/enhanced-ultrasound" element={<EnhancedUltrasoundPage />} />
          <Route path="/modules/advanced-genomics" element={<AdvancedGenomicsPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default AppIncrementalTest;