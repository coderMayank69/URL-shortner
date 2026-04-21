import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Custom tooltip with dark theme
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-bright)', borderRadius: '10px', padding: '12px 16px', fontSize: '13px' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</p>
        <p style={{ color: 'var(--accent)', fontWeight: 600 }}>{payload[0].value} click{payload[0].value !== 1 ? 's' : ''}</p>
      </div>
    );
  }
  return null;
};

const AnalyticsChart = ({ data }) => {
  // Format dates for display
  const formatted = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={formatted} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
          axisLine={{ stroke: 'var(--border)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(108,99,255,0.08)' }} />
        <Bar
          dataKey="count"
          fill="var(--accent)"
          radius={[6, 6, 0, 0]}
          maxBarSize={48}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AnalyticsChart;
