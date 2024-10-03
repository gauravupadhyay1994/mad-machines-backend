const Participant = require("../models/participantModel");

// Function to create a participant
const createParticipant = async (req, res) => {
  const { name, email } = req.body;

  try {
    const participant = await Participant.create({ name, email });
    return res.status(201).json(participant);
  } catch (error) {
    console.error("Error creating participant:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while creating the participant." });
  }
};

module.exports = {
  createParticipant,
};
