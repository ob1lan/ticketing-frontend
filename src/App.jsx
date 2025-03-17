import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import TicketsTable from "./components/TicketsTable";
import Footer from "./components/Footer";
import CounterCards from "./components/CounterCards";

function App() {
  const [tickets, setTickets] = useState([]);

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
    <>
      <Navbar />
      <div className="divider">Stats</div>
      <CounterCards tickets={tickets} />
      <div className="divider"><h1 className="text-2xl font-bold mb-3">Tickets</h1></div>
      <TicketsTable tickets={tickets} />
      <Footer />
    </>
  );
}

export default App;
