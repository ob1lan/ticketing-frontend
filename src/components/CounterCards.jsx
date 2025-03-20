import { useEffect, useState } from "react";
import { fetchTickets } from "../api";

function CounterCards() {
    const [loading, setLoading] = useState(true);
    const [totalTickets, setTotalTickets] = useState(0);
    const [statusCounts, setStatusCounts] = useState({
        open: 0, pending: 0, inProgress: 0, resolved: 0, closed: 0
    });

    useEffect(() => {
        const loadAllTicketsForStats = async () => {
            setLoading(true);
            try {
                let allTickets = [];
                let page = 1;
                let data;

                do {
                    data = await fetchTickets(page);
                    allTickets = [...allTickets, ...data.results];
                    page++;
                } while (data.next);

                setTotalTickets(allTickets.length);
                setStatusCounts({
                    open: allTickets.filter((t) => t.status === "open").length,
                    pending: allTickets.filter((t) => t.status === "pending").length,
                    inProgress: allTickets.filter((t) => t.status === "in_progress").length,
                    resolved: allTickets.filter((t) => t.status === "resolved").length,
                    closed: allTickets.filter((t) => t.status === "closed").length,
                });
            } catch (error) {
                console.error("Error fetching ticket stats:", error);
            } finally {
                setLoading(false);
            }
        };

        loadAllTicketsForStats();
    }, []);

    return (
        <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
            {loading ? (
                <div className="flex justify-center items-center w-full h-24">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <>
                    <div className="stat place-items-center">
                        <div className="stat-title">Total</div>
                        <div className="stat-value">{totalTickets}</div>
                        <div className="stat-desc">Tickets</div>
                    </div>

                    <div className="stat place-items-center">
                        <div className="stat-title">Open</div>
                        <div className="stat-value">{statusCounts.open}</div>
                        <div className="stat-desc">
                            {totalTickets > 0 ? Math.round((statusCounts.open / totalTickets) * 100) : 0}%
                        </div>
                    </div>

                    <div className="stat place-items-center">
                        <div className="stat-title">In Progress</div>
                        <div className="stat-value">{statusCounts.inProgress}</div>
                        <div className="stat-desc">
                            {totalTickets > 0 ? Math.round((statusCounts.inProgress / totalTickets) * 100) : 0}%
                        </div>
                    </div>

                    <div className="stat place-items-center">
                        <div className="stat-title">Pending</div>
                        <div className="stat-value">{statusCounts.pending}</div>
                        <div className="stat-desc">
                            {totalTickets > 0 ? Math.round((statusCounts.pending / totalTickets) * 100) : 0}%
                        </div>
                    </div>

                    <div className="stat place-items-center">
                        <div className="stat-title">Resolved</div>
                        <div className="stat-value">{statusCounts.resolved}</div>
                        <div className="stat-desc">
                            {totalTickets > 0 ? Math.round((statusCounts.resolved / totalTickets) * 100) : 0}%
                        </div>
                    </div>

                    <div className="stat place-items-center">
                        <div className="stat-title">Closed</div>
                        <div className="stat-value">{statusCounts.closed}</div>
                        <div className="stat-desc">
                            {totalTickets > 0 ? Math.round((statusCounts.closed / totalTickets) * 100) : 0}%
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default CounterCards;
