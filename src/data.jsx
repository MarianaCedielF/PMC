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

export function friendlyExpiry(dateStr, lang = "en") {
  if (!dateStr || dateStr === "Unknown") return dateStr;
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return dateStr;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  parsed.setHours(0, 0, 0, 0);
  const diffDays = Math.round((parsed - today) / (1000 * 60 * 60 * 24));
  if (lang === "es") {
    if (diffDays < 0)   return "Caducado";
    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Mañana";
    if (diffDays <= 7)  return `${diffDays} días`;
    if (diffDays <= 30) return `${Math.round(diffDays / 7)} semanas`;
    return `${Math.round(diffDays / 30)} meses`;
  }
  if (diffDays < 0)   return "Expired";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays <= 7)  return `${diffDays} days`;
  if (diffDays <= 30) return `${Math.round(diffDays / 7)} weeks`;
  return `${Math.round(diffDays / 30)} months`;
}

const d = (offset) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + offset);
  return dt.toISOString().split("T")[0];
};
const todayStr = new Date().toISOString().split("T")[0];

const initialPantryItems = [
  { id: 1,  name: "Whole Milk",      quantity: 1,  categories: ["dairy","fridge"],     expiresLabel: todayStr, img: "🥛", addedBy: "Sarah", hoursAgo: 2  },
  { id: 2,  name: "Strawberries",    quantity: 2,  categories: ["produce","fridge"],   expiresLabel: d(1),    img: "🍓", addedBy: "James", hoursAgo: 5  },
  { id: 3,  name: "Free-range Eggs", quantity: 12, categories: ["dairy","fridge"],     expiresLabel: d(5),    img: "🥚", addedBy: "Sarah", hoursAgo: 2  },
  { id: 4,  name: "Ground Coffee",   quantity: 1,  categories: ["beverages","pantry"], expiresLabel: d(90),   img: "☕", addedBy: "David", hoursAgo: 26 },
  { id: 5,  name: "Organic Milk",    quantity: 1,  categories: ["dairy","fridge"],     expiresLabel: todayStr, img: "🥛", addedBy: "Sarah", hoursAgo: 3  },
  { id: 6,  name: "Greek Yogurt",    quantity: 1,  categories: ["dairy","fridge"],     expiresLabel: d(-1),   img: "🫙", addedBy: "Me",    hoursAgo: 5  },
  { id: 7,  name: "Sourdough Bread", quantity: 1,  categories: ["bakery","pantry"],    expiresLabel: d(2),    img: "🍞", addedBy: "Sarah", hoursAgo: 1  },
  { id: 8,  name: "Avocados",        quantity: 3,  categories: ["produce","pantry"],   expiresLabel: d(3),    img: "🥑", addedBy: "James", hoursAgo: 4  },
  { id: 9,  name: "Baby Spinach",    quantity: 1,  categories: ["produce","fridge"],   expiresLabel: d(2),    img: "🥬", addedBy: "Me",    hoursAgo: 26 },
  { id: 10, name: "Cheddar Cheese",  quantity: 1,  categories: ["dairy","fridge"],     expiresLabel: d(7),    img: "🧀", addedBy: "David", hoursAgo: 48 },
].map(i => ({ ...i, status: computeStatus(i.expiresLabel) }));

const initialShoppingList = [
  { id: 1, name: "Organic Whole Milk", quantity: 1, categories: ["dairy","fridge"],   addedBy: "Sarah", avatar: "S",  checked: false },
  { id: 2, name: "Avocados (Ripe)",    quantity: 3, categories: ["produce","pantry"], addedBy: "James", avatar: "J",  checked: false },
  { id: 3, name: "Sourdough Bread",    quantity: 1, categories: ["bakery","pantry"],  addedBy: "Sarah", avatar: "S",  checked: false },
  { id: 4, name: "Greek Yogurt",       categories:  ["dairy","fridge"],               addedBy: "Me",    avatar: "ME", checked: false },
];

const STORAGE_KEY = "freshkeeper_v2";
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
    { id: 1, name: "Free-range Eggs", user: "Sarah", time: "1 hour ago",  status: "added",    emoji: "🥚" },
    { id: 2, name: "Avocados",         user: "James", time: "2 hours ago", status: "consumed", emoji: "🥑" },
    { id: 3, name: "Cheddar Cheese",   user: "David", time: "Yesterday",   status: "added",    emoji: "🧀" },
  ]);
  const [notifications, setNotifications] = useState(saved?.notifications ?? [
    { id: 1, type: "expiring", item: "Organic Whole Milk",  msg: "Expires today! Use it for cereal or making a quick béchamel sauce.",     time: "2h ago", section: "today",     img: "🥛", actioned: false },
    { id: 2, type: "expired",  item: "Greek Yogurt (500g)", msg: "Expired yesterday. Please check if it's still good or compost it.",      time: "5h ago", section: "today",     img: "🫙", actioned: false },
    { id: 3, type: "tip",      item: "Freshness Tip",       msg: "Store your tomatoes at room temperature to keep them flavorful longer!", time: "1d ago", section: "yesterday", img: null },
    { id: 4, type: "expiring", item: "Baby Spinach",        msg: "Expiring in 2 days. Perfect for a morning smoothie!",                    time: "1d ago", section: "yesterday", img: "🥬", actioned: false },
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
      id: Date.now(), name: item.name, user: "Me", time: "Just now", status, emoji: item.img || "🛒",
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
