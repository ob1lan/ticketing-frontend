import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  updateTicket,
  fetchTicketComments,
  postTicketComment,
  fetchTicketTimeEntries,
  fetchAssignees,
  fetchTicketHistory,
} from "../../api";

import TicketDetailsTab from "./TicketDetailsTab";
import TicketCommentsTab from "./TicketCommentsTab";
import TicketTimeSpentTab from "./TicketTimeSpentTab";
import TicketHistoryTab from "./TicketHistoryTab";
import { STATUS_BADGES, STATUS_LABELS } from "../../utils/constants";

function TicketModal({ ticket, onTicketUpdated }) {
  const [activeTab, setActiveTab] = useState("details");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [errorComments, setErrorComments] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [loadingTime, setLoadingTime] = useState(false);
  const [errorTime, setErrorTime] = useState(null);
  const [assignees, setAssignees] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [errorPostingComment, setErrorPostingComment] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [commentsView, setCommentsView] = useState("chat");
  const [editedTicket, setEditedTicket] = useState({
    title: ticket?.title || "",
    priority: ticket?.priority || "low",
    status: ticket?.status || "open",
    assignee: ticket?.assignee || "",
    description: ticket?.description || "",
    type: ticket?.type || "service_request",
  });

  useEffect(() => {
    if (!ticket) return;

    setEditedTicket({
      title: ticket.title,
      priority: ticket.priority,
      status: ticket.status,
      assignee: ticket.assignee,
      description: ticket.description,
      type: ticket.type,
    });

    fetchAssignees()
      .then((res) => {
        const data = Array.isArray(res) ? res : res.results || [];
        setAssignees(data);
      })
      .catch(console.error);

    if (activeTab === "comments") {
      fetchComments(ticket.id);
    } else if (activeTab === "timespent") {
      fetchTimeEntries(ticket.id);
    }
    else if (activeTab === "history") {
      setLoadingHistory(true);
      fetchTicketHistory(ticket.id)
        .then(data => setHistory(data.results || []))
        .catch(console.error)
        .finally(() => setLoadingHistory(false));
    }
  }, [ticket, activeTab]);

  const handleSaveChanges = async () => {
    try {
      const updatedTicket = await updateTicket(ticket.id, editedTicket);
      setEditedTicket(updatedTicket);
      onTicketUpdated(updatedTicket);
    } catch (error) {
      console.error("Failed to update ticket", error);
    }
  };

  const fetchComments = async (ticketId) => {
    setLoadingComments(true);
    setErrorComments(null);
    try {
      const data = await fetchTicketComments(ticketId);
      setComments(data.results);
    } catch (err) {
      setErrorComments(err.message);
    } finally {
      setLoadingComments(false);
    }
  };

  const fetchTimeEntries = async (ticketId) => {
    setLoadingTime(true);
    setErrorTime(null);
    try {
      const data = await fetchTicketTimeEntries(ticketId);
      setTimeEntries(data.results);
    } catch (err) {
      setErrorTime(err.message);
    } finally {
      setLoadingTime(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    setIsSubmittingComment(true);
    setErrorPostingComment(null);
    try {
      await postTicketComment(ticket.id, newComment);
      fetchComments(ticket.id);
      setNewComment("");
    } catch (err) {
      setErrorPostingComment(err.message);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const totalTimeSpent = timeEntries.reduce((sum, entry) => sum + entry.minutes, 0);

  if (!ticket) return null;

  return (
    <dialog id="ticket_modal" className="modal">
      <div className="modal-box container">
        <h3 className="font-bold text-lg">
          <span className={`badge ${STATUS_BADGES[ticket.status]}`}>{STATUS_LABELS[ticket.status]}</span>
          {" "}
          Ticket {ticket.unique_reference}
        </h3>
        <h5>
          <em>Created</em> {formatTimestamp(ticket.created_at)} –{" "}
          <em>Updated</em> {formatTimestamp(ticket.updated_at)}
        </h5>

        {/* Tabs */}
        <div role="tablist" className="tabs tabs-border mt-4">
          {["details", "comments", "timespent", "history"].map((tab) => (
            <a
              key={tab}
              role="tab"
              className={`tab ${activeTab === tab ? "tab-active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {{
                details: "Description",
                comments: "Comments",
                timespent: "Time Spent",
                history: "History",
              }[tab]}
            </a>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "details" && (
            <>
              <TicketDetailsTab
                editedTicket={editedTicket}
                setEditedTicket={setEditedTicket}
                assignees={assignees}
              />
              <div className="modal-action">
                <button className="btn btn-primary" onClick={handleSaveChanges}>
                  Save Changes
                </button>
              </div>
            </>
          )}

          {activeTab === "comments" && (
            <>
              <div className="flex justify-end mb-2">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() =>
                    setCommentsView((prev) => (prev === "chat" ? "card" : "chat"))
                  }
                >
                  {commentsView === "chat" ? "Switch to Card View" : "Switch to Chat View"}
                </button>
              </div>

              <TicketCommentsTab
                comments={comments}
                newComment={newComment}
                setNewComment={setNewComment}
                loadingComments={loadingComments}
                errorComments={errorComments}
                isSubmittingComment={isSubmittingComment}
                errorPostingComment={errorPostingComment}
                handleSubmitComment={handleSubmitComment}
                formatTimestamp={formatTimestamp}
                view={commentsView}
              />
            </>
          )}

          {activeTab === "timespent" && (
            <TicketTimeSpentTab
              timeEntries={timeEntries}
              loadingTime={loadingTime}
              errorTime={errorTime}
              totalTimeSpent={totalTimeSpent}
              formatTimestamp={formatTimestamp}
            />
          )}
        </div>

        {activeTab === "history" && (
          loadingHistory ? <p>Loading history...</p> : (
            <TicketHistoryTab
              history={history}
              formatTimestamp={formatTimestamp}
            />
          )
        )}

        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog >
  );
}

TicketModal.propTypes = {
  ticket: PropTypes.shape({
    id: PropTypes.string.isRequired,
    unique_reference: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    description: PropTypes.string,
    created_at: PropTypes.string.isRequired,
    updated_at: PropTypes.string.isRequired,
  }),
  onTicketUpdated: PropTypes.func.isRequired,
};

export default TicketModal;
