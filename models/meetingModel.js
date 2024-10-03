// src/models/meetingModel.js
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
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  created_by: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

// Setting up relationships
Meeting.belongsTo(Participant, { foreignKey: "created_by" });
Participant.hasMany(Meeting, { foreignKey: "created_by" });
Meeting.belongsTo(Room, { foreignKey: "room_id" });
Room.hasMany(Meeting, { foreignKey: "room_id" });

module.exports = Meeting;
