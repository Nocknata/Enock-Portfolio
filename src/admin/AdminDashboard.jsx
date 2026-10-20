
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

import AddProject from "./AddProject";
import EditProject from "./EditProject";
import DeleteProject from "./DeleteProject";
import ProjectImageUpload from "./ProjectImageUpload";
import CaseStudyEditor from "./CaseStudyEditor";
import CaseStudyMetricsEditor from "./CaseStudyMetricsEditor";
import ProjectTranslationEditor from "./ProjectTranslationEditor";

import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  // Sidebar navigation
  const [activeSection, setActiveSection] =
    useState("dashboard");

  const [signingOut, setSigningOut] = useState(false);

  // Projects from Supabase
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Refresh projects after changes
  const [refreshKey, setRefreshKey] = useState(0);

  // Selected projects for editors
  const [editingProject, setEditingProject] =
    useState(null);

  const [caseStudyProject, setCaseStudyProject] =
    useState(null);

  const [metricsProject, setMetricsProject] =
    useState(null);

  const [translationProject, setTranslationProject] =
    useState(null);

  // Refresh projects
  function refreshProjects() {
    setRefreshKey((current) => current + 1);
  }

  // Handle project updates
  function handleProjectUpdated() {
    setEditingProject(null);
    refreshProjects();
  }

  // Handle case study updates
  function handleCaseStudySaved() {
    setCaseStudyProject(null);
    refreshProjects();
  }

  // Handle project deletion
  function handleProjectDeleted(deletedId) {
    if (editingProject?.id === deletedId) {
      setEditingProject(null);
    }

    if (caseStudyProject?.id === deletedId) {
      setCaseStudyProject(null);
    }

    if (metricsProject?.id === deletedId) {
      setMetricsProject(null);
    }

    if (translationProject?.id === deletedId) {
      setTranslationProject(null);
    }

    setProjects((current) =>
      current.filter((project) => project.id !== deletedId)
    );

    refreshProjects();
  }

  // Load projects from Supabase
  useEffect(() => {
    let active = true;

    async function fetchProjects() {
      setLoading(true);
      setError("");

      try {
        const { data, error: fetchError } =
          await supabase
            .from("projects")
            .select(`
              id,
              title,
              status,
              is_published,
              image_url,
              github_url,
              demo_url,
              created_at,
              problem_statement,
              dataset_description,
              data_preparation,
              methodology,
              models_used,
              evaluation_metrics,
              key_findings,
              future_improvements,
              case_study_metrics,
              title_fr,
              description_fr,
              problem_statement_fr,
              dataset_description_fr,
              data_preparation_fr,
              methodology_fr,
              models_used_fr,
              evaluation_metrics_fr,
              key_findings_fr,
              future_improvements_fr
            `)
            .order("created_at", {
              ascending: false,
            });

        if (fetchError) {
          throw fetchError;
        }

        if (active) {
          setProjects(data || []);
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || "Failed to load projects."
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
  }, [refreshKey]);

  
  // Automatically scroll to the selected editor
  useEffect(() => {
    let editorId = null;

    if (editingProject) {
      editorId = "edit-project";
    } else if (caseStudyProject) {
      editorId = "case-study-editor";
    } else if (metricsProject) {
      editorId = "metrics-editor";
    } else if (translationProject) {
      editorId = "translation-editor";
    }

    if (!editorId) return;

    const frame = requestAnimationFrame(() => {
      document.getElementById(editorId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [
    editingProject,
    caseStudyProject,
    metricsProject,
    translationProject,
  ]);

  
  // Keep only one editor open at a time
  function openEditor(type, project) {
    setEditingProject(
      type === "project" ? project : null
    );

    setCaseStudyProject(
      type === "caseStudy" ? project : null
    );

    setMetricsProject(
      type === "metrics" ? project : null
    );

    setTranslationProject(
      type === "translation" ? project : null
    );
  }


  // Dashboard statistics
  const totalProjects = projects.length;

  const publishedProjects = projects.filter(
    (project) => project.is_published === true
  ).length;

  const draftProjects = projects.filter(
    (project) => project.is_published === false
  ).length;

  // Secure Supabase logout
  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);
    setError("");

    try {
      const { error: signOutError } =
        await supabase.auth.signOut();

      if (signOutError) {
        throw signOutError;
      }

      navigate("/admin/login", {
        replace: true,
      });
    } catch (err) {
      setError(err.message || "Unable to sign out.");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="admin-layout">

      {/* ==============================
          PREMIUM ADMIN SIDEBAR
          ============================== */}

      <aside className="admin-sidebar">

        {/* BRANDING */}
        <div className="admin-sidebar-top">
          <Link
            to="/"
            className="admin-brand"
          >
            <span className="admin-brand-logo">
              EK<span>.</span>
            </span>

            <span className="admin-brand-label">
              ADMIN WORKSPACE
            </span>
          </Link>
        </div>

        {/* NAVIGATION */}
        <div className="admin-sidebar-navigation">
          <p className="admin-menu-heading">
            WORKSPACE
          </p>

          <nav
            className="admin-menu"
            aria-label="Admin navigation"
          >

            <a
              href="#dashboard"
              className={
                activeSection === "dashboard"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection("dashboard")
              }
            >
              <span aria-hidden="true">▦</span>
              Overview
            </a>

            <a
              href="#projects"
              className={
                activeSection === "projects"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection("projects")
              }
            >
              <span aria-hidden="true">▤</span>
              Manage Projects
            </a>

            <a
              href="#add-project"
              className={
                activeSection === "add-project"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection("add-project")
              }
            >
              <span aria-hidden="true">＋</span>
              Add Project
            </a>

            <a
              href="#settings"
              className={
                activeSection === "settings"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection("settings")
              }
            >
              <span aria-hidden="true">⚙</span>
              Settings
            </a>

          </nav>
        </div>

        {/* SIDEBAR FOOTER */}
        <div className="admin-sidebar-bottom">

          <Link
            to="/"
            className="admin-view-portfolio"
          >
            ↗ View Portfolio
          </Link>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {signingOut
              ? "Signing out..."
              : "↪ Log Out"}
          </button>

          <p className="admin-sidebar-copyright">
            © {new Date().getFullYear()} Enock Kanyinda
          </p>

        </div>

      </aside>

      {/* ==============================
          MAIN ADMIN DASHBOARD
          ============================== */}

      <main
        className="admin-main"
        id="dashboard"
      >

        {/* HEADER */}
        <div className="admin-header">
          <div>
            <p className="admin-label">
              PORTFOLIO MANAGEMENT
            </p>

            <h1>Dashboard Overview</h1>

            <p>
              Manage your portfolio projects
              and content.
            </p>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <p
            role="alert"
            style={{ color: "#f87171" }}
          >
            {error}
          </p>
        )}

        {/* STATISTICS */}
        <div className="admin-stats">

          <div className="admin-stat-card">
            <span>Total Projects</span>

            <h2>
              {loading
                ? "..."
                : error
                ? "—"
                : totalProjects}
            </h2>
          </div>

          <div className="admin-stat-card">
            <span>Published</span>

            <h2>
              {loading
                ? "..."
                : error
                ? "—"
                : publishedProjects}
            </h2>
          </div>

          <div className="admin-stat-card">
            <span>Drafts</span>

            <h2>
              {loading
                ? "..."
                : error
                ? "—"
                : draftProjects}
            </h2>
          </div>

        </div>

        {/* ==============================
            PROJECT MANAGEMENT
            ============================== */}

        <section
          className="admin-panel"
          id="projects"
        >

          <div className="admin-panel-heading">
            <h2>Manage Projects</h2>

            <span>
              {loading || error
                ? "—"
                : `${totalProjects} Projects`}
            </span>
          </div>

          {loading ? (
            <p>Loading projects...</p>
          ) : error ? (
            <p>Unable to display projects.</p>
          ) : projects.length === 0 ? (
            <p>
              No projects found. Add your first
              project using the form below.
            </p>
          ) : (

            <div className="admin-project-list">

              {projects.map((project) => (

                <div
                  className="admin-project-item"
                  key={project.id}
                >

                  {/* PROJECT INFORMATION */}
                  <h3>{project.title}</h3>

                  <p>
                    {project.is_published
                      ? "Published"
                      : "Draft"}

                    {" • "}

                    {(project.status || "")
                      .replaceAll("_", " ")}
                  </p>

                  {/* EDIT PROJECT */}
                  <button
                    type="button"
                    onClick={() =>
                      setEditingProject(project)
                    }
                  >
                    Edit Project
                  </button>

                  {/* EDIT CASE STUDY */}
                  <button
                    type="button"
                    className="edit-case-study-btn"
                    onClick={() =>
                      setCaseStudyProject(project)
                    }
                  >
                    Edit Case Study
                  </button>

                  {/* EDIT METRICS */}
                  <button
                    type="button"
                    className="edit-case-study-btn"
                    onClick={() =>
                      setMetricsProject(project)
                    }
                  >
                    Edit Metrics
                  </button>

                  {/* FRENCH TRANSLATION */}
                  <button
                    type="button"
                    className="edit-case-study-btn"
                    onClick={() =>
                      setTranslationProject(project)
                    }
                  >
                    Edit French Translation
                  </button>

                  {/* DELETE PROJECT */}
                  <DeleteProject
                    project={project}
                    onProjectDeleted={
                      handleProjectDeleted
                    }
                  />

                  {/* CURRENT PROJECT IMAGE */}
                  {project.image_url && (

                    <div className="admin-project-image-preview">
                      <p>Current Image</p>

                      <img
                        src={project.image_url}
                        alt={`${project.title} cover`}
                        loading="lazy"
                        style={{
                          width: "100%",
                          maxWidth: "300px",
                          borderRadius: "10px",
                          marginTop: "10px",
                        }}
                      />
                    </div>

                  )}

                  {/* IMAGE UPLOAD */}
                  <ProjectImageUpload
                    project={project}
                    onImageUploaded={
                      refreshProjects
                    }
                  />

                </div>

              ))}

            </div>

          )}

        </section>

        {/* ==============================
            EDIT PROJECT FORM
            ============================== */}

        {editingProject && (

          <div id="edit-project">

            <EditProject
              key={editingProject.id}
              project={editingProject}
              onProjectUpdated={
                handleProjectUpdated
              }
              onCancel={() =>
                setEditingProject(null)
              }
            />

          </div>

        )}

        {/* ==============================
            CASE STUDY EDITOR
            ============================== */}

        {caseStudyProject && (

          <div id="case-study-editor">

            <CaseStudyEditor
              key={caseStudyProject.id}
              project={caseStudyProject}
              onSaved={handleCaseStudySaved}
            />

            <button
              type="button"
              className="close-case-study-btn"
              onClick={() =>
                setCaseStudyProject(null)
              }
            >
              Close Case Study Editor
            </button>

          </div>

        )}

        {/* ==============================
            METRICS EDITOR
            ============================== */}

        {metricsProject && (

          <div id="metrics-editor">

            <CaseStudyMetricsEditor
              key={metricsProject.id}
              project={metricsProject}
              onSaved={() => {
                setMetricsProject(null);
                refreshProjects();
              }}
            />

            <button
              type="button"
              className="close-case-study-btn"
              onClick={() =>
                setMetricsProject(null)
              }
            >
              Close Metrics Editor
            </button>

          </div>

        )}

        {/* ==============================
            FRENCH TRANSLATION EDITOR
            ============================== */}

        {translationProject && (

          <div id="translation-editor">

            <ProjectTranslationEditor
              key={translationProject.id}
              project={translationProject}
              onSaved={() => {
                setTranslationProject(null);
                refreshProjects();
              }}
            />

            <button
              type="button"
              className="close-case-study-btn"
              onClick={() =>
                setTranslationProject(null)
              }
            >
              Close Translation Editor
            </button>

          </div>

        )}

        {/* ==============================
            ADD NEW PROJECT
            ============================== */}

        <div id="add-project">

          <AddProject
            onProjectAdded={refreshProjects}
          />

        </div>

        {/* ==============================
            SETTINGS
            ============================== */}

        <section
          className="admin-panel"
          id="settings"
        >

          <h2>Settings</h2>

          <p>
            Portfolio settings will be
            available here.
          </p>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;
