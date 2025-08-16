import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { apiService } from './services/api';

// Demo Dashboard with real backend data
function Dashboard() {
  const [stats, setStats] = useState({
    totalAnimals: 0,
    activeCustomers: 0,
    pendingTests: 0,
    todayAppointments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Try to fetch real data from backend
        const [animals, customers] = await Promise.all([
          apiService.getAnimals().catch(() => ({ data: [] })),
          apiService.getCustomers().catch(() => ({ data: [] }))
        ]);
        
        setStats({
          totalAnimals: animals.data?.length || 1247,
          activeCustomers: customers.data?.length || 89,
          pendingTests: 23,
          todayAppointments: 7
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Use demo data if backend fails
        setStats({
          totalAnimals: 1247,
          activeCustomers: 89,
          pendingTests: 23,
          todayAppointments: 7
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Analytics Dashboard</h2>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Welcome to Reprotech! (Demo Mode)
        </div>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Total Animals</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
            {stats.totalAnimals.toLocaleString()}
          </div>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Active Customers</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
            {stats.activeCustomers}
          </div>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Pending Lab Results</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>
            {stats.pendingTests}
          </div>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Today's Appointments</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>
            {stats.todayAppointments}
          </div>
        </div>
      </div>

      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h3>Recent Activity</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #dee2e6' }}>
            🐄 Holstein Cow #1247 - Health check completed
          </li>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #dee2e6' }}>
            🧬 Genomic analysis started for Bull #0892
          </li>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #dee2e6' }}>
            📋 New customer registration: Mountain View Dairy
          </li>
          <li style={{ padding: '10px 0' }}>
            🔬 Lab results ready for sample #LB-2024-001
          </li>
        </ul>
      </div>
    </div>
  );
}

// Animals Management with backend integration
function Animals() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await apiService.getAnimals();
        setAnimals(response.data || []);
      } catch (error) {
        console.error('Error fetching animals:', error);
        // Use demo data if backend fails
        setAnimals([
          { id: 1, name: 'Holstein Cow #1247', breed: 'Holstein', status: 'Active' },
          { id: 2, name: 'Jersey Bull #0892', breed: 'Jersey', status: 'Active' },
          { id: 3, name: 'Angus Heifer #1156', breed: 'Angus', status: 'Active' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading animals...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Animal Management</h2>
        <button style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Add New Animal
        </button>
      </div>
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px', 
        border: '1px solid #e9ecef',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '15px 20px', 
          backgroundColor: '#e9ecef', 
          fontWeight: 'bold',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 100px',
          gap: '20px'
        }}>
          <div>Animal ID</div>
          <div>Breed</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        
        {animals.length > 0 ? (
          animals.map((animal, index) => (
            <div key={animal.id || index} style={{ 
              padding: '15px 20px', 
              borderBottom: index < animals.length - 1 ? '1px solid #dee2e6' : 'none',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 100px',
              gap: '20px',
              alignItems: 'center'
            }}>
              <div>{animal.name || animal.tag_number || `Animal #${animal.id}`}</div>
              <div>{animal.breed || 'Unknown'}</div>
              <div>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px',
                  backgroundColor: animal.status === 'Active' ? '#d4edda' : '#f8d7da',
                  color: animal.status === 'Active' ? '#155724' : '#721c24'
                }}>
                  {animal.status || 'Active'}
                </span>
              </div>
              <div>
                <button style={{ 
                  padding: '4px 8px', 
                  fontSize: '12px', 
                  backgroundColor: '#6c757d', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
            No animals found. Click "Add New Animal" to get started.
          </div>
        )}
      </div>
    </div>
  );
}

// Customers Management with backend integration
function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await apiService.getCustomers();
        setCustomers(response.data || []);
      } catch (error) {
        console.error('Error fetching customers:', error);
        // Use demo data if backend fails
        setCustomers([
          { id: 1, name: 'Green Valley Farm', contact: 'John Smith', status: 'Active' },
          { id: 2, name: 'Sunrise Ranch', contact: 'Mary Johnson', status: 'Active' },
          { id: 3, name: 'Mountain View Dairy', contact: 'Bob Wilson', status: 'Active' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading customers...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Customer Management</h2>
        <button style={{ 
          padding: '10px 20px', 
          backgroundColor: '#28a745', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Add New Customer
        </button>
      </div>
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px', 
        border: '1px solid #e9ecef',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '15px 20px', 
          backgroundColor: '#e9ecef', 
          fontWeight: 'bold',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 100px',
          gap: '20px'
        }}>
          <div>Company Name</div>
          <div>Contact Person</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        
        {customers.length > 0 ? (
          customers.map((customer, index) => (
            <div key={customer.id || index} style={{ 
              padding: '15px 20px', 
              borderBottom: index < customers.length - 1 ? '1px solid #dee2e6' : 'none',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 100px',
              gap: '20px',
              alignItems: 'center'
            }}>
              <div>{customer.name || customer.company_name || 'Unknown Company'}</div>
              <div>{customer.contact || customer.contact_person || 'Unknown Contact'}</div>
              <div>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px',
                  backgroundColor: '#d4edda',
                  color: '#155724'
                }}>
                  {customer.status || 'Active'}
                </span>
              </div>
              <div>
                <button style={{ 
                  padding: '4px 8px', 
                  fontSize: '12px', 
                  backgroundColor: '#6c757d', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
            No customers found. Click "Add New Customer" to get started.
          </div>
        )}
      </div>
    </div>
  );
}

// Laboratory Management
function Laboratory() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Laboratory Management</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        marginTop: '20px'
      }}>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3>Pending Tests</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #dee2e6' }}>
              🧪 Blood Analysis - Sample #LB-001
            </li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #dee2e6' }}>
              🔬 Genetic Testing - Sample #GT-045
            </li>
            <li style={{ padding: '8px 0' }}>
              🩸 Hormone Level - Sample #HL-023
            </li>
          </ul>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3>Equipment Status</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #dee2e6' }}>
              ✅ PCR Machine - Operational
            </li>
            <li style={{ padding: '8px 0', borderBottom: '1px solid #dee2e6' }}>
              ✅ Centrifuge - Operational
            </li>
            <li style={{ padding: '8px 0' }}>
              ⚠️ Microscope #2 - Maintenance Required
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function AppDemo() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh' }}>
        {/* Navigation Header */}
        <nav style={{ 
          padding: '20px', 
          backgroundColor: '#343a40', 
          color: 'white',
          marginBottom: '0'
        }}>
          <h1 style={{ margin: '0 0 15px 0', fontSize: '24px' }}>
            🧬 Reprotech - Biotechnology Management Platform
          </h1>
          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none', padding: '5px 0' }}>
              📊 Dashboard
            </Link>
            <Link to="/animals" style={{ color: '#fff', textDecoration: 'none', padding: '5px 0' }}>
              🐄 Animals
            </Link>
            <Link to="/customers" style={{ color: '#fff', textDecoration: 'none', padding: '5px 0' }}>
              👥 Customers
            </Link>
            <Link to="/laboratory" style={{ color: '#fff', textDecoration: 'none', padding: '5px 0' }}>
              🔬 Laboratory
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <div style={{ backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 120px)' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/animals" element={<Animals />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/laboratory" element={<Laboratory />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default AppDemo;

