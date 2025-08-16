import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import AnimalsDatabasePage from './pages/animals/AnimalsDatabasePage';

function AppProgressive() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/animals" element={<AnimalsDatabasePage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default AppProgressive;

