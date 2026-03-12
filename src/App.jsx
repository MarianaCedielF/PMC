import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "./i18n";
import { DataProvider } from "./data";
import BottomNav from "./components/BottomNav";
import LangToggle from "./components/LangToggle";
import Home from "./screens/Home";
import Inventory from "./screens/Inventory";
import AddProduct from "./screens/AddProduct";
import Alerts from "./screens/Alerts";
import Profile from "./screens/Profile";
import "./App.css";

function AppLayout() {
  return (
    <div className="app-shell">
      <LangToggle />
      <div className="mobile-frame">
        <div className="mobile-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/add" element={<AddProduct />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/profile" element={<Profile />} />
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
