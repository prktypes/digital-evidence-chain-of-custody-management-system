const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('./db');

const evidenceRoutes = require('./routes/evidenceRoutes');
const verifyRoutes = require('./routes/verifyRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/evidence', evidenceRoutes);
app.use('/api/verify', verifyRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Evidence Chain Backend running' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
