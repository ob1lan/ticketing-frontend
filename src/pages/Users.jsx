// src/pages/Users.jsx

import React, { useEffect, useState } from "react";
import {
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
} from "../api";
import UserTable from "../components/Users/UserTable";
import UserModal from "../components/Users/UserModal";

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [initialData, setInitialData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Load the list on mount and after saves/deletes
    const loadUsers = async () => {
        try {
            const data = await fetchUsers();
            // Handle both { results: [...] } and [...] formats
            const list = Array.isArray(data)
                ? data
                : Array.isArray(data.results)
                    ? data.results
                    : [];
            setUsers(list);
        } catch (err) {
            console.error("Failed to load users:", err);
            setUsers([]); // avoid undefined
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // Open modal to create a new user
    const handleNew = () => {
        setInitialData({});   // empty → isNew mode
        setError("");
        setSuccess("");
        setModalOpen(true);
    };

    // Open modal to edit an existing user
    const handleEdit = (user) => {
        setInitialData(user);
        setError("");
        setSuccess("");
        setModalOpen(true);
    };

    // Close modal
    const handleClose = () => {
        setModalOpen(false);
    };

    // Called by UserModal on Save/Create
    const handleSubmit = async (formData, isNew) => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            if (isNew) {
                await createUser(formData);
                setSuccess("User created successfully.");
            } else {
                await updateUser(formData.id, formData);
                setSuccess("User updated successfully.");
            }
            await loadUsers();
            setTimeout(() => {
                handleClose();
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Optional: delete user
    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUser(userId);
            await loadUsers();
        } catch (err) {
            console.error("Failed to delete user:", err);
        }
    };

    return (
        <>
            <div className="divider flex justify-end">
                <button className="btn btn-soft btn-primary" onClick={handleNew}>
                    New User
                </button>
            </div>

            <UserTable
                users={users}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <UserModal
                isOpen={modalOpen}
                initialData={initialData}
                onClose={handleClose}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                success={success}
            />
        </>
    );
}

export default UsersPage;
