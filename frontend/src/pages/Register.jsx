import React, { useState } from 'react';
import '../styles/auth.css';

function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, confirmPassword } = formData;

        if (!name || !email || !password || !confirmPassword) {
            setIsError(true); setMessage('Fill all fields.'); return;
        }
        if (password !== confirmPassword) {
            setIsError(true); setMessage('Passwords do not match.'); return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            
            if (!res.ok) {
                setIsError(true); setMessage(data.message);
            } else {
                setIsError(false); setMessage('Registration successful! Redirecting...');
                setTimeout(() => { window.location.href = '/login.html'; }, 1500);
            }
        } catch (err) {
            setIsError(true); setMessage('Cannot connect to server.');
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-card register-card">
                <a href="/" className="auth-brand"><span className="brand-mark">L&F</span><span>Lost & Found</span></a>
                <div className="auth-heading">
                    <span className="auth-eyebrow">JOIN US</span>
                    <h1>Create an account</h1>
                </div>
                {message && <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`}>{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3"><label className="form-label">Full Name</label><input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required /></div>
                    <div className="mb-3"><label className="form-label">Email</label><input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required /></div>
                    <div className="mb-3"><label className="form-label">Password</label><input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required /></div>
                    <div className="mb-4"><label className="form-label">Confirm Password</label><input type="password" name="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleChange} required /></div>
                    <button type="submit" className="auth-submit">Create Account →</button>
                </form>
                <p className="auth-switch">Already registered? <a href="/login.html">Login</a></p>
            </section>
        </main>
    );
}

export default Register;