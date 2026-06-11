import express from "express";
import {
  addCandidate,
  authorizeVoter,
  deleteCandidate,
  updateCandidate,
  endElection
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

// Delete candidate from an election
router.post("/candidate/delete", async (req, res) => {
  try {
    const { electionId, candidateId } = req.body;

    const receipt = await deleteCandidate(electionId, candidateId);

    res.json({
      success: true,
      message: "Candidate deleted successfully",
      txHash: receipt.hash
    });
  } catch (error) {
    console.error("Delete candidate error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update candidate
router.post("/candidate/update", async (req, res) => {
  try {
    const { electionId, candidateId, name, party } = req.body;

    const receipt = await updateCandidate(electionId, candidateId, name, party);

    res.json({
      success: true,
      message: "Candidate updated successfully",
      txHash: receipt.hash
    });
  } catch (error) {
    console.error("Update candidate error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// End election
router.post("/election/end", async (req, res) => {
  try {
    const { electionId } = req.body;

    const receipt = await endElection(electionId);

    res.json({
      success: true,
      message: "Election ended successfully",
      txHash: receipt.hash
    });
  } catch (error) {
    console.error("End election error:", error);
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
