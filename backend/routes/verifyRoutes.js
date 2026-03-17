const express = require('express');
const multer = require('multer');
const path = require('path');

const Evidence = require('../models/evidenceModel');
const { hashBufferOrFile } = require('../utils/hash');
const { nowISO } = require('../utils/timestamp');

const router = express.Router();
const upload = multer({ dest: path.join(__dirname, '..', 'uploads') });

// POST /api/verify/hash - verify by hash value
router.post('/hash', async (req, res) => {
  const { hash } = req.body;
  if (!hash) return res.status(400).json({ error: 'Missing hash' });

  try {
    const found = await Evidence.findOne({ hash });
    res.json({ match: !!found, evidence: found || null, checkedAt: nowISO() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// POST /api/verify/file - verify by uploading a file to compute its hash
router.post('/file', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const hash = await hashBufferOrFile(req.file.path);
    const found = await Evidence.findOne({ hash });
    res.json({ hash, match: !!found, evidence: found || null, checkedAt: nowISO() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

module.exports = router;
