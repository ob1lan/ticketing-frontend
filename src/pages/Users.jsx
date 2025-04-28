import React, { useEffect, useState } from "react";
import { fetchUsers, createUser, updateUser } from "../api";  // you’ll need to add these
import UserTable from "../components/Users/UserTable";
import UserModal from "../components/Users/UserModal";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data.results);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleNew = () => {
    setEditingUser({});
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    loadUsers();
  };

  const handleSubmit = async (userData, isNew) => {
    setLoading(true);
    setError("");
    try {
      if (isNew) {
        await createUser(userData);
        setSuccess("User created successfully.");
      } else {
        await updateUser(userData.id, userData);
        setSuccess("User updated successfully.");
      }
      loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="divider">
        <button className="btn btn-primary" onClick={handleNew}>
          New User
        </button>
      </div>
      <UserTable users={users} onEdit={handleEdit} />
      <UserModal
        isOpen={modalOpen}
        initialData={editingUser}
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
