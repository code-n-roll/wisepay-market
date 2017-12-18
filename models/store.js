const mongoose = require('mongoose');

const storeSchema = mongoose.Schema({
    // id: Int,
    name: String,
    catalog: [{}]
    // categories: [{type: Schema.Types.ObjectId, ref: 'StoreCategory'}],
    // catalog: [{type: Schema.Types.ObjectId, ref: 'ItemCategory'}]
}, { collection: 'stores'});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;