import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

// Simple placeholder components for testing
function Dashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Analytics Dashboard</h2>
      <p>Welcome to the Reprotech Analytics Dashboard</p>
    </div>
  );
}

function Animals() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Animal Management</h2>
      <p>Manage your animal records here</p>
    </div>
  );
}

function Customers() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Customer Management</h2>
      <p>Manage your customer relationships</p>
    </div>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Simple Navigation */}
        <nav style={{ 
          padding: '20px', 
          backgroundColor: '#f5f5f5', 
          borderBottom: '1px solid #ddd',
          marginBottom: '20px'
        }}>
          <h1 style={{ margin: '0 0 10px 0' }}>Reprotech - Biotechnology Management Platform</h1>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: '#007bff' }}>Dashboard</Link>
            <Link to="/animals" style={{ textDecoration: 'none', color: '#007bff' }}>Animals</Link>
            <Link to="/customers" style={{ textDecoration: 'none', color: '#007bff' }}>Customers</Link>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/animals" element={<Animals />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default AppWithRouter;

