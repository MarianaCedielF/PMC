import { useState } from "react";
import { Settings, RotateCcw, LogOut, UserPlus, ChevronDown } from "lucide-react";
import { useLang } from "../i18n";
import { useData } from "../data";
import { useAuth, usePermissions, ROLES, PERM_LABELS } from "../auth";

function getInitials(name = "") {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

function getAvatarColor(name = "") {
  const colors = ["#e8b4b8", "#b4c8e8", "#c8e8b4", "#e8d4b4", "#d4b4e8", "#b4e8d4", "#f0e4b4"];
  let hash = 0;
  for (const c of name) hash = (hash + c.charCodeAt(0)) % colors.length;
  return colors[hash];
}

function RoleBadge({ role, small = false }) {
  const r = ROLES[role] || ROLES.member;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: r.bg, color: r.color, border: `1px solid ${r.border}`,
      borderRadius: 20, padding: small ? "2px 8px" : "4px 12px",
      fontSize: small ? 11 : 12, fontWeight: 700,
    }}>
      {r.icon} {r.label}
    </span>
  );
}

export default function Profile() {
  const { t, lang } = useLang();
  const { pantryItems, resetData } = useData();
  const { user, logout, changeUserRole, householdMembers } = useAuth();
  const perms = usePermissions();

  const [showInvite,  setShowInvite]  = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [pendingInvites, setPendingInvites] = useState([
    { id: 1, email: "jordan@example.com", sent: "Hace 2 horas" },
  ]);
  const [showReset,   setShowReset]   = useState(false);
  const [showLogout,  setShowLogout]  = useState(false);
  const [rolePickerId, setRolePickerId] = useState(null);

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    setPendingInvites(prev => [...prev, { id: Date.now(), email: inviteEmail.trim(), sent: "Justo ahora" }]);
    setInviteEmail("");
    setShowInvite(false);
  };

  const handleReset = () => { resetData(); setShowReset(false); };

  const activeItems   = pantryItems.filter(i => i.status !== "consumed").length;
  const otherMembers  = householdMembers.filter(m => m.id !== user?.id);
  const currentRole   = ROLES[user?.role] || ROLES.member;
  const permEntries   = Object.entries(perms);

  return (
    <div className="screen">
      <div className="header header-simple">
        <div style={{ width: 32 }} />
        <span className="page-title">{t("profile")}</span>
        <div style={{ width: 32 }} />
      </div>

      {/* ── Mi perfil ── */}
      <div style={{ background: "white", borderRadius: 20, padding: "20px 16px", boxShadow: "var(--shadow)", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <div style={{
            width: 54, height: 54, borderRadius: "50%",
            background: getAvatarColor(user?.name),
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 800, color: "#444", flexShrink: 0,
          }}>
            {getInitials(user?.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: "var(--text)", marginBottom: 2 }}>{user?.name}</div>
            <div style={{ fontSize: 12, color: "var(--text-sub)", marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</div>
            <RoleBadge role={user?.role} />
          </div>
        </div>

        {/* Role banner */}
        <div style={{
          background: currentRole.bg, border: `1.5px solid ${currentRole.border}`,
          borderRadius: 12, padding: "10px 14px", marginBottom: 14,
          fontSize: 12, color: currentRole.color, fontWeight: 600,
        }}>
          {user?.role === "owner"
            ? "Tienes acceso total al hogar. Puedes gestionar miembros y permisos."
            : user?.role === "co-admin"
            ? "Puedes gestionar la despensa e invitar miembros, pero no cambiar roles."
            : "Puedes consultar y consumir productos, y gestionar la lista de compras."}
        </div>

        {/* Permissions grid */}
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-sub)", marginBottom: 8 }}>
          MIS PERMISOS
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {permEntries.map(([key, allowed]) => (
            <div key={key} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: allowed ? "#f0fdf4" : "#fef2f2",
              borderRadius: 8, padding: "6px 10px",
              fontSize: 11, fontWeight: 600,
              color: allowed ? "var(--green-dark)" : "#ef4444",
            }}>
              <span style={{ fontSize: 13 }}>{allowed ? "✅" : "❌"}</span>
              {PERM_LABELS[key] || key}
            </div>
          ))}
        </div>
      </div>

      {/* ── Acciones ── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        {perms.inviteMembers && (
          <button
            className="invite-btn"
            style={{ flex: 1 }}
            onClick={() => setShowInvite(!showInvite)}
          >
            <UserPlus size={15} style={{ marginRight: 6 }} />
            Invitar miembro
          </button>
        )}
        {perms.resetData && (
          <button
            className="settings-btn"
            onClick={() => setShowReset(true)}
            title="Resetear datos demo"
            style={{ background: "#fff0f0" }}
          >
            <RotateCcw size={16} color="#ef4444" />
          </button>
        )}
        <button
          className="settings-btn"
          title="Configuración"
        >
          <Settings size={18} color="#666" />
        </button>
        <button
          className="settings-btn"
          onClick={() => setShowLogout(true)}
          title="Cerrar sesión"
          style={{ background: "#fff0f0" }}
        >
          <LogOut size={16} color="#ef4444" />
        </button>
      </div>

      {/* Invite form */}
      {showInvite && (
        <div className="invite-form" style={{ marginBottom: 16 }}>
          <input
            className="field-input"
            type="email"
            placeholder="correo@ejemplo.com"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleInvite()}
            style={{ margin: 0 }}
          />
          <button className="add-btn-green" style={{ marginLeft: 8, whiteSpace: "nowrap" }} onClick={handleInvite}>
            Enviar
          </button>
        </div>
      )}

      {/* ── Stats ── */}
      <div className="profile-stats" style={{ marginBottom: 16 }}>
        <div className="profile-stat-card">
          <div className="profile-stat-label">MIEMBROS ACTIVOS</div>
          <div className="profile-stat-num">{householdMembers.length}</div>
        </div>
        <div className="profile-stat-card">
          <div className="profile-stat-label">ARTÍCULOS EN DESPENSA</div>
          <div className="profile-stat-num">{activeItems}</div>
        </div>
      </div>

      {/* ── Integrantes del hogar ── */}
      <div className="section-header" style={{ marginBottom: 8 }}>
        <div className="section-title-row">
          <span className="section-title">Integrantes del hogar</span>
        </div>
        {perms.managePermissions && (
          <span style={{ fontSize: 11, color: "var(--text-sub)", fontWeight: 600 }}>
            Toca el rol para cambiarlo
          </span>
        )}
      </div>

      <div className="members-list" style={{ marginBottom: 16 }}>
        {/* Current user first */}
        <div className="member-item">
          <div
            className="member-avatar"
            style={{ background: getAvatarColor(user?.name), color: "#444", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {getInitials(user?.name)}
          </div>
          <div className="member-info" style={{ flex: 1 }}>
            <div className="item-name" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {user?.name}
              <span style={{ fontSize: 10, background: "var(--green)", color: "white", borderRadius: 10, padding: "1px 7px", fontWeight: 700 }}>Tú</span>
            </div>
            <div className="item-detail">{user?.email}</div>
          </div>
          <RoleBadge role={user?.role} small />
        </div>

        {/* Other members */}
        {otherMembers.map(m => (
          <div key={m.id} className="member-item">
            <div
              className="member-avatar"
              style={{ background: getAvatarColor(m.name), color: "#444", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {getInitials(m.name)}
            </div>
            <div className="member-info" style={{ flex: 1 }}>
              <div className="item-name">{m.name}</div>
              <div className="item-detail">{m.email}</div>
            </div>
            {perms.managePermissions ? (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setRolePickerId(rolePickerId === m.id ? null : m.id)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    background: (ROLES[m.role] || ROLES.member).bg,
                    color: (ROLES[m.role] || ROLES.member).color,
                    border: `1px solid ${(ROLES[m.role] || ROLES.member).border}`,
                    borderRadius: 20, padding: "3px 10px",
                    fontSize: 11, fontWeight: 700, cursor: "pointer",
                  }}
                >
                  {(ROLES[m.role] || ROLES.member).icon} {(ROLES[m.role] || ROLES.member).label}
                  <ChevronDown size={11} />
                </button>
                {rolePickerId === m.id && (
                  <div style={{
                    position: "absolute", right: 0, top: "110%", zIndex: 50,
                    background: "white", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    overflow: "hidden", minWidth: 140,
                  }}>
                    {Object.entries(ROLES)
                      .filter(([key]) => key !== "owner")
                      .map(([key, r]) => (
                        <button
                          key={key}
                          onClick={() => { changeUserRole(m.id, key); setRolePickerId(null); }}
                          style={{
                            display: "flex", alignItems: "center", gap: 8,
                            width: "100%", padding: "10px 14px",
                            background: m.role === key ? r.bg : "transparent",
                            border: "none", cursor: "pointer", fontSize: 13,
                            fontWeight: m.role === key ? 700 : 500,
                            color: m.role === key ? r.color : "var(--text)",
                            fontFamily: "inherit",
                          }}
                        >
                          {r.icon} {r.label}
                          {m.role === key && <span style={{ marginLeft: "auto", fontSize: 11 }}>✓</span>}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <RoleBadge role={m.role} small />
            )}
          </div>
        ))}

        {/* Pending invites */}
        {perms.inviteMembers && pendingInvites.map(inv => (
          <div key={inv.id} className="member-item member-pending">
            <div className="member-avatar member-avatar-pending">✉️</div>
            <div className="member-info">
              <div className="item-name pending-email">{inv.email}</div>
              <div className="item-detail">Invitación pendiente · Enviado {inv.sent}</div>
            </div>
            <button
              className="cancel-invite"
              onClick={() => setPendingInvites(prev => prev.filter(i => i.id !== inv.id))}
            >
              Cancelar
            </button>
          </div>
        ))}
      </div>

      {/* ── Logout modal ── */}
      {showLogout && (
        <div className="modal-overlay" onClick={() => setShowLogout(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">¿Cerrar sesión?</div>
            <div className="modal-item-name" style={{ marginBottom: 20 }}>
              Tu sesión se cerrará. Podrás volver a iniciar sesión en cualquier momento.
            </div>
            <div className="modal-actions">
              <button className="notif-btn-outline" style={{ flex: 1 }} onClick={() => setShowLogout(false)}>
                Cancelar
              </button>
              <button
                onClick={logout}
                style={{ flex: 2, background: "#ef4444", color: "white", border: "none", borderRadius: 14, padding: 16, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reset modal ── */}
      {showReset && (
        <div className="modal-overlay" onClick={() => setShowReset(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">¿Resetear datos?</div>
            <div className="modal-item-name" style={{ marginBottom: 20 }}>
              Esto restaurará los datos de ejemplo originales. Esta acción no se puede deshacer.
            </div>
            <div className="modal-actions">
              <button className="notif-btn-outline" style={{ flex: 1 }} onClick={() => setShowReset(false)}>
                Cancelar
              </button>
              <button
                onClick={handleReset}
                style={{ flex: 2, background: "#ef4444", color: "white", border: "none", borderRadius: 14, padding: 16, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}
              >
                Resetear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close role picker on outside click */}
      {rolePickerId && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 40 }}
          onClick={() => setRolePickerId(null)}
        />
      )}
    </div>
  );
}
