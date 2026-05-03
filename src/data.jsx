import { createContext, useContext, useState, useEffect } from "react";

export const DEFAULT_CATEGORIES = [
  { id: "dairy",     label: { en: "Dairy",            es: "Lácteos" },           icon: "🥛" },
  { id: "produce",   label: { en: "Produce",           es: "Frutas y Verduras" }, icon: "🍎" },
  { id: "bakery",    label: { en: "Bakery",            es: "Panadería" },         icon: "🍞" },
  { id: "meat",      label: { en: "Meat & Fish",       es: "Carne y Pescado" },   icon: "🥩" },
  { id: "beverages", label: { en: "Beverages",         es: "Bebidas" },           icon: "☕" },
  { id: "frozen",    label: { en: "Frozen",            es: "Congelados" },        icon: "🧊" },
  { id: "fridge",    label: { en: "Fridge",            es: "Nevera" },            icon: "❄️" },
  { id: "pantry",    label: { en: "Pantry",            es: "Despensa" },          icon: "📦" },
  { id: "other",     label: { en: "Other",             es: "Otros" },             icon: "🏷️" },
];

export function computeStatus(expiresLabel) {
  if (!expiresLabel || expiresLabel === "Unknown") return "fresh";
  const parsed = new Date(expiresLabel);
  if (!isNaN(parsed.getTime())) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    parsed.setHours(0, 0, 0, 0);
    const diffDays = Math.round((parsed - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0)  return "expired";
    if (diffDays === 0) return "expiring";
    if (diffDays <= 3) return "warning";
    return "fresh";
  }
  const label = expiresLabel.toLowerCase();
  if (label === "expired")  return "expired";
  if (label === "today")    return "expiring";
  if (label === "tomorrow") return "warning";
  return "fresh";
}

export function friendlyExpiry(dateStr, lang = "es") {
  if (!dateStr || dateStr === "Unknown") return dateStr;
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return dateStr;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  parsed.setHours(0, 0, 0, 0);
  const diffDays = Math.round((parsed - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0)   return "Caducado";
  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Mañana";
  if (diffDays <= 7)  return `${diffDays} días`;
  if (diffDays <= 30) return `${Math.round(diffDays / 7)} semanas`;
  return `${Math.round(diffDays / 30)} meses`;
}

const d = (offset) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + offset);
  return dt.toISOString().split("T")[0];
};
const todayStr = new Date().toISOString().split("T")[0];

const initialPantryItems = [
  // Expiring today
  { id: 1,  name: "Leche Entera",         quantity: 1,  categories: ["dairy","fridge"],     expiresLabel: todayStr, img: "🥛", addedBy: "Sarah", hoursAgo: 2  },
  { id: 5,  name: "Leche Orgánica",        quantity: 1,  categories: ["dairy","fridge"],     expiresLabel: todayStr, img: "🥛", addedBy: "Sarah", hoursAgo: 3  },
  { id: 23, name: "Tortillas de Maíz",     quantity: 6,  categories: ["bakery","pantry"],    expiresLabel: todayStr, img: "🌮", addedBy: "Sarah", hoursAgo: 8  },
  // Warning (1–3 days)
  { id: 2,  name: "Fresas",               quantity: 2,  categories: ["produce","fridge"],   expiresLabel: d(1),    img: "🍓", addedBy: "James", hoursAgo: 5  },
  { id: 7,  name: "Pan de Masa Madre",     quantity: 1,  categories: ["bakery","pantry"],    expiresLabel: d(2),    img: "🍞", addedBy: "Sarah", hoursAgo: 1  },
  { id: 8,  name: "Aguacates",             quantity: 3,  categories: ["produce","pantry"],   expiresLabel: d(3),    img: "🥑", addedBy: "James", hoursAgo: 4  },
  { id: 9,  name: "Espinaca Baby",         quantity: 1,  categories: ["produce","fridge"],   expiresLabel: d(2),    img: "🥬", addedBy: "Me",    hoursAgo: 26 },
  { id: 18, name: "Bananos",              quantity: 5,  categories: ["produce","pantry"],   expiresLabel: d(1),    img: "🍌", addedBy: "James", hoursAgo: 6  },
  // Fresh
  { id: 3,  name: "Huevos de Campo",       quantity: 12, categories: ["dairy","fridge"],     expiresLabel: d(5),    img: "🥚", addedBy: "Sarah", hoursAgo: 2  },
  { id: 4,  name: "Café Molido",           quantity: 1,  categories: ["beverages","pantry"], expiresLabel: d(90),   img: "☕", addedBy: "David", hoursAgo: 26 },
  { id: 10, name: "Queso Cheddar",         quantity: 1,  categories: ["dairy","fridge"],     expiresLabel: d(7),    img: "🧀", addedBy: "David", hoursAgo: 48 },
  { id: 11, name: "Pechuga de Pollo",      quantity: 2,  categories: ["meat","fridge"],      expiresLabel: d(5),    img: "🥩", addedBy: "James", hoursAgo: 10 },
  { id: 12, name: "Jugo de Naranja",       quantity: 1,  categories: ["beverages","fridge"], expiresLabel: d(12),   img: "🍊", addedBy: "Sarah", hoursAgo: 7  },
  { id: 13, name: "Mantequilla",           quantity: 1,  categories: ["dairy","fridge"],     expiresLabel: d(25),   img: "🧈", addedBy: "David", hoursAgo: 48 },
  { id: 14, name: "Arvejas Congeladas",    quantity: 2,  categories: ["frozen"],             expiresLabel: d(120),  img: "🧊", addedBy: "Sarah", hoursAgo: 72 },
  { id: 15, name: "Manzanas",             quantity: 4,  categories: ["produce","fridge"],   expiresLabel: d(14),   img: "🍎", addedBy: "James", hoursAgo: 12 },
  { id: 16, name: "Zanahorias",           quantity: 1,  categories: ["produce","fridge"],   expiresLabel: d(10),   img: "🥕", addedBy: "Me",    hoursAgo: 20 },
  { id: 17, name: "Salsa de Tomate",       quantity: 2,  categories: ["other","pantry"],     expiresLabel: d(120),  img: "🍅", addedBy: "David", hoursAgo: 96 },
  // Expired
  { id: 6,  name: "Yogur Griego",          quantity: 1,  categories: ["dairy","fridge"],     expiresLabel: d(-1),   img: "🫙", addedBy: "Me",    hoursAgo: 5  },
  { id: 19, name: "Tomates Cherry",        quantity: 1,  categories: ["produce","fridge"],   expiresLabel: d(-2),   img: "🍅", addedBy: "Sarah", hoursAgo: 72 },
  { id: 20, name: "Crema de Leche",        quantity: 1,  categories: ["dairy","fridge"],     expiresLabel: d(-1),   img: "🫙", addedBy: "David", hoursAgo: 48 },
  { id: 21, name: "Jamón de Pierna",       quantity: 1,  categories: ["meat","fridge"],      expiresLabel: d(-3),   img: "🍖", addedBy: "James", hoursAgo: 96 },
  { id: 22, name: "Champiñones",           quantity: 1,  categories: ["produce","fridge"],   expiresLabel: d(-1),   img: "🍄", addedBy: "Me",    hoursAgo: 36 },
].map(i => ({ ...i, status: computeStatus(i.expiresLabel) }));

