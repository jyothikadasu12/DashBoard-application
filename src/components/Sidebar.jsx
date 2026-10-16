
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="brand">DashFlow</h2>

      <p className="sidebar-label">WORKSPACE</p>

      <nav className="sidebar-nav">
        <NavLink to="/" end>
          <span>▦</span> Dashboard
        </NavLink>

        <NavLink to="/users">
          <span>♙</span> Users
        </NavLink>

        <NavLink to="/settings">
          <span>⚙</span> Settings
        </NavLink>
      </nav>

      <p className="sidebar-footer">Admin Workspace</p>
    </aside>
  );
}
