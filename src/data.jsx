import { createContext, useContext, useState } from "react";

const initialPantryItems = [
  { id: 1, name: "Whole Milk", zone: "Fridge", detail: "1L Bottle", expiresLabel: "Today", expiresTime: "Expires 6PM", status: "warning", category: "Dairy", img: "🥛", addedBy: "Sarah", hoursAgo: 2 },
  { id: 2, name: "Strawberries", zone: "Fridge", detail: "500g Pack", expiresLabel: "Tomorrow", expiresTime: "Expires 10AM", status: "warning", category: "Produce", img: "🍓", addedBy: "James", hoursAgo: 5 },
  { id: 3, name: "Free-range Eggs", zone: "Fridge", detail: "12 units", expiresLabel: "5 days", expiresTime: "", status: "fresh", category: "Dairy", img: "🥚", addedBy: "Sarah", hoursAgo: 2 },
  { id: 4, name: "Ground Coffee", zone: "Pantry", detail: "500g", expiresLabel: "3 months", expiresTime: "", status: "fresh", category: "Beverages", img: "☕", addedBy: "David", hoursAgo: 26 },
  { id: 5, name: "Organic Milk", zone: "Fridge", detail: "2L Bottle", expiresLabel: "Today", expiresTime: "Expires 8PM", status: "expiring", category: "Dairy", img: "🥛", addedBy: "Sarah", hoursAgo: 3 },
  { id: 6, name: "Greek Yogurt", zone: "Fridge", detail: "500g", expiresLabel: "Expired", expiresTime: "Yesterday", status: "expired", category: "Dairy", img: "🫙", addedBy: "Me", hoursAgo: 5 },
  { id: 7, name: "Sourdough Bread", zone: "Pantry", detail: "Bakery section", expiresLabel: "2 days", expiresTime: "", status: "warning", category: "Bakery", img: "🍞", addedBy: "Sarah", hoursAgo: 1 },
  { id: 8, name: "Avocados", zone: "Pantry", detail: "3 units", expiresLabel: "3 days", expiresTime: "", status: "fresh", category: "Produce", img: "🥑", addedBy: "James", hoursAgo: 4 },
  { id: 9, name: "Baby Spinach", zone: "Fridge", detail: "200g bag", expiresLabel: "2 days", expiresTime: "", status: "warning", category: "Produce", img: "🥬", addedBy: "Me", hoursAgo: 26 },
  { id: 10, name: "Cheddar Cheese", zone: "Fridge", detail: "250g block", expiresLabel: "7 days", expiresTime: "", status: "fresh", category: "Dairy", img: "🧀", addedBy: "David", hoursAgo: 48 },
];

const initialShoppingList = [
  { id: 1, name: "Organic Whole Milk", detail: "2L Bottle", addedBy: "Sarah", avatar: "S", checked: false },
  { id: 2, name: "Avocados (Ripe)", detail: "3 units", addedBy: "James", avatar: "J", checked: false },
  { id: 3, name: "Sourdough Bread", detail: "Bakery section", addedBy: "Sarah", avatar: "S", checked: false },
  { id: 4, name: "Greek Yogurt", detail: "Plain, low-fat", addedBy: "Me", avatar: "ME", checked: false },
];

const DataContext = createContext();

export function DataProvider({ children }) {
  const [pantryItems, setPantryItems] = useState(initialPantryItems);
  const [shoppingList, setShoppingList] = useState(initialShoppingList);
  const [notifications, setNotifications] = useState([
    { id: 1, type: "expiring", item: "Organic Whole Milk", msg: "Expires today! Use it for cereal or making a quick béchamel sauce.", time: "2h ago", section: "today", img: "🥛", actioned: false },
    { id: 2, type: "expired", item: "Greek Yogurt (500g)", msg: "Expired yesterday. Please check if it's still good or compost it.", time: "5h ago", section: "today", img: "🫙", actioned: false },
    { id: 3, type: "tip", item: "Freshness Tip", msg: "Store your tomatoes at room temperature to keep them flavorful longer!", time: "1d ago", section: "yesterday", img: null },
    { id: 4, type: "expiring", item: "Baby Spinach", msg: "Expiring in 2 days. Perfect for a morning smoothie!", time: "1d ago", section: "yesterday", img: "🥬", actioned: false },
  ]);

  const addItem = (item) => {
    setPantryItems(prev => [...prev, { ...item, id: Date.now() }]);
  };

  const removeItem = (id) => {
    setPantryItems(prev => prev.filter(i => i.id !== id));
  };

  const toggleShoppingItem = (id) => {
    setShoppingList(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  const addShoppingItem = (name) => {
    setShoppingList(prev => [...prev, { id: Date.now(), name, detail: "", addedBy: "Me", avatar: "ME", checked: false }]);
  };

  const removeShoppingItem = (id) => {
    setShoppingList(prev => prev.filter(i => i.id !== id));
  };

  const actionNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const fresh = pantryItems.filter(i => i.status === "fresh").length;
  const warning = pantryItems.filter(i => i.status === "warning" || i.status === "expiring").length;
  const expired = pantryItems.filter(i => i.status === "expired").length;
  const fridgeItems = pantryItems.filter(i => i.zone === "Fridge").length;
  const pantryZoneItems = pantryItems.filter(i => i.zone === "Pantry").length;

  return (
    <DataContext.Provider value={{
      pantryItems, shoppingList, notifications,
      addItem, removeItem, toggleShoppingItem, addShoppingItem, removeShoppingItem, actionNotification,
      fresh, warning, expired, fridgeItems, pantryZoneItems
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
