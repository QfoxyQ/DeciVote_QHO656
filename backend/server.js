import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import adminRoutes from "./routes/adminRoutes.js";
import electionRoutes from "./routes/electionRoutes.js";
import voterRoutes from "./routes/voterRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../frontend");

app.use(express.static(frontendPath));


app.use(cors());
app.use(express.json());



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


app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "DeciVote backend is running" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});