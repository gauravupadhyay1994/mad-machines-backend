const express = require("express");
const sequelize = require("./config/db");
const meetingRoutes = require("./routers/meetingRoutes");
const participantRoutes = require("./routers/participantRouters");
const roomRoutes = require("./routers/roomRouters");

const app = express();
app.use(express.json());

app.use("/v1/meetings", meetingRoutes); // Meeting routes
app.use("/v1/participants", participantRoutes); // Participant route
app.use("/v1/rooms", roomRoutes); // roomRoutes route

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); // Use force: true to drop and recreate tables (for development)
    console.log("Database & tables created!");
  } catch (error) {
    console.error("Error creating database tables:", error);
  }
};

// Start the server and sync database
const startServer = async () => {
  await syncDatabase();
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
};

startServer();
