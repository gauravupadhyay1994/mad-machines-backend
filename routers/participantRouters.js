const express = require("express");
const participantController = require("../controllers/participantController");
const router = express.Router();

// Route to create a participant
router.post("", participantController.createParticipant);

// Route to get all participants
router.get("", participantController.getAllParticipants);

// Route to get a specific participant by ID
router.get("/:participantId", participantController.getParticipantById);

// Route to update a participant by ID
router.put("/:participantId", participantController.updateParticipant);

// Route to delete a participant by ID
router.delete("/:participantId", participantController.deleteParticipant);

module.exports = router;
