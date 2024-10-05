# Mad Machines Backend - Meeting Scheduler API

A Node.js and Express.js-based API designed to streamline scheduling meetings, prevent room double bookings, and avoid overlapping participant schedules.

---

## 📋 **Assumptions**

1. **Flexible Scheduling:** Meetings can be scheduled at any time, even outside standard hours.
2. **Unlimited Room Capacity:** No limit on the number of participants a room can accommodate.
3. **Open Participation:** Any user can create a meeting and invite others to join.
4. **Manual Creator Assignment:** Since login is not implemented, the `created_by` field must be manually passed.

---

## 💾 **Database Choice: PostgreSQL**

- **Why PostgreSQL?**
  - **Concurrency:** Ideal for managing transactions without conflict.
  - **Complex Queries:** Robust support for SQL-based queries to handle participant availability and overlapping time periods.
  - **ACID Compliance:** Guarantees data consistency and integrity.

You can find the database schema in `schema.sql` located in the `db` folder.

---

## 🛠️ **Getting Started**

### **Prerequisites**

- **Node.js**
- **PostgreSQL**

### **Installation Steps**

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/gauravupadhyay1994/mad-machines-backend.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd mad-machines-backend
   ```

3. **Install Dependencies:**

   ```bash
   npm install
   ```

4. **Configure the Database Connection:**

   Update your `.env` file using the provided `.env.example` template in the root directory.

5. **Run the Server:**

   ```bash
   npm run dev
   ```

6. **Test the API Using Postman:**

   Import the Postman collection provided in the `postman` folder to test all endpoints.

---

## 🚀 **How the Scheduler Works**

### **1. Creating a Meeting**

- **Input Validation:** Ensures required fields (start time, end time, room ID) are present and formatted correctly.
- **Collision Check:** The `checkForCollisions` function performs two key validations:

  - **Room Collision:** Confirms the room is available by checking for overlapping time slots.
  - **Participant Collision:** Verifies if participants are free during the requested time, ensuring no conflicting meetings.

- **Meeting Creation:** If no collisions are found, the meeting is stored in the database.

---

### **2. Adding Participants to a Meeting**

- **Meeting Validation:** The system ensures the meeting exists before adding participants.
- **Collision Check for Participants:** Using `canParticipantBeAdded`, the system ensures participants have no scheduling conflicts before they're added.

---

### **3. Retrieving Meetings**

All scheduled meetings can be fetched, including room and participant details.

---

## 📑 **API Endpoints**

Import the Postman collection in the `postman` folder to see the full list of API endpoints, parameters, and sample requests.

---

**Happy Scheduling!** 🎉
