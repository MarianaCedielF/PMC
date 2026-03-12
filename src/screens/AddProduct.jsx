import { useState } from "react";
import { ArrowLeft, Info, CheckCircle } from "lucide-react";
import { useData } from "../data";
import { useLang } from "../i18n";
import { useNavigate } from "react-router-dom";

const CATEGORIES_LIST = ["dairyEggs", "produceCat", "meat", "bakery", "beverages", "frozen", "other"];

export default function AddProduct() {
  const { addItem } = useData();
  const { t } = useLang();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", category: "dairyEggs", expiryDate: "", quantity: 1, notes: ""
  });
  const [saved, setSaved] = useState(false);
  const [scanActive, setScanActive] = useState(false);

  const handleSave = () => {
    if (!form.name.trim()) return;
    addItem({
      name: form.name,
      zone: "Fridge",
      detail: `${form.quantity} unit${form.quantity > 1 ? "s" : ""}`,
      expiresLabel: form.expiryDate || "Unknown",
      expiresTime: "",
      status: "fresh",
      category: t(form.category),
      img: "🛒",
      addedBy: "Me",
      hoursAgo: 0,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate("/");
    }, 1200);
  };

  return (
    <div className="screen">
      {/* Header */}
      <div className="header header-simple">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="page-title">{t("addProduct")}</span>
        <button className="icon-btn">
          <div className="info-circle">i</div>
        </button>
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

        {/* Manual Entry */}
        <div className="section-label">{t("manualEntry")}</div>

        <div className="form-field">
          <label className="field-label">🛒 {t("productName")}</label>
          <input
            className="field-input"
            placeholder={t("productNamePlaceholder")}
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="form-field">
          <label className="field-label">🏷️ {t("category")}</label>
          <select
            className="field-input field-select"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES_LIST.map(cat => (
              <option key={cat} value={cat}>{t(cat)}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-field form-field-half">
            <label className="field-label">📅 {t("expiryDate")}</label>
            <input
              className="field-input"
              type="date"
              value={form.expiryDate}
              onChange={e => setForm({ ...form, expiryDate: e.target.value })}
            />
          </div>
          <div className="form-field form-field-half">
            <label className="field-label">⏳ {t("quantity")}</label>
            <input
              className="field-input"
              type="number"
              min="1"
              value={form.quantity}
              onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
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

        <button className={`save-btn ${saved ? "save-btn-success" : ""}`} onClick={handleSave}>
          {saved ? <><CheckCircle size={18} /> Saved!</> : <><CheckCircle size={18} /> {t("saveProduct")}</>}
        </button>
      </div>
    </div>
  );
}
