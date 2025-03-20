import React, { useState } from "react";
import { changePassword } from "../api";

const SettingsModal = ({ isOpen, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            await changePassword(currentPassword, newPassword);
            setSuccess("Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(onClose, 2000);
        } catch (err) {
            setError("Incorrect current password or request failed.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <dialog id="settings_modal" className="modal modal-open">
            <form method="dialog" className="modal-backdrop" onClick={onClose}>
                <button>close</button>
            </form>
            <div className="modal-box w-11/12 max-w-lg">
                <fieldset className="fieldset bg-base-100 border border-base-300 p-6 rounded-box shadow-md">
                    <legend className="fieldset-legend text-lg font-bold">Settings</legend>

                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

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
                            <button type="button" className="btn" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Updating..." : "Change Password"}
                            </button>
                        </div>
                    </form>
                </fieldset>
            </div>
        </dialog>
    );
};

export default SettingsModal;
