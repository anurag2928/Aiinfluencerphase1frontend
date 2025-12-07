import PostForm from '../components/PostForm';
import Link from 'next/link';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

export default function CreatePost() {
  const router = useRouter();
  const { repost } = router.query;
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (repost) {
      axios.get(`${API_URL}/posts/${repost}`)
        .then(res => {
          // Strip ID and status so it's treated as a new draft
          const cleanData = { ...res.data };
          delete cleanData.id;
          delete cleanData.createdAt;
          delete cleanData.scheduledAt;
          delete cleanData.status;
          setInitialData(cleanData);
        })
        .catch(err => console.error('Failed to load repost data', err));
    }
  }, [repost]);
  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Header with Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: '800',
            color: 'var(--text-main)',
            margin: '0 0 0.5rem 0',
            letterSpacing: '-0.02em'
          }}>
            ✨ Create New Post
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1rem' }}>
            Generate AI-powered content for your social media.
          </p>
        </div>
        <Link href="/history">
          <button className="btn-secondary" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.95rem'
          }}>
            <span>📊</span>
            <span>View History</span>
          </button>
        </Link>
      </div>

      {/* Form Component */}
      <PostForm initialData={initialData} />

      {/* Back to Home Link */}
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <Link href="/" style={{
          color: 'var(--text-muted)',
          fontSize: '0.95rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: '500'
        }}>
          <span>←</span>
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
