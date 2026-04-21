import React from 'react';
import UrlForm from '../components/UrlForm';
import { Link } from '@tanstack/react-router';
import { useSelector } from 'react-redux';

const features = [
  { icon: '⚡', title: 'Lightning Fast', desc: 'Redis-cached redirects in under 1ms' },
  { icon: '📊', title: 'Real Analytics', desc: 'Track clicks, unique visitors, daily trends' },
  { icon: '🔗', title: 'Custom Slugs', desc: 'Create branded links your users remember' },
  { icon: '🔒', title: 'Secure by Default', desc: 'JWT auth, expiry dates, link ownership' },
];

const HomePage = () => {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 24px 96px' }}>
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(108,99,255,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div className="badge badge-accent animate-fade-up" style={{ marginBottom: '24px' }}>
            🚀 Production-Grade URL Shortener
          </div>

          <h1 className="gradient-text animate-fade-up" style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px', animationDelay: '0.1s' }}>
            Short URLs.<br />Big Impact.
          </h1>

          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '48px', maxWidth: '520px', margin: '0 auto 48px' }}>
            Turn long URLs into powerful short links with real-time analytics,
            custom slugs, and Redis-powered performance.
          </p>

          {/* URL Form */}
          <div className="card" style={{ maxWidth: '560px', margin: '0 auto', padding: '28px', boxShadow: 'var(--shadow-glow)' }}>
            <UrlForm />
          </div>

          {!isAuth && (
            <p style={{ marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <Link to="/auth" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Sign up free</Link>
              {' '}to get custom slugs & analytics
            </p>
          )}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 24px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '28px', fontWeight: 700, marginBottom: '48px', color: 'var(--text-primary)' }}>
            Built for scale
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '20px' }}>
            {features.map((f) => (
              <div key={f.title} className="card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;