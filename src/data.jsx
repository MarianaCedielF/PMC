import { createContext, useContext, useState } from "react";

export const DEFAULT_CATEGORIES = [
  { id: "dairy", label: { en: "Dairy", es: "Lácteos" }, icon: "🥛" },
  { id: "produce", label: { en: "Produce", es: "Frutas y Verduras" }, icon: "🍎" },
  { id: "bakery", label: { en: "Bakery", es: "Panadería" }, icon: "🍞" },
  { id: "meat", label: { en: "Meat & Fish", es: "Carne y Pescado" }, icon: "🥩" },
  { id: "beverages", label: { en: "Beverages", es: "Bebidas" }, icon: "☕" },
  { id: "frozen", label: { en: "Frozen", es: "Congelados" }, icon: "🧊" },
  { id: "fridge", label: { en: "Fridge", es: "Nevera" }, icon: "❄️" },
  { id: "pantry", label: { en: "Pantry", es: "Despensa" }, icon: "📦" },
  { id: "other", label: { en: "Other", es: "Otros" }, icon: "🏷️" },
];

const initialPantryItems = [
  { id: 1, name: "Whole Milk", categories: ["dairy", "fridge"], detail: "1L Bottle", expiresLabel: "Today", expiresTime: "Expires 6PM", status: "warning", img: "🥛", addedBy: "Sarah", hoursAgo: 2 },
  { id: 2, name: "Strawberries", categories: ["produce", "fridge"], detail: "500g Pack", expiresLabel: "Tomorrow", expiresTime: "Expires 10AM", status: "warning", img: "🍓", addedBy: "James", hoursAgo: 5 },
  { id: 3, name: "Free-range Eggs", categories: ["dairy", "fridge"], detail: "12 units", expiresLabel: "5 days", expiresTime: "", status: "fresh", img: "🥚", addedBy: "Sarah", hoursAgo: 2 },
  { id: 4, name: "Ground Coffee", categories: ["beverages", "pantry"], detail: "500g", expiresLabel: "3 months", expiresTime: "", status: "fresh", img: "☕", addedBy: "David", hoursAgo: 26 },
  { id: 5, name: "Organic Milk", categories: ["dairy", "fridge"], detail: "2L Bottle", expiresLabel: "Today", expiresTime: "Expires 8PM", status: "expiring", img: "🥛", addedBy: "Sarah", hoursAgo: 3 },
  { id: 6, name: "Greek Yogurt", categories: ["dairy", "fridge"], detail: "500g", expiresLabel: "Expired", expiresTime: "Yesterday", status: "expired", img: "🫙", addedBy: "Me", hoursAgo: 5 },
  { id: 7, name: "Sourdough Bread", categories: ["bakery", "pantry"], detail: "Bakery section", expiresLabel: "2 days", expiresTime: "", status: "warning", img: "🍞", addedBy: "Sarah", hoursAgo: 1 },
  { id: 8, name: "Avocados", categories: ["produce", "pantry"], detail: "3 units", expiresLabel: "3 days", expiresTime: "", status: "fresh", img: "🥑", addedBy: "James", hoursAgo: 4 },
  { id: 9, name: "Baby Spinach", categories: ["produce", "fridge"], detail: "200g bag", expiresLabel: "2 days", expiresTime: "", status: "warning", img: "🥬", addedBy: "Me", hoursAgo: 26 },
  { id: 10, name: "Cheddar Cheese", categories: ["dairy", "fridge"], detail: "250g block", expiresLabel: "7 days", expiresTime: "", status: "fresh", img: "🧀", addedBy: "David", hoursAgo: 48 },
];

const initialShoppingList = [
  { id: 1, name: "Organic Whole Milk", categories: ["dairy", "fridge"], addedBy: "Sarah", avatar: "S", checked: false },
  { id: 2, name: "Avocados (Ripe)", categories: ["produce", "pantry"], addedBy: "James", avatar: "J", checked: false },
  { id: 3, name: "Sourdough Bread", categories: ["bakery", "pantry"], addedBy: "Sarah", avatar: "S", checked: false },
  { id: 4, name: "Greek Yogurt", categories: ["dairy", "fridge"], addedBy: "Me", avatar: "ME", checked: false },
];

const DataContext = createContext();

export function DataProvider({ children }) {
  const [pantryItems, setPantryItems] = useState(initialPantryItems);
  const [shoppingList, setShoppingList] = useState(initialShoppingList);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [notifications, setNotifications] = useState([
    { id: 1, type: "expiring", item: "Organic Whole Milk", msg: "Expires today! Use it for cereal or making a quick béchamel sauce.", time: "2h ago", section: "today", img: "🥛", actioned: false },
    { id: 2, type: "expired", item: "Greek Yogurt (500g)", msg: "Expired yesterday. Please check if it's still good or compost it.", time: "5h ago", section: "today", img: "🫙", actioned: false },
    { id: 3, type: "tip", item: "Freshness Tip", msg: "Store your tomatoes at room temperature to keep them flavorful longer!", time: "1d ago", section: "yesterday", img: null },
    { id: 4, type: "expiring", item: "Baby Spinach", msg: "Expiring in 2 days. Perfect for a morning smoothie!", time: "1d ago", section: "yesterday", img: "🥬", actioned: false },
  ]);

  const addItem = (item) => setPantryItems(prev => [...prev, { ...item, id: Date.now() }]);
  const removeItem = (id) => setPantryItems(prev => prev.filter(i => i.id !== id));
  const toggleShoppingItem = (id) => setShoppingList(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  const addShoppingItem = (name, cats = []) => setShoppingList(prev => [...prev, { id: Date.now(), name, categories: cats, addedBy: "Me", avatar: "ME", checked: false }]);
  const removeShoppingItem = (id) => setShoppingList(prev => prev.filter(i => i.id !== id));
  const actionNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));
  const addCategory = (cat) => setCategories(prev => [...prev, cat]);

  const fresh = pantryItems.filter(i => i.status === "fresh").length;
  const warning = pantryItems.filter(i => i.status === "warning" || i.status === "expiring").length;
  const expired = pantryItems.filter(i => i.status === "expired").length;
  const fridgeItems = pantryItems.filter(i => i.categories?.includes("fridge")).length;
  const pantryZoneItems = pantryItems.filter(i => i.categories?.includes("pantry")).length;

  return (
    <DataContext.Provider value={{
      pantryItems, shoppingList, notifications, categories,
      addItem, removeItem, toggleShoppingItem, addShoppingItem, removeShoppingItem, actionNotification, addCategory,
      fresh, warning, expired, fridgeItems, pantryZoneItems
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}