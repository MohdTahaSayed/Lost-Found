const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const { MongoMemoryServer } = require('mongodb-memory-server');

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(session({
    secret: 'kjsce_lost_and_found_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }
}));

app.use('/api', authRoutes);
app.use('/api/items', itemRoutes);

async function startServer() {
    try {
        const mongoServer = await MongoMemoryServer.create({
    instance: {
        launchTimeout: 120000  
    }
});
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
        console.log('In-Memory MongoDB Connected at:', mongoUri);
        app.listen(5000, () => console.log('Server running on port 5000'));
    } catch (err) {
        console.error('Failed to start server:', err);
    }
}

startServer();