import React from 'react';

function App() {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* 1. NAVBAR: Fully KJSCE Red */}
            <nav 
                className="navbar navbar-expand-lg navbar-dark shadow-sm" 
                style={{ backgroundColor: '#A6192E', borderBottom: '4px solid #7a1221' }}
            >
                <div className="container">
                    <a className="navbar-brand fw-bold" href="/" style={{ letterSpacing: '0.5px' }}>
                        <span style={{ color: '#fff' }}>LOST & </span>
                        <span style={{ color: '#FFD700' }}>FOUND</span>
                        <span style={{ fontSize: '0.8rem', marginLeft: '10px', color: '#ffc2c7', fontWeight: 'normal' }}>
                            | KJSCE
                        </span>
                    </a>

                    <div className="d-flex gap-3">
                        <a href="/login.html" className="btn btn-outline-light px-4 fw-semibold">
                            Login
                        </a>
                        <a href="/register.html" className="btn px-4 fw-semibold" style={{ backgroundColor: '#fff', color: '#A6192E' }}>
                            Register
                        </a>
                    </div>
                </div>
            </nav>

            {/* 2. HERO SECTION */}
            <section className="py-5" style={{ backgroundColor: '#F8F9FA', borderBottom: '1px solid #e2e8f0' }}>
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-7 mb-4 mb-lg-0">
                            <span 
                                className="badge mb-3 px-3 py-2" 
                                style={{ backgroundColor: '#fce8ea', color: '#A6192E', fontWeight: 'bold', letterSpacing: '1px' }}
                            >
                                SOMAIYA VIDYAVIHAR UNIVERSITY
                            </span>
                            <h1 className="display-4 fw-bold mb-4" style={{ color: '#A6192E', lineHeight: '1.2' }}>
                                Every Lost Item Deserves to <span style={{ color: '#333' }}>Find Its Way Home.</span>
                            </h1>
                            <p className="lead text-secondary mb-5" style={{ maxWidth: '600px' }}>
                                A centralised platform for KJSCE students and staff to report lost belongings, discover found items, and help reconnect the community with their valuables.
                            </p>

                            <div className="d-flex flex-wrap gap-3">
                                <a href="/login.html" className="btn btn-lg px-5 fw-bold shadow-sm" style={{ backgroundColor: '#A6192E', color: '#fff' }}>
                                    Get Started
                                </a>
                                {/* Fixed: Now goes to Login instead of the protected dashboard */}
                                <a href="/login.html" className="btn btn-lg px-5 fw-bold shadow-sm btn-light" style={{ color: '#A6192E', border: '1px solid #A6192E' }}>
                                    Browse Items
                                </a>
                            </div>
                        </div>
                        
                        {/* Right side graphic box */}
                        <div className="col-lg-5 text-center d-none d-lg-block">
                            <div 
                                className="p-5 shadow-lg mx-auto" 
                                style={{ 
                                    backgroundColor: '#fff', 
                                    borderTop: '6px solid #A6192E', 
                                    borderBottom: '6px solid #A6192E',
                                    borderRadius: '12px',
                                    maxWidth: '400px'
                                }}
                            >
                                <h3 className="fw-bold mb-3" style={{ color: '#A6192E' }}>KJSCE Community</h3>
                                <p className="text-muted small">Connecting students, faculty, and staff across the campus.</p>
                                <div className="d-flex justify-content-center gap-4 mt-4">
                                    <div className="text-center">
                                        <h4 className="fw-bold mb-0" style={{ color: '#A6192E' }}>100%</h4>
                                        <small className="text-muted">Free</small>
                                    </div>
                                    <div className="text-center">
                                        <h4 className="fw-bold mb-0" style={{ color: '#A6192E' }}>24/7</h4>
                                        <small className="text-muted">Access</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. FEATURES SECTION */}
            <section className="py-5 bg-white">
                <div className="container py-4">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold" style={{ color: '#A6192E' }}>How It Works</h2>
                        <div style={{ width: '60px', height: '4px', backgroundColor: '#A6192E', margin: '15px auto' }}></div>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-4">
                            <div 
                                className="card h-100 shadow-sm border-0 text-center p-4" 
                                style={{ borderTop: '4px solid #A6192E', backgroundColor: '#F8F9FA' }}
                            >
                                <h1 className="mb-3">📢</h1>
                                <h4 className="fw-bold" style={{ color: '#A6192E' }}>Report Items</h4>
                                <p className="text-muted small mb-0">
                                    Report belongings you've lost or found with relevant information and location details.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div 
                                className="card h-100 shadow-sm border-0 text-center p-4" 
                                style={{ borderTop: '4px solid #A6192E', backgroundColor: '#F8F9FA' }}
                            >
                                <h1 className="mb-3">🔎</h1>
                                <h4 className="fw-bold" style={{ color: '#A6192E' }}>Search &amp; Discover</h4>
                                <p className="text-muted small mb-0">
                                    Browse reported items and search by keywords, categories, and campus locations.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div 
                                className="card h-100 shadow-sm border-0 text-center p-4" 
                                style={{ borderTop: '4px solid #A6192E', backgroundColor: '#F8F9FA' }}
                            >
                                <h1 className="mb-3">🤝</h1>
                                <h4 className="fw-bold" style={{ color: '#A6192E' }}>Recover Belongings</h4>
                                <p className="text-muted small mb-0">
                                    Help reconnect people with their lost possessions and keep the campus community connected.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. FOOTER */}
            <footer className="text-center text-light py-4" style={{ backgroundColor: '#A6192E', borderTop: '4px solid #7a1221' }}>
                <div className="container">
                    <p className="mb-1 fw-bold" style={{ color: '#FFD700' }}>K. J. Somaiya College of Engineering</p>
                    <p className="mb-0 text-white-50 small">
                        © {new Date().getFullYear()} Lost &amp; Found Application. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;