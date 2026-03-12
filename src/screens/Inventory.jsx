import { useState } from "react";
import { ArrowLeft, UserPlus, Trash2 } from "lucide-react";
import { useData } from "../data";
import { useLang } from "../i18n";
import { useNavigate, useSearchParams } from "react-router-dom";

const CATEGORIES = ["allItems", "produce", "pantry", "dairy", "household"];
const CAT_ICONS = { allItems: "☰", produce: "🍎", pantry: "📦", dairy: "🥛", household: "🧹" };

export default function Inventory() {
  const { shoppingList, toggleShoppingItem, addShoppingItem, removeShoppingItem } = useData();
  const { t } = useLang();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [activeTab, setActiveTab] = useState("allItems");
  const [newItem, setNewItem] = useState("");

  const avatarColors = { S: "#e8b4b8", J: "#b4c8e8", ME: "#22c55e" };

  const handleAdd = () => {
    if (newItem.trim()) {
      addShoppingItem(newItem.trim());
      setNewItem("");
    }
  };

  return (
    <div className="screen">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <button className="icon-btn" onClick={() => navigate("/")}>
            <ArrowLeft size={20} />
          </button>
          <div className="logo-box logo-box-sm">
            🛒
          </div>
          <div>
            <div className="app-name">{t("appName")}</div>
            <div className="app-sub">{t("householdSharedList")}</div>
          </div>
        </div>
        <div className="header-right">
          <button className="icon-btn">
            <UserPlus size={18} color="#22c55e" />
          </button>
          <div className="avatars-stack">
            <div className="avatar-sm" style={{ background: "#e8b4b8" }}>S</div>
            <div className="avatar-sm" style={{ background: "#b4c8e8", marginLeft: -8 }}>J</div>
            <div className="avatar-sm green-badge" style={{ marginLeft: -8 }}>+2</div>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="tabs-scroll">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`tab-btn ${activeTab === cat ? "tab-active" : ""}`}
            onClick={() => setActiveTab(cat)}
          >
            <span className="tab-icon">{CAT_ICONS[cat]}</span>
            <span>{t(cat)}</span>
          </button>
        ))}
      </div>

      {/* Add item */}
      <div className="add-item-row">
        <button className="add-circle-btn" onClick={handleAdd}>+</button>
        <input
          className="add-item-input"
          placeholder={t("addSomething")}
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
        />
        <button className="add-btn-green" onClick={handleAdd}>{t("add")}</button>
      </div>

      {/* Pantry Inventory List */}
      <div className="section-header" style={{ marginTop: 12 }}>
        <div className="section-title-row">
          <span>📋</span>
          <span className="section-title">{t("pantryInventory")}</span>
          <span className="badge-count">{shoppingList.length}</span>
        </div>
      </div>

      <div className="shopping-list">
        {shoppingList.map(item => (
          <div key={item.id} className={`shopping-item ${item.checked ? "checked" : ""}`}>
            <button
              className={`checkbox ${item.checked ? "checkbox-checked" : ""}`}
              onClick={() => toggleShoppingItem(item.id)}
            >
              {item.checked && <span>✓</span>}
            </button>
            <div className="shopping-info">
              <div className={`item-name ${item.checked ? "strikethrough" : ""}`}>{item.name}</div>
              <div className="item-detail">{t("addedBy")} {item.addedBy}{item.detail ? ` · ${item.detail}` : ""}</div>
            </div>
            <div className="shopping-right">
              <div
                className="avatar-sm"
                style={{ background: avatarColors[item.avatar] || "#ddd", color: item.avatar === "ME" ? "white" : "#333", fontSize: 11 }}
              >
                {item.avatar}
              </div>
              <button className="icon-btn" onClick={() => removeShoppingItem(item.id)}>
                <Trash2 size={16} color="#ccc" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
