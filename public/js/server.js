const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

// Serve admin directory
app.use('/admin', express.static(path.join(__dirname, '../../admin')));
console.log('Admin static path resolved to:', path.join(__dirname, '../../admin'));

// Serve user directory
app.use('/user', express.static(path.join(__dirname, '../../user')));
console.log('User static path resolved to:', path.join(__dirname, '../../user'));

// Serve public directory for JS and images
app.use('/public', express.static(path.join(__dirname, '../../public')));
console.log('Public static path resolved to:', path.join(__dirname, '../../public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'YourSecurePassword123',
  database: 'internship_management'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL!');
});




// Student signup
app.post('/signup', (req, res) => {
  const { full_name, email, password } = req.body;
  console.log('Received data:', req.body); // Debug log
  db.query('INSERT INTO students (full_name, email, password) VALUES (?, ?, ?)', 
    [full_name, email, password], (err, results) => {
    if (err) {
      console.error('Database error:', err); // Debug log
      res.json({ success: false, message: 'Error signing up' });
    } else {
      res.json({ success: true, message: 'Signup successful' });
    }
  });
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM students WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err) {
      res.json({ success: false, message: 'Error logging in' });
    } else if (results.length > 0) {
      res.json({ success: true, message: 'Login successful', student_id: results[0].student_id });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// Add internship
app.post('/add-internship', (req, res) => {
  const { title, location, type } = req.body;
  db.query('INSERT INTO internships (title, location, type) VALUES (?, ?, ?)', 
    [title, location, type], (err, results) => {
    if (err) {
      res.json({ success: false, message: 'Error adding internship' });
    } else {
      res.json({ success: true, message: 'Internship added' });
    }
  });
});

// Get internships
app.get('/internships', (req, res) => {
  db.query('SELECT * FROM internships', (err, results) => {
    if (err) {
      res.json({ success: false, message: 'Error fetching internships' });
    } else {
      res.json(results);
    }
  });
});

app.listen(3000, () => console.log('Server on port 3000'));
