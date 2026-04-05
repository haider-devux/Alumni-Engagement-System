import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlumniNavbar from '../../components/AlumniNavbar';
import SubAdminNavbar from '../../components/SubAdminNavbar';
import Navbar from '../../components/Navbar';
import '../../styles/main.css';
import { FaBell } from 'react-icons/fa';

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applyJobId, setApplyJobId] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [applyMsg, setApplyMsg] = useState('');
  const [viewApplicantsJobId, setViewApplicantsJobId] = useState(null);
  const [applicantsByJob, setApplicantsByJob] = useState({}); // { [jobId]: [applicants] }
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [applicantsError, setApplicantsError] = useState('');
  const [notifyMsg, setNotifyMsg] = useState('');
  const [showNotify, setShowNotify] = useState(true);
  const [statusUpdateMsg, setStatusUpdateMsg] = useState('');
  const [statusUpdating, setStatusUpdating] = useState({}); // { [applicationId]: boolean }
  const user = JSON.parse(localStorage.getItem('user'));
  const subadmin = JSON.parse(localStorage.getItem('subadmin'));

  // Redirect to login if not authenticated (allow both alumni and subadmin)
  useEffect(() => {
    if (!user && !subadmin) {
      navigate('/login');
    }
  }, [user, subadmin, navigate]);
  const [showBellDropdown, setShowBellDropdown] = useState(false);

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

  // Fetch applicants for a job
  const fetchApplicants = async (jobId) => {
    setApplicantsLoading(true);
    setApplicantsError('');
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/applications`);
      const data = await res.json();
      setApplicantsByJob(prev => ({ ...prev, [jobId]: data }));
      setApplicantsLoading(false);
    } catch (err) {
      setApplicantsLoading(false);
      setApplicantsError('Failed to fetch applicants');
    }
  };

  // Update application status
  const updateApplicationStatus = async (jobId, applicationId, status) => {
    setStatusUpdating(prev => ({ ...prev, [applicationId]: true }));
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      setStatusUpdating(prev => ({ ...prev, [applicationId]: false }));
      if (!res.ok) {
        alert(data.error || 'Failed to update status');
      } else {
        setStatusUpdateMsg(`Application status updated to '${status}'.`);
        setTimeout(() => setStatusUpdateMsg(''), 2000);
        fetchApplicants(jobId);
      }
    } catch (err) {
      setStatusUpdating(prev => ({ ...prev, [applicationId]: false }));
      alert('Failed to update status');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Check if current user has been accepted for any job
  useEffect(() => {
    if (!user) return;
    const checkAccepted = async () => {
      try {
        for (const job of jobs) {
          const res = await fetch(`http://localhost:5000/api/jobs/${job.id}/applications`);
          const data = await res.json();
          const myApp = data.find(a => a.user_id === user.id && a.status === 'Accepted');
          if (myApp) {
            setNotifyMsg(`You have been selected for the job: ${job.title} at ${job.company}`);
            setShowNotify(true);
            break;
          }
        }
      } catch {}
    };
    checkAccepted();
  }, [jobs, user]);

  const handleApply = (jobId) => {
    setApplyJobId(jobId);
    setCoverLetter('');
    setResumeUrl('');
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

  // Don't render anything if neither user nor subadmin is logged in (will redirect)
  if (!user && !subadmin) {
    return null;
  }

  // Check user type to determine which navbar to show
  const isSubAdmin = !!subadmin;
  const isAlumni = !!user;

  return (
    <div className="home-container" style={{ minHeight: '100vh', background: 'var(--oxford-light)' }}>
      {isSubAdmin ? <SubAdminNavbar /> : isAlumni ? <AlumniNavbar showBackButton={true} backTo="/dashboard" /> : <AlumniNavbar />}
      <div style={{ marginTop: 100, padding: '0 20px' }}>
        {/* Bell notification */}
        {notifyMsg && showNotify && (
          <div style={{ position: 'fixed', top: 30, right: 40, zIndex: 2000 }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                fontSize: 28,
                color: '#c00',
                outline: 'none',
              }}
              aria-label="Notifications"
              onClick={() => setShowBellDropdown((prev) => !prev)}
            >
              <FaBell />
              <span style={{
                position: 'absolute',
                top: 2,
                right: 2,
                width: 12,
                height: 12,
                background: 'red',
                borderRadius: '50%',
                display: 'inline-block',
                border: '2px solid white',
              }}></span>
            </button>
            {showBellDropdown && (
              <div style={{
                position: 'absolute',
                right: 0,
                marginTop: 8,
                background: 'white',
                color: '#19376d',
                border: '1px solid #eee',
                borderRadius: 8,
                boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                minWidth: 260,
                padding: 16,
                zIndex: 2100,
              }}>
                <div style={{ fontWeight: 600, marginBottom: 8, color: '#c00' }}>Job Offer</div>
                <div style={{ marginBottom: 12 }}>{notifyMsg}</div>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => { setShowNotify(false); setShowBellDropdown(false); }}
                >Dismiss</button>
              </div>
            )}
          </div>
        )}
        {statusUpdateMsg && (
          <div className="success-msg" style={{ position: 'fixed', top: 120, right: 30, zIndex: 1000 }}>{statusUpdateMsg}</div>
        )}
        <section className="section alumni-tweets-scrollable" style={{ maxWidth: 900, margin: '40px auto', minHeight: 400, display: 'flex', flexDirection: 'column', height: '70vh' }}>
          <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: 24 }}>Job Board</h2>
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
                          {/* If user is job poster, show applicants button */}
                          {user && job.user_id === user.id && (
                            <button className="btn btn-secondary" style={{ marginRight: 8 }} onClick={() => {
                              setViewApplicantsJobId(viewApplicantsJobId === job.id ? null : job.id);
                              if (viewApplicantsJobId !== job.id) fetchApplicants(job.id);
                            }}>
                              {viewApplicantsJobId === job.id ? 'Hide Applicants' : 'View Applicants'}
                            </button>
                          )}
                          {/* If user is not job poster and has not applied, show Apply button; if applied, show Applied */}
                          {user && job.user_id !== user.id && (
                            (() => {
                              const jobApplicants = applicantsByJob[job.id] || [];
                              const alreadyApplied = jobApplicants.some(a => a.user_id === user.id && a.job_id === job.id) || false;
                              if (alreadyApplied) {
                                return <button className="btn btn-secondary" disabled>Applied</button>;
                              } else if (applyJobId === job.id) {
                                return (
                                  <form onSubmit={handleApplySubmit} style={{ marginTop: 8 }}>
                                    <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} placeholder="Cover Letter" rows={3} className="tweet-textarea" required />
                                    <input type="text" value={resumeUrl} onChange={e => setResumeUrl(e.target.value)} placeholder="Resume URL (optional)" style={{ marginBottom: 8, marginTop: 8 }} />
                                    {applyMsg && <div className={applyMsg.includes('submitted') ? 'success-msg' : 'error'}>{applyMsg}</div>}
                                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 8 }}>{loading ? 'Applying...' : 'Submit Application'}</button>
                                    <button type="button" className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={() => setApplyJobId(null)}>Cancel</button>
                                  </form>
                                );
                              } else {
                                return <button className="btn btn-primary" onClick={() => {
                                  handleApply(job.id);
                                  fetchApplicants(job.id);
                                }}>Apply</button>;
                              }
                            })()
                          )}
                        </div>
                        {/* Applicants list for job poster */}
                        {viewApplicantsJobId === job.id && user && job.user_id === user.id && (
                          <div style={{ marginTop: 16, background: '#f8f9fa', borderRadius: 8, padding: 12 }}>
                            <h4>Applicants:</h4>
                            {applicantsLoading ? <div>Loading...</div> : applicantsError ? <div className="error">{applicantsError}</div> : (
                              (applicantsByJob[job.id] || []).length === 0 ? <div>No applications yet.</div> : (
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                  {(applicantsByJob[job.id] || []).map(app => (
                                    <li key={app.id} style={{ marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
                                      <div><b>{app.name}</b> ({app.email})</div>
                                      <div>Status: <b>{app.status}</b></div>
                                      <div>Cover Letter: {app.cover_letter}</div>
                                      {app.resume_url && <div>Resume: <a href={app.resume_url} target="_blank" rel="noopener noreferrer">View</a></div>}
                                      <div style={{ marginTop: 4 }}>
                                        <button className="btn btn-primary" style={{ marginRight: 6 }} onClick={() => updateApplicationStatus(job.id, app.id, 'Accepted')} disabled={statusUpdating[app.id]}>Accept</button>
                                        <button className="btn btn-secondary" style={{ marginRight: 6 }} onClick={() => updateApplicationStatus(job.id, app.id, 'Shortlisted')} disabled={statusUpdating[app.id]}>Shortlist</button>
                                        <button className="btn btn-secondary" onClick={() => updateApplicationStatus(job.id, app.id, 'Rejected')} disabled={statusUpdating[app.id]}>Reject</button>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Jobs;
