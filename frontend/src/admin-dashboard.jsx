import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/common.css';
import './styles/dashboard.css';
import AdminDashboard from './pages/AdminDashboard.jsx';

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AdminDashboard />
    </React.StrictMode>
);