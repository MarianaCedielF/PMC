import { useParams, useNavigate } from "react-router-dom";
import { Clock, ChefHat, CheckCircle, ArrowLeft } from "lucide-react";
import { useLang } from "../i18n";
import { ALL_RECIPES } from "./Recipes";
import { useState, useEffect } from "react";

export default function RecipeDetail() {
  const { id } = useParams();
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const [madeIt, setMadeIt] = useState(false);

  useEffect(() => {
    const el = document.querySelector(".mobile-content");
    if (el) el.scrollTop = 0;
  }, []);

  const recipe = ALL_RECIPES.find(r => r.id === parseInt(id));

  if (!recipe) return (
    <div className="screen">
      <div className="header header-simple">
        <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 6, display: "flex", alignItems: "center", color: "var(--text)" }}
        >
          <ArrowLeft size={22} />
        </button>
        <span className="page-title">{t("recipeDetail")}</span>
        <div style={{ width: 32 }} />
      </div>
      <div className="empty-state">
        <div className="empty-emoji">🍽️</div>
        <div className="empty-text">{lang === "es" ? "Receta no encontrada." : "Recipe not found."}</div>
      </div>
    </div>
  );

  return (
    <div className="screen">
      {/* Header with back button */}
      <div className="header header-simple">
        <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 6, display: "flex", alignItems: "center", color: "var(--text)", borderRadius: 8 }}
          aria-label={lang === "es" ? "Volver" : "Back"}
        >
          <ArrowLeft size={22} />
        </button>
        <span className="page-title">{t("recipeDetail")}</span>
        <div style={{ width: 34 }} />
      </div>

      {/* Hero */}
      <div className="recipe-hero">
        <div className="recipe-hero-emoji">{recipe.emoji}</div>
        <div className="recipe-hero-name">{recipe.name[lang] || recipe.name.en}</div>
        <div className="recipe-hero-desc">{recipe.description[lang] || recipe.description.en}</div>
        <div className="recipe-hero-meta">
          <span className="recipe-meta-item"><Clock size={13} /> {recipe.time} {t("minutes")}</span>
          <span className="recipe-meta-item"><ChefHat size={13} /> {(recipe.ingredients[lang] || recipe.ingredients.en).length} {t("ingredients")}</span>
        </div>
      </div>

      {/* Ingredients */}
      <div className="section-label" style={{ marginTop: 16 }}>{t("recipeIngredients")}</div>
      <div className="recipe-detail-ingredients">
        {(recipe.ingredients[lang] || recipe.ingredients.en).map((ing, i) => (
          <div key={i} className="recipe-ing-row">
            <span className="recipe-ing-dot" />
            <span className="recipe-ing-name">{ing}</span>
          </div>
        ))}
      </div>

      {/* Steps */}
      <div className="section-label" style={{ marginTop: 16 }}>{t("recipeSteps")}</div>
      <div className="recipe-steps">
        {(recipe.steps[lang] || recipe.steps.en).map((step, i) => (
          <div key={i} className="recipe-step">
            <div className="recipe-step-num">{i + 1}</div>
            <div className="recipe-step-text">{step}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        className={`save-btn ${madeIt ? "save-btn-success" : ""}`}
        style={{ marginTop: 20 }}
        onClick={() => setMadeIt(true)}
      >
        <CheckCircle size={18} />
        {madeIt ? (lang === "es" ? "¡Genial! 🎉" : "Awesome! 🎉") : t("tryRecipe")}
      </button>
    </div>
  );
}
