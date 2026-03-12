import { ArrowLeft, UserPlus, Settings, X } from "lucide-react";
import { useLang } from "../i18n";
import { useData } from "../data";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const MEMBERS = [
  { id: 1, name: "Sarah Miller", role: "coAdmin", joined: "2 months ago", avatar: "👩🏼", color: "#e8b4b8" },
  { id: 2, name: "David Chen", role: "member", joined: "3 weeks ago", avatar: "👨🏻", color: "#b4c8e8" },
  { id: 3, name: "Emily Rodriguez", role: "member", joined: "5 days ago", avatar: "👩🏽", color: "#c8e8b4" },
];

export default function Profile() {
  const { t } = useLang();
  const { pantryItems } = useData();
  const navigate = useNavigate();
  const [inviteEmail, setInviteEmail] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [pendingInvite, setPendingInvite] = useState({ email: "jordan@example.com", sent: "2 hours ago" });

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      setPendingInvite({ email: inviteEmail.trim(), sent: "Just now" });
      setInviteEmail("");
      setShowInvite(false);
    }
  };

  return (
    <div className="screen">
      {/* Header */}
      <div className="header header-simple">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="page-title">{t("profile")}</span>
        <button className="icon-btn">
          <UserPlus size={18} color="#22c55e" />
        </button>
      </div>

      {/* Profile Card */}
      <div className="profile-center">
        <div className="profile-avatar-ring">
          <div className="profile-avatar">👨🏻</div>
        </div>
        <div className="profile-name">Alex Johnson</div>
        <div className="profile-role">{t("householdOwner")}</div>
      </div>

      {/* Invite + Settings */}
      <div className="profile-actions">
        <button className="invite-btn" onClick={() => setShowInvite(!showInvite)}>
          {t("inviteNewMember")}
        </button>
        <button className="settings-btn">
          <Settings size={18} color="#666" />
        </button>
      </div>

      {/* Invite form */}
      {showInvite && (
        <div className="invite-form">
          <input
            className="field-input"
            placeholder="email@example.com"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleInvite()}
          />
          <button className="add-btn-green" style={{ marginLeft: 8 }} onClick={handleInvite}>Send</button>
        </div>
      )}

      {/* Stats */}
      <div className="profile-stats">
        <div className="profile-stat-card">
          <div className="profile-stat-label">{t("activeMembers")}</div>
          <div className="profile-stat-num">{MEMBERS.length + 1}</div>
        </div>
        <div className="profile-stat-card">
          <div className="profile-stat-label">{t("pantryItems")}</div>
          <div className="profile-stat-num">{pantryItems.length + 118}</div>
        </div>
      </div>

      {/* Members */}
      <div className="section-header">
        <div className="section-title-row">
          <span className="section-title">{t("currentMembers")}</span>
        </div>
        <button className="view-all-btn">{t("managePermissions")}</button>
      </div>

      <div className="members-list">
        {MEMBERS.map(m => (
          <div key={m.id} className="member-item">
            <div className="member-avatar" style={{ background: m.color }}>{m.avatar}</div>
            <div className="member-info">
              <div className="item-name">{m.name}</div>
              <div className="item-detail">{t(m.role)} · {t("joined")} {m.joined}</div>
            </div>
          </div>
        ))}

        {/* Pending invite */}
        {pendingInvite && (
          <div className="member-item member-pending">
            <div className="member-avatar member-avatar-pending">✉️</div>
            <div className="member-info">
              <div className="item-name pending-email">{pendingInvite.email}</div>
              <div className="item-detail">{t("invitePending")} · {t("sent")} {pendingInvite.sent}</div>
            </div>
            <button className="cancel-invite" onClick={() => setPendingInvite(null)}>
              {t("cancel")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
