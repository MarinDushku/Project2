import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Profile from './Profile';
import ManageStore from './ManageStore';
import ManageItems from './ManageItems';  // Import the ManageItems component
import '../../styles/StoreOwnerDashboard.css';

const StoreOwnerDashboard = () => {
  const [store, setStore] = useState(null);  
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      const response = await fetch('http://localhost:3000/store', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setStore(data);
      }
    } catch (error) {
      console.error("Failed to fetch store data:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h2 className="dashboard-title">Store Owner Dashboard</h2>
        <button onClick={() => setActiveSection('profile')}>Manage Profile</button>
        <button onClick={() => setActiveSection('store')}>Manage Store</button>
        <button onClick={() => setActiveSection('items')}>Manage Items</button>
        <Link to="/"><button>Logout</button></Link>
      </aside>

      <main className="dashboard-content">
        {/* Conditionally render the sections based on activeSection */}
        {activeSection === 'profile' && <Profile />}
        
        {activeSection === 'store' && (
          <ManageStore store={store} fetchStore={fetchStore} />  // Use the ManageStore component
        )}

        {activeSection === 'items' && (
          <ManageItems />  // Render the ManageItems component when activeSection is 'items'
        )}
      </main>
    </div>
  );
};

export default StoreOwnerDashboard;
