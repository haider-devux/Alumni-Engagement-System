"use client"

import React, { useState } from "react"
import { Link } from "react-router-dom"
import AlumniNavbar from '../../components/AlumniNavbar'
import UserRequestForm from '../../components/UserRequestForm'

const Help = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
  return (
    <div className="subadmin-container">
      <AlumniNavbar />
      <div className="subadmin-content">
        <h1 className="subadmin-title">Manage Events</h1>

        <div className="placeholder-box">
          <UserRequestForm />
        </div>
      </div>
      {/* Footer */}
            <footer className="footer">
              <div className="container">
                <div className="footer-content">
                  <div className="footer-section">
                    <h3>ITU Alumni</h3>
                    <p>Connecting ITU graduates worldwide for professional growth and lifelong relationships.</p>
                  </div>
                  <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                      <li>
                        <Link to="/directory">Alumni Directory</Link>
                      </li>
                      <li>
                        <Link to="/events">Events</Link>
                      </li>
                      <li>
                        <Link to="/jobs">Job Board</Link>
                      </li>
                      <li>
                        <Link to="/admin-panel">Admin Panel</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="footer-section">
                    <h4>Account</h4>
                    <ul>
                      {!isLoggedIn ? (
                        <>
                          <li>
                            <Link to="/login">Login</Link>
                          </li>
                          <li>
                            <Link to="/register">Register</Link>
                          </li>
                        </>
                      ) : (
                        <>
                          <li>
                            <Link to="/dashboard">Dashboard</Link>
                          </li>
                          <li>
                            <Link to="/profile">Profile</Link>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div className="footer-section">
                    <h4>Support</h4>
                    <ul>
                      <li>
                        <Link to="/help">Help Center</Link>
                      </li>
                      <li>
                        <a href="#contact">Contact Us</a>
                      </li>
                      <li>
                        <a href="#privacy">Privacy Policy</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="footer-bottom">
                  <p>&copy; 2024 ITU Alumni Engagement System. All rights reserved.</p>
                  <p style={{ fontSize: "0.9rem", marginTop: "0.5rem", opacity: 0.8 }}>
                    The Alumni Directory is available to those who have completed a minimum of three quarters of a
                    degree-granting program at ITU.
                  </p>
                </div>
              </div>
            </footer>
    </div>
  )
}

export default Help