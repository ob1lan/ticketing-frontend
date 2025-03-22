import React from "react";
import PropTypes from "prop-types";

function TicketRow({ ticket, onClickDetails }) {
  let badgeClass = "badge-ghost";
  let statusLabel = ticket.status;

  if (ticket.status === "open") {
    badgeClass = "badge-error";
    statusLabel = "Open";
  } else if (ticket.status === "pending") {
    badgeClass = "badge-warning";
    statusLabel = "Pending";
  } else if (ticket.status === "in_progress") {
    badgeClass = "badge-info";
    statusLabel = "In Progress";
  } else if (ticket.status === "resolved") {
    badgeClass = "badge-success";
    statusLabel = "Resolved";
  } else if (ticket.status === "closed") {
    badgeClass = "badge-neutral";
    statusLabel = "Closed";
  }

  return (
    <tr key={ticket.unique_reference} className="hover">
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <img src={ticket.company_logo} alt="Company Logo" />
            </div>
          </div>
          <div>
            <div className="font-bold">{ticket.unique_reference}</div>
            <span className={`badge ${badgeClass} badge-sm`}>{statusLabel}</span>
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
        <button className="btn btn-ghost btn-xs" onClick={onClickDetails}>details</button>
      </th>
    </tr>
  );
}

TicketRow.propTypes = {
  ticket: PropTypes.object.isRequired,
  onClickDetails: PropTypes.func.isRequired,
};

export default TicketRow;
