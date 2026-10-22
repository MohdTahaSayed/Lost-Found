import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';

function ReportItem() {
    const [formData, setFormData] = useState({ title: '', description: '', type: 'Lost', location: '' });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5000/api/check-session', { credentials: 'include' })
            .then(res => res.json())
            .then(data => { if (!data.loggedIn) window.location.href = '/login.html'; });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                setIsError(false); setMessage('Item reported!');
                setTimeout(() => { window.location.href = '/user-dashboard.html'; }, 1000);
            } else {
                setIsError(true); setMessage(data.message);
            }
        } catch { setIsError(true); setMessage('Server error.'); }
    };

    return (
        <div className="dashboard-page">
            <nav className="dashboard-navbar">
                <div className="dashboard-container navbar-content">
                    <a href="/user-dashboard.html" className="dashboard-brand"><span className="dashboard-brand-mark">L&F</span> Lost & Found</a>
                    <div className="dashboard-nav-links">
                        <a href="/user-dashboard.html">Dashboard</a>
                        <a href="/browse-items.html">Browse</a>
                        <a href="/report-item.html" className="nav-active">Report Item</a>
                    </div>
                </div>
            </nav>

            <main className="dashboard-container dashboard-main" style={{ maxWidth: '640px' }}>
                <h1>Report an Item</h1>
                {message && <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`}>{message}</div>}
                <form onSubmit={handleSubmit} className="card p-4 mt-3">
                    <div className="mb-3"><label className="form-label">Title</label><input name="title" className="form-control" onChange={e => setFormData({...formData, title: e.target.value})} required /></div>
                    <div className="mb-3"><label className="form-label">Description</label><textarea name="description" className="form-control" onChange={e => setFormData({...formData, description: e.target.value})} required /></div>
                    <div className="mb-3"><label className="form-label">Type</label><select name="type" className="form-control" onChange={e => setFormData({...formData, type: e.target.value})}><option value="Lost">Lost</option><option value="Found">Found</option></select></div>
                    <div className="mb-3"><label className="form-label">Location</label><input name="location" className="form-control" onChange={e => setFormData({...formData, location: e.target.value})} required /></div>
                    <button type="submit" className="dashboard-primary-btn">Submit Report</button>
                </form>
            </main>
        </div>
    );
}

export default ReportItem;