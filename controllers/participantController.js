const Participant = require("../models/participantModel");

// Create a new participant
const createParticipant = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if a participant with the same email already exists
    const existingParticipant = await Participant.findOne({ where: { email } });

    if (existingParticipant) {
      return res.status(409).json({
        error: "Participant with this email already exists.",
      });
    }
    const participant = await Participant.create({ name, email });
    res.status(201).json(participant);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to create participant", details: error.message });
  }
};

// Get all participants
const getAllParticipants = async (req, res) => {
  try {
    const participants = await Participant.findAll();
    res.status(200).json(participants);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to fetch participants", details: error.message });
  }
};

// Get a specific participant by ID
const getParticipantById = async (req, res) => {
  try {
    const { participantId } = req.params;
    const participant = await Participant.findByPk(participantId);

    if (!participant) {
      return res.status(404).json({ error: "Participant not found" });
    }

    res.status(200).json(participant);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to fetch participant", details: error.message });
  }
};

// Update a participant
const updateParticipant = async (req, res) => {
  try {
    const { participantId } = req.params;
    const { name, email } = req.body;
    const participant = await Participant.findByPk(participantId);

    if (!participant) {
      return res.status(404).json({ error: "Participant not found" });
    }

    participant.name = name || participant.name;
    participant.email = email || participant.email;
    await participant.save();

    res.status(200).json(participant);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to update participant", details: error.message });
  }
};

// Delete a participant
const deleteParticipant = async (req, res) => {
  try {
    const { participantId } = req.params;
    const participant = await Participant.findByPk(participantId);

    if (!participant) {
      return res.status(404).json({ error: "Participant not found" });
    }

    await participant.destroy();
    res.status(200).json({ message: "Participant deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to delete participant", details: error.message });
  }
};

module.exports = {
  createParticipant,
  getAllParticipants,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
};
