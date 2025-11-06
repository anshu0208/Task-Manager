import React, { useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./pages/Dashboard";
import PendingPage from "./pages/PendingPage";
import CompletedPage from "./pages/CompletedPage";
import Profile from "./components/Profile";

const App = () => {
  const navigate = useNavigate();

  // Load current user from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  // Keep localStorage in sync
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  // Handle login/signup submission
  const handleAuthSubmit = (data) => {
    const user = {
      email: data.email,
      name: data.name || "User",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        data.name || "User"
      )}&background=random`,
    };
    setCurrentUser(user);
    navigate("/", { replace: true });
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/login", { replace: true });
  };

  // Protected layout wrapper
  const ProtectedLayout = () =>
    currentUser ? (
      <Layout user={currentUser} onLogout={handleLogout}>
        <Outlet />
      </Layout>
    ) : (
      <Navigate to="/login" replace />
    );

  return (
    <Routes>
      {/* ---------- Auth Routes ---------- */}
      <Route
        path="/login"
        element={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Login
              onSubmit={handleAuthSubmit}
              onSwitchMode={() => navigate("/signup")}
            />
          </div>
        }
      />

      <Route
        path="/signup"
        element={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Signup
              onSubmit={handleAuthSubmit}
              onSwitchMode={() => navigate("/login")}
            />
          </div>
        }
      />

      {/* ---------- Protected Routes ---------- */}
      <Route
        element={
          currentUser ? <ProtectedLayout /> : <Navigate to="/login" replace />
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/pending" element={<PendingPage />} />
        <Route path="/complete" element={<CompletedPage />} />
        <Route path="/profile" element={<Profile user={currentUser} setCurrentUser={setCurrentUser} onLogout= {handleLogout} />} />
        <Route
          path="welcome"
          element={
            <div className="p-6 text-gray-700">
              Welcome to your Dashboard!
            </div>
          }
        />
      </Route>

      {/* ---------- Fallback ---------- */}
      <Route
        path="*"
        element={<Navigate to={currentUser ? "/" : "/login"} replace />}
      />
    </Routes>
  );
};

export default App;
