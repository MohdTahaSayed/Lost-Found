import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';

function AdminDashboard() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if admin
        fetch('http://localhost:5000/api/check-session', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (!data.loggedIn || data.role !== 'admin') {
                    window.location.href = '/login.html'; // Kick out non-admins
                }
            });

        fetchItems();
    }, []);

    const fetchItems = () => {
        fetch('http://localhost:5000/api/items')
            .then(res => res.json())
            .then(data => {
                setItems(data);
                setLoading(false);
            });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        
        try {
            const response = await fetch(`http://localhost:5000/api/items/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                fetchItems(); // Refresh list
            } else {
                alert("Failed to delete item.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="text-center mt-5"><h3>Loading Admin Panel...</h3></div>;

    return (
        <div className="dashboard-page">
            <nav className="dashboard-navbar" style={{ backgroundColor: '#242424', color: 'white' }}>
                <div className="dashboard-container navbar-content">
                    <span className="dashboard-brand" style={{ color: 'white' }}>
                        Admin Panel - Lost & Found
                    </span>
                </div>
            </nav>

            <main className="dashboard-container dashboard-main">
                <h1>Manage All Items</h1>
                <table className="table table-striped mt-4">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Location</th>
                            <th>Reporter</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item._id}>
                                <td>{item.title}</td>
                                <td>{item.type}</td>
                                <td>{item.location}</td>
                                <td>{item.reporter ? item.reporter.email : 'N/A'}</td>
                                <td>
                                    <button onClick={() => handleDelete(item._id)} className="btn btn-danger btn-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
}

export default AdminDashboard;