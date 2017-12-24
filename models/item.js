const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    name: String,
    price: String,
    description: String,
    imageUrl: String,
    categoryId: String
}, { collection: 'item'});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
