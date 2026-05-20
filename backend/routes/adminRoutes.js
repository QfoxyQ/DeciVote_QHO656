import express from "express";
import {
  addCandidate,
  authorizeVoter
} from "../services/blockchainService.js";

const router = express.Router();

// Add candidate to an election
router.post("/candidate", async (req, res) => {
  try {
    const { electionId, name, party } = req.body;

    const receipt = await addCandidate(electionId, name, party);

    res.json({
      success: true,
      message: "Candidate added successfully",
      txHash: receipt.hash
    });
  } catch (error) {
    console.error("Add candidate error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Authorize voter for an election
router.post("/authorize-voter", async (req, res) => {
  try {
    const { electionId, voterAddress } = req.body;

    const receipt = await authorizeVoter(electionId, voterAddress);

    res.json({
      success: true,
      message: "Voter authorized successfully",
      txHash: receipt.hash
    });
  } catch (error) {
    console.error("Authorize voter error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
