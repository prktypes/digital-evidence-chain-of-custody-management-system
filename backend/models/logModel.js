// Mongoose schema for audit logs. The application primarily uses sqlite for
// persistence, but this model can be used if the project switches to MongoDB.
const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  // The type of action performed, e.g. 'UPLOAD' or 'VERIFY'
  action: { type: String, required: true },
  // Optional details about the action (user, evidence id, extra metadata)
  details: { type: Object },
  // ISO timestamp string for the action
  timestamp: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Log', LogSchema);
