import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';

// Import page components (first half only)
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

// Commenting out second half of imports for testing
// import EmbryoTransferPage from './modules/embryo-transfer/pages/EmbryoTransferPage';
// ... (other module imports)

function AppHalfTest() {
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
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default AppHalfTest;

