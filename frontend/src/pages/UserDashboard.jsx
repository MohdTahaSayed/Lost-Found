import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';

function UserDashboard() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/check-session', { credentials: 'include' })
            .then(res => res.json())
            .then(data => { if (!data.loggedIn) window.location.href = '/login.html'; });

        fetch('http://localhost:5000/api/items')
            .then(res => res.json())
            .then(data => { setItems(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const handleLogout = async () => {
        await fetch('http://localhost:5000/api/logout', { method: 'POST', credentials: 'include' });
        window.location.href = '/login.html';
    };

    if (loading) return <div className="text-center mt-5"><h3>Loading...</h3></div>;

    return (
        <div className="dashboard-page">
            <nav className="dashboard-navbar">
                <div className="dashboard-container navbar-content">
                    <a href="/" className="dashboard-brand"><span className="dashboard-brand-mark">L&F</span> Lost & Found</a>
                    <div className="dashboard-nav-links">
                        <a href="/user-dashboard.html" className="nav-active">Dashboard</a>
                        <a href="/browse-items.html">Browse</a>
                        <a href="/report-item.html">Report Item</a>
                        <button onClick={handleLogout} className="dashboard-logout" style={{background:'transparent', border:'1px solid #b5121b', cursor:'pointer'}}>Logout</button>
                    </div>
                </div>
            </nav>

            <main className="dashboard-container dashboard-main">
                <section className="dashboard-welcome">
                    <div>
                        <span className="dashboard-eyebrow">USER DASHBOARD</span>
                        <h1>Welcome back!</h1>
                        <p>Track your reports and browse items.</p>
                    </div>
                    <a href="/report-item.html" className="dashboard-primary-btn">+ Report Item</a>
                </section>

                <section className="dashboard-section">
                    <div className="section-heading"><h2>Recent Items</h2></div>
                    <div className="recent-items-list">
                        {items.length === 0 && <p className="p-3">No items reported yet.</p>}
                        {items.map(item => (
                            <article className="recent-item" key={item._id}>
                                <div className="item-placeholder">{item.title.charAt(0)}</div>
                                <div className="recent-item-info">
                                    <h3>{item.title}</h3>
                                    <p>{item.location} · {new Date(item.date).toLocaleDateString()}</p>
                                    <span>By: {item.reporter?.name || 'Unknown'}</span>
                                </div>
                                <div className="recent-item-meta">
                                    <span className={`item-type-badge ${item.type === 'Lost' ? 'badge-lost' : 'badge-found'}`}>{item.type}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default UserDashboard;