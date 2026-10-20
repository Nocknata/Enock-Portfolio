
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

// ======================================
// FRENCH TRANSLATION SECTIONS
// ======================================

const translationSections = [
  {
    number: "01",
    title: "Project Information",
    description:
      "Translate the main information visitors see on your portfolio.",
    fields: [
      {
        key: "title_fr",
        label: "Project Title (French)",
        placeholder:
          "Entrez le titre du projet en français...",
        rows: 2,
      },
      {
        key: "description_fr",
        label: "Description (French)",
        placeholder:
          "Décrivez votre projet en français...",
        rows: 5,
      },
    ],
  },
  {
    number: "02",
    title: "Research & Methodology",
    description:
      "Translate your research process, dataset, and analytical methods.",
    fields: [
      {
        key: "problem_statement_fr",
        label: "Problem Statement (French)",
        placeholder:
          "Expliquez le problème étudié...",
        rows: 5,
      },
      {
        key: "dataset_description_fr",
        label: "Dataset Description (French)",
        placeholder:
          "Décrivez les données utilisées...",
        rows: 5,
      },
      {
        key: "data_preparation_fr",
        label: "Data Preparation (French)",
        placeholder:
          "Expliquez la préparation des données...",
        rows: 5,
      },
      {
        key: "methodology_fr",
        label: "Methodology (French)",
        placeholder:
          "Décrivez votre méthodologie...",
        rows: 5,
      },
      {
        key: "models_used_fr",
        label: "Machine Learning Models (French)",
        placeholder:
          "Présentez les modèles et méthodes utilisés...",
        rows: 5,
      },
    ],
  },
  {
    number: "03",
    title: "Results & Future Work",
    description:
      "Translate the evaluation, main findings, and future improvements.",
    fields: [
      {
        key: "evaluation_metrics_fr",
        label: "Model Evaluation (French)",
        placeholder:
          "Présentez les résultats de l'évaluation...",
        rows: 5,
      },
      {
        key: "key_findings_fr",
        label: "Key Findings (French)",
        placeholder:
          "Résumez les principales conclusions...",
        rows: 5,
      },
      {
        key: "future_improvements_fr",
        label: "Future Improvements (French)",
        placeholder:
          "Proposez des améliorations futures...",
        rows: 5,
      },
    ],
  },
];

// Preserve all original Supabase field names
const translationFields = translationSections.flatMap(
  (section) => section.fields
);

function ProjectTranslationEditor({
  project,
  onSaved,
}) {
  // Load existing French translations
  const [formData, setFormData] = useState(() =>
    Object.fromEntries(
      translationFields.map(({ key }) => [
        key,
        project[key] ?? "",
      ])
    )
  );

  // Form state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Update translation field
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setSuccess("");
  }

  // Translation completion progress
  const completedFields = translationFields.filter(
    ({ key }) =>
      String(formData[key] ?? "").trim().length > 0
  ).length;

  const totalFields = translationFields.length;

  const progressPercentage = Math.round(
    (completedFields / totalFields) * 100
  );

  // ======================================
  // SAVE TRANSLATIONS TO SUPABASE
  // ======================================

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const { data, error: saveError } =
        await supabase
          .from("projects")
          .update({
            ...formData,
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
          "Unable to save translations."
        );
      }

      setSuccess(
        "French translations saved successfully!"
      );

      if (onSaved) {
        onSaved();
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to save translations."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-panel translation-editor-card">

      {/* EDITOR HEADER */}
      <div className="translation-editor-header">

        <span className="translation-editor-eyebrow">
          BILINGUAL CONTENT MANAGEMENT
        </span>

        <div className="translation-editor-heading">
          <div>
            <h2>French Translations</h2>

            <p>
              Manage the French version of
              your project and research content.
            </p>
          </div>

          <span className="translation-language-badge">
            FR · Français
          </span>
        </div>

      </div>

      {/* SELECTED PROJECT */}
      <div className="translation-editor-current">

        <span>YOU ARE TRANSLATING</span>

        <strong>{project.title}</strong>

      </div>

      {/* TRANSLATION PROGRESS */}
      <div className="translation-progress">

        <div className="translation-progress-heading">
          <div>
            <h3>Translation Progress</h3>

            <p>
              {completedFields} of {totalFields}{" "}
              fields completed
            </p>
          </div>

          <strong>
            {progressPercentage}%
          </strong>
        </div>

        <div
          className="translation-progress-track"
          role="progressbar"
          aria-label="French translation completion"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercentage}
        >
          <div
            className="translation-progress-fill"
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>

        <p className="translation-progress-note">
          Progress counts nonempty French fields.
          It does not verify translation accuracy.
        </p>

      </div>

      {/* TRANSLATION FORM */}
      <form onSubmit={handleSubmit}>

        {translationSections.map((section) => (

          <div
            key={section.number}
            className="translation-section"
          >

            {/* SECTION HEADER */}
            <div className="translation-section-heading">

              <span className="translation-section-number">
                {section.number}
              </span>

              <div>
                <h3>{section.title}</h3>
                <p>{section.description}</p>
              </div>

            </div>

            {/* FIELDS */}
            <div className="translation-fields">

              {section.fields.map((field) => (

                <div
                  key={field.key}
                  className="translation-field"
                >

                  <label htmlFor={field.key}>
                    {field.label}

                    {String(
                      formData[field.key] ?? ""
                    ).trim() && (
                      <span className="translation-field-complete">
                        Filled
                      </span>
                    )}
                  </label>

                  <textarea
                    id={field.key}
                    name={field.key}
                    rows={field.rows}
                    value={formData[field.key]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    disabled={saving}
                    lang="fr"
                  />

                </div>

              ))}

            </div>

          </div>

        ))}

        {/* ERROR MESSAGE */}
        {error && (
          <p
            className="translation-editor-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* SUCCESS MESSAGE */}
        {success && (
          <p
            className="translation-editor-success"
            role="status"
          >
            {success}
          </p>
        )}

        {/* SAVE BUTTON */}
        <div className="translation-editor-actions">

          <p>
            Save your French translations
            to update your bilingual case study.
          </p>

          <button
            type="submit"
            className="translation-save-btn"
            disabled={saving}
          >
            {saving
              ? "Saving Translations..."
              : "Save French Translations →"}
          </button>

        </div>

      </form>

    </section>
  );
}

export default ProjectTranslationEditor;
