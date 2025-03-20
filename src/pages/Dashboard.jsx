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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

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
    loadTickets(currentPage);
  }, [currentPage]);

  const loadTickets = async (page) => {
    try {
      const data = await fetchTickets(page);
      setTickets(data.results);
      setTotalPages(Math.ceil(data.count / 5));
      setNextPage(data.next);
      setPrevPage(data.previous);
    } catch (error) {
      navigate("/login", { replace: true });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleOpenModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleTicketCreated = (newTicket) => {
    setTickets([newTicket, ...tickets]);
  };

  return (
    <>
      <Navbar onOpenProfile={() => setIsProfileOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} profile={profile} user={user} />
      <div className="divider">Stats</div>
      <CounterCards />
      <div className="divider">
        <button className="btn btn-soft btn-success" onClick={handleOpenModal}>New Ticket</button>
      </div>
      <TicketsTable tickets={tickets} />
      {/* Pagination Controls */}
      <div className="join p-2">
        <button
          className="join-item btn"
          disabled={!prevPage}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          «
        </button>
        <span className="join-item btn">Page {currentPage} of {totalPages}</span>
        <button
          className="join-item btn"
          disabled={!nextPage}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          »
        </button>
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