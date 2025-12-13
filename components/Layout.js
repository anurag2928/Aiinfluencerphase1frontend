import Head from 'next/head';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

import { useState } from 'react';

export default function Layout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div>
            <Head>
                <title>PostMaster AI</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/logo.png" />
            </Head>

            <nav style={{
                background: 'var(--surface)',
                borderBottom: '1px solid var(--border)',
                padding: '1rem',
                position: 'relative',
                zIndex: 50
            }}>
                <div className="container" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0'
                }}>
                    <Link href="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src="/logo.png" alt="PostMaster AI Logo" style={{ height: '32px', width: 'auto' }} />
                        PostMaster AI
                    </Link>

                    {/* Desktop Menu */}
                    <div className="desktop-menu" style={{ display: 'flex', gap: '1.5rem' }}>
                        <Link href="/">Dashboard</Link>
                        <Link href="/create-post">Create Post</Link>
                        <Link href="/history">History</Link>
                        <Link href="/twitter-accounts">Twitter</Link>
                        <Link href="/instagram-accounts">Instagram</Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="mobile-toggle"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        style={{
                            display: 'none',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-main)',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            padding: '0.5rem'
                        }}
                    >
                        {isMobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Mobile Dropdown */}
                {isMobileMenuOpen && (
                    <div className="mobile-menu">
                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                        <Link href="/create-post" onClick={() => setIsMobileMenuOpen(false)}>Create Post</Link>
                        <Link href="/history" onClick={() => setIsMobileMenuOpen(false)}>History</Link>
                        <Link href="/twitter-accounts" onClick={() => setIsMobileMenuOpen(false)}>Twitter</Link>
                        <Link href="/instagram-accounts" onClick={() => setIsMobileMenuOpen(false)}>Instagram</Link>
                    </div>
                )}
            </nav>

            <main style={{ minHeight: 'calc(100vh - 70px)' }}>
                {children}
            </main>

            <ThemeToggle />

            <style jsx>{`
                @media (max-width: 768px) {
                    .desktop-menu {
                        display: none !important;
                    }
                    .mobile-toggle {
                        display: block !important;
                    }
                    .mobile-menu {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: var(--surface);
                        border-bottom: 1px solid var(--border);
                        padding: 1rem;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        animation: slideDown 0.2s ease-out;
                    }
                    .mobile-menu a {
                        padding: 0.75rem;
                        border-radius: var(--radius);
                        color: var(--text-main);
                        text-decoration: none;
                        font-weight: 500;
                    }
                    .mobile-menu a:hover {
                        background: var(--surface-highlight);
                        color: var(--primary);
                    }
                }
                
                @keyframes slideDown {
                    from { transform: translateY(-10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
