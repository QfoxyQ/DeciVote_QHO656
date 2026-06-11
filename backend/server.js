import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import adminRoutes from "./routes/adminRoutes.js";
import electionRoutes from "./routes/electionRoutes.js";
import voterRoutes from "./routes/voterRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api/admin", adminRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/voters", voterRoutes);
app.use("/api/results", resultRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "DeciVote backend is running" });
});

app.get("/api/contract-address", (req, res) => {
  res.json({
    success: true,
    address: process.env.CONTRACT_ADDRESS
  });
});

// Serve HTML files
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin.html"));
});

app.get("/user", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/user.html"));
});

app.get("/results", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/results.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
