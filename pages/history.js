import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import API_URL from '../config/api';

export default function History() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get(`${API_URL}/posts/list`)
      .then(r => {
        setPosts(r.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      draft: 'var(--text-muted)',
      scheduled: 'var(--warning)',
      queued: 'var(--primary)',
      posted: 'var(--success)',
      failed: 'var(--danger)'
    };
    return colors[status] || 'var(--text-muted)';
  };

  const getStatusEmoji = (status) => {
    const emojis = {
      draft: '📝',
      scheduled: '📅',
      queued: '⏳',
      posted: '✅',
      failed: '❌'
    };
    return emojis[status] || '📄';
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post? This cannot be undone.')) return;

    try {
      await axios.delete(`${API_URL}/posts/${postId}`);
      // Remove from state details
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete post');
    }
  };

  const filteredPosts = filter === 'all'
    ? posts
    : posts.filter(p => p.status === filter);

  return (
    <div className="container" style={{ maxWidth: '1200px', paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: '800',
              color: 'var(--text-main)',
              margin: '0 0 0.5rem 0',
              letterSpacing: '-0.02em'
            }}>
              📊 Post History
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1rem' }}>
              Manage and track all your social media posts.
            </p>
          </div>
          <Link href="/create-post">
            <button style={{
              padding: '0.875rem 1.75rem',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '600'
            }}>
              <span>➕</span>
              <span>Create New Post</span>
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {['all', 'posted', 'scheduled', 'draft', 'failed'].map(status => {
            const count = status === 'all' ? posts.length : posts.filter(p => p.status === status).length;
            const isActive = filter === status;
            return (
              <div
                key={status}
                onClick={() => setFilter(status)}
                style={{
                  padding: '1.25rem',
                  background: isActive ? 'var(--primary)' : 'var(--surface)',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  boxShadow: isActive ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                  border: isActive ? '1px solid var(--primary)' : '1px solid var(--border)',
                  transform: isActive ? 'translateY(-2px)' : 'none'
                }}
              >
                <div style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem', color: isActive ? 'white' : 'var(--text-main)' }}>
                  {count}
                </div>
                <div style={{ fontSize: '0.85rem', textTransform: 'capitalize', fontWeight: '600' }}>
                  {status === 'all' ? 'Total' : status}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 2s infinite' }}>⏳</div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading posts...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>📭</div>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
            {filter === 'all' ? 'No posts yet' : `No ${filter} posts`}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Start creating amazing content with AI.
          </p>
          <Link href="/create-post">
            <button style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
              padding: '1rem 2rem'
            }}>
              Create Your First Post
            </button>
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredPosts.map(post => (
            <div
              key={post.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                padding: 0,
                border: '1px solid var(--border)'
              }}
            >
              {/* Image Preview */}
              {post.imageUrl && (
                <div style={{
                  height: '200px',
                  overflow: 'hidden',
                  background: 'var(--surface-highlight)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={
                      post.imageUrl?.startsWith('http')
                        ? post.imageUrl
                        : (post.imageUrl?.startsWith('data:') ? post.imageUrl : `data:image/png;base64,${post.imageUrl}`)
                    }
                    alt="Post content"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              )}
              {/* Status Badge */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                padding: '0.375rem 0.75rem',
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(4px)',
                color: 'white',
                borderRadius: '2rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                textTransform: 'capitalize',
                zIndex: 1,
                border: `1px solid ${getStatusColor(post.status)}`
              }}>
                <span>{getStatusEmoji(post.status)}</span>
                <span>{post.status}</span>
              </div>

              {/* Content */}
              <div style={{ flex: 1, padding: '1.5rem' }}>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>#{post.id}</span>
                  <span>•</span>
                  <span style={{
                    textTransform: 'uppercase',
                    background: 'var(--surface-highlight)',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '0.25rem'
                  }}>
                    {post.provider || 'X'}
                  </span>
                </div>

                <p style={{
                  color: 'var(--text-main)',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  marginBottom: '1rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {post.content || 'No content'}
                </p>

                {post.hashtags && (
                  <div style={{
                    fontSize: '0.85rem',
                    color: 'var(--primary)',
                    marginBottom: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {post.hashtags}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                background: 'var(--surface-highlight)'
              }}>
                <div>
                  {post.scheduledAt ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span>📅</span>
                      <span>{new Date(post.scheduledAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <span>🕐</span>
                      <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>
                  )}
                </div>

                <Link href={`/create-post?repost=${post.id}`}>
                  <button style={{
                    background: 'transparent',
                    border: '1px solid var(--primary)',
                    color: 'var(--primary)',
                    padding: '0.25rem 0.625rem',
                    fontSize: '0.75rem',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontWeight: '600'
                  }}>
                    <span>🔁</span> Repost
                  </button>
                </Link>

                <button
                  onClick={() => handleDelete(post.id)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--danger)',
                    color: 'var(--danger)',
                    padding: '0.25rem 0.625rem',
                    fontSize: '0.75rem',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontWeight: '600'
                  }}
                  title="Delete Post"
                >
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
