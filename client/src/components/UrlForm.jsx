import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createShortUrl } from '../api/shortUrl.api';
import { useSelector } from 'react-redux';

const UrlForm = () => {
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => createShortUrl(url, slug || undefined),
    onSuccess: (data) => {
      setResult(data.shortUrl);
      setUrl('');
      setSlug('');
      queryClient.invalidateQueries({ queryKey: ['userUrls'] });
    },
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <input
          className="input-field"
          type="url"
          placeholder="https://your-long-url.com/paste-here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && url && mutate()}
          id="url-input"
        />
      </div>

      {isAuth && (
        <div>
          <input
            className="input-field"
            type="text"
            placeholder="Custom slug (optional, e.g. my-link)"
            value={slug}
            onChange={(e) => setSlug(e.target.value.replace(/\s+/g, '-'))}
            id="slug-input"
          />
        </div>
      )}

      <button
        className="btn-primary"
        style={{ width: '100%' }}
        onClick={() => url && mutate()}
        disabled={isPending || !url}
        id="shorten-btn"
      >
        {isPending ? (
          <>
            <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
            Shortening...
          </>
        ) : (
          <>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Shorten URL
          </>
        )}
      </button>

      {isError && (
        <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', color: '#ef4444', fontSize: '13px' }}>
          {error?.message || 'Something went wrong'}
        </div>
      )}

      {result && (
        <div style={{ padding: '16px', background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.25)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}
          className="animate-fade-up">
          <a href={result} target="_blank" rel="noopener noreferrer"
            style={{ color: '#a78bfa', fontSize: '14px', fontWeight: 500, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {result}
          </a>
          <button className="btn-ghost" style={{ padding: '8px 14px', flexShrink: 0, fontSize: '13px' }} onClick={handleCopy}>
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
};

export default UrlForm;