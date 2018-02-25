const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    imageUrl: String,
    categoryId: String,
    currency: String
}, { collection: 'item'});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
