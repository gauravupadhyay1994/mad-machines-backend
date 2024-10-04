const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Participant = require("./participantModel");
const Room = require("./roomModel");

const Meeting = sequelize.define("Meeting", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  room_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  created_by: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

// Setting up relationships
Meeting.belongsTo(Room, { foreignKey: "room_id" });
Room.hasMany(Meeting, { foreignKey: "room_id" });

// Define many-to-many relationship with Participant
Meeting.belongsToMany(Participant, {
  through: "MeetingParticipants",
  foreignKey: "meetingId",
  otherKey: "participantId",
  as: "participants", // Correct alias here
});

// In Participant model
Participant.belongsToMany(Meeting, {
  through: "MeetingParticipants",
  foreignKey: "participantId",
  otherKey: "meetingId",
  as: "meetings", // Correct alias here
});

module.exports = Meeting;
