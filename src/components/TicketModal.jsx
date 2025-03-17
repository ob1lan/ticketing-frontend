import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Editor } from "@tinymce/tinymce-react";

function TicketModal({ ticket }) {
  const [activeTab, setActiveTab] = useState("details");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [errorComments, setErrorComments] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [loadingTime, setLoadingTime] = useState(false);
  const [errorTime, setErrorTime] = useState(null);

  const editorRef = useRef(null);

  useEffect(() => {
    if (activeTab === "comments" && ticket) {
      fetchComments(ticket.id);
    }
  }, [activeTab, ticket]);

  useEffect(() => {
    if (activeTab === "timespent" && ticket) {
      fetchTimeEntries(ticket.id);
    }
  }, [activeTab, ticket]);

  const fetchComments = async (ticketId) => {
    setLoadingComments(true);
    setErrorComments(null);
    
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://127.0.0.1:8000/tickets/${ticketId}/comments/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to load comments");

      const data = await response.json();
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
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://127.0.0.1:8000/tickets/${ticketId}/time-entries/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to load time entries");

      const data = await response.json();
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
          }`}>
            {ticket.status}
          </span>{" "}
          Ticket {ticket.unique_reference}
        </h3>
        <h5>
          <em>Created</em> {formatTimestamp(ticket.created_at)} - 
          <em> Updated</em> {formatTimestamp(ticket.updated_at)}
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
            <Editor
              apiKey="exntuwohcc26tmyo74spy1dxscradb69wx8dn79stb9tsqbz"
              onInit={(_evt, editor) => editorRef.current = editor}
              initialValue={ticket.description}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
          )}

          {activeTab === "comments" && (
            <div className="h-60 overflow-y-auto p-2 rounded-lg">
              {loadingComments && <p>Loading comments...</p>}
              {errorComments && <p className="text-error">{errorComments}</p>}
              {comments.length === 0 && !loadingComments && <p>No comments yet.</p>}
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`chat ${comment.author_role === "admin" ? "chat-end" : "chat-start"}`}
                >
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt={comment.author_fullName}
                        src={`https://api.dicebear.com/7.x/identicon/svg?seed=${comment.author_fullName}`}
                      />
                    </div>
                  </div>
                  <div className="chat-header">
                    {comment.author_fullName}
                    <time className="text-xs opacity-50 ml-2">{formatTimestamp(comment.created_at)}</time>
                  </div>
                  <div className="chat-bubble">{comment.message}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "timespent" && (
            <div className="h-60 overflow-y-auto p-2 rounded-lg">
              {loadingTime && <p>Loading time entries...</p>}
              {errorTime && <p className="text-error">{errorTime}</p>}
              {!loadingTime && timeEntries.length === 0 && <p>No time entries recorded.</p>}

              {timeEntries.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">
                    Total Time Spent: {totalTimeSpent} minutes
                  </h3>
                </div>
              )}

              {timeEntries.map((entry) => (
                <div key={entry.id} className="card bg-base-200 p-3 mb-2 shadow-md">
                  <div className="flex justify-between">
                    <span className="font-bold">{entry.operator_name}</span>
                    <span className="text-sm opacity-70">{formatTimestamp(entry.created_at)}</span>
                  </div>
                  <div className="text-md">
                    ⏳ {entry.minutes} minutes logged
                  </div>
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
