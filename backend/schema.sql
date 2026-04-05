CREATE TABLE registered_alumni (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL,
  roll_number VARCHAR(50) NOT NULL,
  batch_year INT NOT NULL,
  faculty VARCHAR(100) NOT NULL,
  degree VARCHAR(100) NOT NULL
);

CREATE TABLE tweets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES registered_alumni(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES registered_alumni(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  company VARCHAR(200) NOT NULL,
  location VARCHAR(200),
  salary_range VARCHAR(100),               -- e.g., "50,000 - 70,000 PKR"
  employment_type VARCHAR(100),            -- e.g., Full-Time, Part-Time, Internship
  experience_required VARCHAR(100),        -- e.g., "1-2 years", "Fresh"
  skills_required TEXT,                    -- comma-separated or JSON
  deadline DATE,                           -- application deadline
  contact_email VARCHAR(200),              -- email to reach HR 
  is_active BOOLEAN DEFAULT TRUE,          -- mark job as filled/inactive
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE job_applications (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES registered_alumni(id) ON DELETE CASCADE,
  cover_letter TEXT,
  resume_url TEXT,                         -- if resumes are uploaded or stored
  status VARCHAR(50) DEFAULT 'Pending',    -- Pending, Accepted, Rejected, Shortlisted
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

CREATE TABLE subadmins (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

CREATE TABLE event_rsvps (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES registered_alumni(id) ON DELETE CASCADE,
  rsvp_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (event_id, user_id)
); 