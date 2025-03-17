import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function TicketModal({ ticket }) {
  const [activeTab, setActiveTab] = useState("details");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab === "comments" && ticket) {
      fetchComments(ticket.id);
    }
  }, [activeTab, ticket]);

  const fetchComments = async (ticketId) => {
    setLoading(true);
    setError(null);
    const token = "61d36dcc9080061a680b34b242394257dd7e74ec"; // Dev token

    try {
      const response = await fetch(`http://127.0.0.1:8000/tickets/${ticketId}/comments/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to load comments");

      const data = await response.json();
      setComments(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  if (!ticket) return null;

  return (
    <dialog id="ticket_modal" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg"> 
            <span className={`badge ${ticket.status === "open" ? "badge-error" :
                    ticket.status === "pending" ? "badge-warning" :
                    ticket.status === "in_progress" ? "badge-info" :
                    ticket.status === "resolved" ? "badge-success" :
                    "badge-neutral"
                }`}>{ticket.status}
            </span>{" "}
                Ticket {ticket.unique_reference}
        </h3>
        <p>Created {formatTimestamp(ticket.created_at)} - Updated {formatTimestamp(ticket.updated_at)}</p>

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
                <textarea className="textarea w-full" placeholder="Ticket's description" disabled>{ticket.description}</textarea>
            )}

          {activeTab === "comments" && (
            <div className="h-60 overflow-y-auto p-2 rounded-lg">
              {loading && <p>Loading comments...</p>}
              {error && <p className="text-error">{error}</p>}
              {comments.length === 0 && !loading && <p>No comments yet.</p>}
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`chat ${comment.author_name === "antoine" ? "chat-end" : "chat-start"}`}
                >
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt={comment.author_name}
                        src={`https://api.dicebear.com/7.x/identicon/svg?seed=${comment.author_name}`}
                      />
                    </div>
                  </div>
                  <div className="chat-header">
                    {comment.author_name}
                    <time className="text-xs opacity-50 ml-2">{formatTimestamp(comment.created_at)}</time>
                  </div>
                  <div className="chat-bubble">{comment.message}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "timespent" && (
            <div>
              <p className="italic opacity-75">Time spent details coming soon...</p>
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
    id: PropTypes.string.isRequired, // UUID
    unique_reference: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }),
};

export default TicketModal;
