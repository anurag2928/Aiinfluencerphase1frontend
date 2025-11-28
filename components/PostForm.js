import { useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

export default function PostForm(){
  const [topic, setTopic] = useState('');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [imageBase64, setImageBase64] = useState(null);
  const [provider, setProvider] = useState('x');
  const [scheduledAt, setScheduledAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [colorScheme, setColorScheme] = useState('blue-gradient');

  // 20 Crypto topic recommendations: 10 facts + 10 education
  const cryptoTopics = {
    facts: [
      'Bitcoin Pizza Day: 10,000 BTC for 2 Pizzas',
      'Lost Bitcoin: 20% of All BTC is Lost Forever',
      'Satoshi Nakamoto Identity Still Unknown',
      'First Bitcoin Transaction in 2009',
      'Ethereum Created by Vitalik Buterin at 19',
      'Crypto Market Cap Exceeded $3 Trillion',
      'El Salvador Made Bitcoin Legal Tender',
      'NFT Sales Hit $25 Billion in 2021',
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

  async function handleGenerateAll(e){
    e.preventDefault();
    if(!topic) return alert('enter topic');
    setLoading(true);
    try {
      console.log('Sending request to:', `${API_URL}/ai/generate-all`);
      console.log('With data:', { topic, colorScheme });
      const resp = await axios.post(`${API_URL}/ai/generate-all`, { topic, colorScheme });
      console.log('Response received:', resp.data);
      setCaption(resp.data.caption || '');
      setHashtags(resp.data.hashtags || '');
      setImageBase64(resp.data.imageBase64 || null);
    } catch (err) {
      console.error('Generation error:', err);
      console.error('Error response:', err.response?.data);
      alert(`Generation failed: ${err.response?.data?.error || err.message}`);
    } finally { setLoading(false); }
  }

  async function handlePostNow(e){
    e.preventDefault();
    if(!caption) return alert('generate or enter caption');
    await axios.post(`${API_URL}/posts/create`, { content: caption, hashtags, provider, postNow: true, imageBase64 });
    alert('Post queued for immediate publishing.');
  }

  async function handleSchedule(e){
    e.preventDefault();
    if(!caption) return alert('generate or enter caption');
    if(!scheduledAt) return alert('choose schedule date/time');
    await axios.post(`${API_URL}/posts/create`, { content: caption, hashtags, provider, scheduledAt, postNow: false, imageBase64 });
    alert('Post scheduled.');
  }

  function copyText(text){
    if(!text) return;
    navigator.clipboard.writeText(text).then(()=>{
      alert('Copied to clipboard');
    }).catch(()=>alert('Copy failed'));
  }

  function downloadImage(){
    if(!imageBase64) return alert('No image');
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

  // A simple list of accounts. In a real app, this would come from the backend.
  const accounts = ['default', 'business'];
  const providers = [
    { value: 'x', label: 'Twitter/X' },
    { value: 'instagram', label: 'Instagram' }
  ];

  return (
    <div style={{maxWidth: '900px', margin: '0 auto'}}>
      <form style={{display:'grid', gap: '1.5rem'}}>
        {/* Recommended Topics Section */}
        <div className="card" style={{background: 'white', padding: '1.5rem'}}>
          <h3 style={{margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: '700', color: 'var(--gray-800)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <span>💡</span>
            <span>Trending Crypto Topics</span>
          </h3>
          
          <div style={{marginBottom: '1.5rem'}}>
            <h4 style={{fontSize: '0.875rem', fontWeight: '600', color: 'var(--gray-700)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem'}}>
              <span>🔥</span>
              <span>Crypto Facts</span>
            </h4>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
              {cryptoTopics.facts.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTopic(t)}
                  style={{
                    padding: '0.5rem 0.875rem',
                    fontSize: '0.75rem',
                    background: topic === t ? 'var(--primary)' : 'var(--gray-100)',
                    color: topic === t ? 'white' : 'var(--gray-700)',
                    border: topic === t ? 'none' : '1px solid var(--gray-300)',
                    borderRadius: '1rem',
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
            <h4 style={{fontSize: '0.875rem', fontWeight: '600', color: 'var(--gray-700)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem'}}>
              <span>🎓</span>
              <span>Crypto Education</span>
            </h4>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
              {cryptoTopics.education.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTopic(t)}
                  style={{
                    padding: '0.5rem 0.875rem',
                    fontSize: '0.75rem',
                    background: topic === t ? 'var(--primary)' : 'var(--gray-100)',
                    color: topic === t ? 'white' : 'var(--gray-700)',
                    border: topic === t ? 'none' : '1px solid var(--gray-300)',
                    borderRadius: '1rem',
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
        <div className="card" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '2rem'}}>
          <h2 style={{margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: '700'}}>
            ✨ AI Content Generator
          </h2>
          <p style={{margin: '0 0 1.5rem 0', opacity: 0.9, fontSize: '0.875rem'}}>
            Enter a topic and let AI create engaging content with images for your social media
          </p>
          
          <div style={{marginBottom: '1rem'}}>
            <label style={{color: 'white', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', display: 'block'}}>
              🎨 Choose Image Color Scheme
            </label>
            <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
              {[
                {value: 'blue-gradient', label: 'Blue', color: 'linear-gradient(135deg, #1e40af 0%, #06b6d4 100%)'},
                {value: 'purple-gradient', label: 'Purple', color: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)'},
                {value: 'orange-gradient', label: 'Orange', color: 'linear-gradient(135deg, #ea580c 0%, #fbbf24 100%)'},
                {value: 'green-gradient', label: 'Green', color: 'linear-gradient(135deg, #059669 0%, #14b8a6 100%)'},
                {value: 'pink-gradient', label: 'Pink', color: 'linear-gradient(135deg, #db2777 0%, #f43f5e 100%)'},
                {value: 'dark-gradient', label: 'Dark', color: 'linear-gradient(135deg, #1e1b4b 0%, #581c87 100%)'}
              ].map(scheme => (
                <button
                  key={scheme.value}
                  type="button"
                  onClick={() => setColorScheme(scheme.value)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: colorScheme === scheme.value ? 'white' : 'rgba(255,255,255,0.2)',
                    color: colorScheme === scheme.value ? '#667eea' : 'white',
                    border: colorScheme === scheme.value ? 'none' : '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.813rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    boxShadow: colorScheme === scheme.value ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
                  }}
                >
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: scheme.color,
                    border: '2px solid white'
                  }}></div>
                  {scheme.label}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
            <input 
              style={{
                flex: 1,
                padding: '0.875rem 1rem',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.938rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                minWidth: '250px'
              }} 
              value={topic} 
              onChange={e=>setTopic(e.target.value)} 
              placeholder="e.g. Bitcoin Pizza Day, What is Blockchain, DeFi Explained..." 
            />
            <button 
              onClick={handleGenerateAll} 
              disabled={loading} 
              type="button" 
              style={{
                padding: '0.875rem 1.75rem',
                background: 'white',
                color: '#667eea',
                fontWeight: '700',
                fontSize: '0.938rem',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
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
          <h3 style={{margin: '0 0 1.25rem 0', fontSize: '1.125rem', fontWeight: '700', color: 'var(--gray-800)'}}>
            📝 Your Content
          </h3>
          
          <div style={{display: 'grid', gap: '1.25rem'}}>
            <div>
              <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <span>Caption</span>
                <span style={{fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: '400'}}>
                  ({caption.length} characters)
                </span>
              </label>
              <textarea 
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  minHeight: '140px',
                  fontSize: '0.938rem',
                  lineHeight: '1.6',
                  resize: 'vertical'
                }} 
                value={caption} 
                onChange={e=>setCaption(e.target.value)} 
                placeholder="Your engaging caption will appear here..." 
              />
            </div>

            <div>
              <label>Hashtags</label>
              <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                <input 
                  style={{flex: 1, padding: '0.75rem'}} 
                  value={hashtags} 
                  onChange={e=>setHashtags(e.target.value)} 
                  placeholder="#hashtag1 #hashtag2 #hashtag3" 
                />
              </div>
            </div>

            <div style={{display: 'flex', gap: '0.625rem', flexWrap: 'wrap'}}>
              <button 
                type="button" 
                onClick={()=>copyText(caption)} 
                disabled={!caption}
                style={{display: 'flex', alignItems: 'center', gap: '0.375rem'}}
              >
                📋 Copy Caption
              </button>
              <button 
                type="button" 
                onClick={()=>copyText(hashtags)} 
                disabled={!hashtags}
                style={{display: 'flex', alignItems: 'center', gap: '0.375rem'}}
              >
                #️⃣ Copy Hashtags
              </button>
            </div>
          </div>
        </div>

        {/* Image Preview Section */}
        <div className="card">
          <h3 style={{margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: '700', color: 'var(--gray-800)'}}>
            🖼️ Generated Image
          </h3>
          
          <div style={{
            border: '2px dashed var(--gray-300)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            background: 'var(--gray-50)',
            textAlign: 'center',
            minHeight: '250px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {loading && !imageBase64 ? (
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 2s infinite'}}>🎨</div>
                <p style={{color: 'var(--gray-600)', fontWeight: '500'}}>Creating your stunning image...</p>
              </div>
            ) : imageBase64 ? (
              <div style={{width: '100%'}}>
                <img 
                  src={`data:image/png;base64,${imageBase64}`} 
                  alt="Generated" 
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow-xl)',
                    marginBottom: '1rem'
                  }} 
                />
                <button 
                  type="button" 
                  onClick={downloadImage}
                  style={{
                    background: 'var(--success)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  💾 Download Image
                </button>
              </div>
            ) : (
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: '3rem', marginBottom: '1rem', opacity: 0.3}}>🖼️</div>
                <p style={{color: 'var(--gray-500)', fontSize: '0.875rem'}}>
                  No image yet. Generate content above to create an AI image.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Publishing Options Section */}
        <div className="card" style={{background: 'var(--gray-50)', border: '1px solid var(--gray-200)'}}>
          <h3 style={{margin: '0 0 1.25rem 0', fontSize: '1.125rem', fontWeight: '700', color: 'var(--gray-800)'}}>
            🚀 Publishing Options
          </h3>
          
          <div style={{display: 'grid', gap: '1.25rem'}}>
            <div style={{display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'}}>
              <div>
                <label>Social Platform</label>
                <select 
                  value={provider} 
                  onChange={e=>setProvider(e.target.value)} 
                  style={{
                    padding: '0.75rem',
                    fontSize: '0.938rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="x">🐦 Twitter / X</option>
                  <option value="instagram">📸 Instagram</option>
                </select>
              </div>

              <div>
                <label>Schedule Date & Time (Optional)</label>
                <input 
                  type="datetime-local" 
                  value={scheduledAt} 
                  onChange={e=>setScheduledAt(e.target.value)} 
                  style={{padding: '0.75rem', fontSize: '0.938rem'}} 
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--gray-300)',
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={handlePostNow} 
                type="button"
                className="btn-primary"
                style={{
                  flex: 1,
                  padding: '0.875rem 1.5rem',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                  fontSize: '1rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
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
                  padding: '0.875rem 1.5rem',
                  background: 'linear-gradient(135deg, var(--secondary) 0%, #a855f7 100%)',
                  fontSize: '1rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>📅</span>
                <span>Schedule Post</span>
              </button>
            </div>
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
            padding: 1rem !important;
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
