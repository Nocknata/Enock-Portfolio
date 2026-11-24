
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function PasswordRecovery() {
  const location = useLocation();
  const isReset = location.pathname === "/admin/reset-password";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(isReset);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isReset) return;

    let active = true;

    // Supabase processes the recovery link and creates
    // a temporary authenticated recovery session.
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event, session) => {
        if (!active) return;

        if (event === "PASSWORD_RECOVERY" && session) {
          setReady(true);
          setChecking(false);
        }
      });

    async function checkRecoverySession() {
      const { data, error } = await supabase.auth.getSession();

      if (!active) return;

      if (!error && data.session) {
        setReady(true);
      }

      setChecking(false);
    }

    checkRecoverySession();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [isReset]);

  async function sendRecoveryEmail(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setSuccess(false);

    try {
      const redirectTo =
        `${window.location.origin}/admin/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo }
      );

      if (error) throw error;

      setSuccess(true);
      setMessage(
        "If this email belongs to an account, a password recovery link will be sent. Check your inbox and spam folder."
      );
    } catch (error) {
      setMessage(error.message || "Unable to send recovery email.");
    } finally {
      setBusy(false);
    }
  }

  async function updatePassword(event) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    if (password.length < 8) {
      setMessage("Use at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("The passwords do not match.");
      return;
    }

    setBusy(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
      setMessage(
        "Your password has been updated. You can now return to Admin Login."
      );

      await supabase.auth.signOut();
    } catch (error) {
      setMessage(error.message || "Unable to update password.");
    } finally {
      setBusy(false);
    }
  }

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#081426",
      color: "#f8fafc",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "24px",
      fontFamily: "Inter, sans-serif",
    },
    card: {
      width: "100%",
      maxWidth: "440px",
      padding: "36px 28px",
      background: "#101f34",
      border: "1px solid #30445e",
      borderRadius: "12px",
    },
    input: {
      width: "100%",
      padding: "13px",
      marginTop: "8px",
      marginBottom: "20px",
      background: "#0b1728",
      color: "#ffffff",
      border: "1px solid #405671",
      borderRadius: "6px",
      fontSize: "15px",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "13px",
      background: "#2563eb",
      color: "#ffffff",
      border: "none",
      borderRadius: "6px",
      fontWeight: "600",
      cursor: "pointer",
      fontSize: "15px",
    },
  };

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <div
          style={{
            fontSize: "26px",
            fontWeight: "800",
            marginBottom: "20px",
          }}
        >
          EK<span style={{ color: "#60a5fa" }}>.</span>
        </div>

        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>
          {isReset ? "Set New Password" : "Forgot Password?"}
        </h1>

        <p style={{ color: "#aabbd0", marginBottom: "26px" }}>
          {isReset
            ? "Choose a new password for your portfolio admin account."
            : "Enter your admin email to receive a recovery link."}
        </p>

        {!isReset ? (
          <form onSubmit={sendRecoveryEmail}>
            <label htmlFor="recovery-email">
              Email address
            </label>

            <input
              id="recovery-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />

            <button
              type="submit"
              disabled={busy}
              style={styles.button}
            >
              {busy ? "Sending..." : "Send Recovery Email"}
            </button>
          </form>
        ) : checking ? (
          <p>Checking recovery link...</p>
        ) : ready && !success ? (
          <form onSubmit={updatePassword}>
            <label htmlFor="new-password">
              New password
            </label>

            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />

            <label htmlFor="confirm-password">
              Confirm new password
            </label>

            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
            />

            <button
              type="submit"
              disabled={busy}
              style={styles.button}
            >
              {busy ? "Updating..." : "Update Password"}
            </button>
          </form>
        ) : !success ? (
          <p style={{ color: "#fca5a5" }}>
            No active recovery session was found.
            Your link may be invalid or expired.
            Please request a new recovery email.
          </p>
        ) : null}

        {message && (
          <p
            role="status"
            style={{
              color: success ? "#86efac" : "#fca5a5",
              marginTop: "18px",
              lineHeight: 1.6,
            }}
          >
            {message}
          </p>
        )}

        <div style={{ marginTop: "28px" }}>
          <Link
            to={isReset && !success
              ? "/admin/forgot-password"
              : "/admin/login"}
            style={{ color: "#93c5fd" }}
          >
            {isReset && !success
              ? "Request a new recovery email"
              : "Back to Admin Login"}
          </Link>
        </div>
      </div>
    </main>
  );
}
