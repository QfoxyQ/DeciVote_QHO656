import fs from "fs";
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

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const frontendPath = path.join(projectRoot, "frontend");
const artifactsPath = path.join(projectRoot, "artifacts");
const artifactFile = path.join(
  artifactsPath,
  "contracts",
  "DeciVote.sol",
  "DeciVote.json"
);

app.use(cors());
app.use(express.json());

// Frontend and ABI/artifact access
app.use(express.static(frontendPath));
app.use("/artifacts", express.static(artifactsPath));

app.get("/contract-abi", (req, res) => {
  try {
    if (!fs.existsSync(artifactFile)) {
      return res.status(404).json({
        success: false,
        error: `Contract artifact not found at ${artifactFile}`
      });
    }

    const artifact = JSON.parse(fs.readFileSync(artifactFile, "utf8"));
    res.json(artifact);
  } catch (error) {
    console.error("ABI load error:", error);
    res.status(500).json({
      success: false,
      error: "Could not load contract ABI"
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "DeciVote backend is running" });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "admin.html"));
});

app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(frontendPath, "admin.html"));
});

app.get("/user.html", (req, res) => {
  res.sendFile(path.join(frontendPath, "user.html"));
});

app.get("/results.html", (req, res) => {
  res.sendFile(path.join(frontendPath, "results.html"));
});

app.use("/api/admin", adminRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/voters", voterRoutes);
app.use("/api/results", resultRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Serving frontend from: ${frontendPath}`);
  console.log(`Serving contract artifact from: ${artifactFile}`);
});
