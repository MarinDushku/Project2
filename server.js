// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Password hashing library
const saltRounds = 10; // Number of rounds to salt the password

// Initialize Express app
const app = express();

// Enable CORS (Cross-Origin Resource Sharing) to allow frontend and backend communication
app.use(cors({
  origin: 'http://localhost:3001', // The frontend URL (React app)
  credentials: true // Allows sending credentials like cookies
}));

// Create connection to MySQL database using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the MySQL database.');
  }
});

// Middleware to parse incoming JSON requests
app.use(express.json());

// Set up session management with express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET, // Secret key for session encryption
  resave: false, // Don't resave session if not modified
  saveUninitialized: true, // Save uninitialized sessions
  cookie: { secure: false } // For HTTPS, set this to true
}));

// Test route to check server is running
app.get('/', (req, res) => {
  res.send('Server is running and connected to the database.');
});

// ========================== USER ROUTES ========================== //

// User Registration Route: Handles new user sign-ups
app.post('/register', (req, res) => {
  const { username, email, password, role } = req.body;

  // Check if user already exists in the database
  const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkUserQuery, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    if (result.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password for security
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        return res.status(500).json({ message: 'Error hashing password' });
      }

      // Insert the new user into the database
      const insertUserQuery = 'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)';
      db.query(insertUserQuery, [username, email, hash, role], (err) => {
        if (err) {
          return res.status(500).json({ message: 'Database error' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  });
});

// User Login Route: Handles user authentication
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkUserQuery, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    if (result.length === 0) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    const user = result[0];

    // Compare the entered password with the hashed password stored in the database
    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Error comparing passwords' });
      }
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }

      // Store user information in the session
      req.session.userId = user.id;
      req.session.role = user.role;
      res.status(200).json({ message: 'Login successful', role: user.role });
    });
  });
});

// User Logout Route: Logs out the user and destroys the session
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
});

// Profile route: Fetches user profile details based on the session userId
app.get('/profile', (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const query = 'SELECT id, username, email, role, bio, profile_picture, created_at FROM users WHERE id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(result[0]);
  });
});

// Route to update user profile (username and bio)
app.put('/profile', (req, res) => {
  const { username, bio } = req.body;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const query = 'UPDATE users SET username = ?, bio = ? WHERE id = ?';
  db.query(query, [username, bio, userId], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ message: 'Profile updated successfully' });
  });
});

// ========================= STORE AND ITEM ROUTES ========================= //

// Fetch all stores owned by the current user
app.get('/user/stores', (req, res) => {
  const ownerId = req.session.userId;

  if (!ownerId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const query = 'SELECT * FROM stores WHERE owner_id = ?';
  db.query(query, [ownerId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to retrieve stores' });
    }
    res.status(200).json(results);
  });
});

// Create a new store (for store owners)
app.post('/store', (req, res) => {
  const { name, description } = req.body;
  const ownerId = req.session.userId;  // Get the owner (user) ID from the session

  if (!ownerId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (!name || !description) {
    return res.status(400).json({ message: 'Name and description are required' });
  }

  const insertStoreQuery = 'INSERT INTO stores (name, description, owner_id) VALUES (?, ?, ?)';
  db.query(insertStoreQuery, [name, description, ownerId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to create store' });
    }
    res.status(201).json({ message: 'Store created successfully', storeId: result.insertId });
  });
});

// Fetch all stores (for users to browse)
app.get('/stores', (req, res) => {
  const query = 'SELECT * FROM stores';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(results);
  });
});

// Fetch all items from a specific store
app.get('/stores/:storeId/items', (req, res) => {
  const storeId = req.params.storeId;

  const query = 'SELECT * FROM items WHERE store_id = ?';
  db.query(query, [storeId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(results);
  });
});

