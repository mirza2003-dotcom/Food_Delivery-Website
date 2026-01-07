import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * Debug Panel Component
 * Add this to any page to test API connectivity
 * 
 * Usage:
 * import DebugPanel from './components/DebugPanel';
 * <DebugPanel />
 */
const DebugPanel = () => {
  const { user, isAuthenticated } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [backendStatus, setBackendStatus] = useState('checking...');
  const [apiTests, setApiTests] = useState({});

  useEffect(() => {
    testBackendConnection();
    testRestaurantsAPI();
  }, []);

  const testBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/restaurants');
      if (response.ok) {
        setBackendStatus('✅ Connected');
      } else {
        setBackendStatus(`❌ Error: ${response.status}`);
      }
    } catch (error) {
      setBackendStatus(`❌ Failed: ${error.message}`);
    }
  };

  const testRestaurantsAPI = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/restaurants');
      const data = await response.json();
      setRestaurants(data.data || []);
      setApiTests(prev => ({ ...prev, restaurants: '✅ Success' }));
    } catch (error) {
      setApiTests(prev => ({ ...prev, restaurants: `❌ ${error.message}` }));
    }
  };

  const testLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'john@example.com',
          password: 'password123'
        })
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        setApiTests(prev => ({ ...prev, login: '✅ Success' }));
        window.location.reload();
      } else {
        setApiTests(prev => ({ ...prev, login: `❌ ${data.message}` }));
      }
    } catch (error) {
      setApiTests(prev => ({ ...prev, login: `❌ ${error.message}` }));
    }
  };

  const testRegister = async () => {
    const randomNum = Math.floor(Math.random() * 10000);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Test User ${randomNum}`,
          email: `test${randomNum}@example.com`,
          phone: `99999${String(randomNum).padStart(5, '0')}`,
          password: 'password123'
        })
      });
      const data = await response.json();
      if (data.token) {
        setApiTests(prev => ({ ...prev, register: '✅ Success' }));
      } else {
        setApiTests(prev => ({ ...prev, register: `❌ ${data.message}` }));
      }
    } catch (error) {
      setApiTests(prev => ({ ...prev, register: `❌ ${error.message}` }));
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      border: '2px solid #333',
      borderRadius: '8px',
      padding: '15px',
      maxWidth: '400px',
      maxHeight: '90vh',
      overflow: 'auto',
      zIndex: 9999,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      fontSize: '12px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>🔍 Debug Panel</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Backend Status:</strong> {backendStatus}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Auth Status:</strong>
        <div>Logged in: {isAuthenticated ? '✅ Yes' : '❌ No'}</div>
        <div>User: {user?.name || 'None'}</div>
        <div>Token: {localStorage.getItem('token') ? '✅ Present' : '❌ Missing'}</div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>API Tests:</strong>
        <div>Restaurants: {apiTests.restaurants || 'Not tested'}</div>
        <div>Login: {apiTests.login || 'Not tested'}</div>
        <div>Register: {apiTests.register || 'Not tested'}</div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Test Actions:</strong>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
          <button onClick={testBackendConnection} style={buttonStyle}>
            Test Backend
          </button>
          <button onClick={testRestaurantsAPI} style={buttonStyle}>
            Test Fetch Restaurants
          </button>
          <button onClick={testLogin} style={buttonStyle}>
            Test Login
          </button>
          <button onClick={testRegister} style={buttonStyle}>
            Test Register
          </button>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{...buttonStyle, background: '#ff4444'}}>
            Clear & Reload
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Restaurants ({restaurants.length}):</strong>
        <div style={{ maxHeight: '150px', overflow: 'auto', marginTop: '5px' }}>
          {restaurants.map((restaurant, i) => (
            <div key={i} style={{ padding: '5px', borderBottom: '1px solid #eee' }}>
              {restaurant.name} - ⭐{restaurant.rating}
            </div>
          ))}
          {restaurants.length === 0 && <div>No restaurants found</div>}
        </div>
      </div>

      <div style={{ fontSize: '10px', color: '#666' }}>
        <div>Frontend: {window.location.href}</div>
        <div>Backend: http://localhost:5000</div>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '8px 12px',
  background: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px'
};

export default DebugPanel;
