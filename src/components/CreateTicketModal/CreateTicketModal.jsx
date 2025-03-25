import React, { useEffect, useState, useRef } from "react";
import { fetchAllCompanies, createTicket } from "../../api";
import CreateTicketForm from "./CreateTicketForm";
import PropTypes from "prop-types";

const CreateTicketModal = ({ isOpen, onClose, onTicketCreated, user }) => {
    const modalRef = useRef(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "low",
        type: "incident",
        company: "",
    });
    const [companies, setCompanies] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user?.role === "admin") {
            fetchAllCompanies().then(setCompanies).catch(console.error);
        }
    }, [user]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            ...(user.role !== "admin" && { company: undefined }),
        };

        try {
            const newTicket = await createTicket(payload);
            onTicketCreated?.(newTicket);
            setFormData({
                title: "",
                description: "",
                priority: "low",
                type: "incident",
                company: "",
            });
            setError("");
            onClose();
        } catch (err) {
            setError(err.message || "Failed to create ticket");
        }
    };

    if (!isOpen) return null;

    return (
        <dialog ref={modalRef} id="create_ticket_modal" className="modal modal-open">
            <button type="button" className="modal-backdrop" onClick={onClose} aria-label="Close modal">
                <span>close</span>
            </button>
            <div className="modal-box w-11/12 max-w-3xl">
                <fieldset className="fieldset bg-base-100 border border-base-300 p-6 rounded-box shadow-md">
                    <legend className="fieldset-legend text-lg font-bold">Create New Ticket</legend>
                    {error && <div className="alert alert-error mb-4"><span>{error}</span></div>}
                    <CreateTicketForm
                        user={user}
                        companies={companies}
                        formData={formData}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        onClose={() => {
                            modalRef.current?.close();
                            onClose();
                        }}
                    />
                </fieldset>
            </div>
        </dialog>
    );
};

CreateTicketModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onTicketCreated: PropTypes.func.isRequired,
    user: PropTypes.shape({
        role: PropTypes.string.isRequired,
    }).isRequired,
};

export default CreateTicketModal;
