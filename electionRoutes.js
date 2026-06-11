import express from "express";
import { createElection, getElection, getCandidates, getResults, getElectionCount } from "./blockchainService.js";

const router = express.Router();

function serialize(value) {
  return JSON.parse(JSON.stringify(value, (_, v) => typeof v === "bigint" ? v.toString() : v));
}

router.post("/", async (req, res) => {
  try {
    const { name, startTime, endTime } = req.body;
    const receipt = await createElection(name, startTime, endTime);
    res.json({ success: true, txHash: receipt.hash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/count", async (req, res) => {
  try {
    const count = await getElectionCount();
    res.json({ success: true, count: Number(count) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const election = await getElection(req.params.id);
    res.json({ success: true, election: serialize(election) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/:id/candidates", async (req, res) => {
  try {
    const candidates = await getCandidates(req.params.id);
    res.json({ success: true, candidates: serialize(candidates) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/:id/results", async (req, res) => {
  try {
    const results = await getResults(req.params.id);
    res.json({ success: true, results: serialize(results) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;