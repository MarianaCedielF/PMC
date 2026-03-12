import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "./i18n";
import { DataProvider } from "./data";
import BottomNav from "./components/BottomNav";
import Home from "./screens/Home";
import Inventory from "./screens/Inventory";
import AddProduct from "./screens/AddProduct";
import Alerts from "./screens/Alerts";
import Profile from "./screens/Profile";
import Recipes from "./screens/Recipes";
import "./App.css";

function AppLayout() {
  return (
    <div className="app-shell">
      <div className="mobile-frame">
        <div className="mobile-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/add" element={<AddProduct />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/recipes" element={<Recipes />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <DataProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </DataProvider>
    </LangProvider>
  );
}
