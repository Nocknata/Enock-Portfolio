
import { useTranslation } from "react-i18next";

function About() {
  const { i18n } = useTranslation();
  const isFrench = i18n.resolvedLanguage === "fr";

  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-heading">
          <p className="section-label">
            {isFrench ? "À PROPOS DE MOI" : "GET TO KNOW ME"}
          </p>

          <h2>
            {isFrench
              ? "Passionné par les données. Motivé par leur impact."
              : "Curious about data. Driven by impact."}
          </h2>
        </div>

        <div className="about-layout">
          <div className="about-content">
            <h3>
              {isFrench
                ? "Bonjour, je suis Enock."
                : "A little about me."}
            </h3>

            <p>
              {isFrench
                ? "Je suis étudiant en Data Science & Analytics à Kennesaw State University, où je poursuis également une mineure en santé publique."
                : "I'm a Data Science & Analytics student at Kennesaw State University, also pursuing a minor in Public Health."}
            </p>

            <p>
              {isFrench
                ? "Je m'intéresse à la manière dont les données, les statistiques et l'apprentissage automatique peuvent nous aider à comprendre des problèmes complexes et à prendre de meilleures décisions."
                : "I'm interested in how data, statistics, and machine learning can help us understand complex problems and make better decisions."}
            </p>

            <p>
              {isFrench
                ? "À travers mes projets, je développe des compétences en analyse de données, modélisation prédictive, visualisation et développement de solutions fondées sur les données. Je m'intéresse particulièrement aux applications dans les domaines de la santé et de la santé publique."
                : "Through hands-on projects, I develop skills in data analysis, predictive modeling, visualization, and building data-driven solutions. I'm especially interested in applications involving healthcare and public health."}
            </p>
          </div>

          <div className="about-highlights">
            <div className="about-highlight-card">
              <span className="about-highlight-icon">🎓</span>
              <h4>
                {isFrench ? "Formation" : "Education"}
              </h4>
              <p>Kennesaw State University</p>
              <small>
                {isFrench
                  ? "Licence en Data Science & Analytics"
                  : "B.S. in Data Science & Analytics"}
              </small>
            </div>

            <div className="about-highlight-card">
              <span className="about-highlight-icon">🧠</span>
              <h4>
                {isFrench
                  ? "Domaines d'intérêt"
                  : "Areas of Interest"}
              </h4>
              <p>
                {isFrench
                  ? "Machine Learning & Analytique"
                  : "Machine Learning & Analytics"}
              </p>
              <small>
                {isFrench
                  ? "Santé • Santé publique • Modélisation"
                  : "Healthcare • Public Health • Modeling"}
              </small>
            </div>

            <div className="about-highlight-card">
              <span className="about-highlight-icon">💻</span>
              <h4>
                {isFrench
                  ? "Compétences techniques"
                  : "Technical Skills"}
              </h4>
              <p>Python • SQL • R • Power BI</p>
              <small>
                {isFrench
                  ? "Analyse • Visualisation • Machine Learning"
                  : "Analytics • Visualization • Machine Learning"}
              </small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
