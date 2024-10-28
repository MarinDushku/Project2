import React, { useState } from 'react';
import '../../styles/UserDashboard.css';  // Correct import for updated CSS
import Profile from './Profile';
import Shop from './Shop';
import Cart from './Cart';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [view, setView] = useState('profile');
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch("http://localhost:3000/logout", {
      method: 'POST',
      credentials: 'include'
    }).then(() => {
      navigate('/');
    });
  };

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h2 className="dashboard-title">User Dashboard</h2>
        <button onClick={() => setView('profile')}>Profile</button>
        <button onClick={() => setView('shop')}>Shop</button>
        <button onClick={() => setView('cart')}>Cart</button>
        <button onClick={handleLogout}>Logout</button>
      </aside>

      <main className="dashboard-content">
        {view === 'profile' && <Profile />}
        {view === 'shop' && <Shop />}
        {view === 'cart' && <Cart />}
      </main>
    </div>
  );
};

export default UserDashboard;
