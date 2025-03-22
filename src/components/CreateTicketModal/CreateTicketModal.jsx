import React, { useEffect, useState } from "react";
import { fetchCompanies, createTicket } from "../../api";
import CreateTicketForm from "./CreateTicketForm";

const CreateTicketModal = ({ isOpen, onClose, onTicketCreated, user }) => {
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
            fetchCompanies().then((data) => setCompanies(data.results));
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
        <dialog id="create_ticket_modal" className="modal modal-open">
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
                        onClose={onClose}
                    />
                </fieldset>
            </div>
        </dialog>
    );
};

export default CreateTicketModal;
