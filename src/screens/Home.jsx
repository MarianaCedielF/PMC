import { Search, AlertCircle, Refrigerator, Package, Plus } from "lucide-react";
import { useData } from "../data";
import { useLang } from "../i18n";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const { fresh, warning, expired, fridgeItems, pantryZoneItems, pantryItems } = useData();
  const { t } = useLang();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const expiringSoon = pantryItems.filter(i => i.status === "warning" || i.status === "expiring");
  const activity = [
    { id: 1, name: "Free-range Eggs", detail: "addedByUser", user: "Sarah", time: "2 hours ago", status: "added", emoji: "🥚" },
    { id: 2, name: "Ground Coffee", detail: "consumedBy", user: "David", time: "Yesterday", status: "consumed", emoji: "☕" },
    { id: 3, name: "Organic Milk", detail: "expiringSoonLabel", user: "", time: "3 hours ago", status: "expiring", emoji: "🥛" },
  ];

  const filteredItems = search
    ? pantryItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div className="screen">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <div className="logo-box">
            <Refrigerator size={22} color="white" />
          </div>
          <div>
            <div className="app-name">{t("appName")}</div>
            <div className="app-sub">{t("pantryDashboard")}</div>
          </div>
        </div>
        <div className="header-right">
          <button className="icon-btn" onClick={() => navigate("/alerts")}>
            <span className="notif-dot" />
            🔔
          </button>
          <div className="avatar-circle">👤</div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card stat-green">
          <div className="stat-num green">{fresh}</div>
          <div className="stat-label">{t("fresh")}</div>
          <div className="stat-bar green-bar" />
        </div>
        <div className="stat-card stat-orange">
          <div className="stat-num orange">{warning}</div>
          <div className="stat-label">{t("warning")}</div>
          <div className="stat-bar orange-bar" />
        </div>
        <div className="stat-card stat-red">
          <div className="stat-num red">{expired}</div>
          <div className="stat-label">{t("expired")}</div>
          <div className="stat-bar red-bar" />
        </div>
      </div>

      {/* Search */}
      <div className="search-wrap">
        <Search size={16} color="#aaa" />
        <input
          className="search-input"
          placeholder={t("searchPantry")}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Search results */}
      {search && (
        <div className="search-results">
          {filteredItems.length === 0 ? (
            <div className="no-results">No items found</div>
          ) : (
            filteredItems.map(item => (
              <div key={item.id} className="search-result-item">
                <span className="item-emoji">{item.img}</span>
                <div>
                  <div className="item-name">{item.name}</div>
                  <div className="item-detail">{item.zone} · {item.detail}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Expiring Soon */}
      <div className="section-header">
        <div className="section-title-row">
          <AlertCircle size={18} color="#f59e0b" />
          <span className="section-title">{t("expiringSoon")}</span>
        </div>
        <button className="view-all-btn" onClick={() => navigate("/alerts")}>{t("viewAll")}</button>
      </div>

      <div className="expiring-list">
        {expiringSoon.slice(0, 2).map(item => (
          <div key={item.id} className="expiring-card">
            <div className="expiring-img">{item.img}</div>
            <div className="expiring-info">
              <div className="item-name">{item.name}</div>
              <div className="item-detail">{item.zone} · {item.detail}</div>
            </div>
            <div className="expiring-time">
              <div className={`expires-label ${item.expiresLabel === "Today" ? "orange" : "orange"}`}>
                {item.expiresLabel === "Today" ? t("today") : t("tomorrow")}
              </div>
              <div className="expires-time">{item.expiresTime}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Storage Zones */}
      <div className="section-header">
        <div className="section-title-row">
          <Refrigerator size={18} color="#22c55e" />
          <span className="section-title">{t("storageZones")}</span>
        </div>
      </div>

      <div className="zones-row">
        <button className="zone-card zone-fridge" onClick={() => navigate("/inventory?zone=Fridge")}>
          <div className="zone-icon">❄️</div>
          <div className="zone-name">{t("fridge")}</div>
          <div className="zone-count">{fridgeItems} {t("itemsInside")}</div>
        </button>
        <button className="zone-card zone-pantry" onClick={() => navigate("/inventory?zone=Pantry")}>
          <div className="zone-icon">📦</div>
          <div className="zone-name">{t("pantry")}</div>
          <div className="zone-count">{pantryZoneItems} {t("itemsInside")}</div>
        </button>
      </div>

      {/* Activity */}
      <div className="section-header">
        <div className="section-title-row">
          <span className="plus-circle">+</span>
          <span className="section-title">{t("pantryActivity")}</span>
        </div>
      </div>

      <div className="activity-list">
        {activity.map(item => (
          <div key={item.id} className="activity-item">
            <div className="activity-emoji-wrap">
              <span className="activity-emoji">{item.emoji}</span>
            </div>
            <div className="activity-info">
              <div className="item-name">{item.name}</div>
              <div className="item-detail">
                {item.status === "expiring"
                  ? `${t("expiringSoonLabel")} · ${item.time}`
                  : `${item.status === "added" ? t("addedByUser") : t("consumedBy")} ${item.user} · ${item.time}`}
              </div>
            </div>
            <span className={`badge badge-${item.status}`}>
              {item.status === "added" ? t("added") : item.status === "consumed" ? t("consumed") : t("expiring")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
