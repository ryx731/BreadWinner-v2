import React, { useState } from 'react'
import './Profile.css'

function Profile() {
  const [profile, setProfile] = useState({
    username: 'User',
    email: 'user@example.com',
    dietaryRestrictions: ['Gluten-Free'],
  })

  const [isEditing, setIsEditing] = useState(false)
  const [tempProfile, setTempProfile] = useState({ ...profile })

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setProfile({ ...tempProfile })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempProfile({ ...profile })
    setIsEditing(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setTempProfile({
      ...tempProfile,
      [name]: value,
    })
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      <div className="profile-card">
        {!isEditing ? (
          <>
            <div className="profile-view">
              <div className="avatar">
                <span>👤</span>
              </div>

              <div className="profile-info">
                <div className="info-item">
                  <label>Username</label>
                  <p>{profile.username}</p>
                </div>

                <div className="info-item">
                  <label>Email</label>
                  <p>{profile.email}</p>
                </div>

                <div className="info-item">
                  <label>Dietary Restrictions</label>
                  <div className="restrictions">
                    {profile.dietaryRestrictions.map((restriction, idx) => (
                      <span key={idx} className="restriction-tag">
                        {restriction}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={handleEdit} className="btn btn-edit">
                Edit Profile
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="profile-edit">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={tempProfile.username}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={tempProfile.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Dietary Restrictions</label>
                <p className="hint">
                  Your profile indicates gluten-free dietary requirements
                </p>
              </div>

              <div className="button-group">
                <button onClick={handleSave} className="btn btn-save">
                  Save Changes
                </button>
                <button onClick={handleCancel} className="btn btn-cancel">
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="preferences-section">
        <h3>Preferences</h3>
        <div className="preference-item">
          <input type="checkbox" id="notifications" defaultChecked />
          <label htmlFor="notifications">
            Receive notifications for gluten-free items
          </label>
        </div>
        <div className="preference-item">
          <input type="checkbox" id="history" defaultChecked />
          <label htmlFor="history">
            Save purchase history
          </label>
        </div>
        <div className="preference-item">
          <input type="checkbox" id="recommendations" />
          <label htmlFor="recommendations">
            Get personalized recommendations
          </label>
        </div>
      </div>

      <div className="help-section">
        <h3>Need Help?</h3>
        <ul>
          <li><a href="#faq">Frequently Asked Questions</a></li>
          <li><a href="#support">Contact Support</a></li>
          <li><a href="#privacy">Privacy Policy</a></li>
          <li><a href="#terms">Terms of Service</a></li>
        </ul>
      </div>
    </div>
  )
}

export default Profile
