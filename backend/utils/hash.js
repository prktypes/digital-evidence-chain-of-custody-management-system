const crypto = require("crypto");
const fs = require("fs");

function generateHash(filepath) {
  const fileBuffer = fs.readFileSync(filepath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

module.exports = generateHash;