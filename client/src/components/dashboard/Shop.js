import React, { useState, useEffect } from 'react';
import '../../styles/Shop.css';  // Assuming you'll add the styles to this CSS file

const Shop = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Fetch stores from backend
    fetch('http://localhost:3000/stores')
      .then(response => response.json())
      .then(data => setStores(data));
  }, []);

  const handleStoreClick = (storeId) => {
    // Fetch items for the selected store
    fetch(`http://localhost:3000/stores/${storeId}/items`)
      .then(response => response.json())
      .then(data => {
        setSelectedStore(storeId);
        setItems(data);
      });
  };

  const handleAddToCart = (itemId) => {
    // Add item to the cart (you'll need to implement cart functionality on the backend)
    fetch('http://localhost:3000/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ itemId, quantity: 1 })
    }).then(response => {
      if (response.ok) {
        setCart(prevCart => [...prevCart, { itemId, quantity: 1 }]);
        alert('Item added to cart');
      }
    });
  };

  return (
    <div className="shop-container">
      <h2 className="shop-title">Shop</h2>
      {selectedStore ? (
        <div className="store-items">
          <button className="back-button" onClick={() => setSelectedStore(null)}>Back to Stores</button>
          <h3>Items in Store</h3>
          <div className="items-list">
            {items.map(item => (
              <div key={item.id} className="item-card">
                <h4>{item.name}</h4>
                <p>Price: ${item.price}</p>
                <p>Size: {item.size}</p>
                <p>Stock: {item.stock}</p>
                <button onClick={() => handleAddToCart(item.id)} className="add-to-cart-button">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="stores-list">
          <h3>Available Stores</h3>
          <div className="store-grid">
            {stores.map(store => (
              <div key={store.id} className="store-card">
                <h4>{store.name}</h4>
                <p>{store.description}</p>
                <button onClick={() => handleStoreClick(store.id)} className="browse-button">
                  Browse
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
