const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db");

db.serialize(() => {
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

module.exports = db;