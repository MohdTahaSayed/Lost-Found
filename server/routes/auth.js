const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// 1. Register Route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already in use' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Create session
        req.session.userId = user._id;
        req.session.role = user.role;

        res.json({ 
            message: 'Login successful', 
            user: { id: user._id, name: user.name, role: user.role } 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. Logout Route
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out' });
});

// 4. Check Session (Used by Frontend to verify if user is logged in)
router.get('/check-session', (req, res) => {
    if (req.session.userId) {
        res.json({ loggedIn: true, role: req.session.role });
    } else {
        res.json({ loggedIn: false });
    }
});

// 5. Quick Setup Admin Route (FOR LAB DEMO ONLY)
// Visiting http://localhost:5000/api/setup-admin will create an admin account automatically
router.get('/setup-admin', async (req, res) => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@kjsce.edu' });
        if (existingAdmin) {
            return res.json({ message: 'Admin already exists! Email: admin@kjsce.edu | Password: admin123' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        const admin = new User({ 
            name: 'Admin User', 
            email: 'admin@kjsce.edu', 
            password: hashedPassword, 
            role: 'admin' 
        });
        await admin.save();
        
        res.json({ message: 'Admin created successfully! Email: admin@kjsce.edu | Password: admin123' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;