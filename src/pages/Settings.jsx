
import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Settings.css";

const ACCENTS = [
  { value: "rose", label: "Rose", color: "#e34b70" },
  { value: "blue", label: "Blue", color: "#4f7df3" },
  { value: "violet", label: "Violet", color: "#9b6af5" },
];

const EMPTY_MEMBER = { name: "", email: "", role: "Editor" };

export default function Settings() {
  const {
    profile,
    preferences,
    teamMembers,
    updateProfile,
    updatePreferences,
    addTeamMember,
    removeTeamMember,
    updateTeamMember,
  } = useAuth();

  const photoRef = useRef(null);

  const [profileForm, setProfileForm] = useState({
    name: profile.name || "",
    email: profile.email || "",
    jobTitle: profile.jobTitle || "",
    department: profile.department || "",
  });

  const [memberForm, setMemberForm] = useState(EMPTY_MEMBER);
  const [notice, setNotice] = useState("");

  function notify(message) {
    setNotice(message);
  }

  function saveProfile(event) {
    event.preventDefault();

    if (!profileForm.name.trim()) {
      notify("Please enter your name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email.trim())) {
      notify("Please enter a valid email.");
      return;
    }

    updateProfile({
      ...profileForm,
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
    });

    notify("Profile updated successfully.");
  }

  function uploadPhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify("Please select an image.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      notify("Photo must be smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      updateProfile({ avatar: reader.result });
      notify("Profile photo updated.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function addMember(event) {
    event.preventDefault();

    const result = addTeamMember(memberForm);
    notify(result.message);

    if (result.success) {
      setMemberForm(EMPTY_MEMBER);
    }
  }

  function removeMember(member) {
    if (window.confirm(`Remove ${member.name} from the team?`)) {
      removeTeamMember(member.id);
      notify("Member removed.");
    }
  }

  return (
    <main className="settings-page">
      <header className="settings-title">
        <p className="settings-eyebrow">PREFERENCES</p>
        <h1>Settings</h1>
        <p>Manage your profile, appearance, notifications and team.</p>
      </header>

      {notice && (
        <div className="settings-notice" role="status">
          {notice}
          <button type="button" onClick={() => setNotice("")}>×</button>
        </div>
      )}

      <section className="settings-card">
        <h2>Profile information</h2>
        <p className="settings-muted">Manage your account details.</p>

        <div className="profile-photo">
          {profile.avatar ? (
            <img src={profile.avatar} alt="Profile" />
          ) : (
            <span>{(profileForm.name || "A").charAt(0).toUpperCase()}</span>
          )}

          <div>
            <strong>Profile photo</strong>
            <p className="settings-muted">Image up to 2 MB.</p>
            <button
              type="button"
              className="settings-button secondary"
              onClick={() => photoRef.current?.click()}
            >
              Upload photo
            </button>
            {profile.avatar && (
              <button
                type="button"
                className="settings-link danger"
                onClick={() => {
                  updateProfile({ avatar: "" });
                  notify("Photo removed.");
                }}
              >
                Remove
              </button>
            )}
          </div>

          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            hidden
            onChange={uploadPhoto}
          />
        </div>

        <form onSubmit={saveProfile}>
          <div className="settings-grid">
            <label>
              Full name
              <input
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, name: e.target.value })
                }
                required
              />
            </label>

            <label>
              Email address
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
                required
              />
            </label>

            <label>
              Job title
              <input
                value={profileForm.jobTitle}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, jobTitle: e.target.value })
                }
              />
            </label>

            <label>
              Department
              <input
                value={profileForm.department}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, department: e.target.value })
                }
              />
            </label>
          </div>

          <button className="settings-button primary" type="submit">
            Save profile
          </button>
        </form>
      </section>

      <section className="settings-card">
        <h2>Appearance</h2>
        <p className="settings-muted">Personalize your dashboard.</p>

        <div className="settings-row">
          <div>
            <strong>Theme</strong>
            <p className="settings-muted">Select light or dark mode.</p>
          </div>

          <select
            value={preferences.theme}
            onChange={(e) =>
              updatePreferences({ theme: e.target.value })
            }
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        <div className="settings-row">
          <div>
            <strong>Accent color</strong>
            <p className="settings-muted">Choose your highlight color.</p>
          </div>

          <div className="accent-list">
            {ACCENTS.map((accent) => (
              <button
                type="button"
                key={accent.value}
                className={`accent-option ${
                  preferences.accent === accent.value ? "active" : ""
                }`}
                onClick={() => updatePreferences({ accent: accent.value })}
              >
                <span style={{ background: accent.color }} />
                {accent.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="settings-card">
        <h2>Notifications</h2>
        <p className="settings-muted">Choose your notification preferences.</p>

        {[
          ["emailNotifications", "Email notifications"],
          ["weeklyReport", "Weekly report"],
          ["inAppNotifications", "In-app notifications"],
        ].map(([key, label]) => (
          <label className="settings-row" key={key}>
            <strong>{label}</strong>
            <input
              type="checkbox"
              checked={Boolean(preferences[key])}
              onChange={(e) =>
                updatePreferences({ [key]: e.target.checked })
              }
            />
          </label>
        ))}
      </section>

      <section className="settings-card" id="team">
        <div className="settings-section-heading">
          <div>
            <h2>Team members</h2>
            <p className="settings-muted">
              Add people and manage their access.
            </p>
          </div>
          <span className="member-count">{teamMembers.length} members</span>
        </div>

        <form className="member-form" onSubmit={addMember}>
          <label>
            Full name
            <input
              value={memberForm.name}
              onChange={(e) =>
                setMemberForm({ ...memberForm, name: e.target.value })
              }
              placeholder="Member name"
              required
            />
          </label>

          <label>
            Email address
            <input
              type="email"
              value={memberForm.email}
              onChange={(e) =>
                setMemberForm({ ...memberForm, email: e.target.value })
              }
              placeholder="member@example.com"
              required
            />
          </label>

          <label>
            Role
            <select
              value={memberForm.role}
              onChange={(e) =>
                setMemberForm({ ...memberForm, role: e.target.value })
              }
            >
              <option>Admin</option>
              <option>Editor</option>
              <option>Viewer</option>
            </select>
          </label>

          <button className="settings-button primary" type="submit">
            + Add member
          </button>
        </form>

        <div className="settings-table-wrap">
          <table className="settings-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id}>
                  <td>
                    <strong>{member.name}</strong>
                    <small>{member.email}</small>
                  </td>
                  <td>
                    <select
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
                      className="settings-link danger"
                      type="button"
                      onClick={() => removeMember(member)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}

              {teamMembers.length === 0 && (
                <tr>
                  <td colSpan="3">No team members yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
