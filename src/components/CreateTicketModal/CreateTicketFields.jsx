import React from "react";
import PropTypes from "prop-types";

const CreateTicketFields = ({ user, companies, formData, onChange }) => (
  <>
    {user.role === "admin" && (
      <div className="form-control">
        <label className="fieldset-label">Company</label>
        <select
          className="select select-bordered w-full"
          value={formData.company}
          onChange={(e) => onChange("company", e.target.value)}
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
        value={formData.title}
        onChange={(e) => onChange("title", e.target.value)}
        required
      />
    </div>

    <div className="form-control">
      <label className="fieldset-label">Description</label>
      <textarea
        className="textarea textarea-bordered w-full"
        placeholder="Ticket Description"
        value={formData.description}
        onChange={(e) => onChange("description", e.target.value)}
        required
      ></textarea>
    </div>

    <div className="form-control">
      <label className="fieldset-label">Priority</label>
      <select
        className="select select-bordered w-full"
        value={formData.priority}
        onChange={(e) => onChange("priority", e.target.value)}
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
        value={formData.type}
        onChange={(e) => onChange("type", e.target.value)}
      >
        <option value="service_request">Service Request</option>
        <option value="change_request">Change Request</option>
        <option value="incident">Incident</option>
      </select>
    </div>
  </>
);

CreateTicketFields.propTypes = {
  user: PropTypes.object.isRequired,
  companies: PropTypes.array.isRequired,
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CreateTicketFields;
