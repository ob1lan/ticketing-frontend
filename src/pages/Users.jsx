import React, { useEffect, useState } from "react";
import { fetchUsers } from "../api";
import UserTable from "../components/Users/UserTable";
import UserModal from "../components/Users/UserModal";

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadUsers = async () => {
        try {
            const data = await fetchUsers();
            setUsers(data.results);
        } catch (error) {
            console.error("Failed to load users:", error);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        loadUsers();
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            <UserTable users={users} onEdit={handleEdit} />
            {isModalOpen && (
                <UserModal user={selectedUser} onClose={handleModalClose} />
            )}
        </div>
    );
}

export default UsersPage;
