// Main HTTP server for the backend API
// - Sets up middleware (CORS, JSON body parsing)
// - Serves uploaded files from the `/uploads` directory
// - Mounts route handlers for evidence and verification endpoints
const express = require("express");
const cors = require("cors");

const app = express();

// Allow cross-origin requests from the frontend during development
app.use(cors());

// Parse incoming JSON bodies for API endpoints
app.use(express.json());

// Serve static uploaded files at /uploads
app.use("/uploads", express.static("uploads"));

// Register route modules (keeps routing organized)
const evidenceRoutes = require("./routes/evidenceRoutes");
const verifyRoutes = require("./routes/verifyRoutes");

app.use("/api/evidence", evidenceRoutes);
app.use("/api/verify", verifyRoutes);

// Start the HTTP server on port 5000
app.listen(5000, () => console.log("Server running on port 5000"));