import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";

function EditProfile() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(
    localStorage.getItem("username") || ""
  );
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileMessage, setProfileMessage] = useState("");

  const handleSaveProfile = async event => {
    event.preventDefault();

    if (!email) {
      setProfileMessage("Email is required.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setProfileMessage("Passwords do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: displayName,
          username: email,
          password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setProfileMessage(data.message || "Profile update failed.");
        return;
      }

      localStorage.setItem("username", data.user.username);
      localStorage.setItem("displayName", data.user.displayName || "");

      setProfileMessage("Profile updated successfully.");
      navigate("/dashboard");
    } catch (error) {
      setProfileMessage("Unable to update profile. Please try again.");
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-card">
        <h1 className="edit-profile-title">Edit Profile</h1>
        <p className="edit-profile-subtitle">Update your profile details</p>

        {profileMessage && (
          <p className="edit-profile-message">{profileMessage}</p>
        )}

        <form onSubmit={handleSaveProfile}>
          <label className="edit-profile-label">Display Name</label>
          <input
            className="edit-profile-input"
            type="text"
            placeholder="Enter your display name"
            value={displayName}
            onChange={event => setDisplayName(event.target.value)}
          />

          <label className="edit-profile-label">Email</label>
          <input
            className="edit-profile-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />

          <label className="edit-profile-label">New Password</label>
          <input
            className="edit-profile-input"
            type="password"
            placeholder="Leave blank if unchanged"
            value={newPassword}
            onChange={event => setNewPassword(event.target.value)}
          />

          <label className="edit-profile-label">Confirm Password</label>
          <input
            className="edit-profile-input"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={event => setConfirmPassword(event.target.value)}
          />

          <div className="edit-profile-actions">
            <button
              type="button"
              className="edit-profile-cancel"
              onClick={() => navigate("/Dashboard")}>
              Cancel
            </button>

            <button type="submit" className="edit-profile-save">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
