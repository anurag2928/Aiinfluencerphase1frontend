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
          setInitialData(res.data);
        })
        .catch(err => console.error('Failed to load repost data', err));
    }
  }, [repost]);
  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Header with Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: '800',
            color: 'var(--gray-900)',
            margin: '0 0 0.5rem 0'
          }}>
            ✨ Create New Post
          </h1>
          <p style={{ color: 'var(--gray-600)', margin: 0, fontSize: '0.938rem' }}>
            Generate AI-powered content for your social media
          </p>
        </div>
        <Link href="/history">
          <button style={{
            background: 'white',
            color: 'var(--gray-700)',
            border: '1px solid var(--gray-300)',
            padding: '0.75rem 1.5rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.938rem'
          }}>
            <span>📊</span>
            <span>View History</span>
          </button>
        </Link>
      </div>

      {/* Form Component */}
      <PostForm initialData={initialData} />

      {/* Back to Home Link */}
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <Link href="/" style={{
          color: 'var(--gray-600)',
          fontSize: '0.875rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>←</span>
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
