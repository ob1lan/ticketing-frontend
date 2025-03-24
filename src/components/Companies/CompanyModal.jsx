import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import CompanyForm from "./CompanyForm";

const CompanyModal = ({ isOpen, onClose, onSubmit, initialData = {}, loading, error, success }) => {
    const modalRef = useRef(null);
    const [company, setCompany] = useState({
        name: "",
        initials: "",
        logo: "",
        address: "",
        contact_phone: "",
    });

    const [logoPreview, setLogoPreview] = useState("");

    useEffect(() => {
        if (isOpen) {
            setCompany(initialData);
            setLogoPreview(initialData.logo || "https://api.dicebear.com/7.x/identicon/svg?seed=company");
        }
    }, [isOpen, initialData]);

    const handleChange = (e) => {
        setCompany({ ...company, [e.target.name]: e.target.value });
    };

    const handleLogoURLChange = (e) => {
        const url = e.target.value;
        setCompany({ ...company, logo: url });
        setLogoPreview(url || "https://api.dicebear.com/7.x/identicon/svg?seed=company");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(company);
    };

    if (!isOpen) return null;

    return (
        <dialog ref={modalRef} id="company_modal" className="modal modal-open">
            <button type="button" className="modal-backdrop" onClick={onClose} aria-label="Close modal">
                <span>close</span>
            </button>
            <div className="modal-box w-11/12 max-w-3xl">
                <fieldset className="fieldset bg-base-100 border border-base-300 p-6 rounded-box shadow-md">
                    <legend className="fieldset-legend text-lg font-bold">Company</legend>
                    <CompanyForm
                        company={company}
                        logoPreview={logoPreview}
                        handleChange={handleChange}
                        handleLogoURLChange={handleLogoURLChange}
                        handleSubmit={handleSubmit}
                        onClose={() => {
                            modalRef.current?.close();
                            onClose();
                        }}
                        loading={loading}
                        error={error}
                        success={success}
                    />
                </fieldset>
            </div>
        </dialog>
    );
};

CompanyModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.object,
    loading: PropTypes.bool,
    error: PropTypes.string,
    success: PropTypes.string,
};

export default CompanyModal;
