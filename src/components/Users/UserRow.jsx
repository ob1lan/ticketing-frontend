import React from "react";
import PropTypes from "prop-types";

function UserRow({ user, onEdit }) {
    return (
        <tr>
            <td>{user.first_name} {user.last_name}</td>
            <td>{user.email}</td>
            <td>
                <span className={`badge ${user.role === "admin" ? "badge-warning" : "badge-primary"}`}>
                    {user.role}
                </span>
            </td>
            <td className="text-center">
                <button onClick={onEdit} className="btn btn-sm btn-outline">Edit</button>
            </td>
        </tr>
    );
}

UserRow.propTypes = {
    user: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
};

export default UserRow;
