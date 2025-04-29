import React, { useEffect } from "react";
import PropTypes from "prop-types";
import useQuill from "../../hooks/useQuill";
import { TICKET_PRIORITIES, TICKET_TYPES } from "../../utils/constants";

const CreateTicketFields = ({ user, companies, formData, onChange }) => {
  const { containerRef, quill } = useQuill(formData.description || "");

  useEffect(() => {
    if (!quill.current) return;
    const q = quill.current;
    const handler = () => onChange("description", q.root.innerHTML);
    q.on("text-change", handler);
    return () => {
      q.off("text-change", handler);
    };
  }, [quill.current]);

  return (
    <>
      {user.role === "admin" && (
        <div className="form-control">
          <label className="fieldset-label" htmlFor="company">Company</label>
          <select
            id="company"
            className="select select-bordered w-full"
            value={formData.company}
            onChange={(e) => onChange("company", e.target.value)}
            required
          >
            <option value="">Select a company</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="form-control">
        <label className="fieldset-label" htmlFor="title">Title</label>
        <input
          id="title"
          className="input input-bordered w-full"
          value={formData.title}
          onChange={(e) => onChange("title", e.target.value)}
          required
        />
      </div>

      {/* Quill description */}
      <div className="form-control">
        <label className="fieldset-label" htmlFor="Description">Description</label>
        <div
          ref={containerRef}
          className="min-h-[150px] bg-base-100 border border-base-300 rounded p-2"
        />
      </div>

      <div className="form-control">
        <label className="fieldset-label" htmlFor="priority">Priority</label>
        <select
          id="priority"
          className="select select-bordered w-full"
          value={formData.priority}
          onChange={(e) => onChange("priority", e.target.value)}
        >
          {Object.entries(TICKET_PRIORITIES).map(([v, label]) => (
            <option key={v} value={v}>{label}</option>
          ))}
        </select>
      </div>

      <div className="form-control">
        <label className="fieldset-label" htmlFor="type">Type</label>
        <select
          id="type"
          className="select select-bordered w-full"
          value={formData.type}
          onChange={(e) => onChange("type", e.target.value)}
        >
          {Object.entries(TICKET_TYPES).map(([v, label]) => (
            <option key={v} value={v}>{label}</option>
          ))}
        </select>
      </div>
    </>
  );
};

CreateTicketFields.propTypes = {
  user: PropTypes.object.isRequired,
  companies: PropTypes.array.isRequired,
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CreateTicketFields;
