/** @format */
import { Link } from "react-router-dom";

export default function Header({ lang, setLang }) {
  return (
    <div className="header">
      <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
        <div className="logos">
          <img src="/logos/samdaqu.png" alt="SamDAQU Logo" />
          <img src="/logos/workshop.png" alt="Workshop Logo" />
          <img src="/logos/setsudai.jpg" alt="Setsudai Logo" />
        </div>
        <h1>GWS 2025 Schedule</h1>
        <p>PROGRAMME SCHEDULE</p>
        <p className="italic" style={{ textDecoration: "none" }}>
          GEOSYMBIOTIC WORKSHOP 2025
        </p>
      </Link>

      {/* Lang Switch */}
      <div className="lang-switch">
        <button
          className={lang === "uz" ? "active" : ""}
          onClick={() => setLang("uz")}>
          🇺🇿 Uzbek
        </button>
        <button
          className={lang === "ja" ? "active" : ""}
          onClick={() => setLang("ja")}>
          🇯🇵 日本語
        </button>
        <button
          className={lang === "en" ? "active" : ""}
          onClick={() => setLang("en")}>
          🇬🇧 English
        </button>
      </div>
    </div>
  );
}
