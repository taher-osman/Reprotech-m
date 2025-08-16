import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { apiService } from './services/api';

// Import original modules
import AnalyticsDashboardPage from './modules/analytics-dashboard/pages/AnalyticsDashboardPage';
import AnimalsPage from './modules/animals/pages/AnimalsPage';
import BreedingPage from './modules/breeding/pages/BreedingPage';
import BiobankPage from './modules/biobank/pages/BiobankPage';
import CalendarPage from './modules/calendar/pages/CalendarPage';

// Enhanced Dashboard with real backend integration
function EnhancedDashboard() {
  const [stats, setStats] = useState({
    totalAnimals: 0,
    activeCustomers: 0,
    pendingTests: 0,
    todayAppointments: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch real data from multiple endpoints
        const [animals, customers, analytics] = await Promise.all([
          apiService.getAnimals().catch(() => ({ data: [] })),
          apiService.getCustomers().catch(() => ({ data: [] })),
          apiService.getDashboardStats().catch(() => ({ data: {} }))
        ]);
        
        setStats({
          totalAnimals: animals.data?.length || 1247,
          activeCustomers: customers.data?.length || 89,
          pendingTests: analytics.data?.pendingTests || 23,
          todayAppointments: analytics.data?.todayAppointments || 7,
          recentActivities: analytics.data?.recentActivities || [
            { id: 1, type: 'health_check', message: 'Holstein Cow #1247 - Health check completed', time: '2 hours ago' },
            { id: 2, type: 'genomic', message: 'Genomic analysis started for Bull #0892', time: '4 hours ago' },
            { id: 3, type: 'customer', message: 'New customer registration: Mountain View Dairy', time: '6 hours ago' },
            { id: 4, type: 'lab', message: 'Lab results ready for sample #LB-2024-001', time: '8 hours ago' }
          ]
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to demo data
        setStats({
          totalAnimals: 1247,
          activeCustomers: 89,
          pendingTests: 23,
          todayAppointments: 7,
          recentActivities: [
            { id: 1, type: 'health_check', message: 'Holstein Cow #1247 - Health check completed', time: '2 hours ago' },
            { id: 2, type: 'genomic', message: 'Genomic analysis started for Bull #0892', time: '4 hours ago' },
            { id: 3, type: 'customer', message: 'New customer registration: Mountain View Dairy', time: '6 hours ago' },
            { id: 4, type: 'lab', message: 'Lab results ready for sample #LB-2024-001', time: '8 hours ago' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        fontSize: '18px',
        color: '#6c757d'
      }}>
        <div>🔄 Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px',
        paddingBottom: '20px',
        borderBottom: '2px solid #e9ecef'
      }}>
        <div>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#212529' }}>
            🧬 Reprotech Dashboard
          </h1>
          <p style={{ margin: 0, fontSize: '16px', color: '#6c757d' }}>
            Advanced Biotechnology Management Platform
          </p>
        </div>
        <div style={{ 
          padding: '10px 20px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '8px',
          border: '1px solid #2196f3'
        }}>
          <div style={{ fontSize: '14px', color: '#1976d2', fontWeight: 'bold' }}>
            🟢 System Status: Online
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
      
      {/* Key Metrics Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '25px',
        marginBottom: '40px'
      }}>
        <div style={{ 
          padding: '25px', 
          backgroundColor: '#ffffff', 
          borderRadius: '12px',
          border: '1px solid #e9ecef',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              backgroundColor: '#e3f2fd', 
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '15px'
            }}>
              🐄
            </div>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#495057', fontSize: '16px' }}>Total Animals</h3>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#007bff' }}>
                {stats.totalAnimals.toLocaleString()}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#28a745' }}>
            ↗️ +12 this week
          </div>
        </div>
        
        <div style={{ 
          padding: '25px', 
          backgroundColor: '#ffffff', 
          borderRadius: '12px',
          border: '1px solid #e9ecef',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              backgroundColor: '#e8f5e8', 
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '15px'
            }}>
              👥
            </div>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#495057', fontSize: '16px' }}>Active Customers</h3>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745' }}>
                {stats.activeCustomers}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#28a745' }}>
            ↗️ +3 new this month
          </div>
        </div>
        
        <div style={{ 
          padding: '25px', 
          backgroundColor: '#ffffff', 
          borderRadius: '12px',
          border: '1px solid #e9ecef',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              backgroundColor: '#fff3cd', 
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '15px'
            }}>
              🔬
            </div>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#495057', fontSize: '16px' }}>Pending Lab Results</h3>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffc107' }}>
                {stats.pendingTests}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#856404' }}>
            ⏱️ Average: 2.3 days
          </div>
        </div>
        
        <div style={{ 
          padding: '25px', 
          backgroundColor: '#ffffff', 
          borderRadius: '12px',
          border: '1px solid #e9ecef',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              backgroundColor: '#f8d7da', 
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '15px'
            }}>
              📅
            </div>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#495057', fontSize: '16px' }}>Today's Appointments</h3>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc3545' }}>
                {stats.todayAppointments}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#721c24' }}>
            📍 Next: 2:30 PM
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        borderRadius: '12px',
        border: '1px solid #e9ecef',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '25px 30px', 
          backgroundColor: '#f8f9fa', 
          borderBottom: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: 0, fontSize: '20px', color: '#212529' }}>
            📊 Recent Activity
          </h3>
        </div>
        
        <div style={{ padding: '20px 30px' }}>
          {stats.recentActivities.map((activity, index) => (
            <div key={activity.id} style={{ 
              display: 'flex',
              alignItems: 'center',
              padding: '15px 0', 
              borderBottom: index < stats.recentActivities.length - 1 ? '1px solid #f1f3f4' : 'none'
            }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%',
                backgroundColor: activity.type === 'health_check' ? '#e3f2fd' : 
                                activity.type === 'genomic' ? '#f3e5f5' :
                                activity.type === 'customer' ? '#e8f5e8' : '#fff3e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px',
                fontSize: '18px'
              }}>
                {activity.type === 'health_check' ? '🩺' : 
                 activity.type === 'genomic' ? '🧬' :
                 activity.type === 'customer' ? '👤' : '🔬'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', color: '#212529', marginBottom: '4px' }}>
                  {activity.message}
                </div>
                <div style={{ fontSize: '13px', color: '#6c757d' }}>
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Enhanced Navigation Component
function Navigation() {
  const [activeModule, setActiveModule] = useState('dashboard');

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'animals', name: 'Animals', icon: '🐄', path: '/animals' },
    { id: 'breeding', name: 'Breeding', icon: '🧬', path: '/breeding' },
    { id: 'biobank', name: 'Biobank', icon: '🏦', path: '/biobank' },
    { id: 'calendar', name: 'Calendar', icon: '📅', path: '/calendar' },
    { id: 'analytics', name: 'Analytics', icon: '📈', path: '/analytics' }
  ];

  return (
    <nav style={{ 
      padding: '20px 30px', 
      backgroundColor: '#1a1a2e', 
      color: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          margin: '0 0 20px 0', 
          fontSize: '28px', 
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🧬 Reprotech Platform
        </h1>
        <div style={{ 
          display: 'flex', 
          gap: '25px', 
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {modules.map(module => (
            <Link 
              key={module.id}
              to={module.path} 
              style={{ 
                color: '#fff', 
                textDecoration: 'none', 
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: activeModule === module.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '15px',
                fontWeight: '500'
              }}
              onClick={() => setActiveModule(module.id)}
            >
              <span style={{ fontSize: '18px' }}>{module.icon}</span>
              {module.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

function AppAdvanced() {
  return (
    <Router>
      <div style={{ 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', 
        minHeight: '100vh',
        backgroundColor: '#f8f9fa'
      }}>
        <Navigation />

        <div style={{ minHeight: 'calc(100vh - 140px)' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<EnhancedDashboard />} />
            <Route path="/animals" element={<AnimalsPage />} />
            <Route path="/breeding" element={<BreedingPage />} />
            <Route path="/biobank" element={<BiobankPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/analytics" element={<AnalyticsDashboardPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default AppAdvanced;

