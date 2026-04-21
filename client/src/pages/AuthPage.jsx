import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: '900px', display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-glow)' }}>

        {/* Left panel — branding */}
        <div style={{ background: 'linear-gradient(135deg, #1a1830 0%, #0f0f1a 100%)', padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '240px', height: '240px', background: 'radial-gradient(circle, rgba(108,99,255,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px' }}>
              <div style={{ width: '36px', height: '36px', background: 'var(--accent)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <span style={{ fontWeight: 700, fontSize: '18px', color: 'white' }}>Lynk<span style={{ color: '#a78bfa' }}>.io</span></span>
            </div>

            <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'white', lineHeight: 1.3, marginBottom: '16px' }}>
              Powerful links,<br />real insights
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
              Create short links, track every click, and understand your audience with detailed analytics.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Redis-cached redirects', 'Custom branded slugs', 'Real-time click analytics'].map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                <span style={{ width: '16px', height: '16px', background: 'rgba(108,99,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="10" fill="none" stroke="#6c63ff" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — form */}
        <div style={{ background: 'var(--bg-card)', padding: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%' }}>
            {/* Toggle */}
            <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '10px', padding: '4px', marginBottom: '32px' }}>
              {['Login', 'Register'].map((label) => (
                <button key={label}
                  onClick={() => setIsLogin(label === 'Login')}
                  style={{ flex: 1, padding: '8px', fontSize: '13px', fontWeight: 500, border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                    background: (isLogin && label === 'Login') || (!isLogin && label === 'Register') ? 'var(--accent)' : 'transparent',
                    color: (isLogin && label === 'Login') || (!isLogin && label === 'Register') ? 'white' : 'var(--text-muted)' }}>
                  {label}
                </button>
              ))}
            </div>

            {isLogin
              ? <LoginForm state={setIsLogin} />
              : <RegisterForm state={setIsLogin} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;