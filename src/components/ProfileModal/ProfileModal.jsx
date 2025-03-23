import React, { useEffect, useState, useRef } from "react";
import { fetchProfile, updateProfile } from "../../api";
import ProfileForm from "./ProfileForm";
import PropTypes from "prop-types";


const ProfileModal = ({ user, isOpen, onClose }) => {
    const modalRef = useRef(null);
    const [profile, setProfile] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        company: "",
        avatar: "",
    });

    const [avatarPreview, setAvatarPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchProfile()
                .then((data) => {
                    setProfile(data);
                    setAvatarPreview(data.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${data.username}`);
                })
                .catch(err => console.error("Error fetching profile:", err));
        }
    }, [isOpen]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleAvatarURLChange = (e) => {
        const url = e.target.value;
        setProfile({ ...profile, avatar: url });
        setAvatarPreview(url || "https://api.dicebear.com/7.x/identicon/svg?seed=username");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const updatedData = await updateProfile(profile);
            setProfile(updatedData);
            setSuccess("Profile updated successfully!");
            setTimeout(onClose, 2000);
        } catch (err) {
            console.error("Error updating profile:", err);
            setError("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <dialog ref={modalRef} id="profile_modal" className="modal modal-open">
            <button type="button" className="modal-backdrop" onClick={onClose} aria-label="Close modal">
                <span>close</span>
            </button>
            <div className="modal-box w-11/12 max-w-3xl">
                <fieldset className="fieldset bg-base-100 border border-base-300 p-6 rounded-box shadow-md">
                    <legend className="fieldset-legend text-lg font-bold">My Profile</legend>
                    <ProfileForm
                        profile={profile}
                        avatarPreview={avatarPreview}
                        user={user}
                        handleChange={handleChange}
                        handleAvatarURLChange={handleAvatarURLChange}
                        handleSubmit={handleSubmit}
                        onClose={() => {
                            modalRef.current?.close();
                            onClose();
                        }}
                        success={success}
                        error={error}
                        loading={loading}
                    />
                </fieldset>
            </div>
        </dialog>
    );
};

ProfileModal.propTypes = {
    user: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ProfileModal;
