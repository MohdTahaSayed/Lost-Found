import React from 'react';

function App() {
return ( <div>
<nav className="navbar navbar-dark" style={{ backgroundColor: '#172554' }}> <div className="container"> <a className="navbar-brand fw-bold" href="/">
Lost & Found </a>
                <div className="d-flex gap-2">
                    <a href="/login.html" className="btn btn-outline-light">
                        Login
                    </a>

                    <a href="/register.html" className="btn btn-light">
                        Register
                    </a>
                </div>
            </div>
        </nav>

        <section className="text-center py-5" style={{ backgroundColor: '#eff6ff' }}>
            <div className="container py-5">
                <p className="text-primary fw-bold">
                    LOST SOMETHING? FOUND SOMETHING?
                </p>

                <h1 className="display-4 fw-bold mb-4">
                    Every Lost Item Deserves to Find Its Way Home.
                </h1>

                <p className="lead text-secondary mb-4">
                    Report lost belongings, discover found items, and help
                    reunite people with the things they value.
                </p>

                <a href="/login.html" className="btn btn-primary btn-lg me-2">
                    Get Started
                </a>

                <a href="/browse-items.html" className="btn btn-outline-primary btn-lg">
                    Browse Items
                </a>
            </div>
        </section>

        <section className="container py-5">
            <h2 className="text-center mb-4">How It Works</h2>

            <div className="row g-4">
                <div className="col-md-4">
                    <div className="card h-100 border-0 shadow-sm p-4">
                        <h3>📢 Report Items</h3>
                        <p>
                            Report belongings you've lost or found with
                            relevant information.
                        </p>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card h-100 border-0 shadow-sm p-4">
                        <h3>🔎 Search &amp; Discover</h3>
                        <p>
                            Browse reported items and search by keywords,
                            categories, and locations.
                        </p>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card h-100 border-0 shadow-sm p-4">
                        <h3>🤝 Recover Belongings</h3>
                        <p>
                            Help reconnect people with their lost
                            possessions.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <footer className="text-center text-light py-4" style={{ backgroundColor: '#172554' }}>
            <p className="mb-0">
                © {new Date().getFullYear()} Lost &amp; Found Application
            </p>
        </footer>
    </div>
);
}

export default App;
