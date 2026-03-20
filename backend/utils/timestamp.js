// Utility: return an ISO 8601 timestamp string for receipts/logging.
// This centralizes timestamp formatting so the rest of the codebase can
// rely on consistent timestamps for DB rows and audit logs.
function generateTimestamp() {
  return new Date().toISOString();
}

module.exports = generateTimestamp;