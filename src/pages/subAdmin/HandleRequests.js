import React from "react"
import SubAdminNavbar from '../../components/SubAdminNavbar';

const HandleRequests = () => {
  return (
    <div className="subadmin-container">
      <SubAdminNavbar />
      <div className="subadmin-content">
        <h1 className="subadmin-title">Handle User Requests</h1>
        <p className="subadmin-description">
          Respond to user queries and access support tickets.
        </p>

        <div className="placeholder-box">
          <p>This section will display user support requests.</p>
        </div>
      </div>
    </div>
  )
}

export default HandleRequests
