
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      setLoading(true);
      setError("");

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (!active) return;

      if (userError || !userData.user) {
        setAuthenticated(false);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setAuthenticated(true);

      const { data, error: adminError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (!active) return;

      if (adminError) {
        setError("Unable to verify administrator access.");
        setIsAdmin(false);
      } else {
        setIsAdmin(Boolean(data));
      }

      setLoading(false);
    }

    checkAdmin();

    const { data: listener } =
      supabase.auth.onAuthStateChange(() => {
        checkAdmin();
      });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <p>Verifying administrator access...</p>;
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!isAdmin) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>Access Denied</h1>
        <p>You are not authorized to access this dashboard.</p>
      </main>
    );
  }

  return children;
}

export default ProtectedRoute;

