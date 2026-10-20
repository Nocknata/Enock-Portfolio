
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

function EditProject({
  project,
  onProjectUpdated,
  onCancel,
}) {
  // PROJECT INFORMATION
  const [title, setTitle] = useState(
    project.title || ""
  );

  const [status, setStatus] = useState(
    project.status || "in_progress"
  );

  const [isPublished, setIsPublished] = useState(
    project.is_published === true
  );

  // PROJECT LINKS
  const [githubUrl, setGithubUrl] = useState(
    project.github_url || ""
  );

  const [demoUrl, setDemoUrl] = useState(
    project.demo_url || ""
  );

  // FORM STATE
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // SAVE PROJECT
  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const {
        data: updatedProject,
        error: updateError,
      } = await supabase
        .from("projects")
        .update({
          title: title.trim(),
          status,
          is_published: isPublished,
          github_url: githubUrl.trim() || null,
          demo_url: demoUrl.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", project.id)
        .select("id")
        .single();

      if (updateError) {
        throw updateError;
      }

      if (!updatedProject) {
        throw new Error(
          "Project was not updated."
        );
      }

      if (onProjectUpdated) {
        onProjectUpdated();
      }
    } catch (err) {
      setError(
        err.message || "Could not update project."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="admin-panel edit-project-card">

      {/* EDITOR HEADER */}
      <div className="edit-project-header">

        <div className="edit-project-header-content">
          <span className="edit-project-eyebrow">
            PROJECT MANAGEMENT
          </span>

          <h2>Edit Project</h2>

          <p>
            Update project details, manage links,
            and control publication.
          </p>
        </div>

        <span
          className={
            isPublished
              ? "edit-project-status-badge published"
              : "edit-project-status-badge draft"
          }
        >
          <span aria-hidden="true">●</span>
          {isPublished ? "Published" : "Draft"}
        </span>

      </div>

      {/* CURRENT PROJECT */}
      <div className="edit-project-current">
        <span>YOU ARE EDITING</span>
        <strong>{project.title}</strong>
      </div>

      <form onSubmit={handleSubmit}>

        {/* ============================
            SECTION 1 — INFORMATION
            ============================ */}

        <div className="edit-project-section">

          <div className="edit-project-section-heading">
            <span className="edit-project-section-icon">
              01
            </span>

            <div>
              <h3>Project Information</h3>

              <p>
                Basic details about your project.
              </p>
            </div>
          </div>

          <div className="edit-project-fields">

            {/* PROJECT TITLE */}
            <div className="edit-project-field">
              <label htmlFor="edit-project-title">
                Project Title
                <span className="edit-required">
                  *
                </span>
              </label>

              <input
                id="edit-project-title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Enter project title"
                required
                maxLength={150}
                disabled={loading}
              />

              <p className="edit-project-help">
                Use a clear, professional project name.
              </p>
            </div>

            {/* PROJECT STATUS */}
            <div className="edit-project-field">
              <label htmlFor="edit-project-status">
                Project Status
              </label>

              <select
                id="edit-project-status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                disabled={loading}
              >
                <option value="in_progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="coming_soon">
                  Coming Soon
                </option>
              </select>

              <p className="edit-project-help">
                This status appears on your portfolio.
              </p>
            </div>

          </div>
        </div>

        {/* ============================
            SECTION 2 — PROJECT LINKS
            ============================ */}

        <div className="edit-project-section">

          <div className="edit-project-section-heading">
            <span className="edit-project-section-icon">
              02
            </span>

            <div>
              <h3>Project Links</h3>

              <p>
                Connect visitors to your code
                and live demonstrations.
              </p>
            </div>
          </div>

          <div className="edit-project-fields">

            {/* GITHUB URL */}
            <div className="edit-project-field">
              <label htmlFor="edit-github-url">
                GitHub Repository URL
              </label>

              <input
                id="edit-github-url"
                type="url"
                value={githubUrl}
                onChange={(event) =>
                  setGithubUrl(event.target.value)
                }
                placeholder="https://github.com/username/repository"
                disabled={loading}
              />

              <p className="edit-project-help">
                Link to the source code for this project.
              </p>
            </div>

            {/* LIVE DEMO URL */}
            <div className="edit-project-field">
              <label htmlFor="edit-demo-url">
                Live Demo URL
                <span className="edit-optional">
                  Optional
                </span>
              </label>

              <input
                id="edit-demo-url"
                type="url"
                value={demoUrl}
                onChange={(event) =>
                  setDemoUrl(event.target.value)
                }
                placeholder="https://your-project-demo.com"
                disabled={loading}
              />

              <p className="edit-project-help">
                Add a deployed application or publicly
                accessible dashboard link.
              </p>
            </div>

          </div>
        </div>

        {/* ============================
            SECTION 3 — PUBLICATION
            ============================ */}

        <div className="edit-project-section">

          <div className="edit-project-section-heading">
            <span className="edit-project-section-icon">
              03
            </span>

            <div>
              <h3>Publication Settings</h3>

              <p>
                Choose whether visitors can see
                this project.
              </p>
            </div>
          </div>

          <div className="edit-project-publish-box">

            <label
              htmlFor="edit-project-published"
              className="edit-project-publish-label"
            >
              <input
                id="edit-project-published"
                type="checkbox"
                checked={isPublished}
                onChange={(event) =>
                  setIsPublished(event.target.checked)
                }
                disabled={loading}
              />

              <span className="edit-project-publish-text">
                <strong>
                  Publish this project
                </strong>

                <small>
                  {isPublished
                    ? "This project will be visible on your public portfolio."
                    : "This project will remain private to your admin workspace."}
                </small>
              </span>

            </label>

          </div>

          <p className="edit-project-publish-note">
            Changes to publication status take
            effect when you save.
          </p>

        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <p
            className="edit-project-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* ============================
            ACTION BUTTONS
            ============================ */}

        <div className="edit-project-actions">

          <button
            type="button"
            className="edit-project-cancel-btn"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="edit-project-save-btn"
            disabled={loading}
          >
            {loading
              ? "Saving Changes..."
              : "Save Changes →"}
          </button>

        </div>

      </form>

    </section>
  );
}

export default EditProject;
