
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

function DeleteProject({ project, onProjectDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${project.title}"?`
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      const { data, error: deleteError } = await supabase
        .from("projects")
        .delete()
        .eq("id", project.id)
        .select("id");

      if (deleteError) {
        throw deleteError;
      }

      if (!data || data.length === 0) {
        throw new Error(
          "Project could not be deleted. Check your permissions."
        );
      }

      if (onProjectDeleted) {
        onProjectDeleted(project.id);
      }
    } catch (err) {
      setError(err.message || "Failed to delete project.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="delete-project-control">
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="delete-project-btn"
      >
        {deleting ? "Deleting..." : "Delete Project"}
      </button>

      {error && <p role="alert">{error}</p>}
    </div>
  );
}

export default DeleteProject;
