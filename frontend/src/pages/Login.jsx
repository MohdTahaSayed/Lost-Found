import React, { useState } from 'react';
import '../styles/auth.css';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email.trim() || !formData.password) {
            setIsError(true); setMessage('Please fill in all fields.'); return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            
            if (!res.ok) {
                setIsError(true); setMessage(data.message);
            } else {
                setIsError(false); setMessage('Login successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = data.user.role === 'admin' ? '/admin-dashboard.html' : '/user-dashboard.html';
                }, 1000);
            }
        } catch (err) {
            setIsError(true); setMessage('Cannot connect to server.');
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-card">
                <a href="/" className="auth-brand"><span className="brand-mark">L&F</span><span>Lost & Found</span></a>
                <div className="auth-heading">
                    <span className="auth-eyebrow">WELCOME BACK</span>
                    <h1>Login to your account</h1>
                </div>
                {message && <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`}>{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Password</label>
                        <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="auth-submit">Login →</button>
                </form>
                <p className="auth-switch">Don't have an account? <a href="/register.html">Create one</a></p>
            </section>
        </main>
    );
}

export default Login;