import React from "react";
import PropTypes from "prop-types";
import UserRow from "./UserRow";

function UserTable({ users, onEdit }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} onEdit={() => onEdit(user)} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default UserTable;
