
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

function AddProject({ onProjectAdded }) {
  // PROJECT INFORMATION
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");

  // PROJECT SETTINGS
  const [status, setStatus] = useState("in_progress");
  const [isPublished, setIsPublished] = useState(false);

  // FORM STATE
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // CREATE PROJECT
  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const techArray = technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean);

      const { error: insertError } = await supabase
        .from("projects")
        .insert({
          title: title.trim(),
          description: description.trim(),
          technologies: techArray,
          status,
          is_published: isPublished,
        });

      if (insertError) {
        throw insertError;
      }

      setSuccess("Project added successfully!");

      // Reset the form after successful creation
      setTitle("");
      setDescription("");
      setTechnologies("");
      setStatus("in_progress");
      setIsPublished(false);

      if (onProjectAdded) {
        onProjectAdded();
      }
    } catch (err) {
      setError(
        err.message || "Could not add project."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="admin-panel add-project-card">

      {/* EDITOR HEADER */}
      <div className="add-project-header">
        <span className="add-project-eyebrow">
          PROJECT MANAGEMENT
        </span>

        <h2>Add New Project</h2>

        <p>
          Create a new portfolio project and
          manage how it appears to visitors.
        </p>
      </div>

      {/* NEW PROJECT INDICATOR */}
      <div className="add-project-info">
        <span>NEW PROJECT</span>

        <strong>
          Build your next case study
        </strong>

        <p>
          Start with the basic information.
          You can add images, research details,
          metrics, and translations afterward.
        </p>
      </div>

      {/* ADD PROJECT FORM */}
      <form onSubmit={handleSubmit}>

        {/* ============================
            SECTION 1 — INFORMATION
            ============================ */}

        <div className="add-project-section">

          <div className="add-project-section-heading">
            <span className="add-project-section-icon">
              01
            </span>

            <div>
              <h3>Project Information</h3>

              <p>
                Provide the main details
                about your project.
              </p>
            </div>
          </div>

          <div className="add-project-fields">

            {/* PROJECT TITLE */}
            <div className="add-project-field">
              <label htmlFor="project-title">
                Project Title
                <span className="add-project-required">
                  *
                </span>
              </label>

              <input
                id="project-title"
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

              <p className="add-project-help">
                Choose a clear and professional
                title for your project.
              </p>
            </div>

            {/* DESCRIPTION */}
            <div className="add-project-field">
              <label htmlFor="project-description">
                Description
              </label>

              <textarea
                id="project-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Describe your project, objectives, and main results..."
                rows={5}
                disabled={loading}
              />

              <p className="add-project-help">
                Write a short summary that
                visitors can easily understand.
              </p>
            </div>

            {/* TECHNOLOGIES */}
            <div className="add-project-field">
              <label htmlFor="project-technologies">
                Technologies
              </label>

              <input
                id="project-technologies"
                type="text"
                value={technologies}
                onChange={(event) =>
                  setTechnologies(event.target.value)
                }
                placeholder="Python, SQL, Power BI"
                disabled={loading}
              />

              <p className="add-project-help">
                Separate technologies with commas.
                For example: Python, Pandas, Power BI.
              </p>
            </div>

          </div>
        </div>

        {/* ============================
            SECTION 2 — STATUS
            ============================ */}

        <div className="add-project-section">

          <div className="add-project-section-heading">
            <span className="add-project-section-icon">
              02
            </span>

            <div>
              <h3>Project Status</h3>

              <p>
                Tell visitors about your
                project's development stage.
              </p>
            </div>
          </div>

          <div className="add-project-fields">

            <div className="add-project-field">
              <label htmlFor="project-status">
                Current Status
              </label>

              <select
                id="project-status"
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

              <p className="add-project-help">
                You can update the project
                status at any time.
              </p>
            </div>

          </div>
        </div>

        {/* ============================
            SECTION 3 — PUBLICATION
            ============================ */}

        <div className="add-project-section">

          <div className="add-project-section-heading">
            <span className="add-project-section-icon">
              03
            </span>

            <div>
              <h3>Publication Settings</h3>

              <p>
                Decide whether your project
                is visible to visitors.
              </p>
            </div>
          </div>

          <div className="add-project-publish-box">

            <label
              htmlFor="project-published"
              className="add-project-publish-label"
            >
              <input
                id="project-published"
                type="checkbox"
                checked={isPublished}
                onChange={(event) =>
                  setIsPublished(event.target.checked)
                }
                disabled={loading}
              />

              <span className="add-project-publish-text">
                <strong>
                  Publish this project
                </strong>

                <small>
                  {isPublished
                    ? "Your project will be visible on your public portfolio after saving."
                    : "Your project will be saved as a draft and hidden from public visitors."}
                </small>
              </span>

            </label>

          </div>

          <p className="add-project-publish-note">
            New projects are saved as drafts
            by default. You can publish
            them later.
          </p>

        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <p
            className="add-project-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* SUCCESS MESSAGE */}
        {success && (
          <p
            className="add-project-success"
            role="status"
          >
            {success}
          </p>
        )}

        {/* ============================
            CREATE PROJECT BUTTON
            ============================ */}

        <div className="add-project-actions">

          <p>
            Review the information before
            creating your project.
          </p>

          <button
            type="submit"
            className="add-project-save-btn"
            disabled={loading}
          >
            {loading
              ? "Creating Project..."
              : "Create Project →"}
          </button>

        </div>

      </form>

    </section>
  );
}

export default AddProject;
