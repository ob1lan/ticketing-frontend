import React from "react";
import PropTypes from "prop-types";

function UserRow({ user, onEdit }) {
    return (
        <tr>
            <td className="text-center">{user.first_name} {user.last_name}</td>
            <td className="text-center">{user.email}</td>
            <td className="text-center">
                <span className={`badge ${user.role === "admin" ? "badge-warning" : "badge-primary"}`}>
                    {user.role}
                </span>
            </td>
            <td className="text-center">
                <button
                    className="btn btn-soft btn-primary btn-xs"
                    onClick={onEdit}
                >
                    details
                </button>
            </td>
        </tr>
    );
}

UserRow.propTypes = {
    user: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
};

export default UserRow;
