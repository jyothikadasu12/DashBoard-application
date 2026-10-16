
import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import "./Settings.css";

const sections = [
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "appearance", label: "Appearance", icon: "🎨" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
  { id: "security", label: "Security", icon: "🛡️" },
  { id: "workspace", label: "Workspace & Team", icon: "👥" },
];

export default function Settings() {
  const {
    profile,
    preferences,
    workspace,
    teamMembers,
    updateProfile,
    updatePreferences,
    updateWorkspace,
    setTeamMembers,
  } = useAuth();

  const [activeSection, setActiveSection] = useState("profile");
  const [toast, setToast] = useState("");
  const [teamForm, setTeamForm] = useState({
    name: "",
    email: "",
    role: "Viewer",
  });
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [securityMessage, setSecurityMessage] = useState("");
  const [securityError, setSecurityError] = useState("");
  const fileInputRef = useRef(null);

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }

  function handleProfileSave(event) {
    event.preventDefault();

    if (!profile.name.trim()) {
      notify("Please enter your display name.");
      return;
    }

    if (!profile.email.trim()) {
      notify("Please enter your email address.");
      return;
    }

    updateProfile({
      name: profile.name.trim(),
      email: profile.email.trim(),
      jobTitle: profile.jobTitle.trim(),
      department: profile.department.trim(),
    });

    notify("Profile saved successfully.");
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify("Please choose an image file.");
      return;
    }

    if (file.size > 1024 * 1024) {
      notify("Choose an image smaller than 1 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      updateProfile({ avatar: reader.result });
      notify("Profile photo updated.");
    };

    reader.onerror = () => notify("Unable to read this image.");

    reader.readAsDataURL(file);
  }

  function handleProfileReset() {
    updateProfile({
      name: "Admin",
      email: "admin@example.com",
      jobTitle: "Workspace Administrator",
      department: "Management",
      avatar: "",
    });

    notify("Profile reset to demo defaults.");
  }

  function handlePreferencesSave() {
    notify("Appearance and notification preferences saved.");
  }

  function handlePasswordChange(event) {
    event.preventDefault();
    setSecurityMessage("");
    setSecurityError("");

    if (passwordForm.current !== "admin123") {
      setSecurityError("Current demo password is incorrect.");
      return;
    }

    if (passwordForm.next.length < 8) {
      setSecurityError(
        "New password must contain at least 8 characters."
      );
      return;
    }

    if (passwordForm.next === passwordForm.current) {
      setSecurityError(
        "Your new password must differ from your current password."
      );
      return;
    }

    if (passwordForm.next !== passwordForm.confirm) {
      setSecurityError("New passwords do not match.");
      return;
    }

    // Frontend demo: do not store or change a real password.
    setPasswordForm({ current: "", next: "", confirm: "" });
    setSecurityMessage(
      "Validation passed. Connect a backend to change your real password."
    );
  }

  function handleAddMember(event) {
    event.preventDefault();

    const name = teamForm.name.trim();
    const email = teamForm.email.trim();

    if (!name || !email) {
      notify("Enter the member name and email.");
      return;
    }

    if (
      teamMembers.some(
        (member) => member.email.toLowerCase() === email.toLowerCase()
      )
    ) {
      notify("This email is already in the team.");
      return;
    }

    setTeamMembers((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        name,
        email,
        role: teamForm.role,
      },
    ]);

    setTeamForm({ name: "", email: "", role: "Viewer" });
    notify("Team member added.");
  }

  function handleRemoveMember(id) {
    setTeamMembers((previous) =>
      previous.filter((member) => member.id !== id)
    );

    notify("Team member removed.");
  }

  function handleWorkspaceSave(event) {
    event.preventDefault();

    if (!workspace.name.trim()) {
      notify("Workspace name is required.");
      return;
    }

    updateWorkspace({
      name: workspace.name.trim(),
      description: workspace.description.trim(),
    });

    notify("Workspace details saved.");
  }

  return (
    <main className="settings-page">
      <header className="settings-heading">
        <div>
          <span className="settings-eyebrow">WORKSPACE CONTROL</span>
          <h1>Settings</h1>
          <p>Manage your profile, preferences, security and team.</p>
        </div>

        <span className="settings-status">
          <span className="settings-status-dot" />
          Preferences enabled
        </span>
      </header>

      <div className="settings-layout">
        <aside className="settings-sidebar">
          <p className="settings-nav-heading">PREFERENCES</p>

          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`settings-nav-item ${
                activeSection === section.id ? "active" : ""
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              <span>{section.icon}</span>
              {section.label}
            </button>
          ))}
        </aside>

        <div className="settings-content">
          {activeSection === "profile" && (
            <section className="settings-card">
              <div className="settings-section-title">
                <div>
                  <h2>Profile information</h2>
                  <p>Update your personal and professional details.</p>
                </div>
              </div>

              <form onSubmit={handleProfileSave}>
                <div className="settings-avatar-row">
                  {profile.avatar ? (
                    <img
                      className="settings-avatar"
                      src={profile.avatar}
                      alt="Profile"
                    />
                  ) : (
                    <div className="settings-avatar settings-avatar-fallback">
                      {profile.name?.charAt(0).toUpperCase() || "A"}
                    </div>
                  )}

                  <div>
                    <h3>{profile.name || "Your name"}</h3>
                    <p>{profile.jobTitle || "Add your job title"}</p>

                    <button
                      type="button"
                      className="settings-secondary-button"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload photo
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handlePhotoChange}
                    />

                    {profile.avatar && (
                      <button
                        type="button"
                        className="settings-text-button"
                        onClick={() => {
                          updateProfile({ avatar: "" });
                          notify("Profile photo removed.");
                        }}
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                </div>

                <div className="settings-form-grid">
                  <Field label="Display name" htmlFor="profile-name">
                    <input
                      id="profile-name"
                      value={profile.name}
                      onChange={(event) =>
                        updateProfile({ name: event.target.value })
                      }
                      required
                      maxLength={60}
                    />
                  </Field>

                  <Field label="Email address" htmlFor="profile-email">
                    <input
                      id="profile-email"
                      type="email"
                      value={profile.email}
                      onChange={(event) =>
                        updateProfile({ email: event.target.value })
                      }
                      required
                    />
                  </Field>

                  <Field label="Job title" htmlFor="profile-title">
                    <input
                      id="profile-title"
                      value={profile.jobTitle}
                      onChange={(event) =>
                        updateProfile({ jobTitle: event.target.value })
                      }
                      placeholder="e.g. Frontend Developer"
                    />
                  </Field>

                  <Field label="Department" htmlFor="profile-department">
                    <input
                      id="profile-department"
                      value={profile.department}
                      onChange={(event) =>
                        updateProfile({ department: event.target.value })
                      }
                      placeholder="e.g. Engineering"
                    />
                  </Field>
                </div>

                <div className="settings-actions">
                  <button
                    type="button"
                    className="settings-reset-button"
                    onClick={handleProfileReset}
                  >
                    Reset profile
                  </button>
                  <button type="submit" className="settings-save-button">
                    Save profile
                  </button>
                </div>
              </form>
            </section>
          )}

          {activeSection === "appearance" && (
            <section className="settings-card">
              <div className="settings-section-title">
                <div>
                  <h2>Appearance</h2>
                </div>
              </div>
              <h3 className="settings-subheading">Color theme</h3>
              <div className="settings-theme-options">
                {[
                  { id: "dark", label: "Dark", icon: "🌙" },
                  { id: "light", label: "Light", icon: "☀️" },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={`settings-theme-card ${
                      preferences.theme === item.id ? "selected" : ""
                    }`}
                    onClick={() =>
                      updatePreferences({ theme: item.id })
                    }
                  >
                    <span className="settings-theme-icon">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    <span>
                      {preferences.theme === item.id ? "✓" : ""}
                    </span>
                  </button>
                ))}
              </div>

              <h3 className="settings-subheading">Accent color</h3>

              <div className="settings-accent-options">
                {[
                  { id: "rose", label: "Rose", color: "#e11d48" },
                  { id: "blue", label: "Blue", color: "#2563eb" },
                  { id: "violet", label: "Violet", color: "#7c3aed" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`settings-accent-option ${
                      preferences.accent === item.id ? "selected" : ""
                    }`}
                    onClick={() =>
                      updatePreferences({ accent: item.id })
                    }
                  >
                    <span
                      className="settings-accent-swatch"
                      style={{ background: item.color }}
                    />
                    {item.label}
                    {preferences.accent === item.id && " ✓"}
                  </button>
                ))}
              </div>
              <div className="settings-actions">
                <button
                  type="button"
                  className="settings-save-button"
                  onClick={handlePreferencesSave}
                >
                  Save preferences
                </button>
              </div>
            </section>
          )}

          {activeSection === "notifications" && (
            <section className="settings-card">
              <div className="settings-section-title">
                <div>
                  <h2>Notification preferences</h2>
                  <p>Choose the updates you want to receive.</p>
                </div>
              </div>

              <ToggleRow
                title="Email notifications"
                description="Receive important workspace updates by email."
                checked={preferences.emailNotifications}
                onChange={(checked) =>
                  updatePreferences({ emailNotifications: checked })
                }
              />

              <ToggleRow
                title="Weekly report"
                description="Keep a weekly summary preference enabled."
                checked={preferences.weeklyReport}
                onChange={(checked) =>
                  updatePreferences({ weeklyReport: checked })
                }
              />

              <ToggleRow
                title="In-app notifications"
                description="Show notifications inside the dashboard."
                checked={preferences.inAppNotifications}
                onChange={(checked) =>
                  updatePreferences({ inAppNotifications: checked })
                }
              />

              <div className="settings-actions">
                <button
                  type="button"
                  className="settings-save-button"
                  onClick={handlePreferencesSave}
                >
                  Save preferences
                </button>
              </div>
            </section>
          )}

          {activeSection === "security" && (
            <section className="settings-card">
              <div className="settings-section-title">
                <div>
                  <h2>Security</h2>
                  <p>Review password requirements for this demo account.</p>
                </div>
              </div>

              <div className="settings-security-notice">
                Demo account current password: <strong>admin123</strong>.
                This form validates input only. It does not change the
                real account password.
              </div>

              <form onSubmit={handlePasswordChange}>
                <Field label="Current password" htmlFor="current-password">
                  <input
                    id="current-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={passwordForm.current}
                    onChange={(event) =>
                      setPasswordForm((previous) => ({
                        ...previous,
                        current: event.target.value,
                      }))
                    }
                    required
                  />
                </Field>

                <Field label="New password" htmlFor="new-password">
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    value={passwordForm.next}
                    onChange={(event) =>
                      setPasswordForm((previous) => ({
                        ...previous,
                        next: event.target.value,
                      }))
                    }
                    required
                  />
                </Field>

                <Field
                  label="Confirm new password"
                  htmlFor="confirm-password"
                >
                  <input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={passwordForm.confirm}
                    onChange={(event) =>
                      setPasswordForm((previous) => ({
                        ...previous,
                        confirm: event.target.value,
                      }))
                    }
                    required
                  />
                </Field>

                <label className="settings-show-password">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(event) =>
                      setShowPassword(event.target.checked)
                    }
                  />
                  Show passwords
                </label>

                {securityError && (
                  <p className="settings-error" role="alert">
                    {securityError}
                  </p>
                )}

                {securityMessage && (
                  <p className="settings-inline-success" role="status">
                    {securityMessage}
                  </p>
                )}

                <div className="settings-actions">
                  <button type="submit" className="settings-save-button">
                    Validate password change
                  </button>
                </div>
              </form>
            </section>
          )}

          {activeSection === "workspace" && (
            <>
              <section className="settings-card">
                <div className="settings-section-title">
                  <div>
                    <h2>Team members</h2>
                    <p>
                      {teamMembers.length} member
                      {teamMembers.length === 1 ? "" : "s"} in this demo
                      workspace.
                    </p>
                  </div>
                </div>

                <form
                  className="settings-team-form"
                  onSubmit={handleAddMember}
                >
                  <Field label="Full name" htmlFor="member-name">
                    <input
                      id="member-name"
                      value={teamForm.name}
                      onChange={(event) =>
                        setTeamForm((previous) => ({
                          ...previous,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Member name"
                      required
                    />
                  </Field>

                  <Field label="Email" htmlFor="member-email">
                    <input
                      id="member-email"
                      type="email"
                      value={teamForm.email}
                      onChange={(event) =>
                        setTeamForm((previous) => ({
                          ...previous,
                          email: event.target.value,
                        }))
                      }
                      placeholder="member@example.com"
                      required
                    />
                  </Field>

                  <Field label="Role" htmlFor="member-role">
                    <select
                      id="member-role"
                      value={teamForm.role}
                      onChange={(event) =>
                        setTeamForm((previous) => ({
                          ...previous,
                          role: event.target.value,
                        }))
                      }
                    >
                      <option>Viewer</option>
                      <option>Editor</option>
                      <option>Admin</option>
                    </select>
                  </Field>

                  <button type="submit" className="settings-save-button">
                    + Add member
                  </button>
                </form>

                <div className="settings-team-list">
                  {teamMembers.map((member) => (
                    <div className="settings-team-member" key={member.id}>
                      <div className="settings-team-avatar">
                        {member.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="settings-team-info">
                        <strong>{member.name}</strong>
                        <span>{member.email}</span>
                      </div>

                      <span className="settings-role-badge">
                        {member.role}
                      </span>

                      <button
                        type="button"
                        className="settings-remove-button"
                        aria-label={`Remove ${member.name}`}
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  {teamMembers.length === 0 && (
                    <p className="settings-empty">
                      No team members yet. Add your first member above.
                    </p>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </div>

      {toast && (
        <div className="settings-toast" role="status">
          <span>✓</span>
          {toast}
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            ×
          </button>
        </div>
      )}
    </main>
  );
}

function Field({ label, htmlFor, children }) {
  return (
    <div className="settings-field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <label className="settings-toggle-row">
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}
