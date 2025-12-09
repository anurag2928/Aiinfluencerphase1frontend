import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

export default function TwitterAccounts() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        account_name: '',
        api_key: '',
        api_secret: '',
        access_token: '',
        access_secret: ''
    });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await axios.get(`${API_URL}/twitter-accounts/list`);
            setAccounts(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch accounts', err);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/twitter-accounts/add`, formData);
            alert('Account added successfully!');
            setFormData({
                account_name: '',
                api_key: '',
                api_secret: '',
                access_token: '',
                access_secret: ''
            });
            setShowForm(false);
            fetchAccounts();
        } catch (err) {
            console.error('Failed to add account', err);
            alert('Failed to add account: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this account?')) return;
        try {
            await axios.delete(`${API_URL}/twitter-accounts/${id}`);
            setAccounts(prev => prev.filter(acc => acc.id !== id));
        } catch (err) {
            console.error('Failed to delete account', err);
            alert('Failed to delete account');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px', paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    Manage Twitter Accounts
                </h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontWeight: '600', cursor: 'pointer' }}
                >
                    {showForm ? 'Cancel' : 'Add New Account'}
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem', border: '1px solid var(--primary)' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Add New Account</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Account Name (Internal)</label>
                            <input
                                name="account_name"
                                value={formData.account_name}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g. My Personal Account"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                            />
                        </div>
                        <div style={{ padding: '1rem', background: 'var(--surface-highlight)', borderRadius: 'var(--radius)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                            <strong>How to get keys:</strong>
                            <ol style={{ paddingLeft: '1.2rem', margin: '0.5rem 0' }}>
                                <li>Go to <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Twitter Developer Portal</a>.</li>
                                <li>Create a Project & App.</li>
                                <li>In App Settings, set User Authentication Settings to <strong>Read and Write</strong>.</li>
                                <li>Regenerate <strong>API Key & Secret</strong> and <strong>Access Token & Secret</strong>.</li>
                            </ol>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>API Key</label>
                                <input
                                    name="api_key"
                                    value={formData.api_key}
                                    onChange={handleInputChange}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>API Secret</label>
                                <input
                                    name="api_secret"
                                    value={formData.api_secret}
                                    onChange={handleInputChange}
                                    required
                                    type="password"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Access Token</label>
                                <input
                                    name="access_token"
                                    value={formData.access_token}
                                    onChange={handleInputChange}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Access Token Secret</label>
                                <input
                                    name="access_secret"
                                    value={formData.access_secret}
                                    onChange={handleInputChange}
                                    required
                                    type="password"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                                />
                            </div>
                        </div>
                        <button type="submit" style={{ padding: '1rem', background: 'var(--success)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}>
                            Save Account
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <p>Loading accounts...</p>
            ) : accounts.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No accounts added yet.</p>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {accounts.map(acc => (
                        <div key={acc.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{acc.account_name}</h3>
                                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>API Key: {acc.api_key}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(acc.id)}
                                style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 'var(--radius)', cursor: 'pointer' }}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
