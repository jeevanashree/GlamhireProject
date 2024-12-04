const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = 3000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize User Database
const userDb = new sqlite3.Database('./users.db', (err) => {
  if (err) console.error("Database error:", err);
  else {
    userDb.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )`,
      (err) => {
        if (err) console.error("Error creating users table:", err);
        else console.log("Users table ready.");
      }
    );
  }
});

// Initialize Product and Order Database
const productDb = new sqlite3.Database('./store.db', (err) => {
  if (err) console.error("Error opening product database:", err.message);
  else {
    productDb.run(
      `CREATE TABLE IF NOT EXISTS products (
        product_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        price REAL,
        category TEXT,
        image_url TEXT
      )`
    );

    productDb.run(
      `CREATE TABLE IF NOT EXISTS orders (
        order_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        contact TEXT,
        address TEXT,
        pincode TEXT,
        place TEXT,
        district TEXT,
        order_type TEXT,
        product_id INTEGER,
        agree_terms INTEGER,
        FOREIGN KEY (product_id) REFERENCES products(product_id)
      )`,
      () => console.log("Products and orders tables ready.")
    );
  }
});

// Routes for serving static pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'homepage.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));
app.get('/rent', (req, res) => res.sendFile(path.join(__dirname, 'public', 'rent.html')));

// User Registration
app.post('/register', (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) return res.send('Passwords do not match.');

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).send('Error hashing password.');

    userDb.run(
      `INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)`,
      [fullName, email, hashedPassword],
      (err) => {
        if (err) return res.status(500).send('Registration failed.');
        res.redirect('/login');
      }
    );
  });
});

// User Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  userDb.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) return res.status(500).send('Database error.');
    if (!user) return res.status(400).send('User not found.');

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) return res.status(500).send('Error during password comparison.');
      if (!result) return res.status(400).send('Incorrect password.');
      res.redirect('/');
    });
  });
});

// Add a new product
app.post('/add-product', (req, res) => {
  const { name, description, price, category, image_url } = req.body;

  productDb.run(
    `INSERT INTO products (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)`,
    [name, description, price, category, image_url],
    function (err) {
      if (err) return res.status(500).send('Failed to add product.');
      res.send(`Product added with ID: ${this.lastID}`);
    }
  );
});

// Place an order
app.post('/order', (req, res) => {
  const { name, email, contact, address, pincode, place, district, order_type, product_name, agreeTerms } = req.body;

  productDb.get(`SELECT product_id FROM products WHERE name = ?`, [product_name], (err, row) => {
    if (err) return res.status(500).send('Error fetching product.');
    if (!row) return res.status(404).send('Product not found.');

    productDb.run(
      `INSERT INTO orders (name, email, contact, address, pincode, place, district, order_type, product_id, agree_terms) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, contact, address, pincode, place, district, order_type, row.product_id, agreeTerms ? 1 : 0],
      function (err) {
        if (err) return res.status(500).send('Failed to place order.');
        res.send('Order placed successfully!');
      }
    );
  });
});

// Start server
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
