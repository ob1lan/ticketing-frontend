import React from "react";
import PropTypes from "prop-types";
import UserRow from "./UserRow";

function UserTable({ users, onEdit }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th className="text-center">Full Name</th>
            <th className="text-center">Email</th>
            <th className="text-center">Role</th>
            <th className="text-center"></th>
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
