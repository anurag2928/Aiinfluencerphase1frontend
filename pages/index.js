import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: 'calc(100vh - 140px)', // Adjust for nav + padding
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1.5rem',
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            paddingBottom: '0.2em' // Prevent clipper descenders
          }}>
            AI Social Poster
          </h1>
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Create stunning social media content with AI-powered captions, hashtags, and images in seconds.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          <Link href="/create-post" style={{ textDecoration: 'none' }}>
            <div className="card" style={{
              cursor: 'pointer',
              height: '100%',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
              color: 'white',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem', color: 'white' }}>
                  Create Post
                </h2>
                <p style={{ fontSize: '1rem', opacity: 0.9, lineHeight: '1.5', margin: 0 }}>
                  Generate AI-powered content with captions, hashtags, and stunning images.
                </p>
              </div>
              <div style={{
                marginTop: '2rem',
                padding: '0.75rem 1.5rem',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'var(--radius)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: '600',
                width: 'fit-content'
              }}>
                Get Started <span>→</span>
              </div>
            </div>
          </Link>

          <Link href="/history" style={{ textDecoration: 'none' }}>
            <div className="card" style={{
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  Post History
                </h2>
                <p style={{
                  fontSize: '1rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  View all your posts, check their status, and manage scheduled content.
                </p>
              </div>
              <div style={{
                marginTop: '2rem',
                padding: '0.75rem 1.5rem',
                background: 'var(--surface-highlight)',
                color: 'var(--primary)',
                borderRadius: 'var(--radius)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: '600',
                width: 'fit-content'
              }}>
                View History <span>→</span>
              </div>
            </div>
          </Link>
        </div>

        <div style={{
          padding: '2.5rem',
          background: 'var(--surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: 'var(--text-main)',
            marginBottom: '2rem',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            opacity: 0.8
          }}>
            Key Features
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { icon: '🤖', title: 'AI Generation', desc: 'OpenAI-powered content' },
              { icon: '📅', title: 'Smart Scheduling', desc: 'Schedule posts anytime' },
              { icon: '🎨', title: 'Image Creation', desc: 'AI-generated visuals' },
              { icon: '📱', title: 'Multi-Platform', desc: 'Twitter & Instagram' }
            ].map((feature, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{feature.icon}</div>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--text-main)',
                  margin: '0 0 0.25rem 0'
                }}>
                  {feature.title}
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
