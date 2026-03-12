import { useData } from "../data";
import { useLang } from "../i18n";
import { Clock, ChefHat } from "lucide-react";

const ALL_RECIPES = [
  { id: 1, name: { en: "Strawberry Smoothie", es: "Batido de Fresa" }, emoji: "🍓", time: 5, uses: ["produce", "dairy"], ingredients: { en: ["Strawberries", "Milk", "Yogurt"], es: ["Fresas", "Leche", "Yogur"] }, description: { en: "Quick and refreshing smoothie perfect for breakfast.", es: "Batido rápido y refrescante perfecto para el desayuno." } },
  { id: 2, name: { en: "Avocado Toast", es: "Tostada de Aguacate" }, emoji: "🥑", time: 10, uses: ["produce", "bakery"], ingredients: { en: ["Avocado", "Sourdough Bread", "Lemon"], es: ["Aguacate", "Pan de masa madre", "Limón"] }, description: { en: "Classic avocado toast with a squeeze of lemon.", es: "Clásica tostada de aguacate con un toque de limón." } },
  { id: 3, name: { en: "Spinach Omelette", es: "Tortilla de Espinacas" }, emoji: "🍳", time: 15, uses: ["produce", "dairy"], ingredients: { en: ["Baby Spinach", "Eggs", "Cheese"], es: ["Espinacas", "Huevos", "Queso"] }, description: { en: "Fluffy omelette packed with fresh spinach and cheese.", es: "Tortilla esponjosa con espinacas frescas y queso." } },
  { id: 4, name: { en: "Cheese Sandwich", es: "Sándwich de Queso" }, emoji: "🥪", time: 8, uses: ["dairy", "bakery"], ingredients: { en: ["Cheddar Cheese", "Sourdough Bread", "Butter"], es: ["Queso Cheddar", "Pan de masa madre", "Mantequilla"] }, description: { en: "Crispy grilled cheese sandwich with sourdough.", es: "Sándwich de queso a la plancha con pan de masa madre." } },
  { id: 5, name: { en: "Greek Yogurt Bowl", es: "Bowl de Yogur Griego" }, emoji: "🫙", time: 5, uses: ["dairy", "produce"], ingredients: { en: ["Greek Yogurt", "Strawberries", "Honey"], es: ["Yogur griego", "Fresas", "Miel"] }, description: { en: "Creamy yogurt bowl topped with fresh fruit.", es: "Bowl cremoso de yogur con fruta fresca." } },
  { id: 6, name: { en: "Veggie Salad", es: "Ensalada de Verduras" }, emoji: "🥗", time: 10, uses: ["produce"], ingredients: { en: ["Baby Spinach", "Avocado", "Strawberries"], es: ["Espinacas", "Aguacate", "Fresas"] }, description: { en: "Fresh and colorful salad with seasonal vegetables.", es: "Ensalada fresca y colorida con verduras de temporada." } },
  { id: 7, name: { en: "Milk Coffee", es: "Café con Leche" }, emoji: "☕", time: 5, uses: ["beverages", "dairy"], ingredients: { en: ["Ground Coffee", "Milk"], es: ["Café molido", "Leche"] }, description: { en: "Classic café au lait with fresh ground coffee.", es: "Clásico café con leche recién molido." } },
  { id: 8, name: { en: "Fruit Parfait", es: "Parfait de Frutas" }, emoji: "🍓", time: 10, uses: ["dairy", "produce"], ingredients: { en: ["Greek Yogurt", "Strawberries", "Granola"], es: ["Yogur griego", "Fresas", "Granola"] }, description: { en: "Layered yogurt parfait with fresh fruits.", es: "Parfait de yogur en capas con frutas frescas." } },
];

export function getMatchingRecipes(pantryItems, categories) {
  const userCatIds = new Set(pantryItems.flatMap(i => i.categories || []));
  return ALL_RECIPES.filter(r => r.uses.some(u => userCatIds.has(u)));
}

export default function Recipes() {
  const { pantryItems, categories } = useData();
  const { lang, t } = useLang();
  const matching = getMatchingRecipes(pantryItems, categories);

  return (
    <div className="screen">
      <div className="header header-simple">
        <div style={{ width: 32 }} />
        <span className="page-title">{t("suggestedRecipes")}</span>
        <div style={{ width: 32 }} />
      </div>

      <div className="recipes-subtitle">{t("basedOnPantry")}</div>

      <div className="recipes-list">
        {matching.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} lang={lang} t={t} />
        ))}
        {matching.length === 0 && (
          <div className="empty-state">
            <div className="empty-emoji">🍽️</div>
            <div className="empty-text">{lang === "es" ? "Agrega productos para ver recetas sugeridas." : "Add products to see suggested recipes."}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function RecipeCard({ recipe, lang, t, compact = false }) {
  return (
    <div className={`recipe-card ${compact ? "recipe-card-compact" : ""}`}>
      <div className="recipe-emoji">{recipe.emoji}</div>
      <div className="recipe-info">
        <div className="recipe-name">{recipe.name[lang] || recipe.name.en}</div>
        {!compact && <div className="recipe-desc">{recipe.description[lang] || recipe.description.en}</div>}
        <div className="recipe-meta">
          <span className="recipe-meta-item"><Clock size={11} /> {recipe.time} {t("minutes")}</span>
          <span className="recipe-meta-item"><ChefHat size={11} /> {recipe.ingredients[lang]?.length || recipe.ingredients.en.length} {t("ingredients")}</span>
        </div>
        {!compact && (
          <div className="recipe-ingredients">
            {(recipe.ingredients[lang] || recipe.ingredients.en).map((ing, i) => (
              <span key={i} className="recipe-ing-tag">{ing}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}