// src/pages/Users.jsx
import { useEffect, useState } from "react";
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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [initialData, setInitialData] = useState({});
    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState("");
    const [modalSuccess, setModalSuccess] = useState("");

    // ---------- Pagination loader ----------
    const loadUsers = async (page = 1) => {
        try {
            const data = await fetchUsers(page);
            setUsers(data.results || []);
            setTotalPages(Math.ceil(data.count / 5));
            setNextPage(data.next);
            setPrevPage(data.previous);
        } catch (err) {
            console.error("Failed to fetch users", err);
            setUsers([]);
        }
    };

    useEffect(() => {
        loadUsers(currentPage);
    }, [currentPage]);

    // ---------- Modal Handlers ----------
    const openNewModal = () => {
        setInitialData({});
        setModalOpen(true);
        setModalError("");
        setModalSuccess("");
    };

    const openEditModal = (user) => {
        setInitialData(user);
        setModalOpen(true);
        setModalError("");
        setModalSuccess("");
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleModalSubmit = async (formData, isNew) => {
        setModalLoading(true);
        setModalError("");
        setModalSuccess("");
        try {
            if (isNew) {
                await createUser(formData);
                setModalSuccess("User created successfully!");
            } else {
                await updateUser(formData.id, formData);
                setModalSuccess("User updated successfully!");
            }
            // Refresh current page and auto-close
            loadUsers(currentPage);
            setTimeout(closeModal, 1500);
        } catch (err) {
            setModalError(err.message || "Failed to save user.");
        } finally {
            setModalLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Delete this user?")) return;
        try {
            await deleteUser(userId);
            loadUsers(currentPage);
        } catch (err) {
            console.error("Failed to delete user", err);
        }
    };

    // ---------- Render ----------
    return (
        <>
            <div className="divider flex justify-end">
                <button className="btn btn-primary btn-soft" onClick={openNewModal}>
                    New User
                </button>
            </div>

            {users.length === 0 ? (
                <div className="alert alert-warning">
                    <span>No users found.</span>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto max-w-full">
                        <UserTable users={users} onEdit={openEditModal} onDelete={handleDelete} />
                    </div>

                    {/* Pagination controls identical to Companies page */}
                    <div className="join p-2 mt-4 justify-center">
                        <button
                            className="join-item btn"
                            disabled={!prevPage}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            «
                        </button>
                        <span className="join-item btn">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="join-item btn"
                            disabled={!nextPage}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            »
                        </button>
                    </div>
                </>
            )}

            <UserModal
                isOpen={modalOpen}
                onClose={closeModal}
                onSubmit={handleModalSubmit}
                initialData={initialData}
                loading={modalLoading}
                error={modalError}
                success={modalSuccess}
            />
        </>
    );
}

export default UsersPage;
