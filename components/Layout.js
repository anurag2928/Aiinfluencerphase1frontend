import Head from 'next/head';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Layout({ children }) {
    return (
        <div>
            <Head>
                <title>AI Social Poster</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <nav style={{
                background: 'var(--surface)',
                borderBottom: '1px solid var(--border)',
                padding: '1rem'
            }}>
                <div className="container" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0'
                }}>
                    <Link href="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                        AI Social Poster
                    </Link>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <Link href="/">Dashboard</Link>
                        <Link href="/create-post">Create Post</Link>
                        <Link href="/history">History</Link>
                    </div>
                </div>
            </nav>

            <main style={{ minHeight: 'calc(100vh - 70px)' }}>
                {children}
            </main>

            <ThemeToggle />
        </div>
    );
}
