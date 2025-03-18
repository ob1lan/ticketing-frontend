// src/components/CreateTicketModal.jsx
import React, { useState } from "react";

const CreateTicketModal = ({ isOpen, onClose, onTicketCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [type, setType] = useState("incident");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      priority,
      type,
    };

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://127.0.0.1:8000/tickets/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(JSON.stringify(errData));
      } else {
        const data = await res.json();
        onTicketCreated && onTicketCreated(data);
        // Reset form
        setTitle("");
        setDescription("");
        setPriority("low");
        setType("incident");
        setError("");
        onClose();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box container">
        <h3 className="font-bold text-lg mb-4">Create New Ticket</h3>
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {user.role === "admin" && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Company</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={company}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          )}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Priority</span>
            </label>
            <select
              className="select select-bordered"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Type</span>
            </label>
            <select
              className="select select-bordered"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="service_request">Service Request</option>
              <option value="change_request">Change Request</option>
              <option value="incident">Incident</option>
            </select>
          </div>
          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketModal;
