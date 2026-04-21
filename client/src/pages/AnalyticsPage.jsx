import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from '@tanstack/react-router';
import { getAnalytics } from '../api/shortUrl.api';
import AnalyticsChart from '../components/AnalyticsChart';

const StatCard = ({ label, value, sub, color = 'var(--accent)' }) => (
  <div className="card" style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '36px', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '8px' }}>{label}</div>
    {sub && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{sub}</div>}
  </div>
);

const AnalyticsPage = () => {
  const { urlId } = useParams({ strict: false });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['analytics', urlId],
    queryFn: () => getAnalytics(urlId),
    enabled: !!urlId,
  });

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <p style={{ color: 'var(--danger)', fontSize: '15px' }}>{error?.message || 'Failed to load analytics'}</p>
        <Link to="/dashboard"><button className="btn-ghost">← Back to Dashboard</button></Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '32px 24px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <button className="btn-ghost" style={{ padding: '8px 14px', fontSize: '13px', marginBottom: '20px' }}>
              ← Back to Dashboard
            </button>
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Link Analytics</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-accent">/{data.shortCode}</span>
            <a href={data.originalUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px' }}>
              {data.originalUrl}
            </a>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
            Created {new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <StatCard label="Total Clicks" value={data.totalClicks.toLocaleString()} color="var(--accent)" />
          <StatCard label="Unique Visitors" value={data.uniqueClicks.toLocaleString()} sub="by IP address" color="#60a5fa" />
          <StatCard label="Days Active" value={data.dailyBreakdown.length} color="var(--success)" />
        </div>

        {/* Chart */}
        <div className="card">
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '24px' }}>Daily Click Breakdown</h2>
          {data.dailyBreakdown.length > 0
            ? <AnalyticsChart data={data.dailyBreakdown} />
            : <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0', fontSize: '14px' }}>No click data yet — share your link to start tracking!</p>}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
