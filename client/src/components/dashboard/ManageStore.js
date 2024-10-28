import React, { useState, useEffect } from 'react';
import '../../styles/ManageStore.css';
const ManageStore = ({ fetchStore }) => {
  const [stores, setStores] = useState([]);  // To store the list of user's stores
  const [storeData, setStoreData] = useState({ name: '', description: '' });

  // Fetch user's stores when the component loads
  useEffect(() => {
    fetchUserStores();
  }, []);

  const fetchUserStores = async () => {
    try {
      const response = await fetch('http://localhost:3000/user/stores', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        console.log('Stores received from backend:', data);  // Debugging log
        setStores(data);  // Set the fetched stores
      } else {
        console.error('Failed to fetch stores');
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const handleStoreSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(storeData),
      });

      if (response.ok) {
        console.log('Store created successfully');
        fetchUserStores();  // Refresh the list of stores after creating a new one
        setStoreData({ name: '', description: '' });  // Clear the form
      } else {
        console.error('Failed to create store');
      }
    } catch (error) {
      console.error('Error creating store:', error);
    }
  };

  return (
    <section className="manage-store">
      <h2>Manage Your Stores</h2>

      {/* Show user's stores */}
      {stores.length > 0 ? (
        <div>
          <h3>Your Stores</h3>
          <ul>
            {stores.map((store) => (
              <li key={store.id}>
                <strong>{store.name}</strong> - {store.description}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>You don't have any stores yet. Create a new store below.</p>
      )}

      {/* Form to create a new store */}
      <form onSubmit={handleStoreSubmit}>
        <label>Store Name:</label>
        <input
          type="text"
          name="name"
          value={storeData.name}
          onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
          required
        />
        <label>Description:</label>
        <textarea
          name="description"
          value={storeData.description}
          onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
          required
        ></textarea>
        <button type="submit">Create Store</button>
      </form>
    </section>
  );
};

export default ManageStore;
