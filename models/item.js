const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    // id: Number,
    name: String,
    price: Number,
    description: String,
    imageUrl: String
}, { collection: 'items'});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
