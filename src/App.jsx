import React, { useEffect, useState } from "react";
import TicketsTable from "./components/TicketsTable";
import Footer from "./components/Footer";
import ThemeController from "./components/ThemeController";
import TicketModal from "./components/TicketModal";

function App() {
  const [tickets, setTickets] = useState([]);
  const [ticket, setTicket] = useState([]);

  useEffect(() => {
    const token = "61d36dcc9080061a680b34b242394257dd7e74ec";
    fetch("http://127.0.0.1:8000/tickets/", {
      headers: { "Content-Type": "application/json",
        Authorization: `Token ${token}`
      },
    })
      .then((res) => res.json())
      .then((data) => setTickets(data.results || data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <ThemeController />
      <h1 className="text-2xl font-bold mb-4">My Tickets</h1>
      <TicketsTable tickets={tickets} />
      <TicketModal ticket={ticket} />
      <Footer />
    </div>
  );
}

export default App;
