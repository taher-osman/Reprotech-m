import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Simple placeholder components for testing
function Dashboard() {
  const { user, logout } = useAuth();
  
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Analytics Dashboard</h2>
        <div>
          <span style={{ marginRight: '10px' }}>Welcome, {user?.username}!</span>
          <button onClick={logout} style={{ padding: '5px 10px' }}>Logout</button>
        </div>
      </div>
      <p>Welcome to the Reprotech Analytics Dashboard</p>
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h3>Quick Stats</h3>
        <ul>
          <li>Total Animals: 1,247</li>
          <li>Active Customers: 89</li>
          <li>Pending Lab Results: 23</li>
          <li>Today's Appointments: 7</li>
        </ul>
      </div>
    </div>
  );
}

function Animals() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Animal Management</h2>
      <p>Manage your animal records here</p>
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h3>Recent Animals</h3>
        <ul>
          <li>Holstein Cow #1247 - Last updated: Today</li>
          <li>Jersey Bull #0892 - Last updated: Yesterday</li>
          <li>Angus Heifer #1156 - Last updated: 2 days ago</li>
        </ul>
      </div>
    </div>
  );
}

function Customers() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Customer Management</h2>
      <p>Manage your customer relationships</p>
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h3>Recent Customers</h3>
        <ul>
          <li>Green Valley Farm - Last contact: Today</li>
          <li>Sunrise Ranch - Last contact: 3 days ago</li>
          <li>Mountain View Dairy - Last contact: 1 week ago</li>
        </ul>
      </div>
    </div>
  );
}

function LoginForm() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { login, error, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      await login(username, password);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Sign in to Reprotech</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          Biotechnology Management Platform
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div style={{ 
              color: '#dc3545', 
              textAlign: 'center', 
              marginBottom: '20px',
              padding: '10px',
              backgroundColor: '#f8d7da',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !username || !password}
            style={{ 
              width: '100%', 
              padding: '12px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              fontSize: '16px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
          Demo credentials: admin / admin123
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <>{children}</>;
}

function MainApp() {
  return (
    <Router>
      <ProtectedRoute>
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
      </ProtectedRoute>
    </Router>
  );
}

function AppWithAuth() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default AppWithAuth;

