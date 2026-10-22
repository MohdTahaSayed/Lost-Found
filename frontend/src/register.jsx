import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/common.css';
import Register from './pages/Register.jsx';

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Register />
    </React.StrictMode>
);