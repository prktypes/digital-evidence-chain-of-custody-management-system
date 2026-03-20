// Routes for verifying a file against a stored evidence hash
// - Expects multipart/form-data with `file` and form fields `evidence_id` and `user`
// - Computes the uploaded file's SHA-256 hash and compares it to the stored value
const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../db");
const generateHash = require("../utils/hash");

const router = express.Router();

// Use disk storage helper (simple dest). Multer will put files in uploads/.
const upload = multer({ dest: "uploads/" });

router.post("/verify", upload.single("file"), (req, res) => {
  const file = req.file;
  const { evidence_id, user } = req.body;

  // Validate inputs
  if (!file) return res.status(400).json({ error: "No file provided for verification" });
  if (!evidence_id) return res.status(400).json({ error: "Missing evidence_id" });

  // Compose a reliable path to the uploaded file for hashing
  const filePath = file.path || (file.destination && file.filename ? path.join(file.destination, file.filename) : undefined);
  if (!filePath) return res.status(500).json({ error: "Unable to determine uploaded file path" });

  let newHash;
  try {
    newHash = generateHash(filePath);
  } catch (err) {
    return res.status(500).json({ error: "Failed to compute hash", details: err.message });
  }

  // Fetch the stored evidence row and compare hashes
  db.get(
    "SELECT * FROM evidence WHERE id = ?",
    [evidence_id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "Evidence not found" });

      let result = "Verified";
      if (newHash !== row.file_hash) {
        result = "Tampered";
      }

      // Persist verification result and an audit log
      db.run(
        "UPDATE evidence SET status = ? WHERE id = ?",
        [result, evidence_id]
      );

      db.run(
        `INSERT INTO logs (evidence_id, user, action, timestamp)
         VALUES (?, ?, ?, ?)`,
        [evidence_id, user, "VERIFY", new Date().toISOString()]
      );

      res.json({ result });
    }
  );
});

module.exports = router;