const initialShoppingList = [
  { id: 1, name: "Leche Entera Orgánica",  quantity: 1,  categories: ["dairy","fridge"],    addedBy: "Sarah", avatar: "S",  checked: false },
  { id: 2, name: "Aguacates (Maduros)",    quantity: 3,  categories: ["produce","pantry"],  addedBy: "James", avatar: "J",  checked: false },
  { id: 3, name: "Pan de Masa Madre",      quantity: 1,  categories: ["bakery","pantry"],   addedBy: "Sarah", avatar: "S",  checked: false },
  { id: 4, name: "Yogur Griego",           quantity: 1,  categories: ["dairy","fridge"],    addedBy: "Me",    avatar: "ME", checked: false },
  { id: 5, name: "Huevos de Campo",        quantity: 12, categories: ["dairy","fridge"],    addedBy: "IA FreshKeeper", avatar: "AI", checked: false, aiSuggested: true },
  { id: 6, name: "Espinaca Baby",          quantity: 1,  categories: ["produce","fridge"],  addedBy: "IA FreshKeeper", avatar: "AI", checked: false, aiSuggested: true },
  { id: 7, name: "Café Molido",            quantity: 1,  categories: ["beverages","pantry"],addedBy: "IA FreshKeeper", avatar: "AI", checked: false, aiSuggested: true },
];

