const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

const evidenceRoutes = require("./routes/evidenceRoutes");
const verifyRoutes = require("./routes/verifyRoutes");

app.use("/api/evidence", evidenceRoutes);
app.use("/api/verify", verifyRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));