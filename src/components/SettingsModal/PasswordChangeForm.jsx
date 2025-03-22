import React, { useState } from "react";
import { changePassword } from "../../api";

const PasswordChangeForm = ({ onSuccess, onError, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        onError("");
        onSuccess("");
        setLoading(true);

        if (newPassword !== confirmPassword) {
            onError("New passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            await changePassword(currentPassword, newPassword);
            onSuccess("Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(onClose, 2000);
        } catch (err) {
            onError("Incorrect current password or request failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
                <label className="fieldset-label">Current Password</label>
                <input
                    type="password"
                    className="input input-bordered w-full"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
            </div>

            <div className="form-control">
                <label className="fieldset-label">New Password</label>
                <input
                    type="password"
                    minLength={8}
                    className="input input-bordered w-full"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
            </div>

            <div className="form-control">
                <label className="fieldset-label">Confirm New Password</label>
                <input
                    type="password"
                    minLength={8}
                    className="input input-bordered w-full"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>

            <div className="modal-action">
                <button type="button" className="btn" onClick={onClose}>
                    Close
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Updating..." : "Change Password"}
                </button>
            </div>
        </form>
    );
};

export default PasswordChangeForm;
