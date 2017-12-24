const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: String,
    storeId: String
}, { collection: 'category'});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
