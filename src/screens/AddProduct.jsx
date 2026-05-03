import { useState, useRef, useEffect } from "react";
import { CheckCircle, Plus, X, Lock } from "lucide-react";
import { useData, computeStatus, friendlyExpiry } from "../data";
import { useLang } from "../i18n";
import { usePermissions } from "../auth";
import { useNavigate } from "react-router-dom";

const EMOJI_OPTIONS = ["🥛","🍎","🥩","🍞","☕","🧊","❄️","📦","🏷️","🥚","🧀","🥑","🥬","🍓","🫙","🍷","🥫","🌿","🧁","🍰","🥐","🍋","🍇","🫐","🥦","🥕","🧅","🧄","🍅","🥜","🌽","🍄","🫒","🥝","🍑","🍌","🍊","🫚","🧈","🥗","🍯","🧃","🥤","🫖","🍵","🌶️","🫑","🥒","🍆","🥞","🧇","🍖","🥓","🌮","🥙"];

const MOCK_PRODUCTS = [
  { name: "Leche Entera Alpina 1L",    categories: ["dairy", "fridge"],      img: "🥛" },
  { name: "Pan Tajado Bimbo",           categories: ["bakery", "pantry"],     img: "🍞" },
  { name: "Yogur Griego Natural",       categories: ["dairy", "fridge"],      img: "🫙" },
  { name: "Café Juan Valdez 250g",      categories: ["beverages", "pantry"],  img: "☕" },
  { name: "Avena Quaker 500g",          categories: ["other", "pantry"],      img: "🌾" },
];

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
          Puedes añadir artículos a la lista de compras desde Inventario.
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
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("🏷️");

  // Camera state
  const [cameraModal, setCameraModal] = useState(false);
  const [scanStatus, setScanStatus] = useState("scanning");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const getCatLabel = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? (cat.label.es || cat.label.en) : catId;
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

  const openCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Tu navegador no soporta acceso a cámara. Ingresa el producto manualmente.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      setScanStatus("scanning");
      setCameraModal(true);
    } catch {
      alert("No se pudo acceder a la cámara. Verifica los permisos del navegador.");
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    setCameraModal(false);
    setScanStatus("scanning");
  };

  const useMockProduct = () => {
    const mock = MOCK_PRODUCTS[Math.floor(Date.now() / 1000) % MOCK_PRODUCTS.length];
    setForm(prev => ({ ...prev, name: mock.name, selectedCats: mock.categories, img: mock.img }));
  };

  const fillFromBarcode = (barcode) => {
    setScanStatus("found");
    fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
      .then(r => r.json())
      .then(data => {
        if (data.status === 1 && data.product?.product_name) {
          const p = data.product;
          const name = p.product_name_es || p.product_name || "";
          setForm(prev => ({ ...prev, name: name.trim() || prev.name, img: "🛒" }));
        } else {
          useMockProduct();
        }
      })
      .catch(useMockProduct)
      .finally(() => {
        setTimeout(() => closeCamera(), 800);
      });
  };

  useEffect(() => {
    if (!cameraModal) return;

    const attachStream = () => {
      const video = videoRef.current;
      if (!video || !streamRef.current) return;
      video.srcObject = streamRef.current;
      video.play().catch(() => {});

      if ("BarcodeDetector" in window) {
        const detector = new window.BarcodeDetector({
          formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39", "qr_code"],
        });
        let active = true;
        const scan = async () => {
          if (!active || !videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes.length > 0) {
              active = false;
              fillFromBarcode(codes[0].rawValue);
              return;
            }
          } catch {}
          if (active) requestAnimationFrame(scan);
        };
        video.addEventListener("playing", () => requestAnimationFrame(scan), { once: true });
        timerRef.current = setTimeout(() => {
          if (active) { active = false; fillFromBarcode("3017620422003"); }
        }, 6000);
      } else {
        timerRef.current = setTimeout(() => fillFromBarcode("3017620422003"), 3500);
      }
    };

    const raf = requestAnimationFrame(attachStream);
    return () => {
      cancelAnimationFrame(raf);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraModal]);

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

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
        {/* Escaneo rápido */}
        <div className="section-label">{t("quickScan")}</div>
        <div className="scan-row">
          <button className="scan-card" onClick={openCamera}>
            <div className="scan-icon">⬛</div>
            <div className="scan-label">{t("scanBarcode")}</div>
          </button>
          <label className="scan-card" style={{ cursor: "pointer" }}>
            <div className="scan-icon">📷</div>
            <div className="scan-label">{t("uploadPhoto")}</div>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: "none" }}
              onChange={(e) => { if (e.target.files?.[0]) useMockProduct(); }}
            />
          </label>
        </div>

        {/* Entrada manual */}
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
            <span style={{ color: "#aaa", fontWeight: 400 }}>(selecciona una o más)</span>
          </label>
          <div className="cat-chips" style={{ marginTop: 6 }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`cat-chip ${form.selectedCats.includes(cat.id) ? "cat-chip-active" : ""}`}
                onClick={() => toggleCat(cat.id)}
                type="button"
              >
                {cat.icon} {cat.label.es || cat.label.en}
              </button>
            ))}
            <button className="cat-chip cat-chip-new" onClick={() => setShowNewCat(true)} type="button">
              <Plus size={12} /> Nueva
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
            <div className="new-cat-title">Crear categoría</div>
            <input
              className="field-input"
              placeholder="Nombre de categoría"
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <div className="new-cat-label">Elige un ícono:</div>
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
                Crear
              </button>
              <button className="notif-btn-outline" onClick={() => setShowNewCat(false)}>
                Cancelar
              </button>
            </div>
          </div>
        )}

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
          {saved ? "¡Guardado!" : t("saveProduct")}
        </button>

        {(!form.name || form.selectedCats.length === 0) && (
          <div style={{ textAlign: "center", fontSize: 12, color: "var(--text-sub)", marginTop: 8 }}>
            Nombre y al menos una categoría son obligatorios
          </div>
        )}
      </div>

      {/* Modal de cámara */}
      {cameraModal && (
        <div className="camera-modal-overlay">
          <div className="camera-modal">
            <div className="camera-header">
              <button className="camera-close-btn" onClick={closeCamera}>✕</button>
              <span className="camera-title">
                {scanStatus === "found"
                  ? "✅ ¡Producto encontrado!"
                  : "Escanear código de barras"}
              </span>
              <div style={{ width: 32 }} />
            </div>
            <div className="camera-viewfinder">
              <video ref={videoRef} autoPlay playsInline muted className="camera-video" />
              {scanStatus === "scanning" && (
                <div className="scan-frame">
                  <div className="scan-line" />
                </div>
              )}
              {scanStatus === "found" && (
                <div className="scan-success-overlay">
                  <div className="scan-success-icon">✅</div>
                </div>
              )}
            </div>
            <div className="camera-hint">
              {scanStatus === "found"
                ? "Rellenando datos del producto..."
                : "Apunta la cámara al código de barras del producto"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
