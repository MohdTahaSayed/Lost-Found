const express = require('express');
const Item = require('../models/Item');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const items = await Item.find().populate('reporter', 'name email');
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { title, description, type, location } = req.body;
        const newItem = new Item({
            title, description, type, location,
            reporter: req.session.userId
        });
        await newItem.save();
        res.status(201).json({ message: 'Item reported successfully', item: newItem });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        if (req.session.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;