import React, { useState, useEffect } from 'react';
import '../../styles/AdminManageItems.css';

const AdminManageItems = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:3000/admin/items', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        console.error('Failed to fetch items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:3000/admin/items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setItems(items.filter(item => item.id !== itemId));  // Remove item from state
        console.log('Item deleted successfully');
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="manage-items">
      <h2>Manage Items</h2>
      <table className="items-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>${item.price}</td>
              <td>{item.stock}</td>
              <td>
                <button onClick={() => handleDeleteItem(item.id)} className="item-actions-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminManageItems;
