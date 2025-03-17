import React from "react";
import PropTypes from "prop-types";

function TicketModal({ ticket }) {
  if (!ticket) return null;

  return (
    <dialog id="ticket_modal" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg">Ticket {ticket.unique_reference}</h3>
        <p className="py-4">Title: {ticket.title}</p>
        <p>Type: {ticket.type}</p>
        <p>Priority: {ticket.priority}</p>
        <p>Status: {ticket.status}</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

TicketModal.propTypes = {
  ticket: PropTypes.shape({
    unique_reference: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }),
};

export default TicketModal;
