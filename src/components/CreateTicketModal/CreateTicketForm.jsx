import React from "react";
import CreateTicketFields from "./CreateTicketFields";

const CreateTicketForm = ({ user, companies, formData, onChange, onSubmit, onClose }) => (
    <form onSubmit={onSubmit} className="space-y-4">
        <CreateTicketFields
            user={user}
            companies={companies}
            formData={formData}
            onChange={onChange}
        />
        <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Ticket</button>
        </div>
    </form>
);

export default CreateTicketForm;
