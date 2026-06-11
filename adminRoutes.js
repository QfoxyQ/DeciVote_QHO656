import express from "express";
import { addCandidate, endElection } from "./blockchainService.js";

const router = express.Router();

router.post("/candidate", async (req, res) => {
  try {
    const { electionId, name, party } = req.body;
    const receipt = await addCandidate(electionId, name, party);
    res.json({ success: true, txHash: receipt.hash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/end-election", async (req, res) => {
  try {
    const { electionId } = req.body;
    const receipt = await endElection(electionId);
    res.json({ success: true, txHash: receipt.hash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;