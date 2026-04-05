"use client"

import React, { useState } from "react"
import { Link } from "react-router-dom"
import Navbar from '../../components/Navbar'
import '../../styles/main.css';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="home-container">
      <Navbar />
      {/* Hero Section - Stanford Style */}
      <section className="hero">
        <div className="hero-container">
          <p className="hero-subtitle">ITU Alumni Directory</p>
          <h1 className="hero-title">
            Who Will You <br />
            <span style={{ color: "#fbbf24" }}>Discover?</span>
          </h1>
          <p className="hero-description">
            Connect with your ITU Alumni community. Explore your official destination for finding alumni of Information
            Technology University, Lahore.
          </p>
        </div>
      </section>

      {/* Features Section (Replaced with Info & Alumni Reviews) */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">A World-Class Alumni Network</h2>
          <div className="alumni-info">
            <p>
              ITU Alumni are making an impact across the globe in technology, research, entrepreneurship, and public service. Our network is a vibrant community of innovators, leaders, and lifelong learners. Stay connected, share your journey, and inspire the next generation of ITU graduates.
            </p>
          </div>
          <div className="reviews-grid">
            <div className="alumni-review-card">
              <p className="review-text">
                "The ITU alumni network helped me land my dream job and stay connected with mentors who truly care."
              </p>
              <div className="review-author">Ayesha Khan</div>
              <div className="review-role">Software Engineer, Google</div>
            </div>
            <div className="alumni-review-card">
              <p className="review-text">
                "Being part of ITU's alumni community means lifelong learning and friendships that go beyond graduation."
              </p>
              <div className="review-author">Bilal Ahmed</div>
              <div className="review-role">Data Scientist, Microsoft</div>
            </div>
            <div className="alumni-review-card">
              <p className="review-text">
                "I found amazing career opportunities and mentors through the ITU alumni platform. Highly recommended!"
              </p>
              <div className="review-author">Sara Malik</div>
              <div className="review-role">Entrepreneur, Lahore</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">5,000+</div>
              <div className="stat-label">ITU Alumni</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">200+</div>
              <div className="stat-label">Events Hosted</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">800+</div>
              <div className="stat-label">Job Opportunities</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Reconnect with ITU Alumni?</h2>
            <p>Join thousands of ITU graduates who are already benefiting from our platform.</p>
            {!isLoggedIn ? (
              <div className="hero-buttons">
                <Link to="/signup" className="btn btn-primary">
                  Create Your Account
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Login In
                </Link>
              </div>
            ) : (
              <Link to="/dashboard" className="btn btn-primary">
                Access Your Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>ITU Alumni</h3>
              <p>
                The ITU Alumni Engagement System is dedicated to fostering lifelong connections among graduates of Information Technology University. Our mission is to empower alumni through networking, career opportunities, and community support. Whether you are seeking to reconnect, mentor, or grow professionally, our platform is here to help you thrive.
              </p>
              <p style={{marginTop: '1.2rem', color: 'var(--oxford-gold)', fontWeight: 500}}>
                For support or inquiries, please contact alumni@itu.edu.pk
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 ITU Alumni Engagement System. All rights reserved.</p>
            <p style={{ fontSize: "0.9rem", marginTop: "0.5rem", opacity: 0.8 }}>
              The Alumni Directory is available to those who have completed a minimum of three quarters of a degree-granting program at ITU.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
