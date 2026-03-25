import { useState } from "react";
import { CheckCircle, Plus, X, Lock } from "lucide-react";
import { useData, computeStatus, friendlyExpiry } from "../data";
import { useLang } from "../i18n";
import { usePermissions } from "../auth";
import { useNavigate } from "react-router-dom";

const EMOJI_OPTIONS = ["🥛","🍎","🥩","🍞","☕","🧊","❄️","📦","🏷️","🥚","🧀","🥑","🥬","🍓","🫙","🍷","🥫","🌿","🧁","🍰","🥐","🍋","🍇","🫐","🥦","🥕","🧅","🧄","🍅","🥜","🌽","🍄","🫒","🥝","🍑","🍌","🍊","🫚","🧈","🥗","🍯","🧃","🥤","🫖","🍵","🌶️","🫑","🥒","🍆","🥞","🧇","🍖","🥓","🌮","🥙"];

export default function AddProduct() {
  const { addItem, categories, addCategory } = useData();
  const { t, lang } = useLang();
  const perms = usePermissions();
  const navigate = useNavigate();

  if (!perms.addProducts) {
    return (
      <div className="screen" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100%", textAlign: "center", padding: "0 24px" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}><Lock size={52} color="#d1d5db" /></div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>Sin permiso</div>
        <div style={{ fontSize: 14, color: "var(--text-sub)", lineHeight: 1.6, marginBottom: 24 }}>
          Tu rol de <strong>Miembro</strong> no permite agregar productos directamente a la despensa.
          Puedes añadir artículos a la lista de compras desde la sección de Inventario.
        </div>
        <button className="save-btn" style={{ width: "100%", maxWidth: 280 }} onClick={() => navigate("/inventory")}>
          Ir a Lista de Compras
        </button>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({ name: "", selectedCats: [], expiryDate: "", quantity: 1, notes: "", img: "" });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [saved, setSaved] = useState(false);
  const [scanActive, setScanActive] = useState(false);
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("🏷️");

  const getCatLabel = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? (cat.label[lang] || cat.label.en) : catId;
  };

  const toggleCat = (id) => {
    setForm(prev => ({
      ...prev,
      selectedCats: prev.selectedCats.includes(id)
        ? prev.selectedCats.filter(c => c !== id)
        : [...prev.selectedCats, id]
    }));
  };

  const handleCreateCategory = () => {
    if (!newCatName.trim()) return;
    const id = newCatName.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now();
    addCategory({ id, label: { en: newCatName, es: newCatName }, icon: newCatIcon });
    setForm(prev => ({ ...prev, selectedCats: [...prev.selectedCats, id] }));
    setNewCatName(""); setNewCatIcon("🏷️"); setShowNewCat(false);
  };

  const handleSave = () => {
    if (!form.name.trim() || form.selectedCats.length === 0) return;
    addItem({
      name: form.name,
      categories: form.selectedCats,
      quantity: parseInt(form.quantity) || 1,
      expiresLabel: form.expiryDate || "Unknown",
      img: form.img || categories.find(c => c.id === form.selectedCats[0])?.icon || "🛒",
      addedBy: "Me",
      hoursAgo: 0,
    });
    setSaved(true);
    setTimeout(() => { setSaved(false); navigate("/"); }, 1200);
  };

  // Preview status based on chosen date
  const previewStatus = form.expiryDate ? computeStatus(form.expiryDate) : null;
  const previewLabel   = form.expiryDate ? friendlyExpiry(form.expiryDate, lang) : null;

  return (
    <div className="screen">
      <div className="header header-simple">
        <div style={{ width: 32 }} />
        <span className="page-title">{t("addProduct")}</span>
        <div style={{ width: 32 }} />
      </div>

      <div className="form-content">
        {/* Quick Scan */}
        <div className="section-label">{t("quickScan")}</div>
        <div className="scan-row">
          <button
            className={`scan-card ${scanActive === "barcode" ? "scan-active" : ""}`}
            onClick={() => setScanActive(scanActive === "barcode" ? false : "barcode")}
          >
            <div className="scan-icon">⬛</div>
            <div className="scan-label">{t("scanBarcode")}</div>
          </button>
          <button
            className={`scan-card ${scanActive === "photo" ? "scan-active" : ""}`}
            onClick={() => setScanActive(scanActive === "photo" ? false : "photo")}
          >
            <div className="scan-icon">📷</div>
            <div className="scan-label">{t("uploadPhoto")}</div>
          </button>
        </div>

        {/* Scan hint */}
        {scanActive && (
          <div style={{ background: "#f0fdf4", border: "1.5px solid var(--green)", borderRadius: 12, padding: "12px 14px", marginBottom: 16, fontSize: 13, color: "var(--green-dark)", fontWeight: 600 }}>
            {lang === "es"
              ? "📱 Integración con cámara disponible en la versión React Native. Por ahora, ingresa los datos manualmente."
              : "📱 Camera integration available in the React Native version. For now, enter details manually below."}
          </div>
        )}

        {/* Manual Entry */}
        <div className="section-label">{t("manualEntry")}</div>

        <div className="form-field">
          <label className="field-label">🛒 {t("productName")}</label>
          <div className="name-with-icon">
            <button className="emoji-square-btn" type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              {form.img || "🛒"}
            </button>
            <input
              className="field-input"
              placeholder={t("productNamePlaceholder")}
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          {showEmojiPicker && (
            <div className="emoji-grid" style={{ marginTop: 8 }}>
              {EMOJI_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  className={`emoji-btn ${form.img === emoji ? "emoji-btn-active" : ""}`}
                  onClick={() => { setForm({ ...form, img: emoji }); setShowEmojiPicker(false); }}
                  type="button"
                >{emoji}</button>
              ))}
            </div>
          )}
        </div>

        <div className="form-field">
          <label className="field-label">
            🏷️ {t("category")}{" "}
            <span style={{ color: "#aaa", fontWeight: 400 }}>
              ({lang === "es" ? "selecciona una o más" : "select one or more"})
            </span>
          </label>
          <div className="cat-chips" style={{ marginTop: 6 }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`cat-chip ${form.selectedCats.includes(cat.id) ? "cat-chip-active" : ""}`}
                onClick={() => toggleCat(cat.id)}
                type="button"
              >
                {cat.icon} {cat.label[lang] || cat.label.en}
              </button>
            ))}
            <button className="cat-chip cat-chip-new" onClick={() => setShowNewCat(true)} type="button">
              <Plus size={12} /> {lang === "es" ? "Nueva" : "New"}
            </button>
          </div>
          {form.selectedCats.length > 0 && (
            <div className="selected-cats-preview" style={{ marginTop: 8 }}>
              {form.selectedCats.map(id => (
                <span key={id} className="selected-cat-tag">
                  {categories.find(c => c.id === id)?.icon} {getCatLabel(id)}
                  <button className="remove-cat-btn" onClick={() => toggleCat(id)}><X size={10} /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        {showNewCat && (
          <div className="new-cat-form">
            <div className="new-cat-title">{lang === "es" ? "Crear categoría" : "Create category"}</div>
            <input
              className="field-input"
              placeholder={lang === "es" ? "Nombre de categoría" : "Category name"}
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <div className="new-cat-label">{lang === "es" ? "Elige un ícono:" : "Choose an icon:"}</div>
            <div className="emoji-grid">
              {EMOJI_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  className={`emoji-btn ${newCatIcon === emoji ? "emoji-btn-active" : ""}`}
                  onClick={() => setNewCatIcon(emoji)}
                  type="button"
                >{emoji}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button className="add-btn-green" style={{ flex: 1 }} onClick={handleCreateCategory}>
                {lang === "es" ? "Crear" : "Create"}
              </button>
              <button className="notif-btn-outline" onClick={() => setShowNewCat(false)}>
                {lang === "es" ? "Cancelar" : "Cancel"}
              </button>
            </div>
          </div>
        )}

        {/* Date + Quantity row */}
        <div style={{ display: "flex", gap: 12 }}>
          <div className="form-field" style={{ flex: 1 }}>
            <label className="field-label">📅 {t("expiryDate")}</label>
            <input
              className="field-input"
              type="date"
              value={form.expiryDate}
              min={todayStr}
              onChange={e => setForm({ ...form, expiryDate: e.target.value })}
            />
            {/* Real-time status preview */}
            {previewStatus && (
              <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <span className={`expires-chip expires-${previewStatus}`}>{previewLabel}</span>
                <span style={{ fontSize: 11, color: "var(--text-sub)" }}>
                  {previewStatus === "fresh" ? "✅" : previewStatus === "warning" ? "⚠️" : previewStatus === "expiring" ? "🔶" : "🔴"}
                </span>
              </div>
            )}
          </div>
          <div className="form-field" style={{ flex: 1 }}>
            <label className="field-label">🔢 {t("quantity")}</label>
            <input
              className="field-input"
              type="text"
              inputMode="numeric"
              value={form.quantity}
              onChange={e => setForm({ ...form, quantity: e.target.value })}
            />
          </div>
        </div>

        <div className="form-field">
          <label className="field-label">📝 {t("notes")}</label>
          <textarea
            className="field-input field-textarea"
            placeholder={t("notesPlaceholder")}
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <button
          className={`save-btn ${saved ? "save-btn-success" : ""} ${!form.name || form.selectedCats.length === 0 ? "save-btn-disabled" : ""}`}
          onClick={handleSave}
          disabled={!form.name || form.selectedCats.length === 0}
        >
          <CheckCircle size={18} />
          {saved ? (lang === "es" ? "¡Guardado!" : "Saved!") : t("saveProduct")}
        </button>

        {(!form.name || form.selectedCats.length === 0) && (
          <div style={{ textAlign: "center", fontSize: 12, color: "var(--text-sub)", marginTop: 8 }}>
            {lang === "es"
              ? "Nombre y al menos una categoría son obligatorios"
              : "Name and at least one category are required"}
          </div>
        )}
      </div>
    </div>
  );
}
