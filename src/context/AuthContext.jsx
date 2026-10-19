
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

const DEFAULT_PROFILE = {
  name: "Admin",
  email: "admin@example.com",
  jobTitle: "Workspace Administrator",
  department: "Management",
  avatar: "",
};

const DEFAULT_PREFERENCES = {
  theme: "dark",
  accent: "rose",
  emailNotifications: true,
  weeklyReport: true,
  inAppNotifications: true,
};

const DEFAULT_MEMBERS = [
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

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved === null ? fallback : JSON.parse(saved);
  } catch {
    return fallback;
  }
}

function createId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `member-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    readStorage("dashboard-user", null)
  );

  const [profile, setProfile] = useState(() => {
    const saved = readStorage("dashboard-profile", {});
    const oldName = localStorage.getItem("dashboard-profile-name");

    return {
      ...DEFAULT_PROFILE,
      ...saved,
      name: saved.name || oldName || DEFAULT_PROFILE.name,
    };
  });

  const [preferences, setPreferences] = useState(() => ({
    ...DEFAULT_PREFERENCES,
    ...readStorage("dashboard-preferences", {}),
  }));

  const [teamMembers, setTeamMembers] = useState(() => {
    const saved = readStorage("dashboard-team-members", null);
    return Array.isArray(saved) ? saved : DEFAULT_MEMBERS;
  });

  useEffect(() => {
    localStorage.setItem("dashboard-profile", JSON.stringify(profile));
    localStorage.setItem("dashboard-profile-name", profile.name);
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(
      "dashboard-preferences",
      JSON.stringify(preferences)
    );

    document.documentElement.dataset.theme = preferences.theme;
    document.documentElement.dataset.accent = preferences.accent;
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem(
      "dashboard-team-members",
      JSON.stringify(teamMembers)
    );
  }, [teamMembers]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("dashboard-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("dashboard-user");
    }
  }, [user]);

  const login = useCallback((email, password) => {
    if (
      email.trim().toLowerCase() !== "admin@example.com" ||
      password !== "admin123"
    ) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    setUser({
      name: profile.name || "Admin",
      email: profile.email || "admin@example.com",
    });

    return { success: true, message: "Login successful." };
  }, [profile.name, profile.email]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback((changes) => {
    setProfile((current) => ({
      ...current,
      ...changes,
    }));

    setUser((current) => {
      if (!current) return current;

      return {
        ...current,
        ...(changes.name !== undefined && { name: changes.name }),
        ...(changes.email !== undefined && { email: changes.email }),
      };
    });
  }, []);

  const updatePreferences = useCallback((changes) => {
    setPreferences((current) => ({
      ...current,
      ...changes,
    }));
  }, []);

  const addTeamMember = useCallback((member) => {
    const name = member.name?.trim() || "";
    const email = member.email?.trim().toLowerCase() || "";
    const role = member.role || "Editor";

    if (!name || !email) {
      return {
        success: false,
        message: "Name and email are required.",
      };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        success: false,
        message: "Enter a valid email address.",
      };
    }

    if (!["Admin", "Editor", "Viewer"].includes(role)) {
      return {
        success: false,
        message: "Select a valid role.",
      };
    }

    const exists = teamMembers.some(
      (item) => item.email.trim().toLowerCase() === email
    );

    if (exists) {
      return {
        success: false,
        message: "A member with this email already exists.",
      };
    }

    const newMember = {
      id: createId(),
      name,
      email,
      role,
    };

    setTeamMembers((current) => [...current, newMember]);

    return {
      success: true,
      message: "Team member added successfully.",
      member: newMember,
    };
  }, [teamMembers]);

  const removeTeamMember = useCallback((memberId) => {
    setTeamMembers((current) =>
      current.filter((member) => member.id !== memberId)
    );
  }, []);

  const updateTeamMember = useCallback((memberId, changes) => {
    if (
      changes.role &&
      !["Admin", "Editor", "Viewer"].includes(changes.role)
    ) {
      return false;
    }

    setTeamMembers((current) =>
      current.map((member) =>
        member.id === memberId
          ? { ...member, ...changes }
          : member
      )
    );

    return true;
  }, []);

  const value = useMemo(() => ({
    user,
    profile,
    preferences,
    teamMembers,
    login,
    logout,
    updateProfile,
    updatePreferences,
    addTeamMember,
    removeTeamMember,
    updateTeamMember,
  }), [
    user,
    profile,
    preferences,
    teamMembers,
    login,
    logout,
    updateProfile,
    updatePreferences,
    addTeamMember,
    removeTeamMember,
    updateTeamMember,
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
