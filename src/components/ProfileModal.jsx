import React, { useEffect, useState } from "react";
import { fetchProfile } from "../api";

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
                    setAvatarPreview(data.avatar || "https://api.dicebear.com/7.x/identicon/svg?seed=" + data.username);
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
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Avatar Preview & URL Input */}
                        <div className="form-control flex flex-col items-center">

                            <div className="avatar avatar-online mb-3">
                                {user && (
                                    <div className={user?.role === "admin" ? "ring-warning ring-offset-base-100 w-24 rounded-full ring ring-offset-2" : "ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2"} >
                                        <img src={avatarPreview} alt="User Avatar" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="fieldset-label">Avatar URL</label>
                            <input
                                type="url"
                                name="avatar"
                                className="input input-bordered w-full"
                                placeholder="Enter avatar URL"
                                value={profile.avatar}
                                onChange={handleAvatarURLChange}
                            />
                        </div>

                        <div className="form-control">
                            <label className="fieldset-label">Username</label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                value={profile.username}
                                disabled
                            />
                        </div>

                        <div className="form-control">
                            <label className="fieldset-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="input input-bordered w-full"
                                value={profile.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="fieldset-label">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                className="input input-bordered w-full"
                                value={profile.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="fieldset-label">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                className="input input-bordered w-full"
                                value={profile.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="fieldset-label">Phone Number</label>
                            <input
                                type="text"
                                name="phone_number"
                                className="input input-bordered w-full"
                                value={profile.phone_number}
                                onChange={handleChange}
                            />
                        </div>
                        {success &&
                            <div role="alert" class="alert alert-success">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{success}</span>
                            </div>
                        }
                        {error &&
                            <div role="alert" class="alert alert-error">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        }

                        <div className="modal-action">
                            <button type="button" className="btn" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Save</button>
                        </div>
                    </form>
                </fieldset>
            </div>
        </dialog>
    );
};

export default ProfileModal;
