
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabaseClient";

function AdminLogin() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const isFrench = i18n.resolvedLanguage === "fr";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        throw loginError;
      }

      // The existing ProtectedRoute handles
      // access to the admin dashboard.
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(
        err.message ||
          (isFrench
            ? "Impossible de se connecter."
            : "Unable to sign in.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-shell">

        {/* LEFT SIDE — BRANDING */}
        <div className="admin-login-branding">

          <Link
            to="/"
            className="admin-login-logo"
          >
            EK<span>.</span>
          </Link>

          <div className="admin-login-brand-content">
            <span className="admin-login-eyebrow">
              {isFrench
                ? "ESPACE D'ADMINISTRATION"
                : "PORTFOLIO ADMIN"}
            </span>

            <h1>
              {isFrench
                ? "Votre portfolio. Un seul espace."
                : "Your portfolio. One workspace."}
            </h1>

            <p>
              {isFrench
                ? "Gérez vos projets, études de cas, images et contenus depuis une interface sécurisée."
                : "Manage your projects, case studies, images, and portfolio content from one secure workspace."}
            </p>

            <div className="admin-login-features">
              <div>
                <span>✦</span>
                {isFrench
                  ? "Gestion des projets"
                  : "Project management"}
              </div>

              <div>
                <span>✦</span>
                {isFrench
                  ? "Études de cas et analyses"
                  : "Case studies and analytics"}
              </div>

              <div>
                <span>✦</span>
                {isFrench
                  ? "Contenu bilingue"
                  : "Bilingual content"}
              </div>
            </div>
          </div>

          <p className="admin-login-brand-footer">
            © {new Date().getFullYear()} Enock Kanyinda
          </p>
        </div>

        {/* RIGHT SIDE — LOGIN FORM */}
        <div className="admin-login-form-side">
          <div className="admin-login-card">

            <div className="admin-login-lock">
              🔒
            </div>

            <h2>
              {isFrench
                ? "Bon retour"
                : "Welcome back"}
            </h2>

            <p className="admin-login-subtitle">
              {isFrench
                ? "Connectez-vous à votre tableau de bord."
                : "Sign in to your admin dashboard."}
            </p>

            <form
              onSubmit={handleLogin}
              aria-busy={loading}
            >
              {/* EMAIL */}
              <div className="admin-login-field">
                <label htmlFor="admin-email">
                  {isFrench
                    ? "Adresse email"
                    : "Email address"}
                </label>

                <input
                  id="admin-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                  autoComplete="username"
                  disabled={loading}
                />
              </div>

              {/* PASSWORD */}
              <div className="admin-login-field">
                <label htmlFor="admin-password">
                  {isFrench
                    ? "Mot de passe"
                    : "Password"}
                </label>

                <div className="admin-password-wrapper">
                  <input
                    id="admin-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                    autoComplete="current-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="admin-show-password"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword
                        ? isFrench
                          ? "Masquer le mot de passe"
                          : "Hide password"
                        : isFrench
                        ? "Afficher le mot de passe"
                        : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword
                      ? isFrench
                        ? "Masquer"
                        : "Hide"
                      : isFrench
                      ? "Afficher"
                      : "Show"}
                  </button>
                </div>
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <p
                  className="admin-login-error"
                  role="alert"
                >
                  {error}
                </p>
              )}

              {/* SIGN IN BUTTON */}
              <button
                type="submit"
                className="admin-login-submit"
                disabled={loading}
              >
                {loading
                  ? isFrench
                    ? "Connexion..."
                    : "Signing in..."
                  : isFrench
                  ? "Se connecter →"
                  : "Sign In →"}
              </button>
            </form>

            <div className="admin-login-bottom">
              <span>
                🔐{" "}
                {isFrench
                  ? "Accès réservé aux administrateurs"
                  : "Authorized administrators only"}
              </span>

              <Link to="/">
                ←{" "}
                {isFrench
                  ? "Retour au portfolio"
                  : "Back to Portfolio"}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

export default AdminLogin;
