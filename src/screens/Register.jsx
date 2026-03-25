import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../auth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form,   setForm]   = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) {
      e.name = "El nombre es obligatorio.";
    }
    if (!form.email.trim()) {
      e.email = "El correo es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = "Ingresa un correo electrónico válido.";
    }
    if (!form.password) {
      e.password = "La contraseña es obligatoria.";
    } else if (form.password.length < 6) {
      e.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    if (!form.confirm) {
      e.confirm = "Confirma tu contraseña.";
    } else if (form.password !== form.confirm) {
      e.confirm = "Las contraseñas no coinciden.";
    }
    return e;
  };

  const handleRegister = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});

    const result = register(form.name, form.email, form.password);
    if (result.error === "exists") {
      setErrors({ email: "Este correo ya está registrado. Inicia sesión." });
    }
    // Si success, AuthProvider actualiza user y App redirige automáticamente
  };

  return (
    <div className="screen">
      <div className="header header-simple">
        <button
          onClick={() => navigate("/login")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 6, display: "flex", alignItems: "center", color: "var(--text)" }}
        >
          <ArrowLeft size={22} />
        </button>
        <span className="page-title">Crear cuenta</span>
        <div style={{ width: 34 }} />
      </div>

      <div className="form-content">

        <Field label="Nombre completo" error={errors.name} required>
          <input
            className={`field-input${errors.name ? " input-error" : ""}`}
            placeholder="Tu nombre completo"
            value={form.name}
            onChange={set("name")}
            onKeyDown={e => e.key === "Enter" && handleRegister()}
          />
        </Field>

        <Field label="Correo electrónico" error={errors.email} required>
          <input
            className={`field-input${errors.email ? " input-error" : ""}`}
            type="email"
            placeholder="tu@correo.com"
            value={form.email}
            onChange={set("email")}
            onKeyDown={e => e.key === "Enter" && handleRegister()}
          />
        </Field>

        <Field label="Contraseña" error={errors.password} required hint="Mínimo 6 caracteres">
          <input
            className={`field-input${errors.password ? " input-error" : ""}`}
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={set("password")}
            onKeyDown={e => e.key === "Enter" && handleRegister()}
          />
        </Field>

        <Field label="Confirmar contraseña" error={errors.confirm} required>
          <input
            className={`field-input${errors.confirm ? " input-error" : ""}`}
            type="password"
            placeholder="Repite tu contraseña"
            value={form.confirm}
            onChange={set("confirm")}
            onKeyDown={e => e.key === "Enter" && handleRegister()}
          />
        </Field>

        <button className="save-btn" style={{ marginTop: 8 }} onClick={handleRegister}>
          Crear cuenta
        </button>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "var(--text-sub)" }}>
          ¿Ya tienes cuenta?{" "}
          <button
            onClick={() => navigate("/login")}
            style={{ background: "none", border: "none", color: "var(--green-dark)", fontWeight: 700, cursor: "pointer", fontSize: 13, padding: 0 }}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, hint, required, children }) {
  return (
    <div className="form-field">
      <label className="field-label">
        {label}
        {required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
        {hint && !error && (
          <span style={{ color: "var(--text-sub)", fontWeight: 400, fontSize: 11, marginLeft: 6 }}>
            ({hint})
          </span>
        )}
      </label>
      {children}
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}
