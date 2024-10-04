const { Op } = require("sequelize");
const Meeting = require("../models/meetingModel");
const Participant = require("../models/participantModel");
const Room = require("../models/roomModel");
const {
  checkForCollisions,
  canParticipantBeAdded,
} = require("../services/meetingService");

// Create a new meeting
const createMeeting = async (req, res) => {
  const { title, roomId, participantIds, startTime, endTime, createdBy } =
    req.body;

  if (!roomId) {
    return res.status(400).json({ message: "room Id must be provided" });
  }

  if (!title) {
    return res.status(400).json({ message: "meeting title must be provided" });
  }

  if (!startTime || !endTime) {
    return res
      .status(400)
      .json({ message: "start and end time must be provided" });
  }

  if (!createdBy) {
    return res.status(400).json({ message: "createdBy must be provided" });
  }

  try {
    // Check for collisions (room or participants availability)
    const collisionCheck = await checkForCollisions(
      roomId,
      startTime,
      endTime,
      participantIds
    );

    if (collisionCheck.collision) {
      return res.status(400).json({ message: collisionCheck.message });
    }

    // Create the meeting
    const meeting = await Meeting.create({
      title,
      room_id: roomId,
      start_time: startTime,
      end_time: endTime,
      created_by: createdBy,
    });

    const allParticipantIds = participantIds
      ? [...participantIds, createdBy]
      : [createdBy];

    // Add participants to the meeting
    await meeting.addParticipants(allParticipantIds);

    return res
      .status(201)
      .json({ message: "Meeting created successfully", meeting });
  } catch (error) {
    console.error("Error creating meeting:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all meetings
const getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.findAll({
      order: [["start_time", "ASC"]],
      include: [
        { model: Participant, through: { attributes: [] }, as: "participants" },
        { model: Room, as: "Room" },
      ],
    });

    return res.status(200).json(meetings);
  } catch (error) {
    console.error("Error getting all meetings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get meetings by room ID
const getMeetingsByRoom = async (req, res) => {
  const { roomId } = req.params;

  try {
    const room = await Room.findByPk(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const meetings = await Meeting.findAll({
      where: { room_id: roomId },
      order: [["start_time", "ASC"]],
      include: [
        { model: Room, as: "Room" },
        { model: Participant, through: { attributes: [] }, as: "participants" },
      ],
    });

    return res.status(200).json(meetings);
  } catch (error) {
    console.error("Error getting meetings by room:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get meetings by participant ID
const getMeetingsByParticipant = async (req, res) => {
  const { participantId } = req.params;
  try {
    const meetings = await Meeting.findAll({
      include: [
        {
          model: Participant,
          where: { id: participantId },
          through: { attributes: [] },
          as: "participants",
        },
        { model: Room, as: "Room" },
      ],
      order: [["start_time", "ASC"]],
    });

    return res.status(200).json(meetings);
  } catch (error) {
    console.error("Error getting meetings by participant:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const addParticipantToMeeting = async (req, res) => {
  const { participantId } = req.body;
  const { meetingId } = req.params;
  console.log("meeting Id: ", meetingId);

  try {
    if (participantId.length == 0) {
      return res.status(404).json({ message: "No participant provided" });
    }

    for (const id of participantId) {
      const participant = await Participant.findByPk(id);
      if (!participant) {
        return res
          .status(404)
          .json({ message: `Participant with ID ${id} not found.` });
      }
    }
    // Add the participant to the meeting

    const meeting = await Meeting.findByPk(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found." });
    }
    // Check if the participant can be added to the meeting

    console.log("here");
    const collisionCheck = await canParticipantBeAdded(
      meeting.start_time,
      meeting.end_time,
      [participantId]
    );
    console.log("after");
    if (collisionCheck.collision) {
      return res.status(409).json({ message: collisionCheck.message });
    }

    await meeting.addParticipant(participantId);
    return res.status(200).json({ message: "Participant added successfully." });
  } catch (error) {
    console.error("Error adding participant:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while adding the participant." });
  }
};

const deleteMeeting = async (req, res) => {
  const { meetingId } = req.params;

  try {
    // Find the meeting by ID
    const meeting = await Meeting.findByPk(meetingId);

    // Check if the meeting exists
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    // Remove all associated participants first (if you want to do this)
    await meeting.removeParticipants(await meeting.getParticipants());

    // Delete the meeting
    await meeting.destroy();

    return res.status(201).json({ message: "Meeting deleted successfully" });
  } catch (error) {
    console.error("Error deleting meeting:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const removeParticipantFromMeeting = async (req, res) => {
  const { meetingId, participantId } = req.params;

  try {
    // Find the meeting by ID
    const meeting = await Meeting.findByPk(meetingId);

    // Check if the meeting exists
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    // Check if the participant being removed is the creator of the meeting
    if (participantId === meeting.created_by.toString()) {
      return res
        .status(403)
        .json({ message: "Creator of the meeting cannot be removed." });
    }

    // Find the participant by ID
    const participant = await Participant.findByPk(participantId);

    // Check if the participant exists
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    // Remove the participant from the meeting
    await meeting.removeParticipant(participantId);

    return res
      .status(200)
      .json({ message: "Participant removed from meeting successfully" });
  } catch (error) {
    console.error("Error removing participant from meeting:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createMeeting,
  getAllMeetings,
  getMeetingsByRoom,
  getMeetingsByParticipant,
  addParticipantToMeeting,
  deleteMeeting,
  removeParticipantFromMeeting,
};
