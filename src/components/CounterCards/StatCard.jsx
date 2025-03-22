const StatCard = ({ title, value, percentage }) => (
    <div className="stat place-items-center">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-desc">{percentage}%</div>
    </div>
);

export default StatCard;
