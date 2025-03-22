import React, { useState } from "react";
import ThemeSelector from "./ThemeSelector";
import PasswordChangeForm from "./PasswordChangeForm";

const SettingsModal = ({ isOpen, onClose }) => {
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

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

                    <ThemeSelector />

                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>
                            Save
                        </button>
                    </div>

                    <div className="divider">Password change</div>

                    <PasswordChangeForm
                        onSuccess={setSuccess}
                        onError={setError}
                        onClose={onClose}
                    />
                </fieldset>
            </div>
        </dialog>
    );
};

export default SettingsModal;
