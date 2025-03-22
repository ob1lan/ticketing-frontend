import React from "react";
import PropTypes from "prop-types";


const AvatarPreview = ({ avatarPreview, role }) => (
    <div className="form-control flex flex-col items-center">
        <div className="avatar avatar-online mb-3">
            <div className={
                role === "admin"
                    ? "ring-warning ring-offset-base-100 w-24 rounded-full ring ring-offset-2"
                    : "ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2"
            }>
                <img src={avatarPreview} alt="User Avatar" />
            </div>
        </div>
    </div>
);

AvatarPreview.propTypes = {
    avatarPreview: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
};

export default AvatarPreview;
