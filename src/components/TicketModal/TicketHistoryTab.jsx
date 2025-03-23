import React from "react";
import PropTypes from "prop-types";

function TicketHistoryTab({ history, formatTimestamp }) {
    if (!history.length) return <p className="text-center">No history available.</p>;

    return (
        <ul className="timeline timeline-vertical">
            {[...history].reverse().map((event, index) => (
                <li key={event.id}>
                    {index !== 0 && <hr />}
                    <div className="timeline-start">{formatTimestamp(event.changed_at)}</div>
                    <div className="timeline-middle">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="timeline-end timeline-box">
                        {event.message} by {event.user_fullname}
                    </div>
                    <hr />
                </li>
            ))}
        </ul>
    );
}

TicketHistoryTab.propTypes = {
    history: PropTypes.array.isRequired,
    formatTimestamp: PropTypes.func.isRequired,
};

export default TicketHistoryTab;
