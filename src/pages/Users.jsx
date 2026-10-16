import { useAuth } from "../context/AuthContext.jsx";
import "./Users.css";

export default function Users() {
  const { teamMembers, setTeamMembers } = useAuth();

  const handleRemoveUser = (memberId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this user?"
    );

    if (!confirmDelete) return;

    setTeamMembers((previousMembers) =>
      previousMembers.filter((member) => member.id !== memberId)
    );
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1>Team Members</h1>
          <p>Manage your workspace users.</p>
        </div>

        <div className="users-count">
          {teamMembers.length} Members
        </div>
      </div>

      {teamMembers.length === 0 ? (
        <div className="users-empty">
          <h3>No team members yet</h3>
          <p>
            Open Settings → Workspace to add your first team member.
          </p>
        </div>
      ) : (
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {member.name.charAt(0).toUpperCase()}
                      </div>

                      <span>{member.name}</span>
                    </div>
                  </td>

                  <td>{member.email}</td>

                  <td>
                    <span className="user-role">
                      {member.role}
                    </span>
                  </td>

                  <td>
                    <button
                      className="remove-user-btn"
                      onClick={() => handleRemoveUser(member.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
