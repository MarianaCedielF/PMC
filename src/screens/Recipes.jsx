import { useData } from "../data";
import { useLang } from "../i18n";
import { Clock, ChefHat } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ALL_RECIPES = [
  {
    id: 1,
    name: { en: "Strawberry Smoothie", es: "Batido de Fresa" },
    emoji: "🍓",
    time: 5,
    uses: ["produce", "dairy"],
    ingredients: { en: ["Strawberries", "Milk", "Yogurt"], es: ["Fresas", "Leche", "Yogur"] },
    description: { en: "Quick and refreshing smoothie perfect for breakfast.", es: "Batido rápido y refrescante perfecto para el desayuno." },
    steps: {
      en: ["Add strawberries to the blender.", "Pour in the milk and yogurt.", "Blend for 30 seconds until smooth.", "Serve cold and enjoy!"],
      es: ["Agrega las fresas a la licuadora.", "Vierte la leche y el yogur.", "Licúa por 30 segundos hasta que quede suave.", "Sirve frío y disfruta."]
    }
  },
  {
    id: 2,
    name: { en: "Avocado Toast", es: "Tostada de Aguacate" },
    emoji: "🥑",
    time: 10,
    uses: ["produce", "bakery"],
    ingredients: { en: ["Avocado", "Sourdough Bread", "Lemon"], es: ["Aguacate", "Pan de masa madre", "Limón"] },
    description: { en: "Classic avocado toast with a squeeze of lemon.", es: "Clásica tostada de aguacate con un toque de limón." },
    steps: {
      en: ["Toast the sourdough bread until golden.", "Mash the avocado with a fork.", "Spread avocado on the toast.", "Squeeze lemon juice on top and season with salt."],
      es: ["Tuesta el pan de masa madre hasta que esté dorado.", "Aplasta el aguacate con un tenedor.", "Unta el aguacate sobre la tostada.", "Exprime limón encima y sazona con sal."]
    }
  },
  {
    id: 3,
    name: { en: "Spinach Omelette", es: "Tortilla de Espinacas" },
    emoji: "🍳",
    time: 15,
    uses: ["produce", "dairy"],
    ingredients: { en: ["Baby Spinach", "Eggs", "Cheese"], es: ["Espinacas", "Huevos", "Queso"] },
    description: { en: "Fluffy omelette packed with fresh spinach and cheese.", es: "Tortilla esponjosa con espinacas frescas y queso." },
    steps: {
      en: ["Beat the eggs in a bowl and season.", "Heat a pan over medium heat with butter.", "Pour in the eggs and let them set slightly.", "Add spinach and cheese, fold and serve."],
      es: ["Bate los huevos en un bol y sazona.", "Calienta una sartén a fuego medio con mantequilla.", "Vierte los huevos y deja que cuajen ligeramente.", "Agrega espinacas y queso, dobla y sirve."]
    }
  },
  {
    id: 4,
    name: { en: "Cheese Sandwich", es: "Sándwich de Queso" },
    emoji: "🥪",
    time: 8,
    uses: ["dairy", "bakery"],
    ingredients: { en: ["Cheddar Cheese", "Sourdough Bread", "Butter"], es: ["Queso Cheddar", "Pan de masa madre", "Mantequilla"] },
    description: { en: "Crispy grilled cheese sandwich with sourdough.", es: "Sándwich de queso a la plancha con pan de masa madre." },
    steps: {
      en: ["Butter both sides of the sourdough bread.", "Place cheddar cheese between the slices.", "Grill on a pan over medium heat.", "Cook 3 minutes per side until golden and melted."],
      es: ["Unta mantequilla en ambos lados del pan.", "Coloca el queso cheddar entre las rebanadas.", "Cocina en una sartén a fuego medio.", "Cocina 3 minutos por lado hasta que esté dorado."]
    }
  },
  {
    id: 5,
    name: { en: "Greek Yogurt Bowl", es: "Bowl de Yogur Griego" },
    emoji: "🫙",
    time: 5,
    uses: ["dairy", "produce"],
    ingredients: { en: ["Greek Yogurt", "Strawberries", "Honey"], es: ["Yogur griego", "Fresas", "Miel"] },
    description: { en: "Creamy yogurt bowl topped with fresh fruit.", es: "Bowl cremoso de yogur con fruta fresca." },
    steps: {
      en: ["Spoon Greek yogurt into a bowl.", "Slice strawberries and place on top.", "Drizzle honey over everything.", "Serve immediately."],
      es: ["Sirve el yogur griego en un bowl.", "Corta las fresas y colócalas encima.", "Rocía miel sobre todo.", "Sirve inmediatamente."]
    }
  },
  {
    id: 6,
    name: { en: "Veggie Salad", es: "Ensalada de Verduras" },
    emoji: "🥗",
    time: 10,
    uses: ["produce"],
    ingredients: { en: ["Baby Spinach", "Avocado", "Strawberries"], es: ["Espinacas", "Aguacate", "Fresas"] },
    description: { en: "Fresh and colorful salad with seasonal vegetables.", es: "Ensalada fresca y colorida con verduras de temporada." },
    steps: {
      en: ["Wash and dry the spinach leaves.", "Slice avocado and strawberries.", "Combine all ingredients in a bowl.", "Dress with olive oil and lemon juice."],
      es: ["Lava y seca las hojas de espinaca.", "Corta el aguacate y las fresas.", "Combina todos los ingredientes en un bowl.", "Aliña con aceite de oliva y jugo de limón."]
    }
  },
  {
    id: 7,
    name: { en: "Milk Coffee", es: "Café con Leche" },
    emoji: "☕",
    time: 5,
    uses: ["beverages", "dairy"],
    ingredients: { en: ["Ground Coffee", "Milk"], es: ["Café molido", "Leche"] },
    description: { en: "Classic café au lait with fresh ground coffee.", es: "Clásico café con leche recién molido." },
    steps: {
      en: ["Brew a strong cup of ground coffee.", "Heat the milk until steaming.", "Pour coffee into a mug.", "Add hot milk and stir gently."],
      es: ["Prepara una taza fuerte de café molido.", "Calienta la leche hasta que humee.", "Vierte el café en una taza.", "Agrega la leche caliente y mezcla suavemente."]
    }
  },
  {
    id: 8,
    name: { en: "Fruit Parfait", es: "Parfait de Frutas" },
    emoji: "🍓",
    time: 10,
    uses: ["dairy", "produce"],
    ingredients: { en: ["Greek Yogurt", "Strawberries", "Granola"], es: ["Yogur griego", "Fresas", "Granola"] },
    description: { en: "Layered yogurt parfait with fresh fruits.", es: "Parfait de yogur en capas con frutas frescas." },
    steps: {
      en: ["Layer Greek yogurt at the bottom of a glass.", "Add a layer of sliced strawberries.", "Sprinkle granola on top.", "Repeat layers and serve chilled."],
      es: ["Coloca yogur griego en el fondo de un vaso.", "Agrega una capa de fresas cortadas.", "Espolvorea granola encima.", "Repite las capas y sirve frío."]
    }
  },
];

export function getMatchingRecipes(pantryItems, categories) {
  const userCatIds = new Set(pantryItems.flatMap(i => i.categories || []));
  return ALL_RECIPES.filter(r => r.uses.some(u => userCatIds.has(u)));
}

export default function Recipes() {
  const { pantryItems, categories } = useData();
  const { lang, t } = useLang();
  const matching = getMatchingRecipes(pantryItems, categories);
  const navigate = useNavigate();

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
          <RecipeCard key={recipe.id} recipe={recipe} lang={lang} t={t} onClick={() => navigate(`/recipes/${recipe.id}`)} />
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

export function RecipeCard({ recipe, lang, t, compact = false, onClick }) {
  return (
    <div className={`recipe-card ${compact ? "recipe-card-compact" : ""}`} onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
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