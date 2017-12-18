const mongoose = require('mongoose');

const itemCategorySchema = mongoose.Schema({
    name: String,
    items: [
        {type: Schema.Types.ObjectId, ref: 'Item'}
    ]
}, { collection: 'ItemCategories'});

const ItemCategory = mongoose.model('ItemCategory', itemCategorySchema);

module.exports = ItemCategory;
