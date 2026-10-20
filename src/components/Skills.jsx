
import { useTranslation } from "react-i18next";

function Skills() {
  const { i18n } = useTranslation();
  const isFrench = i18n.resolvedLanguage === "fr";

  const skillCategories = [
    {
      icon: "💻",
      title: isFrench
        ? "Programmation & Bases de données"
        : "Programming & Databases",
      skills: [
        "Python",
        "SQL",
        "R",
        "Java",
        "PostgreSQL",
        "MySQL",
      ],
    },
    {
      icon: "📊",
      title: isFrench
        ? "Analyse & Visualisation"
        : "Analytics & Visualization",
      skills: [
        "Pandas",
        "NumPy",
        "Power BI",
        "Excel",
        "SAS",
        "Matplotlib",
      ],
    },
    {
      icon: "🧠",
      title: isFrench
        ? "Apprentissage automatique"
        : "Machine Learning",
      skills: [
        "Scikit-learn",
        "Regression",
        "Classification",
        "Feature Engineering",
        "Model Evaluation",
      ],
    },
    {
      icon: "🛠️",
      title: isFrench
        ? "Développement & Outils"
        : "Development & Tools",
      skills: [
        "FastAPI",
        "React",
        "Git",
        "VS Code",
        "REST APIs",
        "Supabase",
      ],
    },
  ];

  return (
    <section className="skills-section" id="skills">
      <div className="skills-container">
        <div className="skills-header">
          <p className="section-label">
            {isFrench
              ? "COMPÉTENCES TECHNIQUES"
              : "TECHNICAL EXPERTISE"}
          </p>

          <h2>
            {isFrench
              ? "Les outils derrière mes projets."
              : "The tools behind my work."}
          </h2>

          <p>
            {isFrench
              ? "Les technologies que j'utilise pour analyser des données, développer des modèles et créer des solutions."
              : "Technologies I use to analyze data, develop models, and build practical solutions."}
          </p>
        </div>

        <div className="skills-grid">
          {skillCategories.map((category) => (
            <div
              className="skill-category-card"
              key={category.title}
            >
              <div className="skill-category-icon">
                {category.icon}
              </div>

              <h3>{category.title}</h3>

              <div className="skill-tags">
                {category.skills.map((skill) => (
                  <span className="skill-tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
