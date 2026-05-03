import { useState, useMemo } from "react";
import { ArrowLeft, ShoppingBag, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData } from "../data";

const SUPERMARKETS = [
  { id: "exito",   name: "Éxito",   emoji: "🟢", color: "#22c55e", bg: "#f0fdf4", tagline: "La tienda de todos"    },
  { id: "carulla", name: "Carulla", emoji: "🔴", color: "#dc2626", bg: "#fef2f2", tagline: "Frescura garantizada"  },
  { id: "d1",      name: "D1",      emoji: "🟠", color: "#ea580c", bg: "#fff7ed", tagline: "Precios bajos siempre" },
  { id: "jumbo",   name: "Jumbo",   emoji: "🔵", color: "#2563eb", bg: "#eff6ff", tagline: "Todo en un solo lugar" },
];

const DELIVERY_OPTIONS = [
  { id: "asap",  label: "Lo antes posible", sub: "~45 minutos", icon: "⚡" },
  { id: "sched", label: "Programar entrega", sub: "Elige tu hora", icon: "📅" },
];

const ITEM_PRICES = {
  "Leche Entera Orgánica":  4500,
  "Aguacates (Maduros)":    9000,
  "Pan de Masa Madre":      8500,
  "Yogur Griego":           6500,
  "Huevos de Campo":       12000,
  "Espinaca Baby":          5500,
  "Café Molido":            9500,
};

const CAT_EMOJI = {
  dairy: "🥛", produce: "🥑", bakery: "🍞", meat: "🥩",
  beverages: "☕", frozen: "🧊", fridge: "❄️", pantry: "📦", other: "🏷️",
};

function itemEmoji(item) {
  for (const cat of (item.categories || [])) {
    if (CAT_EMOJI[cat]) return CAT_EMOJI[cat];
  }
  return "🛒";
}

function deterministicPrice(item) {
  return ITEM_PRICES[item.name] ?? (3000 + ((item.id * 7919) % 9000));
}

function formatCOP(n) {
  return "$" + Math.round(n).toLocaleString("es-CO");
}

const DELIVERY_FEE = 5000;

