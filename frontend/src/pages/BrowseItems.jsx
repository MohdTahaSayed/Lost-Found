import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';

function BrowseItems() {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetch('http://localhost:5000/api/check-session', { credentials: 'include' })
            .then(res => res.json())
            .then(data => { if (!data.loggedIn) window.location.href = '/login.html'; });

        fetch('http://localhost:5000/api/items')
            .then(res => res.json())
            .then(data => setItems(data))
            .catch(err => console.error("Error fetching items:", err));
    }, []);

    const filtered = items.filter(item => {
        const matchesType = filter === 'All' || item.type === filter;
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                              item.location.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesSearch;
    });

    // Helper for badge colors
    const getBadgeClass = (type) => {
        if (type === 'Lost') return 'badge-lost';
        if (type === 'Found') return 'badge-found';
        if (type === 'Sell') return 'badge-sell';
        if (type === 'Rent') return 'badge-rent';
        return '';
    };

    return (
        <div className="dashboard-page">
            <nav className="dashboard-navbar">
                <div className="dashboard-container navbar-content">
                    <a href="/user-dashboard.html" className="dashboard-brand">
                        <span className="dashboard-brand-mark">L&F</span> Lost & Found
                    </a>
                    <div className="dashboard-nav-links">
                        <a href="/user-dashboard.html">Dashboard</a>
                        <a href="/browse-items.html" className="nav-active">Browse</a>
                        <a href="/report-item.html">Report Item</a>
                    </div>
                </div>
            </nav>

            <main className="dashboard-container dashboard-main">
                <h1>Campus Marketplace & Lost/Found</h1>
                <div className="row g-2 mb-4">
                    <div className="col-md-8">
                        <input className="form-control" placeholder="Search by title or location..." 
                            value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="col-md-4">
                        <select className="form-control" value={filter} onChange={e => setFilter(e.target.value)}>
                            <option value="All">All Categories</option>
                            <option value="Lost">Lost Items</option>
                            <option value="Found">Found Items</option>
                            <option value="Sell">For Sale</option>
                            <option value="Rent">For Rent</option>
                        </select>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <p className="text-muted">No items found matching your search.</p>
                ) : (
                    <div className="recent-items-list">
                        {filtered.map(item => (
                            <article className="recent-item" key={item._id}>
                                <div className="item-placeholder">{item.title.charAt(0)}</div>
                                <div className="recent-item-info">
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                    <span>{item.location} · {new Date(item.date).toLocaleDateString()}</span>
                                </div>
                                <div className="recent-item-meta text-end">
                                    <span className={`item-type-badge ${getBadgeClass(item.type)}`} style={{padding: '6px 12px', borderRadius: '4px', color: '#fff', fontWeight: 'bold'}}>
                                        {item.type}
                                    </span>
                                    {/* Show price if it's Sell or Rent */}
                                    {(item.type === 'Sell' || item.type === 'Rent') && (
                                        <h4 className="mt-2 mb-0" style={{ color: '#A6192E', fontWeight: 'bold' }}>
                                            ₹{item.price}
                                        </h4>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default BrowseItems;