import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TicketsTable from "../components/TicketsTable";
import Footer from "../components/Footer";
import CounterCards from "../components/CounterCards";
import NewTicketModal from "../components/NewTicketModal";


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
  

    const showCreateModal = () => {
        const modal = document.getElementById("createTicketModal");
        modal.classList.add("show-modal");
    };

    return (
      <>
        <Navbar />
        <div className="divider">Stats</div>
        <CounterCards tickets={tickets} />
        <div className="divider">
            <button className="btn btn-soft btn-success" onClick={showCreateModal}>New Ticket</button>
        </div>
        <TicketsTable tickets={tickets} />
        <div className="join pb-2">
            <button className="join-item btn">«</button>
            <button className="join-item btn">Page 22</button>
            <button className="join-item btn">»</button>
        </div>
        <NewTicketModal />
        <Footer />
      </>
    );
  }

export default Dashboard;