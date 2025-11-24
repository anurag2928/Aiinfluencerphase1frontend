import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function History(){
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  useEffect(()=>{ 
    axios.get('http://localhost:4000/posts/list')
      .then(r=>{
        setPosts(r.data || []);
        setLoading(false);
      })
      .catch(()=>setLoading(false));
  },[]);

  const getStatusColor = (status) => {
    const colors = {
      draft: 'var(--gray-500)',
      scheduled: 'var(--warning)',
      queued: 'var(--primary)',
      posted: 'var(--success)',
      failed: 'var(--danger)'
    };
    return colors[status] || 'var(--gray-500)';
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

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(p => p.status === filter);

  return (
    <div className="container" style={{maxWidth: '1200px', paddingTop: '2rem', paddingBottom: '3rem'}}>
      {/* Header */}
      <div style={{marginBottom: '2rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem'}}>
          <div>
            <h1 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: '800',
              color: 'var(--gray-900)',
              margin: '0 0 0.5rem 0'
            }}>
              📊 Post History
            </h1>
            <p style={{color: 'var(--gray-600)', margin: 0, fontSize: '0.938rem'}}>
              Manage and track all your social media posts
            </p>
          </div>
          <Link href="/create-post">
            <button style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              fontSize: '0.938rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
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
          marginBottom: '1.5rem'
        }}>
          {['all', 'posted', 'scheduled', 'draft', 'failed'].map(status => {
            const count = status === 'all' ? posts.length : posts.filter(p => p.status === status).length;
            return (
              <div 
                key={status}
                onClick={() => setFilter(status)}
                style={{
                  padding: '1rem',
                  background: filter === status ? 'var(--primary)' : 'white',
                  color: filter === status ? 'white' : 'var(--gray-700)',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                  border: filter === status ? 'none' : '1px solid var(--gray-200)'
                }}
              >
                <div style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem'}}>
                  {count}
                </div>
                <div style={{fontSize: '0.75rem', textTransform: 'capitalize', fontWeight: '600'}}>
                  {status === 'all' ? 'Total' : status}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div style={{textAlign: 'center', padding: '4rem'}}>
          <div style={{fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 2s infinite'}}>⏳</div>
          <p style={{color: 'var(--gray-600)'}}>Loading posts...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="card" style={{textAlign: 'center', padding: '3rem'}}>
          <div style={{fontSize: '4rem', marginBottom: '1rem', opacity: 0.3}}>📭</div>
          <h3 style={{color: 'var(--gray-700)', marginBottom: '0.5rem'}}>
            {filter === 'all' ? 'No posts yet' : `No ${filter} posts`}
          </h3>
          <p style={{color: 'var(--gray-600)', marginBottom: '1.5rem'}}>
            Start creating amazing content with AI
          </p>
          <Link href="/create-post">
            <button style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)'
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
                overflow: 'hidden'
              }}
            >
              {/* Status Badge */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                padding: '0.375rem 0.75rem',
                background: getStatusColor(post.status),
                color: 'white',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                textTransform: 'capitalize',
                zIndex: 1
              }}>
                <span>{getStatusEmoji(post.status)}</span>
                <span>{post.status}</span>
              </div>

              {/* Content */}
              <div style={{flex: 1}}>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--gray-500)',
                  fontWeight: '600',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>#{post.id}</span>
                  <span>•</span>
                  <span style={{textTransform: 'uppercase'}}>{post.provider || 'X'}</span>
                </div>
                
                <p style={{
                  color: 'var(--gray-800)',
                  fontSize: '0.938rem',
                  lineHeight: '1.6',
                  marginBottom: '0.75rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {post.content || 'No content'}
                </p>

                {post.hashtags && (
                  <div style={{
                    fontSize: '0.813rem',
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
                paddingTop: '1rem',
                borderTop: '1px solid var(--gray-200)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.75rem',
                color: 'var(--gray-500)'
              }}>
                <div>
                  {post.scheduledAt ? (
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.375rem'}}>
                      <span>📅</span>
                      <span>{new Date(post.scheduledAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  ) : (
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.375rem'}}>
                      <span>🕐</span>
                      <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>
                  )}
                </div>
                {post.providerPostId && (
                  <div style={{
                    padding: '0.25rem 0.5rem',
                    background: 'var(--gray-100)',
                    borderRadius: '0.25rem',
                    fontSize: '0.688rem',
                    fontWeight: '600'
                  }}>
                    Published
                  </div>
                )}
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
