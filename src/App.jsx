import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TicketsTable from "./components/TicketsTable";
import Footer from "./components/Footer";
import CounterCards from "./components/CounterCards";
import Login from "./components/Login";
import ProtectedRoute from "./middlewares/ProtectedRoute";

function Dashboard() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    fetch("http://127.0.0.1:8000/tickets/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setTickets(data.results || data))
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("authToken"); // Remove invalid token
        window.location.href = "/login"; // Redirect to login
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="divider">Stats</div>
      <CounterCards tickets={tickets} />
      <div className="divider">
        <h1 className="text-2xl font-bold mb-3">Tickets</h1>
      </div>
      <TicketsTable tickets={tickets} />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Default Route Redirects to Login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
