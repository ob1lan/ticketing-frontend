import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileModal from "../components/ProfileModal";
import SettingsModal from "../components/SettingsModal";
import TicketsTable from "../components/TicketsTable";
import CounterCards from "../components/CounterCards";
import CreateTicketModal from "../components/CreateTicketModal";
import { jwtDecode } from "jwt-decode";
import { fetchProfile, fetchTickets, fetchCompanies } from "../api";

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [includeClosed, setIncludeClosed] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  useEffect(() => {
    fetchProfile().then(data => setProfile(data));

    if (user?.role === "admin") {
      fetchCompanies(1)
        .then((data) => setCompanies(data.results || []))
        .catch((err) => console.error("Failed to fetch companies", err))
        .finally(() => setLoadingCompanies(false));
    }
  }, [user]);

  const handleToggleClosed = () => {
    setIncludeClosed((prev) => !prev);
    setCurrentPage(1);
  };

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
    const delayDebounce = setTimeout(() => {
      loadTickets(1, statusFilter, searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    loadTickets(currentPage, statusFilter, searchQuery);
  }, [currentPage, statusFilter, includeClosed]);

  const loadTickets = async (page, status = statusFilter, query = searchQuery) => {
    try {
      const data = await fetchTickets(page, status, query, includeClosed);
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

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
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

  const handleTicketUpdated = (updatedTicket) => {
    setTickets((prevTickets) =>
      prevTickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
    );
  };

  return (
    <>
      {!loadingCompanies && companies.length === 0 && (
        <div className="alert alert-warning shadow-lg mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </svg>
          <div>
            <h3 className="font-bold">No company found!</h3>
            <div className="text-xs">Please create at least one company in the admin panel to use the ticketing system.</div>
          </div>
        </div>
      )}

      <div className="divider">Stats</div>
      <CounterCards />
      <div className="divider">
        <button className="btn btn-soft btn-success" onClick={handleOpenModal} disabled={companies.length === 0}>New Ticket</button>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn">
            Status: {statusFilter || "Not Closed"} ▼
          </div>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><a onClick={() => handleStatusChange("")}>Not Closed</a></li>
            <li><a onClick={() => handleStatusChange("open")}>Open</a></li>
            <li><a onClick={() => handleStatusChange("pending")}>Pending</a></li>
            <li><a onClick={() => handleStatusChange("in_progress")}>In Progress</a></li>
            <li><a onClick={() => handleStatusChange("resolved")}>Resolved</a></li>
            <li><a onClick={() => handleStatusChange("closed")}>Closed</a></li>
          </ul>
        </div>
        <label className="input w-170">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            className="grow"
            placeholder="Search in the title"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </label>
        <fieldset className="fieldset p-2 bg-base-100 border border-base-300 rounded-box w-64">
          <label className="fieldset-label flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeClosed}
              onChange={handleToggleClosed}
              className="toggle toggle-success"
            />
            Include Closed
          </label>
        </fieldset>
      </div>
      {tickets.length !== 0 ? (
        <>
          <TicketsTable tickets={tickets} onTicketUpdated={handleTicketUpdated} />

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
        </>
      ) : (
        <div className="alert alert-warning shadow-lg mt-6 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </svg>
          <div>
            <h3 className="font-bold">No ticket found!</h3>
            <div className="text-xs">Make sure you created a company first, then create a new ticket.</div>
          </div>
        </div>
      )}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onTicketCreated={handleTicketCreated}
        user={user}
      />
      {isProfileOpen && <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={user} />}
      {isSettingsOpen && <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />}
    </>
  );
}

export default Dashboard;