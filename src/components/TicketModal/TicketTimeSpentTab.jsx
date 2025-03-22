// src/components/TicketModal/TicketTimeSpentTab.jsx
import React from "react";

function TicketTimeSpentTab({ timeEntries, loadingTime, errorTime, totalTimeSpent, formatTimestamp }) {
  return (
    <div className="h-60 overflow-y-auto p-2 rounded-lg">
      {loadingTime && <p>Loading time entries...</p>}
      {errorTime && <p className="text-error">{errorTime}</p>}
      {!loadingTime && timeEntries.length === 0 && (
        <p>No time entries recorded.</p>
      )}

      {timeEntries.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            Total Time Spent: {totalTimeSpent} minutes
          </h3>
        </div>
      )}

      {timeEntries.map((entry) => (
        <div
          key={entry.id}
          className="card bg-base-200 p-3 mb-2 shadow-md"
        >
          <div className="flex justify-between">
            <span className="font-bold">{entry.operator_fullname}</span>
            <span className="text-sm opacity-70">
              {formatTimestamp(entry.created_at)}
            </span>
          </div>
          <div className="text-md">⏳ {entry.minutes} minutes logged</div>
        </div>
      ))}
    </div>
  );
}

export default TicketTimeSpentTab;
