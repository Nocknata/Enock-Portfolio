
import { useTranslation } from "react-i18next";

function Experience() {
  const { i18n } = useTranslation();
  const isFrench = i18n.resolvedLanguage === "fr";

  const experiences = [
    {
      id: 1,
      type: "internship",
      role: isFrench
        ? "Stagiaire en analyse de données de santé"
        : "Healthcare Data Analytics Intern",
      organization: isFrench
        ? "Organisation de santé confidentielle"
        : "Confidential Healthcare Organization",
      location: isFrench
        ? "Lieu non communiqué"
        : "Location Not Disclosed",
      period: isFrench ? "Stage" : "Internship",
      description: isFrench
        ? "Participation à la collecte, au nettoyage et à l'organisation de données de santé pour soutenir les analyses et les rapports. Utilisation d'Excel et de SQL pour examiner les données, identifier les tendances, vérifier leur qualité et contribuer à la création de tableaux de bord facilitant la prise de décision."
        : "Assisted with collecting, cleaning, and organizing healthcare data to support reporting and analysis. Used Excel and SQL to examine datasets, identify trends, perform data quality checks, and contribute to dashboards supporting operational decision-making.",
      skills: [
        "Healthcare Analytics",
        "SQL",
        "Excel",
        "Data Cleaning",
        "Data Visualization",
        "Reporting",
      ],
    },
    {
      id: 2,
      type: "project",
      role: isFrench
        ? "Analyste de données — Projet indépendant"
        : "Data Analyst — Independent Project",
      organization: isFrench
        ? "Prévision de la demande des taxis de New York"
        : "NYC Taxi Demand Forecasting",
      location: isFrench
        ? "Projet indépendant"
        : "Independent Project",
      period: "2026",
      description: isFrench
        ? "Développement d'un projet d'analyse prédictive à partir de données réelles de taxis de New York. Nettoyage et transformation des données, création de variables temporelles et évaluation de modèles de prévision. Obtention d'un RMSE de 10,53 contre 17,24 pour le modèle de référence."
        : "Developed a predictive analytics project using real-world NYC taxi trip data. Performed data cleaning, aggregation, time-based feature engineering, and model evaluation. Achieved an RMSE of 10.53 compared with a baseline RMSE of 17.24.",
      skills: [
        "Python",
        "Pandas",
        "Machine Learning",
        "Feature Engineering",
        "Predictive Analytics",
      ],
    },
    {
      id: 3,
      type: "employment",
      role: isFrench
        ? "Assistant étudiant — Centre étudiant"
        : "Student Assistant — Student Center",
      organization: "Kennesaw State University",
      location: "Marietta Campus",
      period: isFrench ? "Actuellement" : "Present",
      description: isFrench
        ? "Soutien aux opérations du centre étudiant, accueil des visiteurs et assistance aux étudiants dans leurs démarches et demandes d'information."
        : "Support student center operations, assist visitors, and help students access campus services and information.",
      skills: [
        "Communication",
        "Customer Service",
        "Problem Solving",
      ],
    },
  ];

  function getExperienceType(type) {
    if (type === "internship") {
      return isFrench ? "STAGE" : "INTERNSHIP";
    }

    if (type === "project") {
      return isFrench
        ? "PROJET INDÉPENDANT"
        : "INDEPENDENT PROJECT";
    }

    return isFrench
      ? "EXPÉRIENCE PROFESSIONNELLE"
      : "PROFESSIONAL EXPERIENCE";
  }

  return (
    <section className="experience-section" id="experience">
      <div className="experience-container">
        <div className="experience-header">
          <p className="section-label">
            {isFrench ? "MON PARCOURS" : "MY JOURNEY"}
          </p>

          <h2>
            {isFrench
              ? "Expérience & Projets appliqués."
              : "Experience & Applied Work."}
          </h2>

          <p>
            {isFrench
              ? "Mon expérience professionnelle et mes projets pratiques en analyse de données."
              : "My professional experience and hands-on data analytics projects."}
          </p>
        </div>

        <div className="experience-timeline">
          {experiences.map((experience) => (
            <article
              className="experience-card"
              key={experience.id}
            >
              <span className="experience-dot" />

              <div className="experience-card-header">
                <div>
                  <span className="experience-type">
                    {getExperienceType(experience.type)}
                  </span>

                  <h3>{experience.role}</h3>

                  <p className="experience-organization">
                    {experience.organization}
                  </p>
                </div>

                <span className="experience-period">
                  {experience.period}
                </span>
              </div>

              <p className="experience-location">
                {experience.type === "internship"
                  ? "🏥"
                  : experience.type === "project"
                  ? "💻"
                  : "📍"}{" "}
                {experience.location}
              </p>

              <p className="experience-description">
                {experience.description}
              </p>

              <div className="experience-skills">
                {experience.skills.map((skill) => (
                  <span
                    className="experience-skill-tag"
                    key={skill}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Experience;
