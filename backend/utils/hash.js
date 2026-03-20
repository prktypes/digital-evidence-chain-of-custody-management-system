// Utility: compute a SHA-256 hex digest for a file on disk.
// Input: filepath (string) - absolute or relative path to the file
// Output: hex string of SHA-256(file)
const crypto = require("crypto");
const fs = require("fs");

function generateHash(filepath) {
  // Read the entire file synchronously. This is simple and works for
  // small-to-moderate files; for very large files a streaming approach
  // would be preferable.
  const fileBuffer = fs.readFileSync(filepath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

module.exports = generateHash;