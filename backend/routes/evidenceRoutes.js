// Routes for handling evidence uploads and listing.
// Responsibilities:
// - Accept multipart/form-data uploads and store files on disk
// - Compute a SHA-256 hash for each uploaded file
// - Insert evidence metadata into the sqlite `evidence` table
// - Append an audit entry into the `logs` table for traceability
const express = require("express");
const multer = require("multer");
const db = require("../db");
const path = require("path");
const generateHash = require("../utils/hash");
const generateTimestamp = require("../utils/timestamp");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload Evidence
router.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  const user = req.body.user;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Multer may not always populate `file.path` depending on platform/version.
  // Build a safe filepath fallback from destination + filename.
  const filePath = file.path || (file.destination && file.filename
    ? path.join(file.destination, file.filename)
    : undefined);

  if (!filePath) {
    return res.status(500).json({ error: "Could not determine uploaded file path" });
  }

  const hash = generateHash(filePath);
  const timestamp = generateTimestamp();

  db.run(
    `INSERT INTO evidence (file_name, file_hash, uploader, upload_time, timestamp_receipt, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [file.filename, hash, user, new Date().toISOString(), timestamp, "Verified"],
    function (err) {
      // If inserting metadata fails, return a 500 so the client knows the
      // upload wasn't fully recorded. The physical file may still exist on disk.
      if (err) return res.status(500).json({ error: err.message });

      // Record audit log for the upload. We don't block the response on the
      // log insertion; best-effort logging is acceptable here, but we still
      // call db.run to persist the log.
      db.run(
        `INSERT INTO logs (evidence_id, user, action, timestamp)
         VALUES (?, ?, ?, ?)`,
        [this.lastID, user, "UPLOAD", new Date().toISOString()]
      );

      // Success: return the ID of the new evidence row for client reference
      res.json({ message: "Uploaded successfully", id: this.lastID });
    }
  );
});

// Get all evidence
router.get("/all", (req, res) => {
  // Return all evidence rows. Respond with 500 on DB error.
  db.all("SELECT * FROM evidence", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;