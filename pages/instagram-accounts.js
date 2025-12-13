import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

export default function InstagramAccounts() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        account_name: '',
        business_account_id: '',
        app_id: '',
        app_secret: '',
        access_token: ''
    });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await axios.get(`${API_URL}/instagram-accounts/list`);
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
            await axios.post(`${API_URL}/instagram-accounts/add`, formData);
            alert('Account added and token exchanged successfully!');
            setFormData({
                account_name: '',
                business_account_id: '',
                app_id: '',
                app_secret: '',
                access_token: ''
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
            await axios.delete(`${API_URL}/instagram-accounts/${id}`);
            setAccounts(prev => prev.filter(acc => acc.id !== id));
        } catch (err) {
            console.error('Failed to delete account', err);
            alert('Failed to delete account: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px', paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    Manage Instagram Accounts
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
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Add New Instagram Account</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Account Name (Internal)</label>
                            <input
                                name="account_name"
                                value={formData.account_name}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g. My Business Page"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                            />
                        </div>
                        <div style={{ padding: '1.25rem', background: 'var(--surface-highlight)', borderRadius: 'var(--radius)', fontSize: '0.9rem', lineHeight: '1.6', border: '1px solid var(--border)' }}>
                            <strong style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--primary)' }}>⚠️ Prerequisites (Do this first):</strong>
                            <p style={{ margin: '0 0 1rem 0', fontWeight: '500' }}>
                                Make sure that you have a Business Instagram account and a Facebook account. You need to go to <a href="https://business.facebook.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>business.facebook.com</a>, create a Facebook Page, and connect it to your Instagram Business account.
                            </p>

                            <strong>Step-by-Step Guide:</strong>
                            <ol style={{ paddingLeft: '1.2rem', margin: '0.5rem 0 0 0' }}>
                                <li style={{ marginBottom: '0.5rem' }}>Go to <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Meta Developers</a>.</li>
                                <li style={{ marginBottom: '0.5rem' }}>Create an **App**. Select **Business** type, then select **Other**.</li>
                                <li style={{ marginBottom: '0.5rem' }}>Go to **Basic Settings** and copy your **App ID** & **App Secret**.</li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    In the top menu, go to **Tools** &rarr; **Graph API Explorer**. Add these 4 permissions:
                                    <code style={{ background: 'rgba(0,0,0,0.05)', padding: '0.2rem 0.4rem', borderRadius: '4px', margin: '0 0.2rem', display: 'inline-block' }}>pages_show_list</code>
                                    <code style={{ background: 'rgba(0,0,0,0.05)', padding: '0.2rem 0.4rem', borderRadius: '4px', margin: '0 0.2rem', display: 'inline-block' }}>instagram_basic</code>
                                    <code style={{ background: 'rgba(0,0,0,0.05)', padding: '0.2rem 0.4rem', borderRadius: '4px', margin: '0 0.2rem', display: 'inline-block' }}>instagram_content_publish</code>
                                    <code style={{ background: 'rgba(0,0,0,0.05)', padding: '0.2rem 0.4rem', borderRadius: '4px', margin: '0 0.2rem', display: 'inline-block' }}>pages_read_engagement</code>
                                    <br />Then click **Generate Access Token** and copy it.
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    Go to <a href="https://business.facebook.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Meta Business Manager</a>.
                                    In **Accounts** &rarr; **Instagram Accounts**, copy your **Instagram Business Account ID**.
                                </li>
                                <li>Paste everything here. We will automatically exchange the short-lived token for a 60-day token.</li>
                            </ol>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Instagram Business Account ID</label>
                            <input
                                name="business_account_id"
                                value={formData.business_account_id}
                                onChange={handleInputChange}
                                required
                                placeholder="17841..."
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>App ID</label>
                                <input
                                    name="app_id"
                                    value={formData.app_id}
                                    onChange={handleInputChange}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>App Secret</label>
                                <input
                                    name="app_secret"
                                    value={formData.app_secret}
                                    onChange={handleInputChange}
                                    required
                                    type="password"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>User Access Token (Short or Long Lived)</label>
                            <input
                                name="access_token"
                                value={formData.access_token}
                                onChange={handleInputChange}
                                required
                                placeholder="EAAG..."
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                            />
                        </div>

                        <button type="submit" style={{ padding: '1rem', background: 'var(--success)', color: 'white', border: 'none', borderRadius: 'var(--radius)', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}>
                            Save & Exchange Token
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
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {acc.account_name}
                                    {acc.is_default && <span style={{ fontSize: '0.7rem', background: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.5rem', borderRadius: '1rem' }}>DEFAULT</span>}
                                </h3>
                                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Business ID: {acc.business_account_id}</p>
                            </div>
                            {!acc.is_default && (
                                <button
                                    onClick={() => handleDelete(acc.id)}
                                    style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 'var(--radius)', cursor: 'pointer' }}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
