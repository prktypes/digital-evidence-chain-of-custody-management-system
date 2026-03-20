// sqlite database connection and initialization
// This file creates a lightweight sqlite DB file (`database.db`) and ensures
// the schema (tables) required by the app exist. The rest of the application
// uses this `db` object to query and mutate the data.
const sqlite3 = require("sqlite3").verbose();

// Open (or create) a SQLite database file in the repository root
const db = new sqlite3.Database("./database.db");

// Ensure required tables exist. serialize() runs these commands sequentially.
db.serialize(() => {
  // Evidence table: stores uploaded file metadata and verification status
  db.run(`
    CREATE TABLE IF NOT EXISTS evidence (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_name TEXT,
      file_hash TEXT,
      uploader TEXT,
      upload_time TEXT,
      timestamp_receipt TEXT,
      status TEXT
    )
  `);

  // Logs table: stores audit actions for evidence (upload, verify, etc.)
  db.run(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      evidence_id INTEGER,
      user TEXT,
      action TEXT,
      timestamp TEXT
    )
  `);
});

// Export the DB handle for use in route handlers
module.exports = db;