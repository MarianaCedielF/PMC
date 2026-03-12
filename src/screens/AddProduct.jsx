import { useState } from "react";
import { CheckCircle, Plus, X } from "lucide-react";
import { useData } from "../data";
import { useLang } from "../i18n";
import { useNavigate } from "react-router-dom";

const EMOJI_OPTIONS = ["🥛","🍎","🥩","🍞","☕","🧊","❄️","📦","🏷️","🥚","🧀","🥑","🥬","🍓","🫙","🍷","🥫","🌿","🧁","🍰","🥐","🍋","🍇","🫐","🥦","🥕","🧅","🧄","🍅","🥜","🌽","🍄","🫒","🥝","🍑","🍌","🍊","🫚","🧈","🥗","🍯","🧃","🥤","🫖","🍵","🌶️","🫑","🥒","🍆","🥞","🧇","🍖","🥓","🌮","🥙"];
export default function AddProduct() {
  const { addItem, categories, addCategory } = useData();
  const { t, lang } = useLang();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", selectedCats: [], expiryDate: "", quantity: 1, notes: "", img: "" });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [saved, setSaved] = useState(false);
  const [scanActive, setScanActive] = useState(false);

  // New category creation
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
    setNewCatName("");
    setNewCatIcon("🏷️");
    setShowNewCat(false);
  };

  const handleSave = () => {
    if (!form.name.trim() || form.selectedCats.length === 0) return;
    addItem({
      name: form.name,
      categories: form.selectedCats,
      quantity: parseInt(form.quantity) || 1,
      expiresLabel: form.expiryDate || "Unknown",
      status: "fresh",
      img: form.img || categories.find(c => c.id === form.selectedCats[0])?.icon || "🛒",
      addedBy: "Me",
      hoursAgo: 0,
    });
    setSaved(true);
    setTimeout(() => { setSaved(false); navigate("/"); }, 1200);
  };

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
          <button className={`scan-card ${scanActive === "barcode" ? "scan-active" : ""}`} onClick={() => setScanActive(scanActive === "barcode" ? false : "barcode")}>
            <div className="scan-icon">⬛</div>
            <div className="scan-label">{t("scanBarcode")}</div>
          </button>
          <button className={`scan-card ${scanActive === "photo" ? "scan-active" : ""}`} onClick={() => setScanActive(scanActive === "photo" ? false : "photo")}>
            <div className="scan-icon">📷</div>
            <div className="scan-label">{t("uploadPhoto")}</div>
          </button>
        </div>

        {/* Manual Entry */}
        <div className="section-label">{t("manualEntry")}</div>

        <div className="form-field">
          <label className="field-label">🛒 {t("productName")}</label>
          <div className="name-with-icon">
            <button className="emoji-square-btn" type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              {form.img || "🛒"}
            </button>
            <input className="field-input" placeholder={t("productNamePlaceholder")} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          {showEmojiPicker && (
            <div className="emoji-grid" style={{ marginTop: 8 }}>
              {EMOJI_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  className={`emoji-btn ${form.img === emoji ? "emoji-btn-active" : ""}`}
                  onClick={() => { setForm({ ...form, img: emoji }); setShowEmojiPicker(false); }}
                  type="button"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="form-field">
          <label className="field-label">🏷️ {t("category")} <span style={{ color: "#aaa", fontWeight: 400 }}>({lang === "es" ? "selecciona una o más" : "select one or more"})</span></label>
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

          {/* Selected preview */}
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

        {/* New category form */}
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
                >
                  {emoji}
                </button>
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

        <div className="form-row">
          <div className="form-field form-field-half">
            <label className="field-label">📅 {t("expiryDate")}</label>
            <input className="field-input" type="date" value={form.expiryDate} min={new Date().toISOString().split("T")[0]} onChange={e => setForm({ ...form, expiryDate: e.target.value })} />
          </div>
          <div className="form-field form-field-half">
            <label className="field-label">🔢 {t("quantity")}</label>
            <input className="field-input" type="text" inputMode="numeric" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} style={{ appearance: "textfield", MozAppearance: "textfield" }} />
          </div>
        </div>

        <div className="form-field">
          <label className="field-label">📝 {t("notes")}</label>
          <textarea className="field-input field-textarea" placeholder={t("notesPlaceholder")} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
        </div>

        <button
          className={`save-btn ${saved ? "save-btn-success" : ""} ${!form.name || form.selectedCats.length === 0 ? "save-btn-disabled" : ""}`}
          onClick={handleSave}
          disabled={!form.name || form.selectedCats.length === 0}
        >
          <CheckCircle size={18} />
          {saved ? (lang === "es" ? "¡Guardado!" : "Saved!") : t("saveProduct")}
        </button>
      </div>
    </div>
  );
}