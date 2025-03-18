import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TicketsTable from "../components/TicketsTable";
import Footer from "../components/Footer";
import CounterCards from "../components/CounterCards";


function Dashboard() {
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setTimeout(() => navigate("/login", { replace: true }), 100);
          return;
        }
  
        fetch("http://127.0.0.1:8000/tickets/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Unauthorized");
            return res.json();
          })
          .then((data) => setTickets(data.results || data))
          .catch((err) => {
            console.error(err);
            localStorage.removeItem("accessToken");
            navigate("/login", { replace: true });
          });
      }, [navigate]);
  
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

export default Dashboard;