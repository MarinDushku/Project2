import React, { useState, useEffect } from 'react';
import '../../styles/ManageItems.css';


const ManageItems = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    size: '',
    price: '',
    stock: '',
    description: ''
  });

  useEffect(() => {
    // Fetch the stores owned by the logged-in user
    fetch('http://localhost:3000/user/stores', { credentials: 'include' })
      .then(response => response.json())
      .then(data => setStores(data))
      .catch(err => console.error('Error fetching stores:', err));
  }, []);

  const handleStoreChange = (storeId) => {
    setSelectedStore(storeId);

    // Fetch items for the selected store
    fetch(`http://localhost:3000/stores/${storeId}/items`, { credentials: 'include' })
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(err => console.error('Error fetching items:', err));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ ...newItem, storeId: selectedStore }),
    })
      .then(response => {
        if (response.ok) {
          console.log('Item added successfully');
          setNewItem({ name: '', size: '', price: '', stock: '', description: '' });
          handleStoreChange(selectedStore); // Refresh items after adding a new one
        }
      })
      .catch(err => console.error('Error adding item:', err));
  };

  return (
    <div className="manage-items">
      <h2>Manage Items</h2>

      {/* Store selection */}
      <label>Select a Store:</label>
      <select onChange={(e) => handleStoreChange(e.target.value)} value={selectedStore || ''}>
        <option value="">Select a store</option>
        {stores.map(store => (
          <option key={store.id} value={store.id}>
            {store.name}
          </option>
        ))}
      </select>

      {/* Show items of the selected store */}
      {selectedStore && items.length > 0 && (
        <div>
          <h3>Items in {stores.find(store => store.id === parseInt(selectedStore))?.name}</h3>
          <ul>
            {items.map(item => (
              <li key={item.id}>
                {item.name} - ${item.price} - {item.size} - {item.stock} in stock
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add new item form */}
      {selectedStore && (
        <form onSubmit={handleAddItem}>
          <h3>Add a New Item</h3>
          <label>Item Name:</label>
          <input
            type="text"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            required
          />
          <label>Size:</label>
          <input
            type="text"
            value={newItem.size}
            onChange={(e) => setNewItem({ ...newItem, size: e.target.value })}
            required
          />
          <label>Price:</label>
          <input
            type="number"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            required
          />
          <label>Stock:</label>
          <input
            type="number"
            value={newItem.stock}
            onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
            required
          />
          <label>Description:</label>
          <textarea
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            required
          ></textarea>
          <button type="submit">Add Item</button>
        </form>
      )}
    </div>
  );
};

export default ManageItems;
