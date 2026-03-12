import { useData } from "../data";
import { useLang } from "../i18n";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const TABS = ["all", "expiringSoon", "expired", "tips"];

export default function Alerts() {
  const { notifications, actionNotification } = useData();
  const { t } = useLang();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const todayNotifs = notifications.filter(n => n.section === "today");
  const yesterdayNotifs = notifications.filter(n => n.section === "yesterday");

  const filterNotif = (notifs) => {
    if (activeTab === "all") return notifs;
    if (activeTab === "expiringSoon") return notifs.filter(n => n.type === "expiring");
    if (activeTab === "expired") return notifs.filter(n => n.type === "expired");
    if (activeTab === "tips") return notifs.filter(n => n.type === "tip");
    return notifs;
  };

  const todayFiltered = filterNotif(todayNotifs);
  const yesterdayFiltered = filterNotif(yesterdayNotifs);

  return (
    <div className="screen">
      {/* Header */}
      <div className="header header-simple">
        <div style={{ width: 32 }} />
        <span className="page-title">{t("notifications")}</span>
        <div style={{ width: 32 }} />
      </div>

      {/* Tabs */}
      <div className="tabs-scroll tabs-scroll-alerts">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`tab-btn-alert ${activeTab === tab ? "tab-alert-active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "expired" ? t("expiredLabel") : t(tab)}
          </button>
        ))}
      </div>

      {/* TODAY */}
      {todayFiltered.length > 0 && (
        <>
          <div className="day-label">TODAY</div>
          {todayFiltered.map(notif => (
            <NotifCard key={notif.id} notif={notif} t={t} onAction={actionNotification} />
          ))}
        </>
      )}

      {/* YESTERDAY */}
      {yesterdayFiltered.length > 0 && (
        <>
          <div className="day-label">{t("yesterday").toUpperCase()}</div>
          {yesterdayFiltered.map(notif => (
            <NotifCard key={notif.id} notif={notif} t={t} onAction={actionNotification} />
          ))}
        </>
      )}

      {todayFiltered.length === 0 && yesterdayFiltered.length === 0 && (
        <div className="empty-state">
          <div className="empty-emoji">✅</div>
          <div className="empty-text">All clear! No notifications here.</div>
        </div>
      )}
    </div>
  );
}

function NotifCard({ notif, t, onAction }) {
  const isExpired = notif.type === "expired";
  const isTip = notif.type === "tip";

  return (
    <div className={`notif-card ${isExpired ? "notif-expired" : ""}`}>
      <div className="notif-top">
        <div className={`notif-icon-wrap ${isExpired ? "notif-icon-red" : isTip ? "notif-icon-blue" : "notif-icon-green"}`}>
          {isTip ? "💡" : isExpired ? "⚠️" : (notif.img || "🔔")}
        </div>
        <div className="notif-content">
          <div className={`notif-title ${isExpired ? "red" : ""}`}>{notif.item}</div>
          <div className="notif-msg">{notif.msg}</div>
        </div>
        <div className="notif-time">{notif.time}</div>
      </div>
      {!isTip && (
        <div className="notif-actions">
          {notif.type === "expiring" && (
            <>
              <button className="notif-btn-green" onClick={() => onAction(notif.id)}>{t("markAsUsed")}</button>
              <button className="notif-btn-outline">{t("viewRecipe")}</button>
            </>
          )}
          {notif.type === "expired" && (
            <button className="notif-btn-gray" onClick={() => onAction(notif.id)}>{t("removeFromPantry")}</button>
          )}
        </div>
      )}
    </div>
  );
}
