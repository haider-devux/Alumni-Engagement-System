import React, { useEffect, useState } from 'react';
import AlumniNavbar from '../../components/AlumniNavbar';
import SubAdminNavbar from '../../components/SubAdminNavbar';
import '../../styles/main.css';

const Postjob = () => {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [applyJobId, setApplyJobId] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyMsg, setApplyMsg] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [experienceRequired, setExperienceRequired] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [deadline, setDeadline] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch all jobs
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/jobs');
      const data = await res.json();
      setJobs(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to fetch jobs');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!title.trim() || !description.trim() || !company.trim()) {
      setError('All fields except location are required');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          title,
          description,
          company,
          location,
          salary_range: salaryRange,
          employment_type: employmentType,
          experience_required: experienceRequired,
          skills_required: skillsRequired,
          deadline,
          contact_email: contactEmail
        })
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.error || 'Failed to post job');
      } else {
        setSuccess('Job posted!');
        setTitle('');
        setDescription('');
        setCompany('');
        setLocation('');
        setSalaryRange('');
        setEmploymentType('');
        setExperienceRequired('');
        setSkillsRequired('');
        setDeadline('');
        setContactEmail('');
        fetchJobs();
      }
    } catch (err) {
      setLoading(false);
      setError('Failed to post job');
    }
  };

  const handleApply = (jobId) => {
    setApplyJobId(jobId);
    setCoverLetter('');
    setApplyMsg('');
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplyMsg('');
    if (!coverLetter.trim()) {
      setApplyMsg('Cover letter is required');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${applyJobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, cover_letter: coverLetter, resume_url: resumeUrl })
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setApplyMsg(data.error || 'Failed to apply');
      } else {
        setApplyMsg('Application submitted!');
        setApplyJobId(null);
        setCoverLetter('');
        setResumeUrl('');
      }
    } catch (err) {
      setLoading(false);
      setApplyMsg('Failed to apply');
    }
  };

  // Check user type to determine which navbar to show
  const isSubAdmin = !!localStorage.getItem('subadmin');
  const isAlumni = !!localStorage.getItem('user');
  const isAdmin = window.location.pathname.includes('/admin');
  const isMainAdmin = window.location.pathname.includes('/main-admin');

  // Check if component is being rendered inside another component
  const isStandalone = !window.location.pathname.includes('/sub') && !window.location.pathname.includes('/admin') && !window.location.pathname.includes('/main-admin');

  return (
    <div className={isStandalone ? "home-container" : ""} style={isStandalone ? { minHeight: '100vh', background: 'var(--oxford-light)', height: '100vh', overflow: 'hidden' } : {}}>
      {isStandalone && (isSubAdmin ? <SubAdminNavbar /> : isAlumni ? <AlumniNavbar showBackButton={true} backTo="/dashboard" /> : <AlumniNavbar />)}
      {!isStandalone && (isAdmin || isMainAdmin) && <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: 24 }}>Post Job</h2>}
      <div style={isStandalone ? { marginTop: 100, height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' } : { display: 'flex', flexDirection: 'column' }}>

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 40,
          flex: 1,
          height: '100%',
          minHeight: 0,
        }}>
          {/* Post Job Section */}
          <section className="section" style={{ width: isStandalone ? 350 : '100%', minWidth: isStandalone ? 280 : 'auto', flex: isStandalone ? '1 1 350px' : '1', maxWidth: isStandalone ? 400 : 900, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflowY: 'auto', minHeight: 0 }}>
            {!isAdmin && !isMainAdmin && <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: 24 }}>Post a Job</h2>}
            <form onSubmit={handleJobSubmit} className="login-form" style={{ flex: '0 0 auto' }}>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Job Title" required style={{ marginBottom: 12 }} />
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Job Description" rows={4} className="tweet-textarea" required />
              <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Company Name" required style={{ marginBottom: 12 }} />
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location (optional)" style={{ marginBottom: 12 }} />
              <input type="text" value={salaryRange} onChange={e => setSalaryRange(e.target.value)} placeholder="Salary Range (e.g. 50,000 - 70,000 PKR)" style={{ marginBottom: 12 }} />
              <input type="text" value={employmentType} onChange={e => setEmploymentType(e.target.value)} placeholder="Employment Type (Full-Time, Part-Time, Internship)" style={{ marginBottom: 12 }} />
              <input type="text" value={experienceRequired} onChange={e => setExperienceRequired(e.target.value)} placeholder="Experience Required (e.g. 1-2 years, Fresh)" style={{ marginBottom: 12 }} />
              <textarea value={skillsRequired} onChange={e => setSkillsRequired(e.target.value)} placeholder="Skills Required (comma separated)" rows={2} className="tweet-textarea" style={{ marginBottom: 12 }} />
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} placeholder="Application Deadline" style={{ marginBottom: 12 }} />
              <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="Contact Email" style={{ marginBottom: 12 }} />
              {error && <div className="error">{error}</div>}
              {success && <div className="success-msg">{success}</div>}
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 8 }}>{loading ? 'Posting...' : 'Post Job'}</button>
            </form>
          </section>
          {/* All Jobs Section */}
          {isStandalone && (
            <section className="section alumni-tweets-scrollable" style={{ width: 600, minWidth: 300, flex: '2 1 600px', maxWidth: 700, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: 24, flex: '0 0 auto' }}>All Jobs</h2>
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
              {loading ? (
                <div>Loading jobs...</div>
              ) : (
                <div>
                  {jobs.length === 0 ? (
                    <div>No jobs posted yet.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                      {jobs.map(job => (
                        <div key={job.id} className="card tweet-card">
                          <div className="tweet-author">
                            {job.title} <span className="tweet-email">@ {job.company}</span>
                          </div>
                          <div className="tweet-content">{job.description}</div>
                          <div className="tweet-date">
                            {job.location ? job.location + ' | ' : ''}
                            {job.salary_range ? job.salary_range + ' | ' : ''}
                            {job.employment_type ? job.employment_type + ' | ' : ''}
                            {job.experience_required ? job.experience_required + ' | ' : ''}
                            {job.skills_required ? 'Skills: ' + job.skills_required + ' | ' : ''}
                            {job.deadline ? 'Deadline: ' + job.deadline + ' | ' : ''}
                            {job.contact_email ? 'Contact: ' + job.contact_email + ' | ' : ''}
                            {job.is_active === false ? 'Inactive | ' : ''}
                            {new Date(job.created_at).toLocaleString()}
                          </div>
                          <div style={{ marginTop: 8 }}>
                            {applyJobId === job.id ? (
                              <form onSubmit={handleApplySubmit} style={{ marginTop: 8 }}>
                                <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} placeholder="Cover Letter" rows={3} className="tweet-textarea" required />
                                <input type="text" value={resumeUrl} onChange={e => setResumeUrl(e.target.value)} placeholder="Resume URL (optional)" style={{ marginBottom: 8, marginTop: 8 }} />
                                {applyMsg && <div className={applyMsg.includes('submitted') ? 'success-msg' : 'error'}>{applyMsg}</div>}
                                <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 8 }}>{loading ? 'Applying...' : 'Submit Application'}</button>
                                <button type="button" className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={() => setApplyJobId(null)}>Cancel</button>
                              </form>
                            ) : (
                              <button className="btn btn-primary" onClick={() => handleApply(job.id)}>
                                Apply
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Postjob;
