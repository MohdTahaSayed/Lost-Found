import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';

function BrowseItems() {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetch('http://localhost:5000/api/items').then(res => res.json()).then(setItems);
    }, []);

    const filtered = items.filter(item => {
        const matchesType = filter === 'All' || item.type === filter;
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.location.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesSearch;
    });

    return (
        <div className="dashboard-page">
            <nav className="dashboard-navbar">
                <div className="dashboard-container navbar-content">
                    <a href="/user-dashboard.html" className="dashboard-brand"><span className="dashboard-brand-mark">L&F</span> Lost & Found</a>
                    <div className="dashboard-nav-links">
                        <a href="/user-dashboard.html">Dashboard</a>
                        <a href="/browse-items.html" className="nav-active">Browse</a>
                        <a href="/report-item.html">Report Item</a>
                    </div>
                </div>
            </nav>

            <main className="dashboard-container dashboard-main">
                <h1>Browse Items</h1>
                <div className="row g-2 mb-4">
                    <div className="col-md-8"><input className="form-control" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                    <div className="col-md-4">
                        <select className="form-control" value={filter} onChange={e => setFilter(e.target.value)}>
                            <option value="All">All Types</option><option value="Lost">Lost</option><option value="Found">Found</option>
                        </select>
                    </div>
                </div>
                <div className="recent-items-list">
                    {filtered.map(item => (
                        <article className="recent-item" key={item._id}>
                            <div className="item-placeholder">{item.title.charAt(0)}</div>
                            <div className="recent-item-info">
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                                <span>{item.location} · {new Date(item.date).toLocaleDateString()}</span>
                            </div>
                            <div className="recent-item-meta">
                                <span className={`item-type-badge ${item.type === 'Lost' ? 'badge-lost' : 'badge-found'}`}>{item.type}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default BrowseItems;