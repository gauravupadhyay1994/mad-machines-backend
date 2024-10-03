const express = require("express");
const participantController = require("../controllers/participantController");
const router = express.Router();

router.post("", participantController.createParticipant); // Create a participant

module.exports = router;
