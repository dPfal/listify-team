import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileMenu.css";

function ProfileMenu({ userEmail, onLogout }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleEditProfile = () => {
    setShowMenu(false);
    navigate("/edit-profile");
  };

  return (
    <div className="profile-menu-container">
      <button
        className="profile-icon-button"
        onClick={() => setShowMenu(!showMenu)}
      >
        {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
      </button>

      {showMenu && (
        <div className="profile-dropdown">
          <p className="profile-email">{userEmail}</p>

          <button className="profile-dropdown-button" onClick={handleEditProfile}>
            Edit Profile
          </button>

          <button className="profile-dropdown-button logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;