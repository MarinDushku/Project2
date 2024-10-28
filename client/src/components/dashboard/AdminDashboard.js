import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ManageUsers from './ManageUsers';
import ManageStores from './ManageStores';
import AdminManageItems from './AdminManageItems';
import '../../styles/AdminDashboard.css';  

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('users');
  const navigate = useNavigate();  // React Router's navigate function for redirection

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        navigate('/');  // Redirect to the homepage after successful logout
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <aside className="admin-dashboard-sidebar">
        <h2 className="dashboard-title">Admin Dashboard</h2>
        <button onClick={() => setActiveSection('users')}>Manage Users</button>
        <button onClick={() => setActiveSection('stores')}>Manage Stores</button>
        <button onClick={() => setActiveSection('items')}>Manage Items</button>
        {/* Add Logout button */}
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </aside>

      <main className="admin-dashboard-content">
        {activeSection === 'users' && <ManageUsers />}
        {activeSection === 'stores' && <ManageStores />}
        {activeSection === 'items' && <AdminManageItems />}
      </main>
    </div>
  );
};

export default AdminDashboard;
