import PropTypes from "prop-types";

const StatCard = ({ title, value, percentage }) => (
    <div className="stat place-items-center">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-desc">{percentage}%</div>
    </div>
);

StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percentage: PropTypes.number.isRequired,
};

export default StatCard;
