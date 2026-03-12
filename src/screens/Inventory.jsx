import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { useData } from "../data";
import { useLang } from "../i18n";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Inventory() {
  const { shoppingList, toggleShoppingItem, addShoppingItem, removeShoppingItem, pantryItems, categories } = useData();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const zoneParam = params.get("zone"); // "fridge" | "pantry" | null

  const [activeTab, setActiveTab] = useState(zoneParam || "all");
  const [newItem, setNewItem] = useState("");
  const [showCatPicker, setShowCatPicker] = useState(false);
  const [selectedCats, setSelectedCats] = useState([]);

  const avatarColors = { S: "#e8b4b8", J: "#b4c8e8", ME: "#22c55e" };

  const getCatLabel = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? (cat.label[lang] || cat.label.en) : catId;
  };
  const getCatIcon = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.icon : "🏷️";
  };

  // Tabs: "all" + each category that has pantry items
  const usedCatIds = ["all", ...new Set(pantryItems.flatMap(i => i.categories || []))];
  const tabs = usedCatIds.map(id => ({
    id,
    label: id === "all" ? (lang === "es" ? "Todos" : "All") : getCatLabel(id),
    icon: id === "all" ? "☰" : getCatIcon(id),
  }));

  const filteredItems = activeTab === "all"
    ? pantryItems
    : pantryItems.filter(i => i.categories?.includes(activeTab));

  const toggleCat = (id) => {
    setSelectedCats(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleAdd = () => {
    if (newItem.trim()) {
      addShoppingItem(newItem.trim(), selectedCats);
      setNewItem("");
      setSelectedCats([]);
      setShowCatPicker(false);
    }
  };

  return (
    <div className="screen">
      <div className="header header-simple">
        <div style={{ width: 32 }} />
        <span className="page-title">{lang === "es" ? "Inventario" : "Inventory"}</span>
        <div className="avatars-stack">
          <div className="avatar-sm" style={{ background: "#e8b4b8" }}>S</div>
          <div className="avatar-sm" style={{ background: "#b4c8e8", marginLeft: -8 }}>J</div>
          <div className="avatar-sm green-badge" style={{ marginLeft: -8 }}>+2</div>
        </div>
      </div>

      {/* Category tabs — dynamic */}
      <div className="tabs-scroll">
        {tabs.map(tab => (
          <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "tab-active" : ""}`} onClick={() => setActiveTab(tab.id)}>
            <span className="tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Pantry items for selected category */}
      {filteredItems.length > 0 && (
        <>
          <div className="section-header" style={{ marginBottom: 8 }}>
            <div className="section-title-row">
              <span className="section-title">{lang === "es" ? "En tu despensa" : "In your pantry"}</span>
              <span className="badge-count">{filteredItems.length}</span>
            </div>
          </div>
          <div className="pantry-items-list">
            {filteredItems.map(item => (
              <div key={item.id} className={`pantry-item-row status-${item.status}`}>
                <span className="pantry-item-emoji">{item.img}</span>
                <div className="pantry-item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-detail">{item.categories?.map(getCatLabel).join(", ")} · {item.detail}</div>
                </div>
                <div className="pantry-item-expires">
                  <span className={`expires-chip expires-${item.status}`}>{item.expiresLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Shopping list */}
      <div className="section-header" style={{ marginTop: 16 }}>
        <div className="section-title-row">
          <span>📋</span>
          <span className="section-title">{t("pantryInventory")}</span>
          <span className="badge-count">{shoppingList.length}</span>
        </div>
      </div>

      {/* Add item */}
      <div className="add-item-row" style={{ marginBottom: 8 }}>
        <button className="add-circle-btn" onClick={handleAdd}>+</button>
        <input
          className="add-item-input"
          placeholder={t("addSomething")}
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
          onFocus={() => setShowCatPicker(true)}
        />
        <button className="add-btn-green" onClick={handleAdd}>{t("add")}</button>
      </div>

      {/* Category picker for new item */}
      {showCatPicker && (
        <div className="cat-picker">
          <div className="cat-picker-label">{lang === "es" ? "Categorías:" : "Categories:"}</div>
          <div className="cat-chips">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`cat-chip ${selectedCats.includes(cat.id) ? "cat-chip-active" : ""}`}
                onClick={() => toggleCat(cat.id)}
              >
                {cat.icon} {cat.label[lang] || cat.label.en}
              </button>
            ))}
          </div>
          {selectedCats.length > 0 && (
            <div className="selected-cats-preview">
              {selectedCats.map(id => <span key={id} className="selected-cat-tag">{getCatIcon(id)} {getCatLabel(id)}</span>)}
            </div>
          )}
        </div>
      )}

      <div className="shopping-list">
        {shoppingList.map(item => (
          <div key={item.id} className={`shopping-item ${item.checked ? "checked" : ""}`}>
            <button className={`checkbox ${item.checked ? "checkbox-checked" : ""}`} onClick={() => toggleShoppingItem(item.id)}>
              {item.checked && <span>✓</span>}
            </button>
            <div className="shopping-info">
              <div className={`item-name ${item.checked ? "strikethrough" : ""}`}>{item.name}</div>
              <div className="item-detail">
                {t("addedBy")} {item.addedBy}
                {item.categories?.length > 0 && ` · ${item.categories.map(getCatLabel).join(", ")}`}
              </div>
            </div>
            <div className="shopping-right">
              <div className="avatar-sm" style={{ background: avatarColors[item.avatar] || "#ddd", color: item.avatar === "ME" ? "white" : "#333", fontSize: 11 }}>
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