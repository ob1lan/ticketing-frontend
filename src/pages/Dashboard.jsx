import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TicketsTable from "../components/TicketsTable";
import Footer from "../components/Footer";
import CounterCards from "../components/CounterCards";
import CreateTicketModal from "../components/CreateTicketModal";
import ProfileModal from "../components/ProfileModal";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
    const [tickets, setTickets] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({ username: decoded.username, role: decoded.role });
                console.log("User:", decoded);
            } catch (error) {
                console.error("Failed to decode JWT:", error);
            }
        }
    }, []);
  
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
  

      const handleOpenModal = () => {
        setIsCreateModalOpen(true);
      };
    
      const handleCloseModal = () => {
        setIsCreateModalOpen(false);
      };
    
      const handleTicketCreated = (newTicket) => {
        // Optionally, update the tickets list with the new ticket
        setTickets([newTicket, ...tickets]);
      };

    return (
      <>
        <Navbar user={user} />
        <div className="divider">Stats</div>
        <CounterCards tickets={tickets} />
        <div className="divider">
            <button className="btn btn-soft btn-success" onClick={handleOpenModal}>New Ticket</button>
        </div>
        <TicketsTable tickets={tickets} />
        <div className="join p-2">
            <button className="join-item btn">«</button>
            <button className="join-item btn">Page 22</button>
            <button className="join-item btn">»</button>
        </div>
        <CreateTicketModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModal}
          onTicketCreated={handleTicketCreated}
          user={user}
        />
        <Footer />
      </>
    );
  }

export default Dashboard;