import React from "react";
import PropTypes from "prop-types";
import { TICKET_TYPES, TICKET_PRIORITIES } from "../../utils/constants";

const CreateTicketFields = ({ user, companies, formData, onChange }) => (
  <>
    {user.role === "admin" && (
      <div className="form-control">
        <label htmlFor="company" className="fieldset-label">Company</label>
        <select
          id="company"
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
      <label htmlFor="title" className="fieldset-label">Title</label>
      <input
        id="title"
        type="text"
        className="input input-bordered w-full"
        placeholder="Ticket Title"
        value={formData.title}
        onChange={(e) => onChange("title", e.target.value)}
        required
      />
    </div>

    <div className="form-control">
      <label htmlFor="description" className="fieldset-label">Description</label>
      <textarea
        id="description"
        className="textarea textarea-bordered w-full"
        placeholder="Ticket Description"
        value={formData.description}
        onChange={(e) => onChange("description", e.target.value)}
        required
      ></textarea>
    </div>

    <div className="form-control">
      <label htmlFor="priority" className="fieldset-label">Priority</label>
      <select
        id="priority"
        className="select select-bordered w-full"
        value={formData.priority}
        onChange={(e) => onChange("priority", e.target.value)}
      >
        {Object.entries(TICKET_PRIORITIES).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}

      </select>
    </div>

    <div className="form-control">
      <label htmlFor="type" className="fieldset-label">Type</label>
      <select
        id="type"
        className="select select-bordered w-full"
        value={formData.type}
        onChange={(e) => onChange("type", e.target.value)}
      >
        {Object.entries(TICKET_TYPES).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
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
