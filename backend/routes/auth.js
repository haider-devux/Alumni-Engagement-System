const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, rollNumber, batchYear, faculty, degree } = req.body;
  if (!name || !email || !password || !rollNumber || !batchYear || !faculty || !degree) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const userExists = await pool.query('SELECT * FROM registered_alumni WHERE email = $1', [email]);
  if (userExists.rows.length > 0) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  const hashed = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO registered_alumni (name, email, password, roll_number, batch_year, faculty, degree) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [name, email, hashed, rollNumber, batchYear, faculty, degree]
  );
  res.json({ message: 'User registered' });
});

// Register Subadmin
router.post('/register-subadmin', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const subadminExists = await pool.query('SELECT * FROM subadmins WHERE email = $1', [email]);
  if (subadminExists.rows.length > 0) {
    return res.status(400).json({ error: 'Email already registered as subadmin' });
  }
  const hashed = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO subadmins (name, email, password) VALUES ($1, $2, $3)',
    [name, email, hashed]
  );
  res.json({ message: 'Subadmin registered' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query('SELECT * FROM registered_alumni WHERE email = $1', [email]);
  if (user.rows.length === 0) return res.status(400).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.rows[0].password);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
  res.json({ message: 'Login successful', user: { ...user.rows[0], password: undefined } });
});

// Login Subadmin
router.post('/login-subadmin', async (req, res) => {
  const { email, password } = req.body;
  const subadmin = await pool.query('SELECT * FROM subadmins WHERE email = $1', [email]);
  if (subadmin.rows.length === 0) return res.status(400).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, subadmin.rows[0].password);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
  res.json({ message: 'Login successful', subadmin: { ...subadmin.rows[0], password: undefined } });
});

// Get all users (for admin/testing)
router.get('/registered_alumni', async (req, res) => {
  const registered_alumni = await pool.query('SELECT id, name, email, roll_number, batch_year, faculty, degree FROM registered_alumni');
  res.json(registered_alumni.rows);
});

// Update alumni profile (with optional password change)
router.put('/registered_alumni/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, roll_number, batch_year, faculty, degree, password } = req.body;
  console.log('Update request:', { id, name, email, roll_number, batch_year, faculty, degree, password });
  try {
    let result;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      result = await pool.query(
        'UPDATE registered_alumni SET name=$1, email=$2, roll_number=$3, batch_year=$4, faculty=$5, degree=$6, password=$7 WHERE id=$8',
        [name, email, roll_number, batch_year, faculty, degree, hashed, id]
      );
    } else {
      result = await pool.query(
        'UPDATE registered_alumni SET name=$1, email=$2, roll_number=$3, batch_year=$4, faculty=$5, degree=$6 WHERE id=$7',
        [name, email, roll_number, batch_year, faculty, degree, id]
      );
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found or no changes made' });
    }
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// --- Tweets Endpoints ---
// Create a tweet
router.post('/tweets', async (req, res) => {
  const { user_id, content } = req.body;
  if (!user_id || !content) return res.status(400).json({ error: 'Missing user_id or content' });
  try {
    await pool.query('INSERT INTO tweets (user_id, content) VALUES ($1, $2)', [user_id, content]);
    res.json({ message: 'Tweet posted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to post tweet' });
  }
});

// Get all tweets with user info
router.get('/tweets', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.id, t.content, t.created_at, u.id as user_id, u.name, u.email
      FROM tweets t
      JOIN registered_alumni u ON t.user_id = u.id
      ORDER BY t.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tweets' });
  }
});

// Get all tweets by a specific user
router.get('/tweets/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM tweets WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user tweets' });
  }
});

// --- Jobs Endpoints ---
// Create a job
router.post('/jobs', async (req, res) => {
  const { user_id, title, description, company, location, salary_range, employment_type, experience_required, skills_required, deadline, contact_email, is_active } = req.body;
  if (!user_id || !title || !description || !company) return res.status(400).json({ error: 'Missing required fields' });
  try {
    await pool.query(
      `INSERT INTO jobs (user_id, title, description, company, location, salary_range, employment_type, experience_required, skills_required, deadline, contact_email, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, COALESCE($12, TRUE))`,
      [user_id, title, description, company, location, salary_range, employment_type, experience_required, skills_required, deadline, contact_email, is_active]
    );
    res.json({ message: 'Job posted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to post job' });
  }
});

