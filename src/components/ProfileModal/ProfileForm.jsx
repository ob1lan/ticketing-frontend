import React from "react";
import AvatarPreview from "./AvatarPreview";

const ProfileForm = ({
    profile,
    avatarPreview,
    user,
    handleChange,
    handleAvatarURLChange,
    handleSubmit,
    onClose,
    success,
    error,
    loading
}) => (
    <form onSubmit={handleSubmit} className="space-y-4">
        <AvatarPreview avatarPreview={avatarPreview} role={user?.role} />

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

        {success && (
            <div role="alert" className="alert alert-success">
                <span>{success}</span>
            </div>
        )}

        {error && (
            <div role="alert" className="alert alert-error">
                <span>{error}</span>
            </div>
        )}

        <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save"}
            </button>
        </div>
    </form>
);

export default ProfileForm;
