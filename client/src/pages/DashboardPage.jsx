import React from 'react';
import UrlForm from '../components/UrlForm';
import UserUrl from '../components/UserUrl';
import { useSelector } from 'react-redux';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Welcome back, <span style={{ color: 'var(--accent)' }}>{user?.name || 'there'}</span> 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Manage your short links and view analytics
          </p>
        </div>

        {/* Create URL */}
        <div className="card" style={{ marginBottom: '32px', boxShadow: 'var(--shadow-glow)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '2px', display: 'inline-block' }} />
            Create a new link
          </h2>
          <UrlForm />
        </div>

        {/* URL Table */}
        <div className="card">
          <UserUrl />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;