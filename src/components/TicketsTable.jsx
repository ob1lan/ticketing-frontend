import React, { useState } from "react";
import PropTypes from "prop-types";
import TicketModal from "./TicketModal";

function TicketsTable({ tickets }) {
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleOpenModal = (ticket) => {
    setSelectedTicket(ticket);
    document.getElementById("ticket_modal").showModal();
  };

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Title</th>
            <th className="text-center">Priority</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => {
            let badgeClass = "badge-ghost";
            if (ticket.status === "open") badgeClass = "badge-error";
            else if (ticket.status === "pending") badgeClass = "badge-warning";
            else if (ticket.status === "in_progress") badgeClass = "badge-info";
            else if (ticket.status === "resolved") badgeClass = "badge-success";
            else if (ticket.status === "closed") badgeClass = "badge-neutral";

            return (
              <tr key={ticket.unique_reference} className="hover">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src={ticket.company_logo}
                          alt="Ticket's company logo" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{ticket.unique_reference}</div>
                      <span className={`badge ${badgeClass} badge-sm`}>{ticket.status}</span>
                    </div>
                  </div>
                </td>
                <td>
                  {ticket.title}
                  <br />
                  <span className="badge badge-ghost badge-sm">{ticket.type}</span>
                </td>
                <td className="text-center">{ticket.priority}</td>
                <th>
                  <button className="btn btn-ghost btn-xs" onClick={() => handleOpenModal(ticket)}>details</button>
                </th>
              </tr>
            );
          })}
        </tbody>
      </table>
      <TicketModal ticket={selectedTicket} />
    </div>
  );
}

TicketsTable.propTypes = {
  tickets: PropTypes.arrayOf(
    PropTypes.shape({
      unique_reference: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,    
};

export default TicketsTable;