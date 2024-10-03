const { Op } = require("sequelize");
const Meeting = require("../models/meetingModel");
const Participant = require("../models/participantModel");

// Check for meeting collisions
const checkForCollisions = async (
  roomId,
  startTime,
  endTime,
  participantIds = []
) => {
  try {
    // Check for room conflicts (any meeting in the room that overlaps with the given time)
    const roomCollision = await Meeting.count({
      where: {
        room_id: roomId,
        [Op.or]: [
          { start_time: { [Op.between]: [startTime, endTime] } },
          { end_time: { [Op.between]: [startTime, endTime] } },
          {
            [Op.and]: [
              { start_time: { [Op.lt]: endTime } },
              { end_time: { [Op.gt]: startTime } },
            ],
          },
        ],
      },
    });

    if (roomCollision > 0) {
      return {
        collision: true,
        message: "Room is already booked during this time.",
      };
    }

    // If participants are provided, check if they have conflicts
    if (participantIds.length > 0) {
      const participantCollision = await Meeting.count({
        include: [
          {
            model: Participant,
            where: { id: { [Op.in]: participantIds } }, // Check for all participants
          },
        ],
        where: {
          [Op.or]: [
            { start_time: { [Op.between]: [startTime, endTime] } },
            { end_time: { [Op.between]: [startTime, endTime] } },
            {
              [Op.and]: [
                { start_time: { [Op.lt]: endTime } },
                { end_time: { [Op.gt]: startTime } },
              ],
            },
          ],
        },
      });

      if (participantCollision > 0) {
        return {
          collision: true,
          message:
            "One or more participants have a conflicting meeting during this time.",
        };
      }
    }

    return {
      collision: false,
      message: "No collisions found, you can create the meeting.",
    };
  } catch (error) {
    console.error("Error checking for collisions:", error);
    throw error;
  }
};

// Check for meeting collisions
const canParticipantBeAdded = async (startTime, endTime, participantIds) => {
  try {
    // If participants are provided, check if they have conflicts
    if (participantIds.length > 0) {
      const participantCollision = await Meeting.count({
        include: [
          {
            model: Participant,
            where: { id: { [Op.in]: participantIds } }, // Check for all participants
          },
        ],
        where: {
          [Op.or]: [
            { start_time: { [Op.between]: [startTime, endTime] } },
            { end_time: { [Op.between]: [startTime, endTime] } },
            {
              [Op.and]: [
                { start_time: { [Op.lt]: endTime } },
                { end_time: { [Op.gt]: startTime } },
              ],
            },
          ],
        },
      });

      if (participantCollision > 0) {
        return {
          collision: true,
          message:
            "One or more participants have a conflicting meeting during this time.",
        };
      }
    }

    return {
      collision: false,
      message: "No collisions found, you can create the meeting.",
    };
  } catch (error) {
    console.error("Error checking for collisions:", error);
    throw error;
  }
};

module.exports = { checkForCollisions, canParticipantBeAdded };
