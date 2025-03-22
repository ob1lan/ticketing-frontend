import React, { useEffect, useState } from "react";
import { fetchProfile } from "../../api";
import ProfileForm from "./ProfileForm";

const ProfileModal = ({ user, isOpen, onClose }) => {
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
            const token = localStorage.getItem("accessToken");
            const res = await fetch("http://127.0.0.1:8000/accounts/profile/", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profile),
            });

            if (!res.ok) throw new Error("Failed to update profile");

            const updatedData = await res.json();
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
        <dialog id="profile_modal" className="modal modal-open">
            <form method="dialog" className="modal-backdrop" onClick={onClose}>
                <button>close</button>
            </form>
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
                        onClose={onClose}
                        success={success}
                        error={error}
                        loading={loading}
                    />
                </fieldset>
            </div>
        </dialog>
    );
};

export default ProfileModal;
