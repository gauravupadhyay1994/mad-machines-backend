const Room = require("../models/roomModel");

// Function to create a room
const createRoom = async (req, res) => {
  const { name, capacity } = req.body;

  try {
    const room = await Room.create({ name, capacity });
    return res.status(201).json(room);
  } catch (error) {
    console.error("Error creating room:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while creating the room." });
  }
};

module.exports = {
  createRoom,
};
