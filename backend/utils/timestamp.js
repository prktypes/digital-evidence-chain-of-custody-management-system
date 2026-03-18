// Utility to produce a timestamp string for receipts/logging
function generateTimestamp() {
  return new Date().toISOString();
}

module.exports = generateTimestamp;