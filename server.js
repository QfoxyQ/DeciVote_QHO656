import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import adminRoutes from "./backend/routes/adminRoutes.js";
import electionRoutes from "./backend/routes/electionRoutes.js";
import voterRoutes from "./backend/routes/voterRoutes.js";
import resultRoutes from "./backend/routes/resultRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "frontend")));
app.use(express.static(__dirname));

app.get("/api/contract-address", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync("contract-address.json", "utf8"));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Contract address not found" });
  }
});

app.use("/api/admin", adminRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/voters", voterRoutes);
app.use("/api/results", resultRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));