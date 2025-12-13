import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

export default function PostForm({ initialData }) {
  const [topic, setTopic] = useState('');
  const [caption, setCaption] = useState(initialData?.content || '');
  const [hashtags, setHashtags] = useState(initialData?.hashtags || '');
  const [imageBase64, setImageBase64] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(initialData?.imageUrl || null);
  const [provider, setProvider] = useState(initialData?.provider || 'x');
  const [scheduledAt, setScheduledAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [colorScheme, setColorScheme] = useState('blue-gradient');
  const [savedPostId, setSavedPostId] = useState(initialData?.id || null);

  // Social Accounts State
  const [twitterAccounts, setTwitterAccounts] = useState([]);
  const [instagramAccounts, setInstagramAccounts] = useState([]);
  const [accountId, setAccountId] = useState(initialData?.account_id || '');

  useEffect(() => {
    // Fetch available accounts
    axios.get(`${API_URL}/twitter-accounts/list`)
      .then(res => setTwitterAccounts(res.data))
      .catch(err => console.error('Failed to fetch twitter accounts', err));

    axios.get(`${API_URL}/instagram-accounts/list`)
      .then(res => setInstagramAccounts(res.data))
      .catch(err => console.error('Failed to fetch instagram accounts', err));
  }, []);

  // Update state if initialData changes (e.g. after fetch)
  // Update state if initialData changes (e.g. after fetch)
  useEffect(() => {
    if (initialData) {
      setCaption(initialData.content || '');
      setHashtags(initialData.hashtags || '');
      setExistingImageUrl(initialData.imageUrl || null);
      setImageBase64(null); // Reset new image if loading old one
      setProvider(initialData.provider || 'x');
      setSavedPostId(initialData.id || null);
      setAccountId(initialData.account_id || '');
    }
  }, [initialData]);

  // 20 Crypto topic recommendations: 10 facts + 10 education
  const cryptoTopics = {
    facts: [
      'Bitcoin Pizza Day: 10,000 BTC for 2 Pizzas',
      'Lost Bitcoin: 20% of All BTC is Lost Forever',
      'Satoshi Nakamoto Identity Still Unknown',
      'First Bitcoin Transaction in 2009',
      'Ethereum Created by Vitalik Buterin at 19',
      'Crypto Market Cap Hits $5 Trillion in 2025',
      'El Salvador Made Bitcoin Legal Tender',
      'NFT Sales Hit Record Highs in Dec 2025',
      'DeFi Locked Value Surpassed $100 Billion',
      'Over 20,000 Cryptocurrencies Exist Today'
    ],
    education: [
      'What is Blockchain Technology?',
      'How to Start Investing in Crypto',
      'Understanding Crypto Wallets',
      'DeFi vs Traditional Finance',
      'What are Smart Contracts?',
      'Crypto Mining Explained Simply',
      'How to Keep Your Crypto Safe',
      'Understanding Gas Fees',
      'What is Staking and How it Works',
      'Web3 and the Future of Internet'
    ]
  };

  async function handleGenerateAll(e) {
    e.preventDefault();
    if (!topic) return alert('enter topic');
    setLoading(true);
    try {
      console.log('Sending request to:', `${API_URL}/ai/generate-all`);
      console.log('With data:', { topic, colorScheme });
      const resp = await axios.post(`${API_URL}/ai/generate-all`, { topic, colorScheme });
      console.log('Response received:', resp.data);
      setCaption(resp.data.caption || '');
      setHashtags(resp.data.hashtags || '');
      setImageBase64(resp.data.imageBase64 || null);
      setExistingImageUrl(null); // Clear old image since we generated a new one
    } catch (err) {
      console.error('Generation error:', err);
      console.error('Error response:', err.response?.data);
      alert(`Generation failed: ${err.response?.data?.error || err.message}`);
    } finally { setLoading(false); }
  }

  async function handlePostNow(e) {
    e.preventDefault();
    if (!caption) return alert('Enter caption to post.');

    try {
      if (savedPostId) {
        // Publish existing saved post
        await axios.post(`${API_URL}/posts/publish-now`, { postId: savedPostId, provider });
      } else {
        // Auto-create and publish immediately
        await axios.post(`${API_URL}/posts/create`, {
          content: caption,
          hashtags,
          provider,
          postNow: true,
          imageBase64: imageBase64 || undefined,
          imageUrl: existingImageUrl || undefined,
          accountId: accountId || undefined
        });
      }
      alert('Post queued for immediate publishing.');
      // Clear form
      setCaption('');
      setHashtags('');
      setImageBase64(null);
      setExistingImageUrl(null);
      setSavedPostId(null);
    } catch (err) {
      console.error('Post error:', err);
      alert(`Post failed: ${err.response?.data?.error || err.message}`);
    }
  }

  async function handleSchedule(e) {
    e.preventDefault();
    if (!caption) return alert('generate or enter caption');
    if (!scheduledAt) return alert('choose schedule date/time');
    try {
      const jobDate = new Date(scheduledAt); // Local time
      const scheduledIso = jobDate.toISOString();
      await axios.post(`${API_URL}/posts/create`, {
        content: caption,
        hashtags,
        provider,
        scheduledAt: scheduledIso,
        postNow: false,
        imageBase64: imageBase64 || undefined,
        imageUrl: existingImageUrl || undefined,
        accountId: accountId || undefined
      });

      alert(`Post successfully scheduled for ${jobDate.toLocaleString()}!`);
      // Reset schedule time and saved ID to prevent confusion
      setScheduledAt('');
      setSavedPostId(null);
      setExistingImageUrl(null);
      setImageBase64(null);
      setCaption('');
      setHashtags('');
    } catch (err) {
      console.error('Schedule error:', err);
      alert(`Schedule failed: ${err.response?.data?.error || err.message}`);
    }
  }

  async function handleSaveDraft(e) {
    e.preventDefault();
    if (!caption) return alert('generate or enter caption');
    try {
      // No postNow, no scheduledAt -> defaults to 'draft' status
      const res = await axios.post(`${API_URL}/posts/create`, {
        content: caption,
        hashtags,
        provider,
        imageBase64: imageBase64 || undefined,
        imageUrl: existingImageUrl || undefined,
        accountId: accountId || undefined
      });
      if (res.data && res.data.post && res.data.post.id) {
        setSavedPostId(res.data.post.id);
        alert('Post saved to database! You can now publish it.');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert(`Save failed: ${err.response?.data?.error || err.message}`);
    }
  }

  function copyText(text) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard');
    }).catch(() => alert('Copy failed'));
  }

  function downloadImage() {
    if (existingImageUrl) {
      window.open(existingImageUrl, '_blank');
      return;
    }
    if (!imageBase64) return alert('No image');
    const byteChars = atob(imageBase64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const providers = [
    { value: 'x', label: 'X' },
    { value: 'instagram', label: 'Instagram' }
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <form style={{ display: 'grid', gap: '2rem' }}>
        {/* Recommended Topics Section */}
        <div className="card">
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span>💡</span>
            <span>Trending Crypto Topics</span>
          </h3>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🔥</span>
              <span>Crypto Facts</span>
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {cryptoTopics.facts.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTopic(t)}
                  style={{
                    padding: '0.625rem 1rem',
                    fontSize: '0.85rem',
                    background: topic === t ? 'var(--primary)' : 'var(--surface-highlight)',
                    color: topic === t ? 'white' : 'var(--text-secondary)',
                    border: topic === t ? 'none' : '1px solid var(--border)',
                    borderRadius: '2rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontWeight: '500'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🎓</span>
              <span>Crypto Education</span>
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {cryptoTopics.education.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTopic(t)}
                  style={{
                    padding: '0.625rem 1rem',
                    fontSize: '0.85rem',
                    background: topic === t ? 'var(--primary)' : 'var(--surface-highlight)',
                    color: topic === t ? 'white' : 'var(--text-secondary)',
                    border: topic === t ? 'none' : '1px solid var(--border)',
                    borderRadius: '2rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontWeight: '500'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Generation Section */}
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)', color: 'white', padding: '2.5rem', border: 'none' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem', fontWeight: '800', color: 'white' }}>
            ✨ AI Content Generator
          </h2>
          <p style={{ margin: '0 0 2rem 0', opacity: 0.95, fontSize: '1rem' }}>
            Enter a topic and let AI create engaging content with images for your social media.
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ color: 'white', fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem', display: 'block' }}>
              🎨 Choose Image Color Scheme
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { value: 'blue-gradient', label: 'Blue', color: 'linear-gradient(135deg, #1e40af 0%, #06b6d4 100%)' },
                { value: 'purple-gradient', label: 'Purple', color: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)' },
                { value: 'orange-gradient', label: 'Orange', color: 'linear-gradient(135deg, #ea580c 0%, #fbbf24 100%)' },
                { value: 'green-gradient', label: 'Green', color: 'linear-gradient(135deg, #059669 0%, #14b8a6 100%)' },
                { value: 'pink-gradient', label: 'Pink', color: 'linear-gradient(135deg, #db2777 0%, #f43f5e 100%)' },
                { value: 'dark-gradient', label: 'Dark', color: 'linear-gradient(135deg, #1e1b4b 0%, #581c87 100%)' },
                { value: 'red-gradient', label: 'Red', color: 'linear-gradient(135deg, #b91c1c 0%, #f97316 100%)' },
                { value: 'teal-gradient', label: 'Teal', color: 'linear-gradient(135deg, #0f766e 0%, #10b981 100%)' },
                { value: 'gold-gradient', label: 'Gold', color: 'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)' },
                { value: 'cyberpunk-gradient', label: 'Cyber', color: 'linear-gradient(135deg, #f472b6 0%, #22d3ee 100%)' },
                { value: 'sunset-gradient', label: 'Sunset', color: 'linear-gradient(135deg, #c026d3 0%, #f97316 100%)' },
                { value: 'forest-gradient', label: 'Forest', color: 'linear-gradient(135deg, #14532d 0%, #84cc16 100%)' },
                { value: 'midnight-gradient', label: 'Midnight', color: 'linear-gradient(135deg, #0f172a 0%, #4338ca 100%)' }
              ].map(scheme => (
                <button
                  key={scheme.value}
                  type="button"
                  onClick={() => setColorScheme(scheme.value)}
                  style={{
                    padding: '0.625rem 1rem',
                    background: colorScheme === scheme.value ? 'white' : 'rgba(255,255,255,0.15)',
                    color: colorScheme === scheme.value ? 'var(--primary)' : 'white',
                    border: colorScheme === scheme.value ? 'none' : '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backdropFilter: 'blur(5px)'
                  }}
                >
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: scheme.color,
                    border: '2px solid white',
                    flexShrink: 0
                  }}></div>
                  {scheme.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input
              style={{
                flex: 1,
                padding: '1rem 1.25rem',
                border: 'none',
                borderRadius: 'var(--radius)',
                fontSize: '1rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                minWidth: '280px',
                background: 'white',
                color: 'var(--text-main)'
              }}
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Bitcoin Pizza Day, What is Blockchain, DeFi Explained..."
            />
            <button
              onClick={handleGenerateAll}
              disabled={loading}
              type="button"
              style={{
                padding: '1rem 2rem',
                background: 'white',
                color: 'var(--primary)',
                fontWeight: '700',
                fontSize: '1rem',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                whiteSpace: 'nowrap'
              }}
            >
              {loading ? (
                <span>🔄 Generating...</span>
              ) : (
                <span>🚀 Generate All</span>
              )}
            </button>
          </div>
        </div>

        {/* Content Editor Section */}
        <div className="card">
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>
            📝 Your Content
          </h3>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Caption</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '400' }}>
                  ({caption.length} characters)
                </span>
              </label>
              <textarea
                style={{
                  width: '100%',
                  padding: '1rem',
                  minHeight: '160px',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  borderRadius: 'var(--radius)'
                }}
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Your engaging caption will appear here..."
              />
            </div>

            <div>
              <label>Hashtags</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  style={{ flex: 1, padding: '0.875rem' }}
                  value={hashtags}
                  onChange={e => setHashtags(e.target.value)}
                  placeholder="#hashtag1 #hashtag2 #hashtag3"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => copyText(caption)}
                disabled={!caption}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
              >
                <span>📋</span> Copy Caption
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => copyText(hashtags)}
                disabled={!hashtags}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
              >
                <span>#️⃣</span> Copy Hashtags
              </button>
            </div>
          </div>
        </div>

        {/* Image Preview Section */}
        <div className="card">
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>
            🖼️ Generated Image
          </h3>

          <div style={{
            border: '2px dashed var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            background: 'var(--surface-highlight)',
            textAlign: 'center',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {loading && !imageBase64 && !existingImageUrl ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 2s infinite' }}>🎨</div>
                <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Creating your stunning image...</p>
              </div>
            ) : (imageBase64 || existingImageUrl) ? (
              <div style={{ width: '100%' }}>
                <img
                  src={existingImageUrl || `data:image/png;base64,${imageBase64}`}
                  alt="Generated"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow-lg)',
                    marginBottom: '1.5rem'
                  }}
                />
                <button
                  type="button"
                  className="btn"
                  onClick={downloadImage}
                  style={{
                    background: 'var(--success)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>💾</span> {existingImageUrl ? 'Open Image' : 'Download Image'}
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🖼️</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  No image yet. Generate content above to create an AI image.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Publishing Options Section */}
        <div className="card" style={{ border: '1px solid var(--border-focus)', boxShadow: 'var(--shadow-lg)' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>
            🚀 Publishing Options
          </h3>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              <div>
                <label>Social Platform</label>
                <select
                  value={provider}
                  onChange={e => setProvider(e.target.value)}
                  style={{
                    padding: '0.875rem',
                    fontSize: '0.95rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="x">🐦 Twitter / X</option>
                  <option value="instagram">📸 Instagram</option>
                </select>
              </div>

              {provider === 'x' && (
                <div>
                  <label>Twitter Account</label>
                  <select
                    value={accountId}
                    onChange={e => setAccountId(e.target.value)}
                    style={{
                      padding: '0.875rem',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    <option value="">Default (from Env)</option>
                    {twitterAccounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.account_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {provider === 'instagram' && (
                <div>
                  <label>Instagram Account</label>
                  <select
                    value={accountId}
                    onChange={e => setAccountId(e.target.value)}
                    style={{
                      padding: '0.875rem',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    {/* Default option is handled by the backend prepending it, but if array is empty we might need a fallback. 
                        Actually instagram-accounts/list prepends default even if env only. 
                        So we just map. But user might not have env set. 
                        Let's assume the list returns what we need. */}
                    {instagramAccounts.length === 0 && (
                      <option value="default">Default / None</option>
                    )}
                    {instagramAccounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.account_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label>Schedule Date & Time (Optional)</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={e => setScheduledAt(e.target.value)}
                  style={{ padding: '0.875rem', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border)',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={handlePostNow}
                type="button"
                className="btn-primary"
                style={{
                  flex: 1,
                  padding: '1rem 1.75rem',
                  background: 'var(--primary)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem'
                }}
                title={!caption ? "Enter caption first" : "Post immediately"}
              >
                <span>⚡</span>
                <span>Post Now</span>
              </button>
              <button
                onClick={handleSchedule}
                type="button"
                className="btn-primary"
                style={{
                  flex: 1,
                  padding: '1rem 1.75rem',
                  background: 'var(--secondary)',
                  fontSize: '1rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem'
                }}
              >
                <span>📅</span>
                <span>Schedule Post</span>
              </button>
            </div>

            <button
              onClick={handleSaveDraft}
              type="button"
              className="btn-secondary"
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                fontSize: '1.05rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                marginTop: '0.5rem'
              }}
            >
              <span>💾</span>
              <span>Save to database</span>
            </button>
          </div>
        </div>
      </form>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @media (max-width: 640px) {
          .card {
            padding: 1.5rem !important;
          }
        }
        
        @media (max-width: 768px) {
          button[type="button"] {
            flex: 1 1 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
