import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';

// Import page components (all working)
import DashboardPage from './pages/DashboardPage';
import AnimalsDatabasePage from './pages/animals/AnimalsDatabasePage';

// Testing just ONE module import at a time
import EmbryoTransferPage from './modules/embryo-transfer/pages/EmbryoTransferPage';

function AppSingleTest() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/animals" element={<AnimalsDatabasePage />} />
          <Route path="/modules/embryo-transfer" element={<EmbryoTransferPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default AppSingleTest;

