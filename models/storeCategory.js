const mongoose = require('mongoose');

const storeCategorySchema = mongoose.Schema({
    id: Number,
    storeId: Number,
    name: String,
}, { collection: 'StoreCategories'});

const StoreCategory = mongoose.model('StoreCategory', storeCategorySchema);

module.exports = StoreCategory;
