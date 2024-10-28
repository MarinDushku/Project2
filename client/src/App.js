import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/pages/Homepage';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import UserDashboard from './components/dashboard/UserDashboard';
import StoreOwnerDashboard from './components/dashboard/StoreOwnerDashboard';  // Import the Store Owner Dashboard
import AdminDashboard from './components/dashboard/AdminDashboard';  // Import the Admin Dashboard

function App() {
  return (
    
    <Router>
      
      <Routes>
        
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<UserDashboard />} /> 
        <Route path="/store-owner-dashboard" element={<StoreOwnerDashboard />} />  {/* Store Owner Dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />  {/* Admin Dashboard */}
        
      </Routes>
    </Router>
  );
}

export default App;
