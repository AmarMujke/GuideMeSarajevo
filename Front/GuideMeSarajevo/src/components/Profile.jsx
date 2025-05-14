import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Nav from '../nav';
import './Profile.css';
import './AddLocationForm';
import AddLocationForm from './AddLocationForm';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    setIsEditing(false);
  };

  return (
    <>
      <Nav />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <i className="fas fa-user-circle profile-avatar"></i>
            <h2>Profile</h2>
          </div>
          
          <div className="profile-info">
            <div className="info-group">
              <label>Email:</label>
              <p>{user?.email}</p>
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-group">
                  <label>Username:</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Enter new username"
                  />
                </div>
                
                <div className="form-group">
                  <label>Current Password:</label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                  />
                </div>
                
                <div className="form-group">
                  <label>New Password:</label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    placeholder="Enter new password"
                  />
                </div>
                
                <div className="form-group">
                  <label>Confirm New Password:</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                  />
                </div>
                
                <div className="button-group">
                  <button type="submit" className="save-button">Save Changes</button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button 
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
        <AddLocationForm />
      </div>
    </>
  );
};

export default Profile; 