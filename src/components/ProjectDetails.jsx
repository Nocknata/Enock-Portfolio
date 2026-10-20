
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabaseClient";
import ProjectMetricsChart from "./ProjectMetricsChart";

// =========================================
// FORMAT BOLD TEXT
// =========================================

function renderInlineText(text) {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, index) => {
      if (
        part.startsWith("**") &&
        part.endsWith("**")
      ) {
        return (
          <strong key={index}>
            {part.slice(2, -2)}
          </strong>
        );
      }

      return part;
    });
}

// =========================================
// FORMAT PARAGRAPHS AND LISTS
// =========================================

function renderCaseStudyContent(content) {
  if (!content) return null;

  const lines = String(content)
    .replace(/\r\n?/g, "\n")
    .split("\n");

  const blocks = [];

  let paragraph = [];
  let list = [];
  let listType = null;
  let blockKey = 0;

  function flushParagraph() {
    if (paragraph.length === 0) return;

    blocks.push(
      <p
        key={`paragraph-${blockKey++}`}
        className="case-study-paragraph"
      >
        {renderInlineText(paragraph.join(" "))}
      </p>
    );

    paragraph = [];
  }

  function flushList() {
    if (list.length === 0) return;

    const ListTag =
      listType === "ordered" ? "ol" : "ul";

    blocks.push(
      <ListTag
        key={`list-${blockKey++}`}
        className="case-study-list"
      >
        {list.map((item, index) => (
          <li key={index}>
            {renderInlineText(item)}
          </li>
        ))}
      </ListTag>
    );

    list = [];
    listType = null;
  }

  lines.forEach((originalLine) => {
    const line = originalLine.trim();

    // Empty line starts a new paragraph
    if (!line) {
      flushParagraph();
      flushList();
      return;
    }

    // Bullet list: - Item or * Item
    const bulletMatch = line.match(
      /^[-*]\s+(.+)$/
    );

    // Numbered list: 1. Item or 1) Item
    const numberedMatch = line.match(
      /^\d+[.)]\s+(.+)$/
    );

    if (bulletMatch || numberedMatch) {
      flushParagraph();

      const nextType = numberedMatch
        ? "ordered"
        : "unordered";

      if (
        list.length > 0 &&
        listType !== nextType
      ) {
        flushList();
      }

      listType = nextType;

      list.push(
        bulletMatch
          ? bulletMatch[1]
          : numberedMatch[1]
      );

      return;
    }

    // Regular paragraph text
    flushList();
    paragraph.push(line);
  });

  flushParagraph();
  flushList();

  return blocks;
}

// =========================================
// PROJECT DETAILS COMPONENT
// =========================================

