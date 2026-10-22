import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';

function AdminDashboard() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // We relaxed the check so you can test it without manually editing the DB.
        fetch('http://localhost:5000/api/check-session', { credentials: 'include' })
            .then(res => res.json())
            .then(data => { if (!data.loggedIn || data.role !== 'admin') window.location.href = '/login.html'; });
        loadItems();
    }, []);

    const loadItems = () => {
        fetch('http://localhost:5000/api/items').then(res => res.json()).then(data => { setItems(data); setLoading(false); });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item?')) return;
        const res = await fetch(`http://localhost:5000/api/items/${id}`, { method: 'DELETE', credentials: 'include' });
        if (res.ok) loadItems(); else alert('Delete failed.');
    };

    const handleLogout = async () => {
        await fetch('http://localhost:5000/api/logout', { method: 'POST', credentials: 'include' });
        window.location.href = '/login.html';
    };

    if (loading) return <div className="text-center mt-5"><h3>Loading Admin...</h3></div>;

    return (
        <div className="dashboard-page">
            <nav className="dashboard-navbar" style={{ background: '#172554', color: '#fff' }}>
                <div className="dashboard-container navbar-content">
                    <span className="dashboard-brand" style={{ color: '#fff' }}>Admin · Lost & Found</span>
                    <button onClick={handleLogout} className="dashboard-logout" style={{background:'transparent', border:'1px solid #fff', color:'#fff', cursor:'pointer'}}>Logout</button>
                </div>
            </nav>
            <main className="dashboard-container dashboard-main">
                <h1>Manage Items</h1>
                <table className="table table-striped mt-4">
                    <thead><tr><th>Title</th><th>Type</th><th>Location</th><th>Reporter</th><th>Actions</th></tr></thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item._id}>
                                <td>{item.title}</td><td>{item.type}</td><td>{item.location}</td>
                                <td>{item.reporter?.email || 'N/A'}</td>
                                <td><button onClick={() => handleDelete(item._id)} className="btn btn-danger btn-sm">Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
}

export default AdminDashboard;