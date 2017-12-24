const mongoose = require('mongoose');

const itemCategorySchema = mongoose.Schema({
    name: String
}, { collection: 'item-category'});

const ItemCategory = mongoose.model('ItemCategory', itemCategorySchema);

module.exports = ItemCategory;
