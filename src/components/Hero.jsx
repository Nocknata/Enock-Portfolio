
import { useTranslation } from "react-i18next";

function Hero() {
  const { t, i18n } = useTranslation();
  const isFrench = i18n.resolvedLanguage === "fr";

  const linkedinUrl =
    "https://www.linkedin.com/in/enock-kanyinda-522921348";

  const githubUrl =
    "https://github.com/Nocknata";

  return (
    <section className="hero" id="home">
      <div className="hero-content">

        {/* =====================================
            INTRODUCTION
            ===================================== */}

        <p className="hero-label">
          {t("hero.label")}
        </p>

        {/* NAME */}
        <h1>
          {t("hero.greeting")}{" "}
          <span>Enock Kanyinda.</span>
        </h1>

        {/* NEW PROFESSIONAL HOOK */}
        <h2>
          {isFrench
            ? "Des questions concrètes. Des données. Des réponses."
            : "Real questions. Real data. Meaningful answers."}
        </h2>

        {/* PERSONAL INTRODUCTION */}
        <p className="hero-description">
          {isFrench
            ? "Je suis étudiant en Data Science & Analytics à Kennesaw State University, avec une mineure en santé publique. À travers mes projets, j'utilise Python, SQL et la visualisation de données pour explorer des problèmes réels et en tirer des enseignements utiles."
            : "I'm a Data Science & Analytics student at Kennesaw State University, with a minor in Public Health. Through hands-on projects, I use Python, SQL, and data visualization to explore real-world problems and uncover useful insights."}
        </p>

        {/* =====================================
            HERO BUTTONS
            ===================================== */}

        <div className="hero-buttons">

          {/* VIEW PROJECTS */}
          <a
            href="#projects"
            className="primary-btn"
          >
            {t("hero.projectsButton")} →
          </a>

          {/* CONTACT */}
          <a
            href="#contact"
            className="secondary-btn"
          >
            {t("hero.contactButton")} ↗
          </a>

          {/* DOWNLOAD RESUME */}
          <a
            href="/resume.pdf"
            download="Enock_Kanyinda_Resume.pdf"
            className="secondary-btn"
          >
            ↓{" "}
            {isFrench
              ? "Télécharger mon CV"
              : "Download Résumé"}
          </a>

        </div>

        {/* =====================================
            SOCIAL LINKS
            ===================================== */}

        <div className="hero-socials">

          {/* LINKEDIN */}
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-social-link"
            aria-label="LinkedIn profile"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>

            <span>LinkedIn</span>
            <span aria-hidden="true">↗</span>
          </a>

          {/* GITHUB */}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-social-link"
            aria-label="GitHub profile"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 19 4.77 5.07 5.07 0 0 0 18.91 1S17.73.65 15 2.48a13.38 13.38 0 0 0-7 0C5.27.65 4.09 1 4.09 1A5.07 5.07 0 0 0 4 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8 18.13V22" />
            </svg>

            <span>GitHub</span>
            <span aria-hidden="true">↗</span>
          </a>

        </div>

        {/* =====================================
            PROFESSIONAL HIGHLIGHTS
            ===================================== */}

        <div className="hero-highlights">

          {/* UNIVERSITY */}
          <div className="hero-highlight">

            <span className="hero-highlight-icon">
              🎓
            </span>

            <div>
              <strong>
                Kennesaw State University
              </strong>

              <small>
                {isFrench
                  ? "Data Science & Analytics • Santé publique"
                  : "Data Science & Analytics • Public Health"}
              </small>
            </div>

          </div>

          {/* APPLIED PROJECTS */}
          <div className="hero-highlight">

            <span className="hero-highlight-icon">
              📊
            </span>

            <div>
              <strong>
                {isFrench
                  ? "Projets appliqués"
                  : "Applied Projects"}
              </strong>

              <small>
                Python • SQL • Machine Learning
              </small>
            </div>

          </div>

        </div>

      </div>

      {/* =====================================
          PROFESSIONAL PROFILE PHOTO
          ===================================== */}

      <div className="hero-photo">

       
<img
  src="/profile.webp"
  alt="Enock Kanyinda"
  width="600"
  height="750"
  loading="eager"
  fetchPriority="high"
  decoding="async"
/>


        {/* PHOTO OVERLAY */}
        <div className="hero-photo-overlay">

          <span className="hero-photo-dot" />

          <span>
            {isFrench
              ? "Data Science • Analytique de santé"
              : "Data Science • Healthcare Analytics"}
          </span>

        </div>

      </div>

    </section>
  );
}

export default Hero;
