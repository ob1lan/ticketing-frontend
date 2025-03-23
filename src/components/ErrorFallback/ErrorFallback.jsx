import React from "react";
import PropTypes from "prop-types";
import errorImg from "../../assets/error-illustration.svg";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8">
            <img src={errorImg} alt="Error occurred" className="w-48 h-48 mb-6" />
            <h2 className="text-2xl font-semibold text-error mb-2">
                Something went wrong 😢 <br />
                We're working on it!
            </h2>
            <p className="text-sm text-base-content mb-4">
                {error?.message || "An unexpected error has occurred."}
            </p>
            <button className="btn btn-outline btn-error" onClick={resetErrorBoundary}>
                Try Again
            </button>
        </div>
    );
};

ErrorFallback.propTypes = {
    error: PropTypes.object,
    resetErrorBoundary: PropTypes.func,
};

export default ErrorFallback;
