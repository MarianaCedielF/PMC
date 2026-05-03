import { useState } from "react";
import { Trash2, X, Plus, Minus, ShoppingCart } from "lucide-react";
import { useData } from "../data";
import { friendlyExpiry } from "../data";
import { useLang } from "../i18n";
import { usePermissions } from "../auth";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Inventory() {
  const { shoppingList, toggleShoppingItem, addShoppingItem, removeShoppingItem, pantryItems, categories, consumeItem, removeItem } = useData();
  const { t, lang } = useLang();
  const perms = usePermissions();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const zoneParam = params.get("zone");

  const [activeTab,      setActiveTab]      = useState(zoneParam || "all");
  const [newItem,        setNewItem]        = useState("");
  const [showCatPicker,  setShowCatPicker]  = useState(false);
  const [selectedCats,   setSelectedCats]   = useState([]);
  const [consumeModal,   setConsumeModal]   = useState(null);
  const [consumeAmount,  setConsumeAmount]  = useState(1);

  const avatarColors = { S: "#e8b4b8", J: "#b4c8e8", ME: "#22c55e" };

  const getCatLabel = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? (cat.label.es || cat.label.en) : catId;
  };
  const getCatIcon = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.icon : "🏷️";
  };

  const usedCatIds = ["all", ...new Set(pantryItems.flatMap(i => i.categories || []))];
  const tabs = usedCatIds.map(id => ({
    id,
    label: id === "all" ? "Todos" : getCatLabel(id),
    icon: id === "all" ? "☰" : getCatIcon(id),
  }));

  const activeItems = pantryItems.filter(i => i.status !== "consumed");
  const filteredItems = activeTab === "all"
    ? activeItems
    : activeItems.filter(i => i.categories?.includes(activeTab));

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

  const openConsume = (item) => { setConsumeModal(item); setConsumeAmount(1); };
  const handleConsume = () => { if (!consumeModal) return; consumeItem(consumeModal.id, consumeAmount); setConsumeModal(null); };
  const maxAmount = consumeModal ? (parseInt(consumeModal.quantity) || 1) : 1;

  return (
    <div className="screen">
      <div className="header header-simple">
        <div style={{ width: 32 }} />
        <span className="page-title">Inventario</span>
        <div style={{ width: 32 }} />
      </div>

      {/* Category tabs */}
      <div className="tabs-scroll">
        {tabs.map(tab => (
          <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "tab-active" : ""}`} onClick={() => setActiveTab(tab.id)}>
            <span className="tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Pantry items */}
      <div className="section-label" style={{ marginBottom: 8 }}>
        Artículos en despensa
        <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 500, color: "var(--text-sub)" }}>
          ({filteredItems.length})
        </span>
      </div>

      <div className="pantry-items-list">
        {filteredItems.length === 0 && (
          <div style={{ background: "white", borderRadius: 14, padding: "20px", textAlign: "center", color: "var(--text-sub)", fontSize: 13, boxShadow: "var(--shadow)" }}>
            Sin artículos en esta categoría.
          </div>
        )}
        {filteredItems.map(item => (
          <div key={item.id} className={`pantry-item-row status-${item.status}`}>
            <span className="pantry-item-emoji">{item.img}</span>
            <div className="pantry-item-info">
              <div className="item-name">{item.name}</div>
              <div className="item-detail">{item.categories?.map(getCatLabel).join(" · ")}</div>
              <div className="item-detail" style={{ marginTop: 2 }}>
                Añadido por {item.addedBy}
              </div>
            </div>
            <div className="pantry-item-expires">
              <span className={`expires-chip expires-${item.status}`}>
                {friendlyExpiry(item.expiresLabel, lang)}
              </span>
              <div style={{ fontSize: 11, color: "var(--text-sub)", marginTop: 3, textAlign: "right" }}>
                ×{parseInt(item.quantity) ?? 1}
              </div>
            </div>
            <div className="pantry-item-actions">
              <div className="item-action-btns">
                <button
                  className="consume-btn-general"
                  onClick={() => openConsume(item)}
                  disabled={(parseInt(item.quantity) ?? 1) <= 0}
                  style={{ opacity: (parseInt(item.quantity) ?? 1) <= 0 ? 0.4 : 1 }}
                >
                  {t("consume")}
                </button>
                {perms.removeProducts && (
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 6px", color: "var(--red)", display: "flex", alignItems: "center" }}
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shopping list section */}
      <div className="section-header" style={{ marginTop: 24 }}>
        <div className="section-title-row">
          <span>🛒</span>
          <span className="section-title">{t("shoppingListTitle")}</span>
        </div>
      </div>

      <div className="add-item-row">
        <button className="add-circle-btn" onClick={() => setShowCatPicker(!showCatPicker)}>+</button>
        <input
          className="add-item-input"
          placeholder={t("addSomething")}
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
        />
        {newItem.trim() && (
          <button className="add-btn-green" onClick={handleAdd}>Añadir</button>
        )}
      </div>

      {showCatPicker && (
        <div className="cat-picker">
          <div className="cat-picker-label">Categorías</div>
          <div className="cat-chips">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`cat-chip ${selectedCats.includes(cat.id) ? "cat-chip-active" : ""}`}
                onClick={() => toggleCat(cat.id)}
              >
                {cat.icon} {cat.label.es || cat.label.en}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="shopping-list" style={{ marginBottom: 16 }}>
        {shoppingList.length === 0 && (
          <div style={{ textAlign: "center", color: "var(--text-sub)", fontSize: 13, padding: "20px 0" }}>
            La lista de compras está vacía.
          </div>
        )}
        {shoppingList.map(item => (
          <div key={item.id} className={`shopping-item ${item.checked ? "checked" : ""}`}>
            <button
              className={`checkbox ${item.checked ? "checkbox-checked" : ""}`}
              onClick={() => toggleShoppingItem(item.id)}
            >
              {item.checked ? "✓" : ""}
            </button>
            <div className="shopping-info">
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className={`item-name ${item.checked ? "strikethrough" : ""}`}>{item.name}</span>
                {item.aiSuggested && (
                  <span className="ai-badge">✨ IA</span>
                )}
              </div>
              <div className="item-detail">{t("addedBy")} {item.addedBy}</div>
            </div>
            <div className="shopping-right">
              <div
                className="avatar-sm"
                style={{ background: item.aiSuggested ? "linear-gradient(135deg, #8b5cf6, #2563eb)" : (avatarColors[item.avatar] || "#ccc") }}
              >
                {item.aiSuggested ? "✨" : item.avatar}
              </div>
              <button onClick={() => removeShoppingItem(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", padding: 4 }}>
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order button */}
      <button
        className="order-supermarket-btn"
        onClick={() => navigate("/supermarket")}
      >
        <ShoppingCart size={20} />
        <span>Realizar Compra</span>
        <span className="order-btn-badge">{shoppingList.filter(i => !i.checked).length}</span>
      </button>

      {/* Consume modal */}
      {consumeModal && (
        <div className="modal-overlay" onClick={() => setConsumeModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{t("consumeProduct")}</div>
            <div className="modal-item-name">{consumeModal.name}</div>
            <div className="modal-subtitle">{t("howMany")}</div>
            <div className="modal-counter">
              <button className="counter-btn" onClick={() => setConsumeAmount(a => Math.max(1, a - 1))}>
                <Minus size={18} />
              </button>
              <span className="counter-value">{consumeAmount}</span>
              <button className="counter-btn" onClick={() => setConsumeAmount(a => Math.min(maxAmount, a + 1))}>
                <Plus size={18} />
              </button>
            </div>
            <div className="modal-remaining">
              {maxAmount - consumeAmount} {t("remaining")}
            </div>
            <div className="modal-actions">
              <button className="notif-btn-outline" style={{ flex: 1 }} onClick={() => setConsumeModal(null)}>
                {t("cancel")}
              </button>
              <button className="save-btn" style={{ flex: 2, margin: 0 }} onClick={handleConsume}>
                {t("consume")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
