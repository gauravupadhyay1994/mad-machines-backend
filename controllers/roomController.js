const Room = require("../models/roomModel");

// Create a new room
const createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const room = await Room.create({ name });
    res.status(201).json(room);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to create room", details: error.message });
  }
};

// Get all rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.status(200).json(rooms);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to fetch rooms", details: error.message });
  }
};

// Get a specific room by ID
const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findByPk(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to fetch room", details: error.message });
  }
};

// Update a room
const updateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(404).json({ error: "Room id must be provided" });
    }
    const { name } = req.body;
    const room = await Room.findByPk(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.name = name;
    await room.save();

    res.status(200).json(room);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to update room", details: error.message });
  }
};

// Delete a room
const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findByPk(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    await room.destroy();
    res.status(204).json({ message: "Room deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to delete room", details: error.message });
  }
};

module.exports = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
};
