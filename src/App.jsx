
import {
  lazy,
  Suspense,
  useEffect,
  useState,
} from "react";

import { Routes, Route } from "react-router-dom";

import "./App.css";

// ==========================================
// PUBLIC HOMEPAGE COMPONENTS
// These load normally with the homepage.
// ==========================================

import Navbar from "./components/Navbar1";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

// ==========================================
// LAZY-LOADED PAGES
// These load only when needed.
// ==========================================

// Public project case studies
const ProjectDetails = lazy(() =>
  import("./components/ProjectDetails")
);

// Admin login
const AdminLogin = lazy(() =>
  import("./admin/AdminLogin")
);

// Protected admin route
const ProtectedRoute = lazy(() =>
  import("./admin/ProtectedRoute")
);

// Admin dashboard
const AdminDashboard = lazy(() =>
  import("./admin/AdminDashboard")
);

// ==========================================
// LOADING FALLBACK
// ==========================================

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

// ==========================================
// MAIN APPLICATION
// ==========================================

function App() {
  // THEME STATE
  const [theme, setTheme] = useState(() => {
    return (
      localStorage.getItem("portfolio-theme") ||
      "dark"
    );
  });

  // SAVE THEME
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem(
      "portfolio-theme",
      theme
    );
  }, [theme]);

  // SWITCH DARK / LIGHT MODE
  function toggleTheme() {
    setTheme((current) =>
      current === "dark" ? "light" : "dark"
    );
  }

  return (
    <Routes>

      {/* ====================================
          PUBLIC HOMEPAGE
          ==================================== */}

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

      {/* ====================================
          PROJECT CASE STUDIES
          ==================================== */}

      <Route
        path="/projects/:id"
        element={
          <Suspense fallback={<PageLoading />}>
            <ProjectDetails />
          </Suspense>
        }
      />

      {/* ====================================
          ADMIN LOGIN
          ==================================== */}

      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<PageLoading />}>
            <AdminLogin />
          </Suspense>
        }
      />

      {/* ====================================
          PROTECTED ADMIN DASHBOARD
          ==================================== */}

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
