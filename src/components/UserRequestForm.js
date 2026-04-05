import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const requestTypes = [
  "Profile Update",
  "Account Verification",
  "Request Alumni Certificate",
  "Report Bug or Issue",
  "Delete My Account",
  "Other"
]

const UserRequestForm = () => {
  const [selectedType, setSelectedType] = useState("")
  const [fields, setFields] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFields(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedType) {
      alert("Please select a request type.")
      return
    }

    const payload = {
      type: selectedType,
      fields: fields
    }

    try {
      const res = await fetch("http://localhost:5000/api/user-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error("Submission failed")
      setSubmitted(true)

      setTimeout(() => {
        navigate("/") // or redirect somewhere
      }, 2000)
    } catch (err) {
      console.error("Error submitting request:", err)
      alert("There was a problem submitting your request.")
    }
  }

  const renderDynamicFields = () => {
    switch (selectedType) {
      case "Profile Update":
        return (
          <>
            <label>Field to Update</label>
            <select name="fieldToUpdate" onChange={handleChange}>
              <option value="">-- Select field --</option>
              <option value="name">Name</option>
              <option value="batchYear">Batch Year</option>
              <option value="degree">Degree</option>
              <option value="job">Current Job</option>
            </select>
            <label>New Value</label>
            <input type="text" name="newValue" onChange={handleChange} placeholder="Enter new value" />
          </>
        )
      case "Account Verification":
        return (
          <>
            <label>Verification Method</label>
            <select name="verificationType" onChange={handleChange}>
              <option value="">-- Choose one --</option>
              <option value="id_card">Upload Student ID</option>
              <option value="email_verification">Verify via Email</option>
            </select>
          </>
        )
      case "Request Alumni Certificate":
        return (
          <>
            <label>Purpose</label>
            <select name="purpose" onChange={handleChange}>
              <option value="">-- Select purpose --</option>
              <option value="job">Job Application</option>
              <option value="immigration">Immigration</option>
              <option value="other">Other</option>
            </select>
            <label>Graduation Year</label>
            <input type="text" name="gradYear" onChange={handleChange} placeholder="e.g. 2022" />
            <label>Delivery Method</label>
            <select name="deliveryMethod" onChange={handleChange}>
              <option value="">-- Choose delivery --</option>
              <option value="email">Email (PDF)</option>
              <option value="post">Postal Mail</option>
            </select>
          </>
        )
      case "Report Bug or Issue":
        return (
          <>
            <label>Device Used</label>
            <input type="text" name="device" onChange={handleChange} placeholder="e.g. Mobile, Laptop" />
            <label>Steps to Reproduce</label>
            <textarea name="steps" rows="3" onChange={handleChange} placeholder="Describe the issue..." />
          </>
        )
      case "Delete My Account":
        return (
          <>
            <label>Reason for Deletion</label>
            <select name="reason" onChange={handleChange}>
              <option value="">-- Select reason --</option>
              <option value="privacy">Privacy concerns</option>
              <option value="inactive">No longer using</option>
              <option value="duplicate">Duplicate account</option>
              <option value="other">Other</option>
            </select>
            <label>Comments (optional)</label>
            <textarea name="comments" rows="2" onChange={handleChange} />
          </>
        )
      case "Other":
        return (
          <p className="contact-hint">
            This category is not handled automatically. Please use our{" "}
            <a href="/contact">Contact Us</a> page for more help.
          </p>
        )
      default:
        return null
    }
  }

  return (
    <div className="request-form-container">
      <h2>Submit a Request</h2>
      <form onSubmit={handleSubmit} className="request-form">
        <label htmlFor="type">Select a request type</label>
        <select
          id="type"
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value)
            setFields({})
          }}
        >
          <option value="">-- Choose a type --</option>
          {requestTypes.map((type, idx) => (
            <option key={idx} value={type}>{type}</option>
          ))}
        </select>

        {renderDynamicFields()}

        {selectedType && selectedType !== "Other" && (
          <button type="submit" className="submit-btn">Submit Request</button>
        )}
      </form>

      {submitted && <p className="success-msg">Your request has been submitted ✅</p>}
    </div>
  )
}

export default UserRequestForm

