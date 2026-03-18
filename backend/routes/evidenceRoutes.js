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
      if (err) return res.send(err);

      db.run(
        `INSERT INTO logs (evidence_id, user, action, timestamp)
         VALUES (?, ?, ?, ?)`,
        [this.lastID, user, "UPLOAD", new Date().toISOString()]
      );

      res.json({ message: "Uploaded successfully" });
    }
  );
});

// Get all evidence
router.get("/all", (req, res) => {
  db.all("SELECT * FROM evidence", [], (err, rows) => {
    res.json(rows);
  });
});

module.exports = router;