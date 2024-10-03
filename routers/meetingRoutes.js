const express = require("express");
const meetingController = require("../controllers/meetingController");

const router = express.Router();

// Route to create a new meeting
router.post("", meetingController.createMeeting);

// Route to get all meetings
router.get("", meetingController.getAllMeetings);

// Route to get meetings by room ID
router.get("/room/:roomId", meetingController.getMeetingsByRoom);

// Route to get meetings by participant ID
router.get(
  "/participant/:participantId",
  meetingController.getMeetingsByParticipant
);

// Route to get meetings by multiple participant IDs
router.post("/participants", meetingController.getMeetingsByParticipants);

// Route to get meetings happening during a particular time
router.get("/time", meetingController.getMeetingsByTime);

router.post(
  "/:meetingId/participants",
  meetingController.addParticipantToMeeting
); // Add a participant to a meeting

module.exports = router;
