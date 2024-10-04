const express = require("express");
const roomController = require("../controllers/roomController");
const router = express.Router();

// Route to create a new room
router.post("", roomController.createRoom);

// Route to get all rooms
router.get("", roomController.getAllRooms);

// Route to get a specific room by ID
router.get("/:roomId", roomController.getRoomById);

// Route to update a room by ID
router.put("/:roomId", roomController.updateRoom);

// Route to delete a room by ID
router.delete("/:roomId", roomController.deleteRoom);

module.exports = router;
