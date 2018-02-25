const mongoose = require('mongoose');

const storeSchema = mongoose.Schema({   
    name: String,
    imageUrl: String
}, { collection: 'store'});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;