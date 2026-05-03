import { Search, AlertCircle, Refrigerator } from "lucide-react";
import { useData } from "../data";
import { useLang } from "../i18n";
import { friendlyExpiry } from "../data";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { RecipeCard, getMatchingRecipes } from "./Recipes";

export default function Home() {
  const { fresh, warning, expired, fridgeItems, pantryZoneItems, pantryItems, categories, activity } = useData();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const expiringSoon = pantryItems.filter(i => i.status === "warning" || i.status === "expiring");
  const matchingRecipes = getMatchingRecipes(pantryItems, categories);
  const filteredItems = search ? pantryItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase())) : [];

  const getCatLabel = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? (cat.label.es || cat.label.en) : catId;
  };

  return (
    <div className="screen">
      <div className="header header-simple">
        <div style={{ width: 32 }} />
        <span className="page-title">{t("pantryDashboard")}</span>
        <div style={{ width: 32 }} />
      </div>

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

      <div className="search-wrap">
        <Search size={16} color="#aaa" />
        <input
          className="search-input"
          placeholder={t("searchPantry")}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: "0 2px", fontSize: 16 }}
          >×</button>
        )}
      </div>

      {search && (
        <div className="search-results">
          {filteredItems.length === 0 ? (
            <div className="no-results">Sin resultados</div>
          ) : (
            filteredItems.map(item => (
              <div key={item.id} className="search-result-item" onClick={() => navigate("/inventory")} style={{ cursor: "pointer" }}>
                <span className="item-emoji">{item.img}</span>
                <div>
                  <div className="item-name">{item.name}</div>
                  <div className="item-detail">
                    {item.categories?.map(getCatLabel).join(", ")} ·{" "}
                    <span className={`expires-chip expires-${item.status}`}>
                      {friendlyExpiry(item.expiresLabel, lang)}
                    </span>
                  </div>
                </div>
                <span className={`badge badge-${item.status === "fresh" ? "added" : item.status === "expired" ? "consumed" : "expiring"}`}>
                  {item.status === "fresh" ? t("fresh") : item.status === "expired" ? t("expiredLabel") : t("expiringSoonLabel")}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      <div className="section-header">
        <div className="section-title-row">
          <AlertCircle size={18} color="#f59e0b" />
          <span className="section-title">{t("expiringSoon")}</span>
        </div>
        {expiringSoon.length > 2 && (
          <button className="view-all-btn" onClick={() => navigate("/alerts")}>{t("viewAll")}</button>
        )}
      </div>

      <div className="expiring-list">
        {expiringSoon.length === 0 ? (
          <div style={{ background: "white", borderRadius: 14, padding: "16px 14px", textAlign: "center", color: "var(--text-sub)", fontSize: 13, boxShadow: "var(--shadow)" }}>
            ✅ ¡Todo fresco! Sin alertas de vencimiento.
          </div>
        ) : (
          expiringSoon.slice(0, 2).map(item => (
            <div key={item.id} className="expiring-card">
              <div className="expiring-img">{item.img}</div>
              <div className="expiring-info">
                <div className="item-name">{item.name}</div>
                <div className="item-detail">{item.categories?.map(getCatLabel).join(", ")}</div>
                <span className={(parseInt(item.quantity) ?? 1) > 0 ? "qty-badge" : "qty-badge qty-empty"}>
                  {(parseInt(item.quantity) ?? 1) > 0
                    ? `${parseInt(item.quantity) ?? 1} ${t("remaining")}`
                    : t("outOfStock")}
                </span>
              </div>
              <div className="expiring-time">
                <div className="expires-label orange">{friendlyExpiry(item.expiresLabel, lang)}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="section-header">
        <div className="section-title-row">
          <Refrigerator size={18} color="#22c55e" />
          <span className="section-title">{t("storageZones")}</span>
        </div>
      </div>

      <div className="zones-row">
        <button className="zone-card zone-fridge" onClick={() => navigate("/inventory?zone=fridge")}>
          <div className="zone-icon">❄️</div>
          <div className="zone-name">{t("fridge")}</div>
          <div className="zone-count">{fridgeItems} {t("itemsInside")}</div>
        </button>
        <button className="zone-card zone-pantry" onClick={() => navigate("/inventory?zone=pantry")}>
          <div className="zone-icon">📦</div>
          <div className="zone-name">{t("pantry")}</div>
          <div className="zone-count">{pantryZoneItems} {t("itemsInside")}</div>
        </button>
      </div>

      <div className="section-header">
        <div className="section-title-row">
          <span className="plus-circle">+</span>
          <span className="section-title">{t("pantryActivity")}</span>
        </div>
      </div>

      <div className="activity-list">
        {activity.length === 0 && (
          <div style={{ padding: "16px", textAlign: "center", color: "var(--text-sub)", fontSize: "13px" }}>
            Aún no hay actividad registrada.
          </div>
        )}
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

      <div className="section-header" style={{ marginTop: 20 }}>
        <div className="section-title-row">
          <span>👨‍🍳</span>
          <span className="section-title">{t("suggestedRecipes")}</span>
        </div>
        <button className="view-all-btn" onClick={() => navigate("/recipes")}>{t("seeMore")}</button>
      </div>
      <div className="recipes-list">
        {matchingRecipes.slice(0, 2).map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} lang={lang} t={t} compact={true} onClick={() => navigate(`/recipes/${recipe.id}`)} />
        ))}
      </div>
    </div>
  );
}
