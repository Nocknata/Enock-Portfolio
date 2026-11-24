
import {
  lazy,
  Suspense,
  useEffect,
  useState,
} from "react";

import { Routes, Route } from "react-router-dom";

import "./App.css";

// PUBLIC HOMEPAGE
import Navbar from "./components/Navbar1";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

// LAZY-LOADED PAGES
const ProjectDetails = lazy(() =>
  import("./components/ProjectDetails")
);

const AdminLogin = lazy(() =>
  import("./admin/AdminLogin")
);

const ProtectedRoute = lazy(() =>
  import("./admin/ProtectedRoute")
);

const AdminDashboard = lazy(() =>
  import("./admin/AdminDashboard")
);

// NEW: PASSWORD RECOVERY
const PasswordRecovery = lazy(() =>
  import("./admin/PasswordRecovery")
);

function PageLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <p>Loading page...</p>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("portfolio-theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) =>
      current === "dark" ? "light" : "dark"
    );
  }

  return (
    <Routes>

      {/* PUBLIC HOMEPAGE */}
      <Route
        path="/"
        element={
          <div className="app">
            <Navbar
              theme={theme}
              toggleTheme={toggleTheme}
            />

            <main>
              <Hero />
              <Projects />
              <About />
              <Skills />
              <Experience />
              <Contact />
            </main>
          </div>
        }
      />

      {/* PROJECT CASE STUDIES */}
      <Route
        path="/projects/:id"
        element={
          <Suspense fallback={<PageLoading />}>
            <ProjectDetails />
          </Suspense>
        }
      />

      {/* ADMIN LOGIN */}
      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<PageLoading />}>
            <AdminLogin />
          </Suspense>
        }
      />

      {/* FORGOT PASSWORD */}
      <Route
        path="/admin/forgot-password"
        element={
          <Suspense fallback={<PageLoading />}>
            <PasswordRecovery />
          </Suspense>
        }
      />

      {/* RESET PASSWORD */}
      <Route
        path="/admin/reset-password"
        element={
          <Suspense fallback={<PageLoading />}>
            <PasswordRecovery />
          </Suspense>
        }
      />

      {/* PROTECTED ADMIN DASHBOARD */}
      <Route
        path="/admin"
        element={
          <Suspense fallback={<PageLoading />}>
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          </Suspense>
        }
      />

    </Routes>
  );
}

export default App;
