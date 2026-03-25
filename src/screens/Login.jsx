import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [errors,   setErrors]   = useState({});

  const validate = () => {
    const e = {};
    if (!email.trim())    e.email    = "El correo es obligatorio.";
    if (!password)        e.password = "La contraseña es obligatoria.";
    return e;
  };

  const handleLogin = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});

    const result = login(email, password);
    if (result.error === "no_user") {
      setErrors({ email: "No existe ninguna cuenta con ese correo." });
    } else if (result.error === "password") {
      setErrors({ password: "Contraseña incorrecta. Inténtalo de nuevo." });
    }
  };

  return (
    <div
      className="screen"
      style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100%", padding: "0 4px" }}
    >
      {/* Branding */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>🥗</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: "var(--green-dark)" }}>FreshKeeper</div>
        <div style={{ fontSize: 13, color: "var(--text-sub)", marginTop: 4 }}>
          Gestiona tu despensa con facilidad
        </div>
      </div>

      {/* Card */}
      <div style={{ background: "white", borderRadius: 20, padding: "24px 20px", boxShadow: "var(--shadow)" }}>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: "var(--text)" }}>
          Iniciar sesión
        </div>

        <div className="form-field">
          <label className="field-label">Correo electrónico</label>
          <input
            className={`field-input${errors.email ? " input-error" : ""}`}
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>

        <div className="form-field">
          <label className="field-label">Contraseña</label>
          <input
            className={`field-input${errors.password ? " input-error" : ""}`}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
          />
          {errors.password && <div className="field-error">{errors.password}</div>}
        </div>

        <button className="save-btn" style={{ marginTop: 8 }} onClick={handleLogin}>
          Entrar
        </button>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "var(--text-sub)" }}>
          ¿No tienes cuenta?{" "}
          <button
            onClick={() => navigate("/register")}
            style={{ background: "none", border: "none", color: "var(--green-dark)", fontWeight: 700, cursor: "pointer", fontSize: 13, padding: 0 }}
          >
            Crear cuenta
          </button>
        </div>
      </div>

      {/* Demo hint */}
      <div style={{ marginTop: 16, background: "#f0fdf4", border: "1.5px dashed var(--green)", borderRadius: 12, padding: "12px 14px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--green-dark)", marginBottom: 4 }}>
          Usuarios demo
        </div>
        <div style={{ fontSize: 12, color: "var(--text-sub)", lineHeight: 1.7 }}>
          alex@freshkeeper.com · <span style={{ fontFamily: "monospace" }}>demo123</span><br />
          sarah@freshkeeper.com · <span style={{ fontFamily: "monospace" }}>demo123</span><br />
          david@freshkeeper.com · <span style={{ fontFamily: "monospace" }}>demo123</span>
        </div>
      </div>
    </div>
  );
}