const STORAGE_KEY = "freshkeeper_v3";
function loadState() {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

const DataContext = createContext();

export function DataProvider({ children }) {
  const saved = loadState();

  const [pantryItems, setPantryItems] = useState(() =>
    saved?.pantryItems
      ? saved.pantryItems.map(i => ({ ...i, status: computeStatus(i.expiresLabel) }))
      : initialPantryItems
  );
  const [shoppingList,  setShoppingList]  = useState(saved?.shoppingList  ?? initialShoppingList);
  const [categories,    setCategories]    = useState(saved?.categories     ?? DEFAULT_CATEGORIES);
  const [activity,      setActivity]      = useState(saved?.activity       ?? [
    { id: 1, name: "Huevos de Campo",   user: "Sarah", time: "Hace 1 hora",   status: "added",    emoji: "🥚" },
    { id: 2, name: "Aguacates",          user: "James", time: "Hace 2 horas",  status: "consumed", emoji: "🥑" },
    { id: 3, name: "Pechuga de Pollo",   user: "James", time: "Hace 3 horas",  status: "added",    emoji: "🥩" },
    { id: 4, name: "Manzanas",           user: "Sarah", time: "Hace 4 horas",  status: "added",    emoji: "🍎" },
    { id: 5, name: "Queso Cheddar",      user: "David", time: "Ayer",          status: "added",    emoji: "🧀" },
    { id: 6, name: "Leche Entera",       user: "Sarah", time: "Ayer",          status: "consumed", emoji: "🥛" },
  ]);
  const [notifications, setNotifications] = useState(saved?.notifications ?? [
    { id: 1, type: "expiring", item: "Leche Orgánica",    msg: "¡Vence hoy! Úsala para el cereal o para preparar una salsa cremosa.",         time: "Hace 2h",  section: "today",     img: "🥛", actioned: false },
    { id: 2, type: "expired",  item: "Yogur Griego",      msg: "Venció ayer. Revisa si aún está en buen estado o descártalo.",                 time: "Hace 5h",  section: "today",     img: "🫙", actioned: false },
    { id: 3, type: "expiring", item: "Bananos",           msg: "¡Vencen mañana! Perfectos para hacer pan de banano o un batido.",              time: "Hace 4h",  section: "today",     img: "🍌", actioned: false },
    { id: 4, type: "expired",  item: "Tomates Cherry",    msg: "Caducados hace 2 días. Revisa si aún sirven o compóstalos.",                   time: "Hace 3h",  section: "today",     img: "🍅", actioned: false },
    { id: 5, type: "tip",      item: "Consejo de Frescura", msg: "¡Guarda los tomates a temperatura ambiente para mantenerlos más sabrosos!", time: "Hace 1d",  section: "yesterday", img: null  },
    { id: 6, type: "expiring", item: "Espinaca Baby",     msg: "Vence en 2 días. ¡Perfecta para un batido matutino o una ensalada rápida!",   time: "Hace 1d",  section: "yesterday", img: "🥬", actioned: false },
    { id: 7, type: "expired",  item: "Jamón de Pierna",   msg: "Caducado hace 3 días. No consumir. Descarta antes de usar.",                  time: "Hace 1d",  section: "yesterday", img: "🍖", actioned: false },
    { id: 8, type: "tip",      item: "Consejo de Frescura", msg: "Envuelve el pan en papel aluminio para que se conserve fresco por más tiempo en la despensa.", time: "Hace 2d", section: "yesterday", img: null },
  ]);

  useEffect(() => {
    saveState({ pantryItems, shoppingList, categories, activity, notifications });
  }, [pantryItems, shoppingList, categories, activity, notifications]);

  const fresh           = pantryItems.filter(i => i.status === "fresh").length;
  const warning         = pantryItems.filter(i => i.status === "warning" || i.status === "expiring").length;
  const expired         = pantryItems.filter(i => i.status === "expired").length;
  const fridgeItems     = pantryItems.filter(i => i.categories?.includes("fridge")).length;
  const pantryZoneItems = pantryItems.filter(i => i.categories?.includes("pantry")).length;

  const logActivity = (item, status) => {
    setActivity(prev => [{
      id: Date.now(), name: item.name, user: "Me", time: "Justo ahora", status, emoji: item.img || "🛒",
    }, ...prev].slice(0, 10));
  };

  const addItem = (item) => {
    const status = computeStatus(item.expiresLabel);
    const newItem = { ...item, id: Date.now(), status };
    setPantryItems(prev => [...prev, newItem]);
    logActivity(newItem, "added");
    if (status === "expiring" || status === "warning") {
      setNotifications(prev => [{
        id: Date.now() + 1, type: "expiring", item: item.name,
        msg: `¡Vence ${status === "expiring" ? "hoy" : "en los próximos días"}! Úsalo pronto.`,
        time: "Ahora", section: "today", img: item.img || "🛒", actioned: false,
      }, ...prev]);
    }
  };

  const removeItem = (id) => setPantryItems(prev => prev.filter(i => i.id !== id));

  const consumeItem = (id, amount) => {
    setPantryItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item) logActivity(item, "consumed");
      return prev.map(i => {
        if (i.id !== id) return i;
        const newQty = (parseInt(i.quantity) ?? 1) - amount;
        return newQty <= 0 ? { ...i, quantity: 0, status: "consumed" } : { ...i, quantity: newQty };
      });
    });
  };

  const toggleShoppingItem  = (id) => setShoppingList(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  const addShoppingItem     = (name, cats = []) => setShoppingList(prev => [...prev, { id: Date.now(), name, categories: cats, addedBy: "Me", avatar: "ME", checked: false }]);
  const removeShoppingItem  = (id) => setShoppingList(prev => prev.filter(i => i.id !== id));
  const actionNotification  = (id) => setNotifications(prev => prev.filter(n => n.id !== id));
  const addCategory         = (cat) => setCategories(prev => [...prev, cat]);

  const resetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPantryItems(initialPantryItems);
    setShoppingList(initialShoppingList);
    setCategories(DEFAULT_CATEGORIES);
    setActivity([]);
    setNotifications([]);
  };

  return (
    <DataContext.Provider value={{
      pantryItems, shoppingList, notifications, categories, activity,
      addItem, removeItem, consumeItem,
      toggleShoppingItem, addShoppingItem, removeShoppingItem,
      actionNotification, addCategory, logActivity, resetData,
      fresh, warning, expired, fridgeItems, pantryZoneItems,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() { return useContext(DataContext); }
