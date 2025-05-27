import CreateTicketFields from "./CreateTicketFields";
import PropTypes from "prop-types";

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

CreateTicketForm.propTypes = {
    user: PropTypes.object.isRequired,
    companies: PropTypes.array.isRequired,
    formData: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default CreateTicketForm;
