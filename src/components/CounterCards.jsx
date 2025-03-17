function CounterCards({ tickets }) {
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === "open").length;
    const pending = tickets.filter((t) => t.status === "pending").length;
    const inProgress = tickets.filter((t) => t.status === "in_progress").length;
    const resolved = tickets.filter((t) => t.status === "resolved").length;
    const closed = tickets.filter((t) => t.status === "closed").length;

    return (
        <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
            <div className="stat place-items-center">
                <div className="stat-title">Total</div>
                <div className="stat-value">{ total }</div>
                <div className="stat-desc">Tickets</div>
            </div>

            <div className="stat place-items-center">
                <div className="stat-title">Open</div>
                <div className="stat-value">{ open }</div>
                <div className="stat-desc">
                    {/** Percentage from total */ }
                    { total > 0 ? Math.round((open / total) * 100) : 0 }%
                </div>
            </div>

            <div className="stat place-items-center">
                <div className="stat-title">In Progress</div>
                <div className="stat-value">{ inProgress }</div>
                <div className="stat-desc">
                    {/** Percentage from total */ }
                    { total > 0 ? Math.round((inProgress / total) * 100) : 0 }%
                </div>
            </div>

            <div className="stat place-items-center">
                <div className="stat-title">Pending</div>
                <div className="stat-value">{ pending }</div>
                <div className="stat-desc">
                    {/** Percentage from total */ }
                    { total > 0 ? Math.round((pending / total) * 100) : 0 }%
                </div>
            </div>

            <div className="stat place-items-center">
                <div className="stat-title">Resolved</div>
                <div className="stat-value">{ resolved }</div>
                <div className="stat-desc">
                    {/** Percentage from total */ }
                    { total > 0 ? Math.round((resolved / total) * 100) : 0 }%
                </div>
            </div>

            <div className="stat place-items-center">
                <div className="stat-title">Closed</div>
                <div className="stat-value">{ closed }</div>
                <div className="stat-desc">
                    {/** Percentage from total */ }
                    { total > 0 ? Math.round((closed / total) * 100) : 0 }%
                </div>
            </div>
        </div>
    );
}

export default CounterCards;