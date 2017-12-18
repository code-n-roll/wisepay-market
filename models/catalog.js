const mongoose = require('mongoose');

const Item = require('./models/item');

const catalogSchema = mongoose.Schema({
    name: String,
    items: [{Item}]
}, { collection: 'catalogs'});

const Catalog = mongoose.model('Catalog', catalogSchema);

module.exports = Catalog;
