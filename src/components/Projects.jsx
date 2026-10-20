
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProjectCard from "./ProjectCard";

function Projects() {
  const { i18n } = useTranslation();
  const isFrench = i18n.resolvedLanguage === "fr";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchProjects() {
      setLoading(true);
      setError("");

      try {
        // Load Supabase only when this component runs.
        const { supabase } = await import(
          "../lib/supabaseClient"
        );

        if (!active) return;

        const { data, error: fetchError } =
          await supabase
            .from("projects")
            .select(`
              id,
              title,
              title_fr,
              description,
              description_fr,
              technologies,
              status,
              image_url,
              github_url,
              demo_url
            `)
            .eq("is_published", true)
            .order("created_at", {
              ascending: false,
            });

        if (fetchError) {
          throw fetchError;
        }

        if (active) {
          setProjects(
            (data || []).map((project) => ({
              ...project,
              technologies:
                project.technologies || [],
              icon: "📊",
            }))
          );
        }
      } catch (err) {
        if (active) {
          console.error(
            "Failed to load projects:",
            err
          );

          setError(
            err.message ||
              "Failed to load projects."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchProjects();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      className="projects-section"
      id="projects"
    >
      <div className="projects-header">

        <p className="section-label">
          {isFrench
            ? "MES RÉALISATIONS"
            : "SELECTED WORK"}
        </p>

        <h2>
          {isFrench
            ? "Des données aux résultats."
            : "From data to impact."}
        </h2>

        <p>
          {isFrench
            ? "Une sélection de projets où j'utilise la science des données, l'apprentissage automatique et l'analyse pour résoudre des problèmes concrets."
            : "A selection of projects where I apply data science, machine learning, and analytics to solve real-world problems."}
        </p>

      </div>

      {loading ? (
        <p className="projects-message">
          {isFrench
            ? "Chargement des projets..."
            : "Loading projects..."}
        </p>
      ) : error ? (
        <p
          className="projects-message"
          role="alert"
        >
          {isFrench
            ? "Impossible de charger les projets."
            : "Unable to load projects."}
        </p>
      ) : projects.length === 0 ? (
        <p className="projects-message">
          {isFrench
            ? "De nouveaux projets seront bientôt disponibles."
            : "New projects are coming soon."}
        </p>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Projects;
