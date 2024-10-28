import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [userData, setUserData] = useState(null);  // Holds the user profile data
  const [error, setError] = useState(null);  // Holds any error messages from the server

  // Fetch profile data on component mount
  useEffect(() => {
    console.log("Fetching profile data...");
    fetch('http://localhost:3000/profile', { credentials: 'include' })  // 'include' ensures the session cookie is sent
      .then(response => {
        console.log("Response from server:", response);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch profile data');
        }
      })
      .then(data => {
        console.log("Profile data received:", data);
        setUserData(data);  // Set the user data
      })
      .catch(error => {
        console.error("Error fetching profile:", error);
        setError(error.message);
      });
  }, []);

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      {error ? (
        <p className="error-message">Error: {error}</p>
      ) : userData ? (
        <div className="profile-card">
          <div className="profile-item">
            <strong>Username:</strong> <span>{userData.username}</span>
          </div>
          <div className="profile-item">
            <strong>Email:</strong> <span>{userData.email}</span>
          </div>
          <div className="profile-item">
            <strong>Bio:</strong> <span>{userData.bio || 'No bio available'}</span>
          </div>
          <div className="profile-item">
            <strong>Role:</strong> <span>{userData.role}</span>
          </div>
          <div className="profile-item">
            <strong>Account Created:</strong> <span>{new Date(userData.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