export default function Supermarket() {
  const navigate = useNavigate();
  const { shoppingList } = useData();

  const [selectedSM, setSelectedSM] = useState("exito");
  const [delivery, setDelivery] = useState("asap");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const items = useMemo(() => (
    shoppingList.filter(i => !i.checked).map(i => ({
      ...i,
      price: deterministicPrice(i),
      qty: parseInt(i.quantity) || 1,
    }))
  ), [shoppingList]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const total = subtotal + DELIVERY_FEE;
  const selectedSMData = SUPERMARKETS.find(s => s.id === selectedSM);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setConfirmed(true); }, 1800);
  };

  if (confirmed) {
    return (
      <div className="screen" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center", padding: "0 20px" }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>¡Pedido Enviado!</div>
        <div style={{ fontSize: 14, color: "var(--text-sub)", marginBottom: 12, lineHeight: 1.5 }}>
          Tu pedido a <strong>{selectedSMData?.name}</strong> ha sido confirmado.
        </div>
        <div style={{ background: "var(--green-light)", color: "var(--green-dark)", borderRadius: 14, padding: "12px 24px", fontSize: 14, fontWeight: 700, marginBottom: 24 }}>
          ⚡ Llega en ~45 minutos
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "var(--green-dark)", marginBottom: 4 }}>
          {formatCOP(total)}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-sub)", marginBottom: 32 }}>Total cobrado</div>
        <button className="save-btn" style={{ maxWidth: 280, width: "100%" }} onClick={() => navigate("/inventory")}>
          <CheckCircle size={18} />
          Volver al Inventario
        </button>
      </div>
    );
  }

  return (
    <div className="screen">
      {/* Encabezado */}
      <div className="header header-simple">
        <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 6, display: "flex", alignItems: "center", color: "var(--text)", borderRadius: 8 }}
          aria-label="Volver"
        >
          <ArrowLeft size={22} />
        </button>
        <span className="page-title">Pedir al Supermercado</span>
        <div style={{ width: 34 }} />
      </div>

      {/* Banner */}
      <div className="supermarket-hero">
        <div style={{ fontSize: 36 }}>🛒</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 2 }}>
            {items.length} artículos en tu lista
          </div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>
            Elige tu supermercado y confirma el pedido
          </div>
        </div>
      </div>

      {/* Selección de supermercado */}
      <div className="section-label">Supermercados aliados</div>
      <div className="supermarket-grid">
        {SUPERMARKETS.map(sm => (
          <button
            key={sm.id}
            className={`supermarket-card ${selectedSM === sm.id ? "supermarket-card-active" : ""}`}
            style={{
              borderColor: selectedSM === sm.id ? sm.color : "var(--border)",
              background: selectedSM === sm.id ? sm.bg : "white",
              boxShadow: selectedSM === sm.id ? `0 4px 20px ${sm.color}30` : "var(--shadow)",
            }}
            onClick={() => setSelectedSM(sm.id)}
          >
            <div style={{ fontSize: 26, marginBottom: 6 }}>{sm.emoji}</div>
            <div style={{ fontWeight: 800, fontSize: 15, color: selectedSM === sm.id ? sm.color : "var(--text)" }}>
              {sm.name}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-sub)", marginTop: 2, lineHeight: 1.3 }}>
              {sm.tagline}
            </div>
            {selectedSM === sm.id && (
              <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: sm.color }}>✓ Seleccionado</div>
            )}
          </button>
        ))}
      </div>

      {/* Artículos del pedido */}
      <div className="section-label">
        Tu pedido
        <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 500, color: "var(--text-sub)" }}>
          ({items.length} artículos)
        </span>
      </div>

      {items.length === 0 ? (
        <div style={{ background: "white", borderRadius: 14, padding: "20px", textAlign: "center", color: "var(--text-sub)", fontSize: 13, boxShadow: "var(--shadow)", marginBottom: 20 }}>
          No hay artículos en tu lista de compras.
        </div>
      ) : (
        <div className="order-items-list">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="order-item-row"
              style={{ borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none" }}
            >
              <div className="order-item-emoji">{itemEmoji(item)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-sub)", display: "flex", alignItems: "center", gap: 4 }}>
                  ×{item.qty} {item.qty > 1 ? "unidades" : "unidad"}
                  {item.aiSuggested && <span className="ai-badge">✨ IA</span>}
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "var(--green-dark)", flexShrink: 0 }}>
                {formatCOP(item.price * item.qty)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tiempo de entrega */}
      <div className="section-label">Tiempo de entrega</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {DELIVERY_OPTIONS.map(opt => (
          <button
            key={opt.id}
            className={`delivery-option ${delivery === opt.id ? "delivery-option-active" : ""}`}
            onClick={() => setDelivery(opt.id)}
          >
            <span style={{ fontSize: 22 }}>{opt.icon}</span>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: delivery === opt.id ? "var(--green-dark)" : "var(--text)" }}>
                {opt.label}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-sub)" }}>{opt.sub}</div>
            </div>
            <div className={`radio-circle ${delivery === opt.id ? "radio-circle-active" : ""}`}>
              {delivery === opt.id && <span className="radio-dot" />}
            </div>
          </button>
        ))}
      </div>

      {/* Resumen del pedido */}
      <div className="order-summary">
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 14 }}>Resumen del pedido</div>
        <div className="summary-row">
          <span style={{ color: "var(--text-sub)" }}>Subtotal</span>
          <span style={{ fontWeight: 600 }}>{formatCOP(subtotal)}</span>
        </div>
        <div className="summary-row" style={{ marginBottom: 14 }}>
          <span style={{ color: "var(--text-sub)" }}>Costo de envío</span>
          <span style={{ fontWeight: 600 }}>{formatCOP(DELIVERY_FEE)}</span>
        </div>
        <div style={{ borderTop: "1.5px solid var(--border)", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: 16 }}>TOTAL</span>
          <span style={{ fontWeight: 800, fontSize: 22, color: "var(--green-dark)" }}>{formatCOP(total)}</span>
        </div>
      </div>

      {/* Botón confirmar */}
      <button
        className="save-btn"
        onClick={handleConfirm}
        disabled={loading || items.length === 0}
        style={{ opacity: items.length === 0 ? 0.5 : 1, marginBottom: 12 }}
      >
        {loading ? (
          <>
            <span className="spin-icon">⏳</span>
            Enviando pedido...
          </>
        ) : (
          <>
            <ShoppingBag size={18} />
            Confirmar Pedido · {formatCOP(total)}
          </>
        )}
      </button>
    </div>
  );
}
