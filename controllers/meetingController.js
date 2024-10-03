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

    // Add participants if provided
    if (participantIds && participantIds.length > 0) {
      await meeting.addParticipants(participantIds);
    }

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
        { model: Participant, through: { attributes: [] }, as: "Participants" },
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
    const meetings = await Meeting.findAll({
      where: { room_id: roomId },
      order: [["start_time", "ASC"]],
      include: [
        { model: Room, as: "Room" },
        { model: Participant, through: { attributes: [] }, as: "Participants" },
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
          as: "Participants",
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

// Get meetings by multiple participant IDs
const getMeetingsByParticipants = async (req, res) => {
  const { participantIds } = req.body; // Expect an array of participant IDs

  try {
    const meetings = await Meeting.findAll({
      include: [
        {
          model: Participant,
          where: { id: { [Op.in]: participantIds } },
          through: { attributes: [] },
          as: "Participants",
        },
        { model: Room, as: "Room" },
      ],
      order: [["start_time", "ASC"]],
    });

    return res.status(200).json(meetings);
  } catch (error) {
    console.error("Error getting meetings by participants:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get meetings happening at a particular time
const getMeetingsByTime = async (req, res) => {
  const { startTime, endTime } = req.query;

  try {
    const meetings = await Meeting.findAll({
      where: {
        [Op.or]: [
          {
            start_time: { [Op.between]: [startTime, endTime] },
          },
          {
            end_time: { [Op.between]: [startTime, endTime] },
          },
          {
            [Op.and]: [
              { start_time: { [Op.lt]: endTime } },
              { end_time: { [Op.gt]: startTime } },
            ],
          },
        ],
      },
      include: [
        { model: Participant, through: { attributes: [] }, as: "Participants" },
        { model: Room, as: "Room" },
      ],
      order: [["start_time", "ASC"]],
    });

    return res.status(200).json(meetings);
  } catch (error) {
    console.error("Error getting meetings by time:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const addParticipantToMeeting = async (req, res) => {
  const { meetingId, participantId, startTime, endTime } = req.body;

  try {
    // Check if the participant can be added to the meeting
    const collisionCheck = await canParticipantBeAdded(startTime, endTime, [
      participantId,
    ]);
    if (collisionCheck.collision) {
      return res.status(409).json({ message: collisionCheck.message });
    }

    // Add the participant to the meeting
    const meeting = await Meeting.findByPk(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found." });
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

module.exports = {
  createMeeting,
  getAllMeetings,
  getMeetingsByRoom,
  getMeetingsByParticipant,
  getMeetingsByParticipants,
  getMeetingsByTime,
  addParticipantToMeeting,
};
