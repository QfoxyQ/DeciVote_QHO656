import express from "express";
import {
  createElection,
  getElection,
  getCandidates,
  getResults,
  vote,
  getElectionCount
} from "../services/blockchainService.js";

const router = express.Router();

function serializeBigInt(value) {
  return JSON.parse(
    JSON.stringify(value, (_, v) =>
      typeof v === "bigint" ? v.toString() : v
    )
  );
}

// Get total election count
router.get("/count", async (req, res) => {
  try {
    const count = await getElectionCount();
    res.json({
      success: true,
      count: parseInt(count.toString())
    });
  } catch (error) {
    console.error("Get election count error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new election
router.post("/", async (req, res) => {
  try {
    const { name, startTime, endTime } = req.body;

    const receipt = await createElection(name, startTime, endTime);

    res.json({
      success: true,
      message: "Election created successfully",
      txHash: receipt.hash
    });
  } catch (error) {
    console.error("Create election error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get one election
router.get("/:id", async (req, res) => {
  try {
    const election = await getElection(req.params.id);

    res.json({
      success: true,
      election: serializeBigInt(election)
    });
  } catch (error) {
    console.error("Get election error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get candidates for election
router.get("/:id/candidates", async (req, res) => {
  try {
    const candidates = await getCandidates(req.params.id);

    res.json({
      success: true,
      candidates: serializeBigInt(candidates)
    });
  } catch (error) {
    console.error("Get candidates error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get results for election
router.get("/:id/results", async (req, res) => {
  try {
    const results = await getResults(req.params.id);

    res.json({
      success: true,
      results: serializeBigInt(results)
    });
  } catch (error) {
    console.error("Get results error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cast a vote
router.post("/:id/vote", async (req, res) => {
  try {
    const { electionId, candidateId } = req.body;

    const receipt = await vote(electionId, candidateId);

    res.json({
      success: true,
      message: "Vote cast successfully",
      txHash: receipt.hash
    });
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

