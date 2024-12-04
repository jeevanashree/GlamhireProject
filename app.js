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
  if (err) console.error('Database error:', err);
  else {
    userDb.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )`,
      (err) => {
        if (err) console.error('Error creating users table:', err);
        else console.log('Users table ready.');
      }
    );
  }
});

// Initialize Orders Database
const db = new sqlite3.Database('./orders.db', (err) => {
  if (err) console.error('Database error:', err);
  else {
    db.run(
      `CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        contact TEXT NOT NULL,
        address TEXT NOT NULL,
        pincode TEXT NOT NULL,
        place TEXT NOT NULL,
        district TEXT NOT NULL,
        agree_terms INTEGER NOT NULL
      )`,
      (err) => {
        if (err) console.error('Error creating orders table:', err);
        else console.log('Orders table ready.');
      }
    );
  }
});

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'rent.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle user registration
app.post('/register', async (req, res) => {
  const { fullName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  userDb.run(
    `INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)`,
    [fullName, email, hashedPassword],
    function (err) {
      if (err) {
        console.error('Error registering user:', err);
        res.status(500).send(
          `<script>alert('Registration failed. Email may already be registered.'); window.location.href = '/register';</script>`
        );
      } else {
        res.send(
          `<script>alert('Registration successful! Redirecting to homepage...'); window.location.href = '/homepage.html';</script>`
        );
      }
    }
  );
});

// Handle user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  userDb.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) {
      console.error('Error fetching user:', err);
      res.status(500).send('Login failed.');
    } else if (!user) {
      res.send(
        `<script>alert('Invalid email or password.'); window.location.href = '/login';</script>`
      );
    } else {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        res.send(
          `<script>alert('Login successful! Redirecting to homepage...'); window.location.href = '/homepage.html';</script>`
        );
      } else {
        res.send(
          `<script>alert('Invalid email or password.'); window.location.href = '/login';</script>`
        );
      }
    }
  });
});

// Handle order submission
app.post('/order', (req, res) => {
  const { name, email, contact, address, pincode, place, district, agreeTerms } = req.body;

  db.run(
    `INSERT INTO orders (name, email, contact, address, pincode, place, district, agree_terms) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, email, contact, address, pincode, place, district, agreeTerms ? 1 : 0],
    function (err) {
      if (err) {
        console.error('Error inserting order:', err);
        res.status(500).send('Failed to submit order.');
      } else {
        res.send(
          `<script>alert('Order submitted successfully!'); window.location.href = '/';</script>`
        );
      }
    }
  );
});

// Serve homepage
app.get('/homepage.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
