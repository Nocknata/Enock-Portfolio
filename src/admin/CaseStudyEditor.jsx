
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Case study sections and database fields
const caseStudySections = [
  {
    number: "01",
    title: "Research Overview",
    description:
      "Introduce the research problem and the data.",
    fields: [
      {
        name: "problem_statement",
        label: "Problem Statement",
        placeholder:
          "What problem does this project solve?",
        help:
          "Explain the research question and why it matters.",
      },
      {
        name: "dataset_description",
        label: "Dataset Description",
        placeholder:
          "Describe your dataset and its source.",
        help:
          "Include the data source, relevant variables, and dataset size if known.",
      },
    ],
  },
  {
    number: "02",
    title: "Data & Methodology",
    description:
      "Document your data preparation and analysis.",
    fields: [
      {
        name: "data_preparation",
        label: "Data Preparation",
        placeholder:
          "Explain cleaning and feature engineering.",
        help:
          "Describe missing values, transformations, and other preparation steps.",
      },
      {
        name: "methodology",
        label: "Methodology",
        placeholder:
          "Describe your analytical approach.",
        help:
          "Explain the steps and techniques used to investigate the problem.",
      },
      {
        name: "models_used",
        label: "Machine Learning Models",
        placeholder:
          "Which models did you use?",
        help:
          "Describe the actual models or analytical methods used.",
      },
    ],
  },
  {
    number: "03",
    title: "Results & Evaluation",
    description:
      "Present evidence and explain your findings.",
    fields: [
      {
        name: "evaluation_metrics",
        label: "Model Evaluation",
        placeholder:
          "Enter your actual evaluation results.",
        help:
          "Include verified metrics and explain how performance was measured.",
      },
      {
        name: "key_findings",
        label: "Key Findings",
        placeholder:
          "What did you discover?",
        help:
          "Summarize your most important evidence-based insights.",
      },
    ],
  },
  {
    number: "04",
    title: "Future Development",
    description:
      "Document opportunities for improvement.",
    fields: [
      {
        name: "future_improvements",
        label: "Future Improvements",
        placeholder:
          "How could the project be improved?",
        help:
          "Describe possible next steps, limitations, and future work.",
      },
    ],
  },
];

// Flatten fields to preserve the existing
// Supabase database column names.
const caseStudyFields = caseStudySections.flatMap(
  (section) => section.fields
);

function CaseStudyEditor({ project, onSaved }) {
  // Load existing project content
  const [formData, setFormData] = useState(() =>
    Object.fromEntries(
      caseStudyFields.map((field) => [
        field.name,
        project[field.name] || "",
      ])
    )
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Update form fields
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  // Calculate completion based on filled fields
  const completedFields = caseStudyFields.filter(
    (field) =>
      (formData[field.name] || "").trim().length > 0
  ).length;

  const totalFields = caseStudyFields.length;

  const progressPercentage = Math.round(
    (completedFields / totalFields) * 100
  );

  // Save case study to Supabase
  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const { data, error: updateError } =
        await supabase
          .from("projects")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", project.id)
          .select("id")
          .single();

      if (updateError) {
        throw updateError;
      }

      if (!data) {
        throw new Error(
          "Project could not be updated."
        );
      }

      setSuccess(
        "Case study saved successfully!"
      );

      if (onSaved) {
        onSaved();
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to save case study."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-panel case-study-card">

      {/* EDITOR HEADER */}
      <div className="case-study-header">
        <span className="case-study-eyebrow">
          RESEARCH MANAGEMENT
        </span>

        <h2>Case Study Editor</h2>

        <p>
          Document your research process,
          analysis, and findings.
        </p>
      </div>

      {/* SELECTED PROJECT */}
      <div className="case-study-current">
        <span>YOU ARE EDITING</span>

        <strong>{project.title}</strong>
      </div>

      {/* COMPLETION OVERVIEW */}
      <div className="case-study-progress">

        <div className="case-study-progress-heading">
          <div>
            <h3>Case Study Progress</h3>

            <p>
              {completedFields} of {totalFields}{" "}
              sections completed
            </p>
          </div>

          <strong>{progressPercentage}%</strong>
        </div>

        <div
          className="case-study-progress-track"
          role="progressbar"
          aria-label="Case study field completion"
          aria-valuenow={completedFields}
          aria-valuemin={0}
          aria-valuemax={totalFields}
        >
          <div
            className="case-study-progress-fill"
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>

        <p className="case-study-progress-note">
          Progress is based on completed text
          fields, not research quality.
        </p>
      </div>

      {/* CASE STUDY FORM */}
      <form onSubmit={handleSubmit}>

        {caseStudySections.map((section) => (

          <div
            key={section.number}
            className="case-study-section"
          >

            {/* SECTION HEADING */}
            <div className="case-study-section-heading">

              <span className="case-study-section-number">
                {section.number}
              </span>

              <div>
                <h3>{section.title}</h3>

                <p>{section.description}</p>
              </div>

            </div>

            {/* SECTION FIELDS */}
            <div className="case-study-fields">

              {section.fields.map((field) => (

                <div
                  key={field.name}
                  className="case-study-field"
                >

                  <label
                    htmlFor={`case-${field.name}`}
                  >
                    {field.label}
                  </label>

                  <textarea
                    id={`case-${field.name}`}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    rows={5}
                    disabled={saving}
                  />

                  <p className="case-study-field-help">
                    {field.help}
                  </p>

                </div>

              ))}

            </div>

          </div>

        ))}

        {/* ERROR */}
        {error && (
          <p
            className="case-study-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* SUCCESS */}
        {success && (
          <p
            className="case-study-success"
            role="status"
          >
            {success}
          </p>
        )}

        {/* SAVE BUTTON */}
        <div className="case-study-actions">

          <p>
            Save your research content when
            you finish editing.
          </p>

          <button
            type="submit"
            className="case-study-save-btn"
            disabled={saving}
          >
            {saving
              ? "Saving Case Study..."
              : "Save Case Study →"}
          </button>

        </div>

      </form>

    </section>
  );
}

export default CaseStudyEditor;
