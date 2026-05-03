import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "./i18n";
import { DataProvider } from "./data";
import { AuthProvider, useAuth } from "./auth";
import BottomNav from "./components/BottomNav";
import Home from "./screens/Home";
import Inventory from "./screens/Inventory";
import AddProduct from "./screens/AddProduct";
import Alerts from "./screens/Alerts";
import Profile from "./screens/Profile";
import Recipes from "./screens/Recipes";
import RecipeDetail from "./screens/RecipeDetail";
import Supermarket from "./screens/Supermarket";
import Login from "./screens/Login";
import Register from "./screens/Register";
import "./App.css";

function AuthLayout() {
  return (
    <div className="app-shell">
      <div className="mobile-frame">
        <div className="mobile-content">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

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
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/supermarket" element={<Supermarket />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </div>
  );
}

function AppGate() {
  const { user } = useAuth();
  return user ? <AppLayout /> : <AuthLayout />;
}

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <AppGate />
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </LangProvider>
  );
}
