import React, { useState, useEffect } from 'react';
import '../../styles/Cart.css'; 

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Fetch cart items with item details from backend
    fetch('http://localhost:3000/cart', { credentials: 'include' })
      .then(response => response.json())
      .then(data => setCartItems(data));
  }, []);

  const handleRemoveItem = (itemId) => {
    // Remove item from the cart in the backend
    fetch(`http://localhost:3000/cart/${itemId}`, {
      method: 'DELETE',
      credentials: 'include'
    }).then(response => {
      if (response.ok) {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      } else {
        alert('Failed to remove item');
      }
    });
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    // Update the quantity in the database
    fetch(`http://localhost:3000/cart`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ itemId, quantity: newQuantity })
    }).then(response => {
      if (response.ok) {
        // Update the quantity locally after successfully updating in the backend
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        alert('Failed to update quantity');
      }
    });
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length > 0 ? (
        <ul className="cart-items">
          {cartItems.map(item => (
            <li key={item.id} className="cart-item">
              <div className="cart-item-details">
                <span className="item-name">{item.name}</span>
                <div className="item-attributes">
                  Description: {item.description || 'N/A'}<br />
                  Size: {item.size || 'N/A'}<br />
                  {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>
              <span className="price">${item.price}</span>
              <div className="quantity-select">
                <select
                  value={item.quantity}
                  onChange={e => handleQuantityChange(item.id, parseInt(e.target.value))}
                >
                  {/* Generate options based on the stock available */}
                  {[...Array(item.stock).keys()].map(num => (
                    <option key={num + 1} value={num + 1}>{num + 1}</option>
                  ))}
                </select>
              </div>
              <span className="total">${(item.price * item.quantity).toFixed(2)}</span>
              <button onClick={() => handleRemoveItem(item.id)} className="remove-button">Remove</button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-cart">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
