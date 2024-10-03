-- 1. Create rooms table
CREATE TABLE rooms (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
);

-- 2. Create meetings table
CREATE TABLE meetings (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  room_id INT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by BIGINT NOT NULL,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES participants(id) ON DELETE CASCADE
);


-- 3. Create participants table
CREATE TABLE participants (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(10) 
);


-- 4. Create meeting_participants table
CREATE TABLE meeting_participants (
  id BIGSERIAL PRIMARY KEY,
  meeting_id BIGINT NOT NULL,
  participant_id BIGINT NOT NULL,
  FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE,
  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);
