import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import { updateTicket, fetchTicketComments, postTicketComment, fetchTicketTimeEntries, fetchAssignees } from "../api";


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
  const [editedTicket, setEditedTicket] = useState({
    title: ticket?.title || "",
    type: ticket?.type || "",
    priority: ticket?.priority || "",
    status: ticket?.status || "",
    assignee: ticket?.assignee || "",
    description: ticket?.description || "",
  });

  useEffect(() => {
    if (!ticket) return;

    setEditedTicket({
      title: ticket.title,
      type: ticket.type,
      priority: ticket.priority,
      status: ticket.status,
      assignee: ticket.assignee,
      description: ticket.description,
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

  const totalTimeSpent = timeEntries.reduce((sum, entry) => sum + entry.minutes, 0);

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

  if (!ticket) return null;

  return (
    <dialog id="ticket_modal" className="modal">
      <div className="modal-box container">
        <h3 className="font-bold text-lg">
          <span
            className={`badge ${ticket.status === "open"
              ? "badge-error"
              : ticket.status === "pending"
                ? "badge-warning"
                : ticket.status === "in_progress"
                  ? "badge-info"
                  : ticket.status === "resolved"
                    ? "badge-success"
                    : "badge-neutral"
              }`}
          >
            {ticket.status === "open"
              ? "Open"
              : ticket.status === "pending"
                ? "Pending"
                : ticket.status === "in_progress"
                  ? "In Progress"
                  : ticket.status === "resolved"
                    ? "Resolved"
                    : ticket.status === "closed"
                      ? "Closed"
                      : "Unknown"}
          </span>

          {" "}
          Ticket {ticket.unique_reference}
        </h3>
        <h5>
          <em>Created</em> {formatTimestamp(ticket.created_at)} -{" "}
          <em>Updated</em> {formatTimestamp(ticket.updated_at)}
        </h5>

        {/* Tabs Navigation */}
        <div role="tablist" className="tabs tabs-border mt-4">
          <a
            role="tab"
            className={`tab ${activeTab === "details" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Description
          </a>
          <a
            role="tab"
            className={`tab ${activeTab === "comments" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("comments")}
          >
            Comments
          </a>
          <a
            role="tab"
            className={`tab ${activeTab === "timespent" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("timespent")}
          >
            Time Spent
          </a>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "details" && (
            <>
              {/* Ticket Edit Form */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                {/* Type */}
                <label className="fieldset w-full">
                  <span className="fieldset-label font-bold">Type</span>
                  <select
                    className="select select-bordered w-full"
                    value={editedTicket.type}
                    onChange={(e) => setEditedTicket({ ...editedTicket, type: e.target.value })}
                    required
                  >
                    <option value="service_request">📝 Service Request</option>
                    <option value="change_request">🔧 Change Request</option>
                    <option value="incident">⚠️ Incident</option>
                  </select>
                </label>

                {/* Priority */}
                <label className="fieldset w-full">
                  <span className="fieldset-label font-bold">Priority</span>
                  <select
                    className="select select-bordered w-full"
                    value={editedTicket.priority}
                    onChange={(e) => setEditedTicket({ ...editedTicket, priority: e.target.value })}
                    required
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </label>

                {/* Status */}
                <label className="fieldset w-full">
                  <span className="fieldset-label font-bold">Status</span>
                  <select
                    className="select select-bordered w-full"
                    value={editedTicket.status}
                    onChange={(e) => setEditedTicket({ ...editedTicket, status: e.target.value })}
                  >
                    <option value="open">🛠️ Open</option>
                    <option value="pending">⏳ Pending</option>
                    <option value="in_progress">🚧 In Progress</option>
                    <option value="resolved">✅ Resolved</option>
                    <option value="closed">🔒 Closed</option>
                  </select>
                </label>

                {/* Assignee */}
                <label className="fieldset w-full">
                  <span className="fieldset-label font-bold">Assignee</span>
                  <select
                    className="select select-bordered w-full"
                    value={editedTicket.assignee}
                    onChange={(e) => setEditedTicket({ ...editedTicket, assignee: e.target.value })}
                  >
                    <option value="">Non assigné</option>
                    {Array.isArray(assignees) &&
                      assignees.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.first_name} {user.last_name}
                        </option>
                      ))}
                  </select>
                </label>
              </div>

              {/* Description (Editable) */}
              <div className="grid mt-4">
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend">Description</legend>
                  <textarea className="textarea h-30 w-full" placeholder="Description" value={editedTicket.description} onChange={(e) => setEditedTicket({ ...editedTicket, description: e.target.value })}
                    required></textarea>
                </fieldset>
              </div>

              {/* Save Button */}
              <div className="modal-action">
                <button className="btn btn-primary" onClick={handleSaveChanges}>Save Changes</button>
              </div>
            </>
          )}

          {activeTab === "comments" && (
            <>
              <div className="h-60 overflow-y-auto p-2 rounded-lg">
                {loadingComments && <p>Loading comments...</p>}
                {errorComments && <p className="text-error">{errorComments}</p>}
                {comments.length === 0 && !loadingComments && <p>No comments yet.</p>}
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`chat ${comment.author_role === "admin" ? "chat-end" : "chat-start"
                      }`}
                  >
                    <div className="chat-image avatar avatar-rounded">
                      <div className={comment?.author_role === "admin" ? "ring-warning ring-offset-base-100 w-10 rounded-full ring ring-offset-2" : "ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2"} >
                        <img
                          alt={comment.author_fullName}
                          src={comment?.author_avatar ? comment?.author_avatar : `https://api.dicebear.com/7.x/identicon/svg?seed=username`}
                        />
                      </div>
                    </div>
                    <div className="chat-header">
                      {comment.author_fullName}
                      <time className="text-xs opacity-50 ml-2">
                        {formatTimestamp(comment.created_at)}
                      </time>
                    </div>
                    <div
                      className="chat-bubble"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.message) }}
                    />
                  </div>
                ))}
              </div>
              {/* New Comment Editor Section */}
              <div className="mt-4">
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend">Add a comment</legend>
                  <textarea className="textarea h-30 w-full" placeholder="Comment" value={newComment} onChange={(e) => setNewComment(e.target.value)}>
                  </textarea>
                </fieldset>
                <div className="mt-3">
                  <button
                    onClick={handleSubmitComment}
                    disabled={isSubmittingComment}
                    className="btn btn-primary"
                  >
                    {isSubmittingComment ? "Posting..." : "Post Comment"}
                  </button>
                  {errorPostingComment && (
                    <p className="text-error mt-2">{errorPostingComment}</p>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === "timespent" && (
            <div className="h-60 overflow-y-auto p-2 rounded-lg">
              {loadingTime && <p>Loading time entries...</p>}
              {errorTime && <p className="text-error">{errorTime}</p>}
              {!loadingTime && timeEntries.length === 0 && (
                <p>No time entries recorded.</p>
              )}

              {timeEntries.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">
                    Total Time Spent: {totalTimeSpent} minutes
                  </h3>
                </div>
              )}

              {timeEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="card bg-base-200 p-3 mb-2 shadow-md"
                >
                  <div className="flex justify-between">
                    <span className="font-bold">{entry.operator_fullname}</span>
                    <span className="text-sm opacity-70">
                      {formatTimestamp(entry.created_at)}
                    </span>
                  </div>
                  <div className="text-md">⏳ {entry.minutes} minutes logged</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Close Button */}
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
};

export default TicketModal;
