import React, { useState } from 'react';

function ItemForm({ onItemAdded }) {
    const [formData, setFormData] = useState({
        title: '', description: '', type: 'Lost', location: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (response.ok) {
                setMessage('Item reported successfully!');
                setFormData({ title: '', description: '', type: 'Lost', location: '' });
                if (onItemAdded) onItemAdded(); // Refresh list if needed
            } else {
                setMessage(data.message || 'Error reporting item');
            }
        } catch (err) {
            setMessage('Server error');
        }
    };

    return (
        <div className="card p-4 shadow-sm">
            <h3>Report an Item</h3>
            {message && <div className="alert alert-info">{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea name="description" className="form-control" value={formData.description} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Type</label>
                    <select name="type" className="form-control" value={formData.type} onChange={handleChange}>
                        <option value="Lost">Lost</option>
                        <option value="Found">Found</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary w-100">Submit Report</button>
            </form>
        </div>
    );
}

export default ItemForm;