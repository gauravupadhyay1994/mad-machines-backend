# mad-machines-backend

This repository contains a Meeting Scheduler API built with Node.js and Express.js, designed to help schedule meetings while preventing conflicts such as double bookings of rooms or overlapping participant schedules.

# Assumptions:

1. Meetings can be scheduled at any time, including non-standard hours.
2. There is no limit to the capacity of any room.
3. Any user can create a meeting.
4. Any user can invite others to participate in a meeting.

Note: login is not implemented, therefore meeting created by will be passed manually

# Database Choice: PostgreSQL

Reason: PostgreSQL is chosen because of its strong support for concurrent transactions, making it ideal for handling collision detection. It also supports complex queries with its robust SQL capabilities, enabling easy querying for overlapping time periods and participant availability. Additionally, its ACID compliance ensures data consistency and integrity in a scheduling system.

Database tables are provided in the schema.sql within the db folder available in the same directory

# API endpoints

    You can import file for the postman available within the same directory with the postman folder to check all the api endpoints

- How the Scheduler Works
  The scheduler operates through a series of checks and validations to ensure that meetings can be scheduled without conflicts. Here’s an in-depth explanation of the scheduling process:

1.  Creating a Meeting
    When a new meeting is created, the following steps are executed:

    Input Validation: The API checks the provided input to ensure that all required fields (start time, end time, and room ID) are present and correctly formatted.

    Collision Check: Before proceeding, the API invokes the checkForCollisions function. This function performs two key checks:

    Room Collision: It queries the database to determine if the specified room is already booked during the requested time frame.

    It checks: If the new meeting's start time falls within an existing meeting's duration.
    If the new meeting's end time falls within an existing meeting's duration.
    If the existing meeting starts before the new meeting ends and ends after the new meeting starts.

    Participant Collision: If participant IDs are provided, the function checks if any of the specified participants are already scheduled for another meeting during the requested time. Similar checks are applied as with the room collision.

    Scheduling the Meeting: If no collisions are found, the meeting is scheduled, and its details are stored in the database.

2.  Adding Participants to a Meeting
    When adding participants to an existing meeting:

         The API first verifies that the meeting exists.
         It then checks for collisions for each participant being added using the canParticipantBeAdded function, which follows a similar process to the room collision checks.
         If all checks pass, the participants are added to the meeting. 3. Retrieving Meetings

# Getting Started

-- Prerequisites
Node.js
PostgreSQL

# Installation

Clone the repository:

    git clone https://github.com/gauravupadhyay1994/mad-machines-backend.git

Navigate to the project directory:

    cd meeting-machines-backend

Install the dependencies:

    npm install

Configure the database connection in the .env file. (parameters to be added are given in the .env.example file in the directory)

Run the server:

    npm run dev

Testing the API with Postman

    Open Postman and import the collection
