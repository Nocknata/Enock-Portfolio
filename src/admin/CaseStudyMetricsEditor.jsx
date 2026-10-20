
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Create a new empty metric
function createEmptyMetric() {
  return {
    id: crypto.randomUUID(),
    label: "",
    value: "",
    unit: "",
  };
}

function CaseStudyMetricsEditor({
  project,
  onSaved,
}) {
  // Load saved metrics from Supabase
  const [metrics, setMetrics] = useState(() => {
    const saved = project.case_study_metrics;

    if (Array.isArray(saved) && saved.length > 0) {
      return saved.map((metric) => ({
        id: crypto.randomUUID(),
        label: String(metric?.label ?? ""),
        value: String(metric?.value ?? ""),
        unit: String(metric?.unit ?? ""),
      }));
    }

    return [
      createEmptyMetric(),
      createEmptyMetric(),
    ];
  });

  // Form state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Update one metric field
  function updateMetric(id, field, value) {
    setMetrics((current) =>
      current.map((metric) =>
        metric.id === id
          ? { ...metric, [field]: value }
          : metric
      )
    );

    setSuccess("");
  }

  // Add a new metric
  function addMetric() {
    setMetrics((current) => [
      ...current,
      createEmptyMetric(),
    ]);

    setSuccess("");
  }

  // Remove a metric
  function removeMetric(id) {
    setMetrics((current) =>
      current.filter(
        (metric) => metric.id !== id
      )
    );

    setSuccess("");
  }

  // Count metrics containing any information
  const filledMetricsCount = metrics.filter(
    (metric) =>
      metric.label.trim() ||
      metric.value.trim() ||
      metric.unit.trim()
  ).length;

  // Save metrics to Supabase
  async function handleSave(event) {
    event.preventDefault();

    if (saving) return;

    setError("");
    setSuccess("");

    // Ignore completely empty rows
    const filledMetrics = metrics.filter(
      (metric) =>
        metric.label.trim() ||
        metric.value.trim() ||
        metric.unit.trim()
    );

    // Validate all filled metric rows
    const invalidMetric = filledMetrics.some(
      (metric) =>
        !metric.label.trim() ||
        metric.value.trim() === "" ||
        !Number.isFinite(Number(metric.value))
    );

    if (invalidMetric) {
      setError(
        "Each metric must have a name and a valid number."
      );
      return;
    }

    // Preserve the existing database structure
    const metricsToSave = filledMetrics.map(
      (metric) => ({
        label: metric.label.trim(),
        value: Number(metric.value),
        unit: metric.unit.trim(),
      })
    );

    setSaving(true);

    try {
      const {
        data,
        error: saveError,
      } = await supabase
        .from("projects")
        .update({
          case_study_metrics: metricsToSave,
          updated_at: new Date().toISOString(),
        })
        .eq("id", project.id)
        .select("id")
        .single();

      if (saveError) {
        throw saveError;
      }

      if (!data) {
        throw new Error(
          "Metrics could not be saved."
        );
      }

      setSuccess(
        "Metrics saved successfully!"
      );

      if (onSaved) {
        onSaved();
      }
    } catch (err) {
      setError(
        err.message || "Unable to save metrics."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-panel metrics-editor-card">

      {/* =========================
          EDITOR HEADER
          ========================= */}

      <div className="metrics-editor-header">

        <span className="metrics-editor-eyebrow">
          ANALYTICS MANAGEMENT
        </span>

        <h2>Model Performance Metrics</h2>

        <p>
          Manage numerical results and
          evaluation metrics for your project.
        </p>

      </div>

      {/* =========================
          SELECTED PROJECT
          ========================= */}

      <div className="metrics-editor-current">

        <span>YOU ARE EDITING</span>

        <strong>{project.title}</strong>

      </div>

      {/* =========================
          METRICS OVERVIEW
          ========================= */}

      <div className="metrics-editor-overview">

        <div>
          <span className="metrics-overview-label">
            METRICS ENTERED
          </span>

          <strong>{filledMetricsCount}</strong>
        </div>

        <p>
          Add measurable results from your
          analysis. Use only verified values.
        </p>

      </div>

      {/* =========================
          METRICS FORM
          ========================= */}

      <form onSubmit={handleSave}>

        <div className="metrics-editor-list">

          {metrics.map((metric, index) => (

            <div
              key={metric.id}
              className="metrics-editor-item"
            >

              {/* METRIC HEADER */}
              <div className="metrics-item-header">

                <div className="metrics-item-heading">

                  <span className="metrics-item-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h3>
                      Metric {index + 1}
                    </h3>

                    <p>
                      Enter an evaluation metric
                      or research result.
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  className="metrics-remove-btn"
                  onClick={() =>
                    removeMetric(metric.id)
                  }
                  disabled={saving}
                  aria-label={
                    `Remove metric ${index + 1}`
                  }
                >
                  Remove Metric
                </button>

              </div>

              {/* METRIC FIELDS */}
              <div className="metrics-editor-fields">

                {/* METRIC NAME */}
                <div className="metrics-editor-field">

                  <label
                    htmlFor={
                      `metric-label-${metric.id}`
                    }
                  >
                    Metric Name
                  </label>

                  <input
                    id={
                      `metric-label-${metric.id}`
                    }
                    type="text"
                    value={metric.label}
                    onChange={(event) =>
                      updateMetric(
                        metric.id,
                        "label",
                        event.target.value
                      )
                    }
                    placeholder="Model RMSE"
                    maxLength={80}
                    disabled={saving}
                  />

                  <p>
                    Example: Model RMSE,
                    Accuracy, or MAE.
                  </p>

                </div>

                {/* METRIC VALUE */}
                <div className="metrics-editor-field">

                  <label
                    htmlFor={
                      `metric-value-${metric.id}`
                    }
                  >
                    Metric Value
                  </label>

                  <input
                    id={
                      `metric-value-${metric.id}`
                    }
                    type="number"
                    step="any"
                    value={metric.value}
                    onChange={(event) =>
                      updateMetric(
                        metric.id,
                        "value",
                        event.target.value
                      )
                    }
                    placeholder="10.53"
                    disabled={saving}
                  />

                  <p>
                    Enter the actual numerical
                    result.
                  </p>

                </div>

                {/* METRIC UNIT */}
                <div className="metrics-editor-field">

                  <label
                    htmlFor={
                      `metric-unit-${metric.id}`
                    }
                  >
                    Unit
                    <span className="metrics-optional">
                      Optional
                    </span>
                  </label>

                  <input
                    id={
                      `metric-unit-${metric.id}`
                    }
                    type="text"
                    value={metric.unit}
                    onChange={(event) =>
                      updateMetric(
                        metric.id,
                        "unit",
                        event.target.value
                      )
                    }
                    placeholder="%, trips, hours"
                    maxLength={30}
                    disabled={saving}
                  />

                  <p>
                    Leave blank if the metric
                    has no unit.
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* =========================
            ADD METRIC
            ========================= */}

        <button
          type="button"
          className="metrics-add-btn"
          onClick={addMetric}
          disabled={saving}
        >
          + Add Another Metric
        </button>

        {/* VALIDATION ERROR */}
        {error && (
          <p
            className="metrics-editor-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* SUCCESS MESSAGE */}
        {success && (
          <p
            className="metrics-editor-success"
            role="status"
          >
            {success}
          </p>
        )}

        {/* =========================
            SAVE METRICS
            ========================= */}

        <div className="metrics-editor-actions">

          <p>
            Save your metrics to update
            the project case study.
          </p>

          <button
            type="submit"
            className="metrics-save-btn"
            disabled={saving}
          >
            {saving
              ? "Saving Metrics..."
              : "Save Metrics →"}
          </button>

        </div>

      </form>

    </section>
  );
}

export default CaseStudyMetricsEditor;
