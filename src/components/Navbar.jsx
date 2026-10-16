
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, profile, workspace, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="navbar">
      <div className="navbar-workspace">
        <div className="navbar-workspace-icon">W</div>

        <div className="navbar-workspace-text">
          <strong>{workspace.name}</strong>
          <span>Workspace dashboard</span>
        </div>
      </div>

      <div className="navbar-right">
        <button
          type="button"
          className="navbar-settings-button"
          onClick={() => navigate("/settings")}
        >
          <span aria-hidden="true">⚙</span>
          <span>Settings</span>
        </button>

        <div className="navbar-profile">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt=""
              className="navbar-avatar"
            />
          ) : (
            <div className="navbar-avatar navbar-avatar-fallback">
              {(profile.name || user?.name || "A")
                .charAt(0)
                .toUpperCase()}
            </div>
          )}

          <div className="navbar-profile-details">
            <strong>{profile.name || user?.name || "Admin"}</strong>
            <span>{profile.email || user?.email || ""}</span>
          </div>
        </div>

        <button
          type="button"
          className="navbar-logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