// Add a new item to a store
app.post('/items', (req, res) => {
  const { name, size, price, stock, description, storeId } = req.body;

  if (!name || !size || !price || !stock || !description || !storeId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const insertItemQuery = 'INSERT INTO items (name, size, price, stock, description, store_id) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(insertItemQuery, [name, size, price, stock, description, storeId], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to add item' });
    }
    res.status(201).json({ message: 'Item added successfully' });
  });
});

// ========================= CART ROUTES ========================= //

// Add an item to the cart
app.post('/cart', (req, res) => {
  const { itemId, quantity } = req.body;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const getCartQuery = 'SELECT id FROM carts WHERE user_id = ?';
  db.query(getCartQuery, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    let cartId;
    if (results.length > 0) {
      cartId = results[0].id;
    } else {
      const createCartQuery = 'INSERT INTO carts (user_id) VALUES (?)';
      db.query(createCartQuery, [userId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        cartId = result.insertId;
      });
    }

    const insertCartItemQuery = 'INSERT INTO cart_items (cart_id, item_id, quantity) VALUES (?, ?, ?)';
    db.query(insertCartItemQuery, [cartId, itemId, quantity], (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.status(200).json({ message: 'Item added to cart' });
    });
  });
});

// Fetch all items in the user's cart, including stock information
app.get('/cart', (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const query = `
    SELECT cart_items.item_id AS id, items.name, items.price, items.stock, cart_items.quantity 
    FROM cart_items 
    JOIN items ON cart_items.item_id = items.id
    JOIN carts ON cart_items.cart_id = carts.id
    WHERE carts.user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json(results);
  });
});

// Remove an item from the cart
app.delete('/cart/:itemId', (req, res) => {
  const userId = req.session.userId;
  const itemId = req.params.itemId;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const query = `
    DELETE cart_items 
    FROM cart_items 
    JOIN carts ON cart_items.cart_id = carts.id 
    WHERE cart_items.item_id = ? AND carts.user_id = ?`;

  db.query(query, [itemId, userId], (err) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json({ message: 'Item removed from cart' });
  });
});

// Update quantity of an item in the cart
app.put('/cart', (req, res) => {
  const { itemId, quantity } = req.body;
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const updateCartItemQuery = `
    UPDATE cart_items 
    JOIN carts ON cart_items.cart_id = carts.id 
    SET cart_items.quantity = ? 
    WHERE cart_items.item_id = ? AND carts.user_id = ?`;

  db.query(updateCartItemQuery, [quantity, itemId, userId], (err) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json({ message: 'Quantity updated successfully' });
  });
});
// ========================= ADMIN ROUTES ========================= //

// Fetch all users (Admin only)
app.get('/admin/users', (req, res) => {
  if (req.session.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(results);
  });
});

// Delete a user (Admin only)
app.delete('/admin/users/:userId', (req, res) => {
  if (req.session.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const userId = req.params.userId;
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [userId], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
});

// Fetch all stores (Admin only)
app.get('/admin/stores', (req, res) => {
  if (req.session.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const query = 'SELECT * FROM stores';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(results);
  });
});

// Delete a store (Admin only)
app.delete('/admin/stores/:storeId', (req, res) => {
  if (req.session.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const storeId = req.params.storeId;
  const query = 'DELETE FROM stores WHERE id = ?';
  db.query(query, [storeId], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ message: 'Store deleted successfully' });
  });
});

// Fetch all items (Admin only)
app.get('/admin/items', (req, res) => {
  if (req.session.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const query = 'SELECT * FROM items';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(results);
  });
});

// Delete an item (Admin only)
app.delete('/admin/items/:itemId', (req, res) => {
  if (req.session.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const itemId = req.params.itemId;
  const query = 'DELETE FROM items WHERE id = ?';
  db.query(query, [itemId], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  });
});

// ========================= ADDITIONAL ITEM ROUTE ========================= //

// Fetch item information by store_id
app.get('/items/:storeId', (req, res) => {
  const storeId = req.params.storeId;

  const query = 'SELECT * FROM items WHERE store_id = ?';
  db.query(query, [storeId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

// Set the port for the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
