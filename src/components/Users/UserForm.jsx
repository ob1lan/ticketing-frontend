import React from "react";
import PropTypes from "prop-types";

const UserForm = ({
    user,
    companies,
    handleChange,
    handleSubmit,
    onClose,
    loading,
    error,
    success,
    isNew,
}) => (
    <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div className="form-control">
            <label className="fieldset-label">
                <span className="label-text">Username</span>
            </label>
            <input
                name="username"
                type="text"
                className="input input-bordered w-full"
                value={user.username}
                onChange={handleChange}
                required
                disabled={loading}
            />
        </div>

        {/* First Name */}
        <div className="form-control">
            <label className="fieldset-label">
                <span className="label-text">First Name</span>
            </label>
            <input
                name="first_name"
                type="text"
                className="input input-bordered w-full"
                value={user.first_name}
                onChange={handleChange}
                required
                disabled={loading}
            />
        </div>

        {/* Last Name */}
        <div className="form-control">
            <label className="fieldset-label">
                <span className="label-text">Last Name</span>
            </label>
            <input
                name="last_name"
                type="text"
                className="input input-bordered w-full"
                value={user.last_name}
                onChange={handleChange}
                required
                disabled={loading}
            />
        </div>

        {/* Email */}
        <div className="form-control">
            <label className="fieldset-label">
                <span className="label-text">Email</span>
            </label>
            <input
                name="email"
                type="email"
                className="input input-bordered w-full"
                value={user.email}
                onChange={handleChange}
                required
                disabled={loading}
            />
        </div>

        {/* Role */}
        <div className="form-control">
            <label className="fieldset-label">
                <span className="label-text">Role</span>
            </label>
            <select
                name="role"
                className="select select-bordered w-full"
                value={user.role}
                onChange={handleChange}
                disabled={loading}
            >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
            </select>
        </div>

        {/* Company */}
        <div className="form-control">
            <label className="fieldset-label">
                <span className="label-text">Company</span>
            </label>
            <select
                name="company"
                className="select select-bordered w-full"
                value={user.company}
                onChange={handleChange}
                disabled={loading || !companies.length}
            >
                <option value="">— Select Company —</option>
                {companies.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                        {c.name}
                    </option>
                ))}
            </select>
        </div>

        {/* Password (only when creating a new user) */}
        {isNew && (
            <div className="form-control">
                <label className="fieldset-label">
                    <span className="label-text">Password</span>
                </label>
                <input
                    name="password"
                    type="password"
                    className="input input-bordered w-full"
                    value={user.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
            </div>
        )}

        {/* Success / Error Alerts */}
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

        {/* Action Buttons */}
        <div className="modal-action">
            <button
                type="button"
                className="btn"
                onClick={onClose}
                disabled={loading}
            >
                Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (isNew ? "Creating…" : "Saving…") : isNew ? "Create" : "Save"}
            </button>
        </div>
    </form>
);

UserForm.propTypes = {
    user: PropTypes.object.isRequired,
    companies: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
    success: PropTypes.string,
    isNew: PropTypes.bool,
};

export default UserForm;
