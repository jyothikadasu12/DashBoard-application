
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const {
    teamMembers = [],
    workspace = {},
    profile = {},
  } = useAuth();

  const memberCount = teamMembers.length;

  const adminCount = teamMembers.filter(
    (member) => member.role?.toLowerCase() === "admin"
  ).length;

  const editorCount = teamMembers.filter(
    (member) => member.role?.toLowerCase() === "editor"
  ).length;

  return (
    <main className="dashboard-page">
      {/* Welcome header */}
      <section className="dashboard-welcome">
        <div>
          <div className="dashboard-breadcrumb">
            Workspace <span>/</span> Overview
          </div>

          <h1>
            Welcome back, {profile.name || "Admin"}
          </h1>

         
        </div>

        <button
          type="button"
          className="dashboard-primary-button"
          onClick={() => navigate("/users")}
        >
          <span className="dashboard-plus">+</span>
          Manage team
        </button>
      </section>

      {/* Workspace summary */}
      <section className="dashboard-summary">
        <article className="dashboard-summary-card">
          <div className="dashboard-summary-top">
            <span className="dashboard-summary-label">
              Total members
            </span>

            <span className="dashboard-summary-icon members-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
              >
                <path
                  d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  strokeLinecap="round"
                />
                <circle cx="10" cy="7" r="4" />
                <path
                  d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>

          <div className="dashboard-summary-value">
            {memberCount}
          </div>

          <p>Members in your workspace</p>
        </article>

        <article className="dashboard-summary-card">
          <div className="dashboard-summary-top">
            <span className="dashboard-summary-label">
              Administrators
            </span>

            <span className="dashboard-summary-icon admins-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
              >
                <path
                  d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"
                  strokeLinejoin="round"
                />
                <path
                  d="m9 12 2 2 4-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          <div className="dashboard-summary-value">
            {adminCount}
          </div>

          <p>Members with the Admin role</p>
        </article>

        <article className="dashboard-summary-card">
          <div className="dashboard-summary-top">
            <span className="dashboard-summary-label">
              Editors
            </span>

            <span className="dashboard-summary-icon editors-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
              >
                <path
                  d="M12 20h9"
                  strokeLinecap="round"
                />
                <path
                  d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          <div className="dashboard-summary-value">
            {editorCount}
          </div>

          <p>Members with the Editor role</p>
        </article>
      </section>

      {/* Team table */}
      <section className="dashboard-team-section">
        <div className="dashboard-section-header">
          <div>
            <h2>Team members</h2>
            <p>
              Manage the people who have access to your workspace.
            </p>
          </div>

          <button
            type="button"
            className="dashboard-view-button"
            onClick={() => navigate("/users")}
          >
            View all members
            <span aria-hidden="true">→</span>
          </button>
        </div>

        {memberCount === 0 ? (
          <div className="dashboard-empty">
            <div className="dashboard-empty-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
              >
                <circle cx="9" cy="7" r="4" />
                <path
                  d="M2 21v-2a7 7 0 0 1 14 0v2M19 8v6m-3-3h6"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h3>No team members yet</h3>
            <p>
              Add a team member to start building your workspace.
            </p>

            <button
              type="button"
              className="dashboard-primary-button"
              onClick={() => navigate("/users")}
            >
              Add team member
            </button>
          </div>
        ) : (
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>MEMBER</th>
                  <th>EMAIL ADDRESS</th>
                  <th>ROLE</th>
                  <th> </th>
                </tr>
              </thead>

              <tbody>
                {teamMembers.slice(0, 5).map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="dashboard-member-cell">
                        <div className="dashboard-member-avatar">
                          {member.name?.trim()?.charAt(0).toUpperCase() || "U"}
                        </div>

                        <span className="dashboard-member-name">
                          {member.name}
                        </span>
                      </div>
                    </td>

                    <td className="dashboard-email">
                      {member.email}
                    </td>

                    <td>
                      <span
                        className={`dashboard-role dashboard-role-${(
                          member.role || "viewer"
                        ).toLowerCase()}`}
                      >
                        {member.role || "Viewer"}
                      </span>
                    </td>

                    <td className="dashboard-table-action">
                      <button
                        type="button"
                        onClick={() => navigate("/users")}
                        aria-label={`Manage ${member.name}`}
                        title="Manage member"
                      >
                        →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {memberCount > 5 && (
              <div className="dashboard-table-footer">
                <span>
                  Showing 5 of {memberCount} members
                </span>

                <button
                  type="button"
                  onClick={() => navigate("/users")}
                >
                  See all members
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
