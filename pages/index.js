import Link from 'next/link';

export default function Home(){ 
  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div className="container" style={{maxWidth: '1000px'}}>
        <div style={{textAlign: 'center', marginBottom: '3rem'}}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            🚀 AI Social Poster
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--gray-600)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Create stunning social media content with AI-powered captions, hashtags, and images in seconds
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginTop: '3rem'
        }}>
          <Link href="/create-post" style={{textDecoration: 'none'}}>
            <div className="card" style={{
              cursor: 'pointer',
              height: '100%',
              transition: 'all 0.3s ease',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none'
            }}>
              <div style={{fontSize: '3rem', marginBottom: '1rem'}}>✨</div>
              <h2 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem', margin: 0}}>
                Create Post
              </h2>
              <p style={{fontSize: '0.938rem', opacity: 0.9, lineHeight: '1.6', margin: '0.75rem 0 0 0'}}>
                Generate AI-powered content with captions, hashtags, and stunning images for your social media
              </p>
              <div style={{
                marginTop: '1.5rem',
                padding: '0.625rem 1.25rem',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '0.5rem',
                display: 'inline-block',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                Get Started →
              </div>
            </div>
          </Link>

          <Link href="/history" style={{textDecoration: 'none'}}>
            <div className="card" style={{
              cursor: 'pointer',
              height: '100%',
              transition: 'all 0.3s ease'
            }}>
              <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📊</div>
              <h2 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--gray-800)', margin: 0}}>
                Post History
              </h2>
              <p style={{fontSize: '0.938rem', color: 'var(--gray-600)', lineHeight: '1.6', margin: '0.75rem 0 0 0'}}>
                View all your posts, check their status, and manage scheduled content
              </p>
              <div style={{
                marginTop: '1.5rem',
                padding: '0.625rem 1.25rem',
                background: 'var(--gray-100)',
                color: 'var(--primary)',
                borderRadius: '0.5rem',
                display: 'inline-block',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                View History →
              </div>
            </div>
          </Link>
        </div>

        <div style={{
          marginTop: '4rem',
          padding: '2rem',
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--gray-200)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: 'var(--gray-800)',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            ⚡ Key Features
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🤖</div>
              <h4 style={{fontSize: '0.938rem', fontWeight: '600', color: 'var(--gray-800)', margin: '0 0 0.5rem 0'}}>
                AI Generation
              </h4>
              <p style={{fontSize: '0.813rem', color: 'var(--gray-600)', margin: 0}}>
                OpenAI-powered content
              </p>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📅</div>
              <h4 style={{fontSize: '0.938rem', fontWeight: '600', color: 'var(--gray-800)', margin: '0 0 0.5rem 0'}}>
                Smart Scheduling
              </h4>
              <p style={{fontSize: '0.813rem', color: 'var(--gray-600)', margin: 0}}>
                Schedule posts anytime
              </p>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🎨</div>
              <h4 style={{fontSize: '0.938rem', fontWeight: '600', color: 'var(--gray-800)', margin: '0 0 0.5rem 0'}}>
                Image Creation
              </h4>
              <p style={{fontSize: '0.813rem', color: 'var(--gray-600)', margin: 0}}>
                AI-generated visuals
              </p>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📱</div>
              <h4 style={{fontSize: '0.938rem', fontWeight: '600', color: 'var(--gray-800)', margin: '0 0 0.5rem 0'}}>
                Multi-Platform
              </h4>
              <p style={{fontSize: '0.813rem', color: 'var(--gray-600)', margin: 0}}>
                Twitter & Instagram
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card:hover {
          transform: translateY(-4px);
        }
      `}</style>
    </div>
  );
}
