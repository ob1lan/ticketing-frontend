import React from "react";
import PropTypes from "prop-types";

function UserModal({ user, onClose }) {
    return (
        <dialog open className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Edit User</h3>
                <p>Name: {user.first_name} {user.last_name}</p>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>

                <div className="modal-action">
                    <button className="btn" onClick={onClose}>Close</button>
                </div>
            </div>
        </dialog>
    );
}

UserModal.propTypes = {
    user: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default UserModal;
