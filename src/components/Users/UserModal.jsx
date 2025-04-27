// src/components/Users/UserModal.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function UserModal({ user, onClose }) {
    // formData.company is now just the ID (string) returned from the API
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        role: "user",
        company: "",        // <-- holds the company ID as a string
    });
    const [companies, setCompanies] = useState([]);
    const [loadingCompanies, setLoadingCompanies] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    // Seed the form when `user` changes
    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                email: user.email || "",
                role: user.role || "user",
                company: user.company ? String(user.company) : "",  // <-- use the raw ID
            });
        }
    }, [user]);

    // Load the companies so we can both render names in the dropdown...
    useEffect(() => {
        if (!user) return;
        setLoadingCompanies(true);
        fetch(`${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}/companies/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load companies");
                return res.json();
            })
            .then((data) => {
                // DRF pagination? use data.results or data
                setCompanies(data.results || data);
            })
            .catch(console.error)
            .finally(() => setLoadingCompanies(false));
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((f) => ({ ...f, [name]: value }));
    };

    const handleSave = async () => {
        setError(null);
        // Basic required-field check
        if (!formData.first_name || !formData.last_name || !formData.email) {
            setError("First name, last name, and email are required.");
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}/accounts/${user.id}/`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    body: JSON.stringify({
                        ...formData,
                        company: formData.company || null, // null if no selection
                    }),
                }
            );
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.detail || "Failed to update user");
            }
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return null;

    return (
        <dialog open className="modal modal-open">
            <div className="modal-box max-w-md">
                <h3 className="font-bold text-lg mb-4">Edit User</h3>

                {/* First Name */}
                <div className="form-control mb-2">
                    <label className="label"><span className="label-text">First Name</span></label>
                    <input
                        name="first_name"
                        type="text"
                        className="input input-bordered w-full"
                        value={formData.first_name}
                        onChange={handleChange}
                    />
                </div>

                {/* Last Name */}
                <div className="form-control mb-2">
                    <label className="label"><span className="label-text">Last Name</span></label>
                    <input
                        name="last_name"
                        type="text"
                        className="input input-bordered w-full"
                        value={formData.last_name}
                        onChange={handleChange}
                    />
                </div>

                {/* Email */}
                <div className="form-control mb-2">
                    <label className="label"><span className="label-text">Email</span></label>
                    <input
                        name="email"
                        type="email"
                        className="input input-bordered w-full"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                {/* Role */}
                <div className="form-control mb-2">
                    <label className="label"><span className="label-text">Role</span></label>
                    <select
                        name="role"
                        className="select select-bordered w-full"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {/* Company */}
                <div className="form-control mb-4">
                    <label className="label"><span className="label-text">Company</span></label>
                    <select
                        name="company"
                        className="select select-bordered w-full"
                        value={formData.company}
                        onChange={handleChange}
                        disabled={loadingCompanies}
                    >
                        <option value="">— Select a company —</option>
                        {companies.map((c) => (
                            <option key={c.id} value={String(c.id)}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Error */}
                {error && <p className="text-red-500 mb-2">{error}</p>}

                {/* Actions */}
                <div className="modal-action">
                    <button className="btn" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving…" : "Save"}
                    </button>
                </div>
            </div>
        </dialog>
    );
}

UserModal.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string,
        company: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default UserModal;
