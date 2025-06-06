import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import Users from "./pages/Users";
import ProtectedRoute from "./middleware/ProtectedRoute";
import Layout from "./layout/Layout";

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
          <Route path="/companies" element={
            <Layout>
              <Companies />
            </Layout>
          } />
        </Route>
        <Route path="/users" element={
          <Layout>
            <Users />
          </Layout>
        } />

        {/* Default Route Redirects to Login */}
        <Route path="*" element={localStorage.getItem("accessToken") ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
