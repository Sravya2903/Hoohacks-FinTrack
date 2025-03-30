import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";

// Components
import Navbar from "./components/Navbar";

// Pages
import LandingPage from "./pages/LandingPage";
import WelcomePage from "./pages/WelcomePage";
import SetupWizardPage from "./pages/SetupWizardPage";
import ExpenseTrackerPage from "./pages/ExpenseTrackerPage";
import DashboardPage from "./pages/DashboardPage";
import InsightsPage from "./pages/InsightsPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // Check session on mount
  useEffect(() => {
    axios
      .get("http://localhost:3010/api/session", { withCredentials: true })
      .then((res) => {
        setIsAuthenticated(res.data.authenticated);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">
        Checking session...
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/welcome" /> : <LandingPage />
            }
          />
          <Route
            path="/welcome"
            element={isAuthenticated ? <WelcomePage /> : <Navigate to="/" />}
          />
          <Route
            path="/setup"
            element={
              isAuthenticated ? <SetupWizardPage /> : <Navigate to="/" />
            }
          />
          <Route
            path="/tracker"
            element={
              isAuthenticated ? <ExpenseTrackerPage /> : <Navigate to="/" />
            }
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/" />}
          />
          <Route
            path="/insights"
            element={isAuthenticated ? <InsightsPage /> : <Navigate to="/" />}
          />
          <Route
            path="/history"
            element={isAuthenticated ? <HistoryPage /> : <Navigate to="/" />}
          />
          <Route
            path="/settings"
            element={isAuthenticated ? <SettingsPage /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
