import React, { useState, useEffect } from 'react';
import '../../styles/ManageStores.css';

const ManageStores = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await fetch('http://localhost:3000/admin/stores', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setStores(data);
      } else {
        console.error('Failed to fetch stores');
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const handleDeleteStore = async (storeId) => {
    try {
      const response = await fetch(`http://localhost:3000/admin/stores/${storeId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setStores(stores.filter(store => store.id !== storeId));  // Remove store from state
        console.log('Store deleted successfully');
      } else {
        console.error('Failed to delete store');
      }
    } catch (error) {
      console.error('Error deleting store:', error);
    }
  };

  return (
    <div className="manage-stores">
      <h2>Manage Stores</h2>
      <table className="stores-table">
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Description</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(store => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.description}</td>
              <td>
                <button onClick={() => handleDeleteStore(store.id)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageStores;
