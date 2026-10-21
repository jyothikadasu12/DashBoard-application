
import { useAuth } from "../context/AuthContext";
import "./navbar.css";

export default function Navbar() {
  const { user, profile, logout } = useAuth();

  const displayName = profile?.name || user?.name || "Admin";
  const displayEmail = profile?.email || user?.email || "admin@example.com";

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2>Dashboard</h2>
      </div>

      <div className="navbar-right">
        <div className="navbar-user">
          <div className="navbar-avatar">
            {profile?.avatar ? (
              <img src={profile.avatar} alt="Profile" />
            ) : (
              <span>{initial}</span>
            )}
          </div>

          <div className="navbar-user-info">
            <strong>{displayName}</strong>
            <span>{displayEmail}</span>
          </div>
        </div>

        <button
          type="button"
          className="navbar-logout , cursor-pointer"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
