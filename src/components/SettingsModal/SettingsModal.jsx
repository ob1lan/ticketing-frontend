import React, { useState, useRef } from "react";
import ThemeSelector from "./ThemeSelector";
import PasswordChangeForm from "./PasswordChangeForm";
import PropTypes from "prop-types";

const SettingsModal = ({ isOpen, onClose }) => {
    const modalRef = useRef(null);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    return (
        <dialog ref={modalRef} id="settings_modal" className="modal modal-open">
            <button type="button" className="modal-backdrop" onClick={onClose} aria-label="Close modal">
                <span>close</span>
            </button>
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
                        onClose={() => {
                            modalRef.current?.close();
                            onClose();
                        }}
                    />
                </fieldset>
            </div>
        </dialog>
    );
};

SettingsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default SettingsModal;