function ProjectDetails() {
  const { id } = useParams();

  const { i18n } = useTranslation();

  const isFrench =
    i18n.resolvedLanguage === "fr";

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // FETCH PROJECT FROM SUPABASE
  // =========================================

  useEffect(() => {
    let active = true;

    async function fetchProject() {
      setLoading(true);
      setError("");

      try {
        const {
          data,
          error: fetchError,
        } = await supabase
          .from("projects")
          .select("*")
          .eq("id", id)
          .eq("is_published", true)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        if (active) {
          setProject(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err.message ||
              "Unable to load project."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchProject();

    return () => {
      active = false;
    };
  }, [id]);

  // =========================================
  // LOADING STATE
  // =========================================

  if (loading) {
    return (
      <main className="project-details">
        <p>
          {isFrench
            ? "Chargement du projet..."
            : "Loading project..."}
        </p>
      </main>
    );
  }

  // =========================================
  // PROJECT NOT FOUND
  // =========================================

  if (error || !project) {
    return (
      <main className="project-details">
        <h1>
          {isFrench
            ? "Projet introuvable"
            : "Project not found"}
        </h1>

        <Link to="/">
          {isFrench
            ? "Retour à l'accueil"
            : "Back to Home"}
        </Link>
      </main>
    );
  }

  // =========================================
  // BILINGUAL PROJECT CONTENT
  // =========================================

  function getLocalizedContent(field) {
    const englishContent = project[field];

    if (isFrench) {
      const frenchContent =
        project[`${field}_fr`];

      if (
        typeof frenchContent === "string" &&
        frenchContent.trim() !== ""
      ) {
        return frenchContent;
      }
    }

    return englishContent ?? "";
  }

  // =========================================
  // PROJECT STATUS
  // =========================================

  const statusLabels = {
    in_progress: isFrench
      ? "En cours"
      : "In Progress",

    completed: isFrench
      ? "Terminé"
      : "Completed",

    coming_soon: isFrench
      ? "Bientôt disponible"
      : "Coming Soon",
  };

  // =========================================
  // CASE STUDY SECTIONS
  // =========================================

  const caseStudySections = [
    {
      key: "problem_statement",
      title: isFrench
        ? "Problématique"
        : "Problem Statement",
    },
    {
      key: "dataset_description",
      title: isFrench
        ? "Description des données"
        : "Dataset Description",
    },
    {
      key: "data_preparation",
      title: isFrench
        ? "Préparation des données"
        : "Data Preparation",
    },
    {
      key: "methodology",
      title: isFrench
        ? "Méthodologie"
        : "Methodology",
    },
    {
      key: "models_used",
      title: isFrench
        ? "Modèles d'apprentissage automatique"
        : "Machine Learning Models",
    },
    {
      key: "evaluation_metrics",
      title: isFrench
        ? "Évaluation du modèle"
        : "Model Evaluation",
    },
    {
      key: "key_findings",
      title: isFrench
        ? "Principaux résultats"
        : "Key Findings",
    },
    {
      key: "future_improvements",
      title: isFrench
        ? "Améliorations futures"
        : "Future Improvements",
    },
  ];

  // =========================================
  // METRICS FROM SUPABASE
  // =========================================

  const savedMetrics = Array.isArray(
    project.case_study_metrics
  )
    ? project.case_study_metrics
    : [];

  const modelRMSE = savedMetrics.find(
    (metric) =>
      metric.label?.trim().toLowerCase() ===
      "model rmse"
  );

  const baselineRMSE = savedMetrics.find(
    (metric) =>
      metric.label?.trim().toLowerCase() ===
      "baseline rmse"
  );

  const modelValue = Number(modelRMSE?.value);
  const baselineValue = Number(
    baselineRMSE?.value
  );

  const hasRMSEComparison =
    modelRMSE != null &&
    baselineRMSE != null &&
    Number.isFinite(modelValue) &&
    Number.isFinite(baselineValue) &&
    modelValue >= 0 &&
    baselineValue > 0;

  const rmseReduction = hasRMSEComparison
    ? (
        (baselineValue - modelValue) /
        baselineValue
      ) * 100
    : null;

  // =========================================
  // TRANSLATE METRIC LABELS
  // =========================================

  const metricLabel = (label) => {
    if (!isFrench) return label;

    const labels = {
      "model rmse": "RMSE du modèle",
      "baseline rmse":
        "RMSE du modèle de référence",
    };

    return (
      labels[label?.trim().toLowerCase()] ||
      label
    );
  };

  // =========================================
  // PUBLIC CASE STUDY PAGE
  // =========================================

  return (
    <main className="project-details">

      {/* BACK LINK */}
      <Link
        to="/"
        className="project-back-link"
      >
        ←{" "}
        {isFrench
          ? "Retour aux projets"
          : "Back to Projects"}
      </Link>

      {/* PROJECT HEADER */}
      <header className="project-details-header">

        <span className="project-status">
          {statusLabels[project.status] ||
            project.status}
        </span>

        <h1>
          {getLocalizedContent("title")}
        </h1>

        <p>
          {getLocalizedContent("description")}
        </p>

      </header>

      {/* PROJECT IMAGE */}
      {project.image_url && (
        <img
          src={project.image_url}
          alt={`${getLocalizedContent(
            "title"
          )} cover`}
          className="project-details-image"
        />
      )}

      {/* TECHNOLOGIES */}
      {Array.isArray(project.technologies) &&
        project.technologies.length > 0 && (

          <section className="project-details-section">

            <h2>
              {isFrench
                ? "Technologies"
                : "Technologies Used"}
            </h2>

            <div className="project-tech">
              {project.technologies.map(
                (tech) => (
                  <span key={tech}>
                    {tech}
                  </span>
                )
              )}
            </div>

          </section>
        )}

      {/* PROJECT OVERVIEW */}
      <section className="project-details-section">

        <h2>
          {isFrench
            ? "Présentation du projet"
            : "Project Overview"}
        </h2>

        <div
          className="case-study-text case-study-rich-text"
          style={{ textAlign: "left" }}
        >
          {renderCaseStudyContent(
            getLocalizedContent("description")
          )}
        </div>

      </section>

      {/* =====================================
          MODEL PERFORMANCE
          ===================================== */}

      {savedMetrics.length > 0 && (

        <section className="project-details-section">

          <h2>
            {isFrench
              ? "Performance du modèle"
              : "Model Performance"}
          </h2>

          <div className="performance-metrics-grid">

            {savedMetrics.map(
              (metric, index) => (

                <div
                  className="performance-metric-card"
                  key={index}
                >
                  <p className="performance-metric-label">
                    {metricLabel(metric.label)}
                  </p>

                  <h3 className="performance-metric-value">
                    {metric.value}

                    {metric.unit && (
                      <span className="performance-metric-unit">
                        {" "}
                        {metric.unit}
                      </span>
                    )}
                  </h3>

                </div>

              )
            )}

            {/* AUTOMATIC RMSE REDUCTION */}
            {hasRMSEComparison && (

              <div className="performance-metric-card">

                <p className="performance-metric-label">
                  {isFrench
                    ? "Réduction du RMSE"
                    : "RMSE Reduction"}
                </p>

                <h3 className="performance-metric-value">
                  {rmseReduction.toFixed(1)}%
                </h3>

              </div>
            )}

          </div>

          {/* COMPARISON CHART */}
          <ProjectMetricsChart
            metrics={savedMetrics}
          />

        </section>
      )}

      {/* =====================================
          DETAILED RESEARCH SECTIONS
          ===================================== */}

      {caseStudySections
        .filter((section) => {
          const content =
            getLocalizedContent(section.key);

          return (
            typeof content === "string" &&
            content.trim().length > 0
          );
        })
        .map((section) => (

          <section
            className="project-details-section"
            key={section.key}
          >

            <h2>{section.title}</h2>

            <div
              className="case-study-text case-study-rich-text"
              style={{ textAlign: "left" }}
            >
              {renderCaseStudyContent(
                getLocalizedContent(section.key)
              )}
            </div>

          </section>

        ))}

      {/* =====================================
          PROJECT LINKS
          ===================================== */}

      {(project.github_url ||
        project.demo_url) && (

        <div className="project-links">

          {project.github_url && (

            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              {isFrench
                ? "Voir le code"
                : "View Code"}{" "}
              ↗
            </a>

          )}

          {project.demo_url && (

            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              {isFrench
                ? "Démo"
                : "Live Demo"}{" "}
              ↗
            </a>

          )}

        </div>

      )}

    </main>
  );
}

export default ProjectDetails;
