const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  details: { type: Object },
  timestamp: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Log', LogSchema);
