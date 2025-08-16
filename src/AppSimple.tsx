import React from 'react';

function AppSimple() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1>Reprotech - Simple Test</h1>
      <p>This is a simple test to verify React is working.</p>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h2>Test Component Loaded Successfully</h2>
        <p>If you can see this, React is rendering properly.</p>
      </div>
    </div>
  );
}

export default AppSimple;

