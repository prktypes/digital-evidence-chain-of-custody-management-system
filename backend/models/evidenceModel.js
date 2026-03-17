const mongoose = require('mongoose');

const EvidenceSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalname: { type: String },
  path: { type: String, required: true },
  hash: { type: String, required: true, index: true },
  size: { type: Number },
  timestamp: { type: String },
  metadata: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Evidence', EvidenceSchema);
