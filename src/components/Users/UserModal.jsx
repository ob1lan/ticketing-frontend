import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import UserForm from "./UserForm";

const UserModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData = {},
    loading = false,
    error = "",
    success = "",
}) => {
    const modalRef = useRef(null);
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        role: "user",
        company: "",
        password: "",
    });
    const [companies, setCompanies] = useState([]);

    const isNew = !initialData.id;

    // Seed the user state when modal opens or initialData changes
    useEffect(() => {
        if (isOpen) {
            const defaults = {
                first_name: "",
                last_name: "",
                email: "",
                role: "user",
                company: "",
                password: "",
            };
            setUser({ ...defaults, ...initialData, password: "" });
            // Fetch companies once
            (async () => {
                try {
                    const token = localStorage.getItem("accessToken");
                    const res = await fetch(
                        `${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}/companies/`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    if (!res.ok) throw new Error("Unable to load companies");
                    const data = await res.json();
                    setCompanies(data.results || data);
                } catch (e) {
                    console.error(e);
                }
            })();
        }
    }, [isOpen, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((u) => ({ ...u, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(user, isNew);
    };

    if (!isOpen) return null;

    return (
        <dialog ref={modalRef} className="modal modal-open">
            <button
                type="button"
                className="modal-backdrop"
                onClick={onClose}
                aria-label="Close modal"
            />
            <div className="modal-box w-11/12 max-w-lg">
                <fieldset className="fieldset bg-base-100 border border-base-300 p-6 rounded-box shadow-md">
                    <legend className="fieldset-legend">
                        {isNew ? "Create New User" : "Edit User"}
                    </legend>
                    <UserForm
                        user={user}
                        companies={companies}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        onClose={onClose}
                        loading={loading}
                        error={error}
                        success={success}
                        isNew={isNew}
                    />
                </fieldset>
            </div>
        </dialog>
    );
};

UserModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.object,
    loading: PropTypes.bool,
    error: PropTypes.string,
    success: PropTypes.string,
};

export default UserModal;
