import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUserUrls } from '../api/user.api';
import { deleteShortUrl } from '../api/shortUrl.api';
import { Link } from '@tanstack/react-router';

const UserUrl = () => {
  const queryClient = useQueryClient();
  const [copiedId, setCopiedId] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['userUrls'],
    queryFn: getAllUserUrls,
    staleTime: 0,
    refetchInterval: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: (shortCode) => deleteShortUrl(shortCode),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userUrls'] }),
  });

  const handleCopy = (shortCode, id) => {
    navigator.clipboard.writeText(`http://localhost:3000/${shortCode}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', color: '#ef4444', fontSize: '13px' }}>
        Error loading your URLs: {error?.message}
      </div>
    );
  }

  const urls = data?.urls || [];

  if (urls.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ margin: '0 auto 16px', display: 'block', color: 'var(--border-bright)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-secondary)' }}>No URLs yet</p>
        <p style={{ fontSize: '13px', marginTop: '4px' }}>Shorten your first URL above to get started</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Your Links</h3>
        <span className="badge badge-accent">{urls.length} total</span>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)' }}>
              {['Original URL', 'Short Code', 'Created', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {urls.map((url, i) => (
              <tr key={url.id} style={{ borderTop: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-secondary)'}>

                <td style={{ padding: '14px 16px', maxWidth: '220px' }}>
                  <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }} title={url.originalUrl}>
                    {url.originalUrl}
                  </span>
                </td>

                <td style={{ padding: '14px 16px' }}>
                  <a href={`http://localhost:3000/${url.shortCode}`} target="_blank" rel="noopener noreferrer"
                    style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>
                    {url.shortCode}
                  </a>
                </td>

                <td style={{ padding: '14px 16px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {new Date(url.createdAt).toLocaleDateString()}
                </td>

                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => handleCopy(url.shortCode, url.id)}
                      style={{ padding: '6px 12px', background: copiedId === url.id ? 'rgba(34,197,94,0.12)' : 'var(--accent-soft)', color: copiedId === url.id ? 'var(--success)' : 'var(--accent)', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}>
                      {copiedId === url.id ? '✓ Copied' : 'Copy'}
                    </button>

                    <Link to={`/analytics/${url.id}`} style={{ textDecoration: 'none' }}>
                      <button style={{ padding: '6px 12px', background: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}>
                        Analytics
                      </button>
                    </Link>

                    <button className="btn-danger"
                      style={{ padding: '6px 12px' }}
                      onClick={() => deleteMutation.mutate(url.shortCode)}
                      disabled={deleteMutation.isPending}>
                      {deleteMutation.isPending ? '...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserUrl;