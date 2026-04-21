import React, { useState } from 'react';
import { loginUser } from '../api/user.api';
import { useDispatch } from 'react-redux';
import { login } from '../store/slice/authSlice.js';
import { useNavigate } from '@tanstack/react-router';

const LoginForm = ({ state }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginUser(email, password);
      dispatch(login(data.user));
      navigate({ to: '/dashboard' });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: '48px', height: '48px', background: 'rgba(108,99,255,0.15)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <svg width="24" height="24" fill="none" stroke="#6c63ff" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Welcome back</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>Sign in to manage your links</p>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', color: '#ef4444', fontSize: '13px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Email</label>
          <input className="input-field" id="login-email" type="email" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Password</label>
          <input className="input-field" id="login-password" type="password" placeholder="••••••••"
            value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button className="btn-primary" id="login-btn" type="submit" disabled={loading} style={{ marginTop: '8px', width: '100%' }}>
          {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Signing in...</> : 'Sign In'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '24px' }}>
        Don't have an account?{' '}
        <span onClick={() => state(false)} style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>
          Register
        </span>
      </p>
    </div>
  );
};

export default LoginForm;