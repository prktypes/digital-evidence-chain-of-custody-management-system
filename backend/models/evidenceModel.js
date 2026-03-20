// Mongoose schema for Evidence (not required for SQLite-backed routes, but
// provided for completeness if the project uses MongoDB in other contexts).
// This file defines the shape of an Evidence document used by Mongoose.
const mongoose = require('mongoose');

const EvidenceSchema = new mongoose.Schema({
  // stored filename on disk
  filename: { type: String, required: true },
  // original file name uploaded by the user
  originalname: { type: String },
  // filesystem path to the file
  path: { type: String, required: true },
  // SHA-256 hash of the file contents
  hash: { type: String, required: true, index: true },
  // file size in bytes
  size: { type: Number },
  // human-readable timestamp string
  timestamp: { type: String },
  // additional metadata if any
  metadata: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Evidence', EvidenceSchema);
