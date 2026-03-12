import { useLang } from "../i18n";

export default function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="lang-toggle-inline">
      <button className={`lang-btn ${lang === "en" ? "lang-active" : ""}`} onClick={() => setLang("en")}>EN</button>
      <button className={`lang-btn ${lang === "es" ? "lang-active" : ""}`} onClick={() => setLang("es")}>ES</button>
    </div>
  );
}