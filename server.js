const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// SQL Server config
const config = {
  user: 'sa', // your SQL Server username
  password: 'Amruta@12', // your SQL Server password
  server: 'localhost', // or 'YOGITA' (your server name)
  database: 'YaPlatterDB',
  options: {
    encrypt: false, // use true if you're using Azure
    trustServerCertificate: true // allow self-signed certs
  }
};

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await sql.connect(config);
    await sql.query`
      INSERT INTO Users (username, email, password)
      VALUES (${username}, ${email}, ${hashedPassword})
    `;
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    await sql.connect(config);
    const result = await sql.query`
      SELECT * FROM Users WHERE username = ${username}
    `;

    const user = result.recordset[0];
    if (!user) return res.status(400).json({ error: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Start server
app.listen(3000, () => console.log('Server running at http://localhost:3000'));