// Get all jobs with user info
router.get('/jobs', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT j.id, j.title, j.description, j.company, j.location, j.salary_range, j.employment_type, j.experience_required, j.skills_required, j.deadline, j.contact_email, j.is_active, j.created_at, u.id as user_id, u.name, u.email
      FROM jobs j
      JOIN registered_alumni u ON j.user_id = u.id
      ORDER BY j.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Apply to a job
router.post('/jobs/:job_id/apply', async (req, res) => {
  const { job_id } = req.params;
  const { user_id, cover_letter, resume_url } = req.body;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id' });
  try {
    await pool.query(
      'INSERT INTO job_applications (job_id, user_id, cover_letter, resume_url) VALUES ($1, $2, $3, $4)',
      [job_id, user_id, cover_letter, resume_url]
    );
    res.json({ message: 'Application submitted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to apply to job' });
  }
});

// Get all applications for a job
router.get('/jobs/:job_id/applications', async (req, res) => {
  const { job_id } = req.params;
  try {
    const result = await pool.query(`
      SELECT a.id, a.cover_letter, a.resume_url, a.status, a.applied_at, u.id as user_id, u.name, u.email
      FROM job_applications a
      JOIN registered_alumni u ON a.user_id = u.id
      WHERE a.job_id = $1
      ORDER BY a.applied_at DESC
    `, [job_id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Update application status (accept, reject, shortlist)
router.patch('/jobs/:job_id/applications/:application_id', async (req, res) => {
  const { job_id, application_id } = req.params;
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Missing status' });
  try {
    const result = await pool.query(
      'UPDATE job_applications SET status = $1 WHERE id = $2 AND job_id = $3 RETURNING *',
      [status, application_id, job_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json({ message: 'Application status updated', application: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// Create Event
router.post('/events', async (req, res) => {
  const { user_id, title, description, date, location } = req.body;
  if (!user_id || !title || !description || !date || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    await pool.query(
      'INSERT INTO events (user_id, title, description, date, location) VALUES ($1, $2, $3, $4, $5)',
      [user_id, title, description, date, location]
    );
    res.json({ message: 'Event created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Get all events with user info
router.get('/events', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT e.*, u.name, u.email
      FROM events e
      JOIN registered_alumni u ON e.user_id = u.id
      ORDER BY e.date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// RSVP for an event
router.post('/rsvp', async (req, res) => {
  const { event_id, user_id } = req.body;
  if (!event_id || !user_id) {
    return res.status(400).json({ error: 'Event ID and User ID are required' });
  }
  try {
    // Prevent duplicate RSVP
    const existing = await pool.query('SELECT * FROM event_rsvps WHERE event_id = $1 AND user_id = $2', [event_id, user_id]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Already RSVP’d for this event' });
    }
    await pool.query('INSERT INTO event_rsvps (event_id, user_id) VALUES ($1, $2)', [event_id, user_id]);
    res.json({ message: 'RSVP successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to RSVP' });
  }
});

// Check RSVP status for an event and user
router.get('/rsvp/:eventId/:userId', async (req, res) => {
  const { eventId, userId } = req.params;
  try {
    const rsvp = await pool.query('SELECT * FROM event_rsvps WHERE event_id = $1 AND user_id = $2', [eventId, userId]);
    res.json({ rsvped: rsvp.rows.length > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to check RSVP status' });
  }
});

// Get all subadmins (for admin directory)
router.get('/subadmins', async (req, res) => {
  try {
    const subadmins = await pool.query('SELECT id, name, email, created_at FROM subadmins');
    res.json(subadmins.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch subadmins' });
  }
});

module.exports = router; 