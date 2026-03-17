const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Evidence = require('../models/evidenceModel');
const { hashBufferOrFile } = require('../utils/hash');
const { nowISO } = require('../utils/timestamp');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // prefix timestamp to avoid collisions
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// POST /api/evidence/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = req.file.path;
    const hash = await hashBufferOrFile(filePath);

    const evidence = new Evidence({
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      hash,
      size: req.file.size,
      timestamp: nowISO(),
      metadata: req.body || {}
    });

    await evidence.save();

    res.json({ message: 'Uploaded', evidence });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// GET /api/evidence
router.get('/', async (req, res) => {
  try {
    const items = await Evidence.find().sort({ createdAt: -1 }).limit(100);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list evidence' });
  }
});

module.exports = router;
