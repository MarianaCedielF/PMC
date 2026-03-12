import { useState } from "react";
import { Trash2, X, Plus, Minus } from "lucide-react";
import { useData } from "../data";
import { useLang } from "../i18n";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Inventory() {
  const { shoppingList, toggleShoppingItem, addShoppingItem, removeShoppingItem, pantryItems, categories, consumeItem, removeItem } = useData();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const zoneParam = params.get("zone");

  const [activeTab, setActiveTab] = useState(zoneParam || "all");
  const [newItem, setNewItem] = useState("");
  const [showCatPicker, setShowCatPicker] = useState(false);
  const [selectedCats, setSelectedCats] = useState([]);
  const [consumeModal, setConsumeModal] = useState(null); // item being consumed
  const [consumeAmount, setConsumeAmount] = useState(1);

  const avatarColors = { S: "#e8b4b8", J: "#b4c8e8", ME: "#22c55e" };

  const getCatLabel = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? (cat.label[lang] || cat.label.en) : catId;
  };
  const getCatIcon = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.icon : "🏷️";
  };

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

  const openConsume = (item) => {
    setConsumeModal(item);
    setConsumeAmount(1);
  };

  const handleConsume = () => {
    if (!consumeModal) return;
    consumeItem(consumeModal.id, consumeAmount);
    setConsumeModal(null);
  };

  const maxAmount = consumeModal ? (parseInt(consumeModal.quantity) || 1) : 1;

  return (
    <div className="screen">
      <div className="header header-simple">
        <div style={{ width: 32 }} />
        <span className="page-title">{lang === "es" ? "Inventario" : "Inventory"}</span>
        <div style={{ width: 32 }} />
      </div>

      <div className="tabs-scroll">
        {tabs.map(tab => (
          <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? "tab-active" : ""}`} onClick={() => setActiveTab(tab.id)}>
            <span className="tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {filteredItems.length > 0 && (
        <>
          <div className="section-header" style={{ marginBottom: 8 }}>
            <div className="section-title-row">
              <span className="section-title">{lang === "es" ? "En tu despensa" : "In your pantry"}</span>
              <span className="badge-count">{filteredItems.length}</span>
            </div>
            <button className="consume-btn-general" onClick={() => setConsumeModal({})}>
              {t("consume")}
            </button>
          </div>
          <div className="pantry-items-list">
            {filteredItems.map(item => (
              <div key={item.id} className={`pantry-item-row status-${item.status}`}>
                <span className="pantry-item-emoji">{item.img}</span>
                <div className="pantry-item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-detail">{item.categories?.map(getCatLabel).join(", ")} · {item.addedBy}</div>
                  <div className="item-qty">
                    {(parseInt(item.quantity) ?? 1) > 0
                      ? <span className="qty-badge">{parseInt(item.quantity) ?? 1} {t("remaining")}</span>
                      : <span className="qty-badge qty-empty">{t("outOfStock")}</span>
                    }
                  </div>
                </div>
                <div className="pantry-item-actions">
                  <span className={`expires-chip expires-${item.status}`}>{item.expiresLabel}</span>
                  <div className="item-action-btns">
                    <button className="icon-btn" onClick={() => removeItem(item.id)}>
                      <Trash2 size={14} color="#ccc" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="section-header" style={{ marginTop: 16 }}>
        <div className="section-title-row">
          <span>📋</span>
          <span className="section-title">{t("pantryInventory")}</span>
          <span className="badge-count">{shoppingList.length}</span>
        </div>
      </div>

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

      {showCatPicker && (
        <div className="cat-picker">
          <div className="cat-picker-label">{lang === "es" ? "Categorías:" : "Categories:"}</div>
          <div className="cat-chips">
            {categories.map(cat => (
              <button key={cat.id} className={`cat-chip ${selectedCats.includes(cat.id) ? "cat-chip-active" : ""}`} onClick={() => toggleCat(cat.id)}>
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

      {/* Consume modal */}
      {consumeModal && (
        <div className="modal-overlay" onClick={() => setConsumeModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{t("consumeProduct")}</div>

            {/* Step 1: pick product */}
            {!consumeModal.id ? (
              <>
                <div className="modal-subtitle">{lang === "es" ? "¿Qué producto consumiste?" : "Which product did you consume?"}</div>
                <div className="consume-product-list">
                  {pantryItems.filter(i => parseInt(i.quantity) > 0).map(item => (
                    <button key={item.id} className="consume-product-option" onClick={() => { setConsumeModal(item); setConsumeAmount(1); }}>
                      <span>{item.img}</span>
                      <span className="consume-option-name">{item.name}</span>
                      <span className="consume-option-qty">{parseInt(item.quantity)} {t("remaining")}</span>
                    </button>
                  ))}
                </div>
                <button className="notif-btn-outline" style={{ width: "100%", marginTop: 10 }} onClick={() => setConsumeModal(null)}>
                  {lang === "es" ? "Cancelar" : "Cancel"}
                </button>
              </>
            ) : (
              /* Step 2: pick amount */
              <>
                <div className="modal-item-name">{consumeModal.img} {consumeModal.name}</div>
                <div className="modal-subtitle">{t("howMany")}</div>
                <div className="modal-counter">
                  <button className="counter-btn" onClick={() => setConsumeAmount(a => Math.max(1, a - 1))}>
                    <Minus size={16} />
                  </button>
                  <span className="counter-value">{consumeAmount}</span>
                  <button className="counter-btn" onClick={() => setConsumeAmount(a => Math.min(maxAmount, a + 1))}>
                    <Plus size={16} />
                  </button>
                </div>
                <div className="modal-remaining">
                  {lang === "es" ? "Quedarán" : "Will remain"}: <strong>{Math.max(0, maxAmount - consumeAmount)}</strong>
                </div>
                <div className="modal-actions">
                  <button className="add-btn-green" style={{ flex: 1 }} onClick={handleConsume}>{t("consume")}</button>
                  <button className="notif-btn-outline" onClick={() => setConsumeModal(null)}>
                    {lang === "es" ? "Cancelar" : "Cancel"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}