
import { useAuth } from "../context/AuthContext";
import "./Users.css";

export default function Users() {
  const { teamMembers, removeTeamMember, updateTeamMember } = useAuth();

  return (
    <main className="users-page">
      <header className="users-header">
        <div>
          <p className="users-eyebrow">TEAM MANAGEMENT</p>
          <h1>Users</h1>
        </div>

        <div className="users-total">
          <span>Total users</span>
          <strong>{teamMembers.length}</strong>
        </div>
      </header>

      <section className="users-card">
        <div className="users-card-heading">
          <div>
            <h2>All members</h2>
          </div>
        </div>

        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className="users-person">
                      <span className="users-avatar">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                      <strong>{member.name}</strong>
                    </div>
                  </td>

                  <td>{member.email}</td>

                  <td>
                    <select
                      className="users-role-select"
                      value={member.role}
                      onChange={(e) =>
                        updateTeamMember(member.id, { role: e.target.value })
                      }
                      aria-label={`Role for ${member.name}`}
                    >
                      <option>Admin</option>
                      <option>Editor</option>
                      <option>Viewer</option>
                    </select>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="users-remove"
                      onClick={() => {
                        if (
                          window.confirm(`Remove ${member.name} from the team?`)
                        ) {
                          removeTeamMember(member.id);
                        }
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}

              {teamMembers.length === 0 && (
                <tr>
                  <td colSpan="4" className="users-empty">
                    No users found. Add a team member in Settings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
