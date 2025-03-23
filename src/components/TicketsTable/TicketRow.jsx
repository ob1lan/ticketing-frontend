import React from "react";
import PropTypes from "prop-types";
import { STATUS_LABELS, STATUS_BADGES, TICKET_PRIORITIES, TICKET_TYPES, TICKET_PRIORITY_CLASSES, TICKET_TYPE_BADGE_CLASSES } from "../../utils/constants";

function TicketRow({ ticket, onClickDetails }) {
  const badgeClass = STATUS_BADGES[ticket.status] || "badge-ghost";
  const statusLabel = STATUS_LABELS[ticket.status] || ticket.status;
  const priorityLabel = TICKET_PRIORITIES[ticket.priority] || ticket.priority;
  const priorityClass = TICKET_PRIORITY_CLASSES[ticket.priority];

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
        <span className={`badge badge-sm ${TICKET_TYPE_BADGE_CLASSES[ticket.type] || "badge-ghost"}`}>
          {TICKET_TYPES[ticket.type] || ticket.type}
        </span>
      </td>
      <td className="text-center">{ticket.created_by_fullname}</td>
      <td>
        <div className="flex items-center gap-2">
          {ticket.priority === "high" ? (
            <div className="inline-grid *:[grid-area:1/1]">
              <div className="status status-error animate-ping" />
              <div className="status status-error" />
            </div>
          ) : (
            <div className={`status ${priorityClass}`} aria-label={priorityLabel} />
          )}
          {priorityLabel}
        </div>
      </td>
      <td className="text-center">{ticket.assignee_fullname || "None"}</td>
      <th>
        <button className="btn btn-soft btn-primary btn-xs" onClick={onClickDetails}>details</button>
      </th>
    </tr>
  );
}

TicketRow.propTypes = {
  ticket: PropTypes.object.isRequired,
  onClickDetails: PropTypes.func.isRequired,
};

export default TicketRow;
