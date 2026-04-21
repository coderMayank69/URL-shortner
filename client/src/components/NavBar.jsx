import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slice/authSlice.js';
import { logoutUser } from '../api/user.api';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (_) { /* ignore */ }
    dispatch(logout());
    navigate({ to: '/' });
  };

  return (
    <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>Lynk<span style={{ color: 'var(--accent)' }}>.io</span></span>
        </Link>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: '13px' }}>Dashboard</button>
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                  src={user?.avatar || `https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp`}
                  alt="avatar"
                  style={{ width: '30px', height: '30px', borderRadius: '50%', border: '2px solid var(--border-bright)' }}
                />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>{user?.name}</span>
              </div>
              <button className="btn-ghost" id="logout-btn" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" style={{ textDecoration: 'none' }}>
                <button className="btn-ghost" id="nav-login-btn" style={{ padding: '8px 16px', fontSize: '13px' }}>Login</button>
              </Link>
              <Link to="/auth" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" id="nav-signup-btn" style={{ padding: '8px 18px', fontSize: '13px' }}>Get Started</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;