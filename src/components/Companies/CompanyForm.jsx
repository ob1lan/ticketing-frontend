import React from "react";
import PropTypes from "prop-types";

const CompanyForm = ({
    company,
    logoPreview,
    handleChange,
    handleLogoURLChange,
    handleSubmit,
    onClose,
    loading,
    error,
    success,
}) => (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control flex flex-col items-center">
            <div className="avatar mb-3">
                <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
                    <img src={logoPreview} alt="Company Logo" />
                </div>
            </div>
        </div>

        <div className="form-control">
            <label className="fieldset-label">Logo URL</label>
            <input
                type="url"
                name="logo"
                className="input input-bordered w-full"
                placeholder="Enter logo URL"
                value={company.logo}
                onChange={handleLogoURLChange}
            />
        </div>

        <div className="form-control">
            <label className="fieldset-label">Name</label>
            <input
                type="text"
                name="name"
                className="input input-bordered w-full"
                value={company.name}
                onChange={handleChange}
                required
            />
        </div>

        <div className="form-control">
            <label className="fieldset-label">Initials</label>
            <input
                type="text"
                name="initials"
                className="input input-bordered w-full"
                value={company.initials}
                onChange={handleChange}
                required
            />
        </div>

        <div className="form-control">
            <label className="fieldset-label">Address</label>
            <textarea
                name="address"
                className="textarea textarea-bordered w-full"
                value={company.address}
                onChange={handleChange}
                rows={3}
            />
        </div>

        <div className="form-control">
            <label className="fieldset-label">Contact Phone</label>
            <input
                type="text"
                name="contact_phone"
                className="input input-bordered w-full"
                value={company.contact_phone}
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

CompanyForm.propTypes = {
    company: PropTypes.object.isRequired,
    logoPreview: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleLogoURLChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
    success: PropTypes.string,
};

export default CompanyForm;
