import { createContext, useContext, useState } from "react";

const AUTH_USERS_KEY   = "freshkeeper_users";
const AUTH_SESSION_KEY = "freshkeeper_session";

export const ROLES = {
  owner: {
    label: "Propietario",
    icon: "👑",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fcd34d",
    permissions: {
      addProducts: true,
      removeProducts: true,
      consumeProducts: true,
      inviteMembers: true,
      managePermissions: true,
      resetData: true,
      manageShoppingList: true,
    },
  },
  "co-admin": {
    label: "Co-Admin",
    icon: "⭐",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#93c5fd",
    permissions: {
      addProducts: true,
      removeProducts: true,
      consumeProducts: true,
      inviteMembers: true,
      managePermissions: false,
      resetData: false,
      manageShoppingList: true,
    },
  },
  member: {
    label: "Miembro",
    icon: "👤",
    color: "#4b5563",
    bg: "#f3f4f6",
    border: "#d1d5db",
    permissions: {
      addProducts: false,
      removeProducts: false,
      consumeProducts: true,
      inviteMembers: false,
      managePermissions: false,
      resetData: false,
      manageShoppingList: true,
    },
  },
};

export const PERM_LABELS = {
  addProducts:        "Agregar productos",
  removeProducts:     "Eliminar productos",
  consumeProducts:    "Marcar consumido",
  inviteMembers:      "Invitar miembros",
  managePermissions:  "Gestionar permisos",
  resetData:          "Resetear datos",
  manageShoppingList: "Lista de compras",
};

const INITIAL_USERS = [
  { id: 1, name: "Alex Johnson",  email: "alex@freshkeeper.com",  password: "demo123", role: "owner"    },
  { id: 2, name: "Sarah Miller",  email: "sarah@freshkeeper.com", password: "demo123", role: "co-admin" },
  { id: 3, name: "David Chen",    email: "david@freshkeeper.com", password: "demo123", role: "member"   },
];

function loadUsers() {
  try {
    const raw = localStorage.getItem(AUTH_USERS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_USERS;
  } catch { return INITIAL_USERS; }
}

function saveUsers(users) {
  try { localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users)); } catch {}
}

function loadSession() {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    // Re-sync role from users list in case it was changed
    const users = loadUsers();
    const found = users.find(u => u.id === s.id);
    return found ? { id: found.id, name: found.name, email: found.email, role: found.role || "member" } : null;
  } catch { return null; }
}

function saveSession(user) {
  try { localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user)); } catch {}
}

function clearSession() {
  try { localStorage.removeItem(AUTH_SESSION_KEY); } catch {}
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(() => loadSession());
  const [users, setUsers] = useState(() => loadUsers());

  const login = (email, password) => {
    const list  = loadUsers();
    const found = list.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) return { error: "no_user" };
    if (found.password !== password) return { error: "password" };
    const session = { id: found.id, name: found.name, email: found.email, role: found.role || "member" };
    saveSession(session);
    setUsers(list);
    setUser(session);
    return { success: true };
  };

  const register = (name, email, password) => {
    const list   = loadUsers();
    const exists = list.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) return { error: "exists" };
    const newUser = { id: Date.now(), name: name.trim(), email: email.trim(), password, role: "member" };
    const updated = [...list, newUser];
    saveUsers(updated);
    setUsers(updated);
    const session = { id: newUser.id, name: newUser.name, email: newUser.email, role: "member" };
    saveSession(session);
    setUser(session);
    return { success: true };
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  // Only owner can change roles; cannot demote themselves
  const changeUserRole = (userId, newRole) => {
    if (user?.role !== "owner" || userId === user.id) return;
    const updated = users.map(u => u.id === userId ? { ...u, role: newRole } : u);
    saveUsers(updated);
    setUsers(updated);
  };

  // householdMembers: all users without passwords
  const householdMembers = users.map(({ password: _p, ...rest }) => rest);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, changeUserRole, householdMembers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function usePermissions() {
  const { user } = useAuth();
  const role = user?.role || "member";
  return ROLES[role]?.permissions ?? ROLES.member.permissions;
}
