import React from "react";
import PropTypes from "prop-types";

function TicketDetailsTab({ editedTicket, setEditedTicket, assignees }) {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Type */}
                <label className="fieldset w-full">
                    <span className="fieldset-label font-bold">Type</span>
                    <select
                        className="select select-bordered w-full"
                        value={editedTicket.type}
                        onChange={(e) => setEditedTicket({ ...editedTicket, type: e.target.value })}
                        required
                    >
                        <option value="service_request">📝 Service Request</option>
                        <option value="change_request">🔧 Change Request</option>
                        <option value="incident">⚠️ Incident</option>
                    </select>
                </label>

                {/* Priority */}
                <label className="fieldset w-full">
                    <span className="fieldset-label font-bold">Priority</span>
                    <select
                        className="select select-bordered w-full"
                        value={editedTicket.priority}
                        onChange={(e) => setEditedTicket({ ...editedTicket, priority: e.target.value })}
                        required
                    >
                        <option value="low">🟢 Low</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="high">🔴 High</option>
                    </select>
                </label>

                {/* Status */}
                <label className="fieldset w-full">
                    <span className="fieldset-label font-bold">Status</span>
                    <select
                        className="select select-bordered w-full"
                        value={editedTicket.status}
                        onChange={(e) => setEditedTicket({ ...editedTicket, status: e.target.value })}
                    >
                        <option value="open">🛠️ Open</option>
                        <option value="pending">⏳ Pending</option>
                        <option value="in_progress">🚧 In Progress</option>
                        <option value="resolved">✅ Resolved</option>
                        <option value="closed">🔒 Closed</option>
                    </select>
                </label>

                {/* Assignee */}
                <label className="fieldset w-full">
                    <span className="fieldset-label font-bold">Assignee</span>
                    <select
                        className="select select-bordered w-full"
                        value={editedTicket.assignee}
                        onChange={(e) => setEditedTicket({ ...editedTicket, assignee: e.target.value })}
                    >
                        <option value="">Non assigné</option>
                        {Array.isArray(assignees) &&
                            assignees.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.first_name} {user.last_name}
                                </option>
                            ))}
                    </select>
                </label>
            </div>

            {/* Description (Editable) */}
            <div className="grid mt-4">
                <fieldset className="fieldset w-full">
                    <legend className="fieldset-legend">Description</legend>
                    <textarea
                        className="textarea h-30 w-full"
                        placeholder="Description"
                        value={editedTicket.description}
                        onChange={(e) =>
                            setEditedTicket({ ...editedTicket, description: e.target.value })
                        }
                        required
                    ></textarea>
                </fieldset>
            </div>
        </>
    );
}

TicketDetailsTab.propTypes = {
    editedTicket: PropTypes.object.isRequired,
    setEditedTicket: PropTypes.func.isRequired,
    assignees: PropTypes.array.isRequired,
};

export default TicketDetailsTab;
