import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProfileModal from "../components/ProfileModal";
import SettingsModal from "../components/SettingsModal";
import TicketsTable from "../components/TicketsTable";
import Footer from "../components/Footer";
import CounterCards from "../components/CounterCards";
import CreateTicketModal from "../components/CreateTicketModal";
import { jwtDecode } from "jwt-decode";
import { fetchProfile, fetchTickets } from "../api";

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    fetchProfile().then(data => setProfile(data));
  }, []);


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ username: decoded.username, role: decoded.role });
      } catch (error) {
        console.error("Failed to decode JWT:", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchTickets()
      .then(data => setTickets(data.results || data))
      .catch(() => navigate("/login", { replace: true }));
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
      <Navbar onOpenProfile={() => setIsProfileOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} profile={profile} user={user} />
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
      {isProfileOpen && <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={user} />}
      {isSettingsOpen && <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />}
    </>
  );
}

export default Dashboard;