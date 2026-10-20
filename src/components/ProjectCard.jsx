
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function ProjectCard({ project }) {
  const { i18n } = useTranslation();
  const isFrench = i18n.resolvedLanguage === "fr";

  function getLocalizedContent(field) {
    const englishContent = project[field];

    if (isFrench) {
      const frenchContent = project[`${field}_fr`];

      if (
        typeof frenchContent === "string" &&
        frenchContent.trim() !== ""
      ) {
        return frenchContent;
      }
    }

    return englishContent ?? "";
  }

  const statusLabels = {
    completed: isFrench ? "Terminé" : "Completed",
    in_progress: isFrench ? "En cours" : "In Progress",
    coming_soon: isFrench
      ? "Bientôt disponible"
      : "Coming Soon",
  };

  const projectTitle = getLocalizedContent("title");
  const projectDescription = getLocalizedContent("description");

  return (
    <article className="project-card">
      {/* PROJECT IMAGE */}
      <div className="project-image">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={
              isFrench
                ? `Illustration du projet ${projectTitle}`
                : `${projectTitle} project screenshot`
            }
            className="project-cover-image"
            loading="lazy"
          />
        ) : (
          <div className="project-placeholder">
            {project.icon || "📊"}
          </div>
        )}
      </div>

      {/* PROJECT INFORMATION */}
      <div className="project-info">
        <span className="project-status">
          {statusLabels[project.status] ||
            project.status?.replaceAll("_", " ")}
        </span>

        <h3>{projectTitle}</h3>

        <p>{projectDescription}</p>

        {/* TECHNOLOGIES */}
        <div className="project-tech">
          {(project.technologies || []).map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>

        {/* CASE STUDY */}
        <Link
          to={`/projects/${project.id}`}
          className="project-case-study-btn"
        >
          {isFrench
            ? "Voir l'étude de cas →"
            : "View Case Study →"}
        </Link>

        {/* GITHUB AND DEMO LINKS */}
        {(project.github_url || project.demo_url) && (
          <div className="project-links">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
              >
                {isFrench ? "Voir le code" : "View Code"} ↗
              </a>
            )}

            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
              >
                {isFrench ? "Démo en direct" : "Live Demo"} ↗
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default ProjectCard;
