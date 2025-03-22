import { useEffect, useState } from "react";
import { fetchTickets } from "../../api";
import StatCard from "./StatCard";

const CounterCards = () => {
    const [loading, setLoading] = useState(true);
    const [totalTickets, setTotalTickets] = useState(0);
    const [statusCounts, setStatusCounts] = useState({
        open: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0,
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

    const getPercentage = (count) =>
        totalTickets > 0 ? Math.round((count / totalTickets) * 100) : 0;

    return (
        <div className="stats stats-vertical lg:stats-horizontal shadow mb-4">
            {loading ? (
                <div className="flex justify-center items-center w-full h-24">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <>
                    <StatCard title="Total" value={totalTickets} percentage={100} />
                    <StatCard title="Open" value={statusCounts.open} percentage={getPercentage(statusCounts.open)} />
                    <StatCard title="In Progress" value={statusCounts.inProgress} percentage={getPercentage(statusCounts.inProgress)} />
                    <StatCard title="Pending" value={statusCounts.pending} percentage={getPercentage(statusCounts.pending)} />
                    <StatCard title="Resolved" value={statusCounts.resolved} percentage={getPercentage(statusCounts.resolved)} />
                    <StatCard title="Closed" value={statusCounts.closed} percentage={getPercentage(statusCounts.closed)} />
                </>
            )}
        </div>
    );
};

export default CounterCards;
