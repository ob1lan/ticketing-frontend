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

    // loadUsers now safely handles either {results:[…]} or plain […]
    const loadUsers = async () => {
        try {
            const data = await fetchUsers();
            const list = Array.isArray(data) ? data : data.results ?? [];
            setUsers(list);
        } catch (err) {
            console.error("Failed to load users:", err);
            setUsers([]); // ensure we never pass undefined into the table
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleNew = () => {
        setInitialData({});    // empty = isNew
        setError("");
        setSuccess("");
        setModalOpen(true);
    };

    const handleEdit = (user) => {
        setInitialData(user);
        setError("");
        setSuccess("");
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
    };

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
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
                <button className="btn btn-primary" onClick={handleNew}>
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
