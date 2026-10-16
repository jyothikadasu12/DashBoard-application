import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

// Default profile
const defaultProfile = {
  name: "Admin",
  email: "admin@example.com",
  jobTitle: "Workspace Administrator",
  department: "Management",
  avatar: "",
};

// Default appearance and notification settings
const defaultPreferences = {
  theme: "dark",
  accent: "rose",
  emailNotifications: true,
  weeklyReport: true,
  inAppNotifications: true,
};

// Default workspace
const defaultWorkspace = {
  name: "My Workspace",
  description: "Our team's shared workspace",
};

// Default team members
const defaultMembers = [
  {
    id: "member-1",
    name: "Alex Morgan",
    email: "alex@example.com",
    role: "Admin",
  },
  {
    id: "member-2",
    name: "Sam Taylor",
    email: "sam@example.com",
    role: "Editor",
  },
];

// Safely read data from localStorage
function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }) {
  // Authentication state
  const [user, setUser] = useState(() =>
    readStorage("dashboard-user", null)
  );

  // Profile state
  const [profile, setProfile] = useState(() => {
    const savedProfile = readStorage(
      "dashboard-profile",
      {}
    );

    return {
      ...defaultProfile,
      ...savedProfile,
      name:
        localStorage.getItem("dashboard-profile-name") ||
        savedProfile.name ||
        defaultProfile.name,
    };
  });

  // Theme and notification preferences
  const [preferences, setPreferences] = useState(() => ({
    ...defaultPreferences,
    ...readStorage("dashboard-preferences", {}),
  }));

  // Workspace state
  const [workspace, setWorkspace] = useState(() => ({
    ...defaultWorkspace,
    ...readStorage("dashboard-workspace", {}),
  }));

  // Shared team members state
  const [teamMembers, setTeamMembers] = useState(() =>
    readStorage(
      "dashboard-team-members",
      defaultMembers
    )
  );

  // Save profile changes
  useEffect(() => {
    localStorage.setItem(
      "dashboard-profile",
      JSON.stringify(profile)
    );

    localStorage.setItem(
      "dashboard-profile-name",
      profile.name || defaultProfile.name
    );
  }, [profile]);

  // Save preferences and apply theme globally
  useEffect(() => {
    localStorage.setItem(
      "dashboard-preferences",
      JSON.stringify(preferences)
    );

    localStorage.setItem(
      "dashboard-theme",
      preferences.theme
    );

    localStorage.setItem(
      "dashboard-email-notifications",
      String(preferences.emailNotifications)
    );

    localStorage.setItem(
      "dashboard-weekly-report",
      String(preferences.weeklyReport)
    );

    document.documentElement.dataset.theme =
      preferences.theme;

    document.documentElement.dataset.accent =
      preferences.accent;
  }, [preferences]);

  // Save workspace changes
  useEffect(() => {
    localStorage.setItem(
      "dashboard-workspace",
      JSON.stringify(workspace)
    );
  }, [workspace]);

  // Save team member changes
  useEffect(() => {
    localStorage.setItem(
      "dashboard-team-members",
      JSON.stringify(teamMembers)
    );
  }, [teamMembers]);

  // Login
  function login(email, password) {
    // Demo authentication only
    if (
      email === "admin@example.com" &&
      password === "admin123"
    ) {
      const loggedInUser = {
        email,
        name: profile.name || "Admin",
      };

      setUser(loggedInUser);

      localStorage.setItem(
        "dashboard-user",
        JSON.stringify(loggedInUser)
      );

      return true;
    }

    return false;
  }

  // Logout
  function logout() {
    setUser(null);
    localStorage.removeItem("dashboard-user");
  }

  // Update profile
  function updateProfile(changes) {
    setProfile((previous) => ({
      ...previous,
      ...changes,
    }));

    setUser((previous) => {
      if (!previous) return previous;

      const updatedUser = {
        ...previous,
        name: changes.name ?? previous.name,
        email: changes.email ?? previous.email,
      };

      localStorage.setItem(
        "dashboard-user",
        JSON.stringify(updatedUser)
      );

      return updatedUser;
    });
  }

  // Update theme and notification preferences
  function updatePreferences(changes) {
    setPreferences((previous) => ({
      ...previous,
      ...changes,
    }));
  }

  // Update workspace information
  function updateWorkspace(changes) {
    setWorkspace((previous) => ({
      ...previous,
      ...changes,
    }));
  }

  // Add a team member
  function addTeamMember(member) {
    const normalizedEmail = member.email
      .trim()
      .toLowerCase();

    const emailExists = teamMembers.some(
      (existingMember) =>
        existingMember.email.toLowerCase() ===
        normalizedEmail
    );

    if (emailExists) {
      return {
        success: false,
        message: "A member with this email already exists.",
      };
    }

    const newMember = {
      id: crypto.randomUUID(),
      name: member.name.trim(),
      email: normalizedEmail,
      role: member.role,
    };

    setTeamMembers((previousMembers) => [
      ...previousMembers,
      newMember,
    ]);

    return {
      success: true,
      message: "Team member added successfully.",
    };
  }

  // Remove a team member
  function removeTeamMember(memberId) {
    setTeamMembers((previousMembers) =>
      previousMembers.filter(
        (member) => member.id !== memberId
      )
    );
  }

  // Update an existing team member
  function updateTeamMember(memberId, changes) {
    setTeamMembers((previousMembers) =>
      previousMembers.map((member) =>
        member.id === memberId
          ? { ...member, ...changes }
          : member
      )
    );
  }

  // Shared Context values and functions
  const value = {
    user,
    profile,
    preferences,
    workspace,
    teamMembers,

    login,
    logout,

    updateProfile,
    updatePreferences,
    updateWorkspace,

    setTeamMembers,
    addTeamMember,
    removeTeamMember,
    updateTeamMember,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for accessing Context
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
