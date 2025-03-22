import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TicketModal from "./TicketModal";
import { fetchTicketById } from "../api";

function TicketsTable({ tickets, onTicketUpdated }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = (ticket) => {
    fetchTicketById(ticket.id).then((data) => {
      setSelectedTicket(data);
      setModalVisible(true);
    });
  };

  useEffect(() => {
    if (modalVisible && selectedTicket) {
      const modal = document.getElementById("ticket_modal");
      if (modal) modal.showModal();
    }
  }, [modalVisible, selectedTicket]);

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Title</th>
            <th className="text-center">Requester</th>
            <th className="text-center">Priority</th>
            <th className="text-center">Assignee</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => {
            let statusValue = ticket.status;
            let badgeClass = "badge-ghost";
            if (ticket.status === "open") {
              badgeClass = "badge-error";
              statusValue = "Open";
            }
            else if (ticket.status === "pending") {
              badgeClass = "badge-warning";
              statusValue = "Pending";
            }
            else if (ticket.status === "in_progress") {
              badgeClass = "badge-info";
              statusValue = "In Progress";
            }
            else if (ticket.status === "resolved") {
              badgeClass = "badge-success";
              statusValue = "Resolved";
            }
            else if (ticket.status === "closed") {
              badgeClass = "badge-neutral";
              statusValue = "Closed";
            }
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
                      <span className={`badge ${badgeClass} badge-sm`}>{statusValue}</span>
                    </div>
                  </div>
                </td>
                <td>
                  {ticket.title}
                  <br />
                  <span className="badge badge-ghost badge-sm">{ticket.type}</span>
                </td>
                <td className="text-center">{ticket.created_by_fullname}</td>
                <td className="text-center">{ticket.priority}</td>
                <td className="text-center">{ticket.assignee_fullname}</td>
                <th>
                  <button className="btn btn-ghost btn-xs" onClick={() => handleOpenModal(ticket)}>details</button>
                </th>
              </tr>
            );
          })}
        </tbody>
      </table>
      <TicketModal ticket={selectedTicket} onTicketUpdated={onTicketUpdated} onCloseModal={() => {
        setModalVisible(false);
        setSelectedTicket(null);
      }} />
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
  onTicketUpdated: PropTypes.func.isRequired,
};

export default TicketsTable;