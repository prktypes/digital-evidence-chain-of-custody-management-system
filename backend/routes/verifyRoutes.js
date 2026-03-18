const express = require("express");
const multer = require("multer");
const db = require("../db");
const generateHash = require("../utils/hash");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/verify", upload.single("file"), (req, res) => {
  const file = req.file;
  const { evidence_id, user } = req.body;

  const newHash = generateHash(file.path);

  db.get(
    "SELECT * FROM evidence WHERE id = ?",
    [evidence_id],
    (err, row) => {
      if (!row) return res.send("Not found");

      let result = "Verified";

      if (newHash !== row.file_hash) {
        result = "Tampered";
      }

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