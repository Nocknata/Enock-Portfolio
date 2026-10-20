
import { useState } from "react";
import { useTranslation } from "react-i18next";

function Navbar({ theme, toggleTheme }) {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isFrench = i18n.resolvedLanguage === "fr";

  function changeLanguage(language) {
    i18n.changeLanguage(language);
    localStorage.setItem("portfolio-language", language);
  }

  const navLinks = [
    { href: "#home", label: t("nav.home") },
    { href: "#about", label: t("nav.about") },
    { href: "#projects", label: t("nav.projects") },
    { href: "#skills", label: t("nav.skills") },
    { href: "#experience", label: t("nav.experience") },
    { href: "#contact", label: t("nav.contact") },
  ];

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">

        <a
          href="#home"
          className="navbar-brand"
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-mark">
            EK<span className="brand-dot">.</span>
          </span>

          <span className="brand-name">
            Enock Kanyinda
          </span>
        </a>

        <div
          id="portfolio-mobile-nav"
          className={
            menuOpen
              ? "navbar-links mobile-open"
              : "navbar-links"
          }
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="navbar-actions">
          <div
            className="language-switcher"
            role="group"
            aria-label="Website language"
          >
            <button
              type="button"
              className={!isFrench ? "active" : ""}
              onClick={() => changeLanguage("en")}
              aria-pressed={!isFrench}
            >
              EN
            </button>

            <button
              type="button"
              className={isFrench ? "active" : ""}
              onClick={() => changeLanguage("fr")}
              aria-pressed={isFrench}
            >
              FR
            </button>
          </div>

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() =>
              setMenuOpen((current) => !current)
            }
            aria-expanded={menuOpen}
            aria-controls="portfolio-mobile-nav"
            aria-label={
              menuOpen
                ? isFrench
                  ? "Fermer le menu"
                  : "Close menu"
                : isFrench
                ? "Ouvrir le menu"
                : "Open menu"
            }
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

      </nav>
    </header>
  );
}

export default Navbar;
