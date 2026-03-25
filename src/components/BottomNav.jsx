import { useNavigate, useLocation } from "react-router-dom";
import { useLang } from "../i18n";
import { usePermissions } from "../auth";
import { Home, Package, Bell, User, Plus, Lock } from "lucide-react";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLang();
  const perms = usePermissions();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bottom-nav">
      <button className={`nav-btn ${isActive("/") ? "nav-active" : ""}`} onClick={() => navigate("/")}>
        <Home size={22} />
        <span>{t("home")}</span>
      </button>
      <button className={`nav-btn ${isActive("/inventory") ? "nav-active" : ""}`} onClick={() => navigate("/inventory")}>
        <Package size={22} />
        <span>{t("inventory")}</span>
      </button>
      <button className="nav-btn nav-add" onClick={() => navigate("/add")}>
        <div className="nav-plus-circle" style={!perms.addProducts ? { background: "#9ca3af" } : {}}>
          {perms.addProducts ? <Plus size={24} color="white" /> : <Lock size={18} color="white" />}
        </div>
      </button>
      <button className={`nav-btn ${isActive("/alerts") ? "nav-active" : ""}`} onClick={() => navigate("/alerts")}>
        <Bell size={22} />
        <span>{t("alerts")}</span>
      </button>
      <button className={`nav-btn ${isActive("/profile") ? "nav-active" : ""}`} onClick={() => navigate("/profile")}>
        <User size={22} />
        <span>{t("profile")}</span>
      </button>
    </div>
  );
}
