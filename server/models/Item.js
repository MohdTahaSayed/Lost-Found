const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    // Added 'Sell' and 'Rent'
    type: { type: String, enum: ['Lost', 'Found', 'Sell', 'Rent'], required: true },
    category: { type: String, default: 'General' }, // e.g., Books, Electronics
    price: { type: Number, default: 0 }, // Only used if type is Sell or Rent
    location: { type: String, required: true },
    date: { type: Date, default: Date.now },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'Active' }
});

module.exports = mongoose.model('Item', ItemSchema);