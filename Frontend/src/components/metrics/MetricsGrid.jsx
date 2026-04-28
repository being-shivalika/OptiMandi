import MetricCard from "./MetricCard";

const MetricsGrid = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard label="Avg Price" value={`₹${metrics.averagePrice}`} />
      <MetricCard label="Change %" value={`${metrics.changePercent}%`} />
      <MetricCard label="Volatility" value={metrics.volatility} />
      <MetricCard label="Data Points" value={metrics.dataPoints} />
    </div>
  );
};
export default MetricsGrid;
