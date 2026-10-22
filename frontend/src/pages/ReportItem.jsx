import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';

function ReportItem() {
    const [formData, setFormData] = useState({ 
        title: '', 
        description: '', 
        type: 'Lost', 
        category: 'Books',
        price: '',
        location: '' 
    });
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
                setIsError(false); 
                setMessage('Item reported successfully!');
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
                    <a href="/user-dashboard.html" className="dashboard-brand">
                        <span className="dashboard-brand-mark">L&F</span> Lost & Found
                    </a>
                    <div className="dashboard-nav-links">
                        <a href="/user-dashboard.html">Dashboard</a>
                        <a href="/browse-items.html">Browse</a>
                        <a href="/report-item.html" className="nav-active">Report Item</a>
                    </div>
                </div>
            </nav>

            <main className="dashboard-container dashboard-main" style={{ maxWidth: '640px' }}>
                <h1>List an Item</h1>
                <p className="text-muted">Report a lost/found item, or list a book for sale/rent.</p>
                
                {message && <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`}>{message}</div>}
                
                <form onSubmit={handleSubmit} className="card p-4 mt-3 shadow-sm border-0">
                    <div className="mb-3">
                        <label className="form-label fw-bold">Item Type</label>
                        <select name="type" className="form-control" 
                            onChange={e => setFormData({...formData, type: e.target.value})}>
                            <option value="Lost">Lost Item (I lost this)</option>
                            <option value="Found">Found Item (I found this)</option>
                            <option value="Sell">Sell Item (Selling a book/notes)</option>
                            <option value="Rent">Rent Item (Renting a book)</option>
                        </select>
                    </div>

                    {(formData.type === 'Sell' || formData.type === 'Rent') && (
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Category</label>
                                <select name="category" className="form-control" 
                                    onChange={e => setFormData({...formData, category: e.target.value})}>
                                    <option value="Books">Books</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Lab Equipment">Lab Equipment</option>
                                    <option value="Stationery">Stationery</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Price (₹)</label>
                                <input type="number" name="price" className="form-control" placeholder="e.g. 250"
                                    onChange={e => setFormData({...formData, price: e.target.value})} required />
                            </div>
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label fw-bold">Title</label>
                        <input name="title" className="form-control" placeholder="e.g. Engineering Mathematics Textbook" 
                            onChange={e => setFormData({...formData, title: e.target.value})} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Description</label>
                        <textarea name="description" className="form-control" rows="3" placeholder="Provide details (condition, edition, etc.)" 
                            onChange={e => setFormData({...formData, description: e.target.value})} required />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold">Location (Campus)</label>
                        <input name="location" className="form-control" placeholder="e.g. Library, Canteen, CS Lab" 
                            onChange={e => setFormData({...formData, location: e.target.value})} required />
                    </div>

                    <button type="submit" className="dashboard-primary-btn w-100">Submit Listing</button>
                </form>
            </main>
        </div>
    );
}

export default ReportItem;