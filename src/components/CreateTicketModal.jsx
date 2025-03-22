import React, { useEffect, useState } from "react";
import { fetchCompanies, createTicket } from "../api";

const CreateTicketModal = ({ isOpen, onClose, onTicketCreated, user }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [type, setType] = useState("incident");
  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role === "admin") {
      fetchCompanies().then((data) => setCompanies(data.results));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      priority,
      type,
      ...(user.role === "admin" && { company }),
    };

    try {
      const newTicket = await createTicket(payload);
      onTicketCreated?.(newTicket);
      setTitle("");
      setDescription("");
      setPriority("low");
      setType("incident");
      setCompany("");
      setError("");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create ticket");
    }
  };


  if (!isOpen) return null;

  return (
    <dialog id="create_ticket_modal" className="modal modal-open">
      <div className="modal-box w-11/12 max-w-3xl">
        <fieldset className="fieldset bg-base-100 border border-base-300 p-6 rounded-box shadow-md">
          <legend className="fieldset-legend text-lg font-bold">Create New Ticket</legend>

          {error && <div className="alert alert-error mb-4"><span>{error}</span></div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {user.role === "admin" && (
              <div className="form-control">
                <label className="fieldset-label">Company</label>
                <select
                  className="select select-bordered w-full"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                >
                  <option value="">Select a company</option>
                  {companies.map((comp) => (
                    <option key={comp.id} value={comp.id}>
                      {comp.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-control">
              <label className="fieldset-label">Title</label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Ticket Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="fieldset-label">Description</label>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Ticket Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-control">
              <label className="fieldset-label">Priority</label>
              <select
                className="select select-bordered w-full"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-control">
              <label className="fieldset-label">Type</label>
              <select
                className="select select-bordered w-full"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="service_request">Service Request</option>
                <option value="change_request">Change Request</option>
                <option value="incident">Incident</option>
              </select>
            </div>

            <div className="modal-action">
              <button type="button" className="btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create Ticket</button>
            </div>
          </form>
        </fieldset>
      </div>
    </dialog>
  );
};

export default CreateTicketModal;
