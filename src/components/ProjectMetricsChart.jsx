
import { useTranslation } from "react-i18next";

function ProjectMetricsChart({ metrics = [] }) {
  const { i18n } = useTranslation();
  const isFrench = i18n.resolvedLanguage === "fr";

  // Translate metric labels when French is selected
  function translateMetric(label) {
    if (!isFrench) return label;

    const translations = {
      "model rmse": "RMSE du modèle",
      "baseline rmse": "RMSE du modèle de référence",
    };

    return translations[label?.trim().toLowerCase()] || label;
  }

  // Keep only metrics with valid numerical values
  const validMetrics = (Array.isArray(metrics) ? metrics : []).filter(
    (metric) =>
      metric &&
      typeof metric.label === "string" &&
      metric.label.trim() !== "" &&
      metric.value !== null &&
      metric.value !== undefined &&
      metric.value !== "" &&
      Number.isFinite(Number(metric.value)) &&
      Number(metric.value) >= 0
  );

  // We need at least two metrics for a comparison
  if (validMetrics.length < 2) {
    return null;
  }

  // Find the largest value to scale the bars
  const maxValue = Math.max(
    ...validMetrics.map((metric) => Number(metric.value)),
    1
  );

  return (
    <div className="metrics-chart">
      {/* TRANSLATED CHART TITLE */}
      <h3>
        {isFrench
          ? "Comparaison des performances"
          : "Performance Comparison"}
      </h3>

      <div className="metrics-chart-list">
        {validMetrics.map((metric, index) => {
          const value = Number(metric.value);
          const percentage = (value / maxValue) * 100;

          return (
            <div className="metrics-chart-row" key={index}>
              <div className="metrics-chart-label">
                <span>{translateMetric(metric.label)}</span>

                <strong>
                  {value}
                  {metric.unit ? ` ${metric.unit}` : ""}
                </strong>
              </div>

              <div className="metrics-chart-track">
                <div
                  className="metrics-chart-bar"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProjectMetricsChart;
