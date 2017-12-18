require('dotenv').config();

const express = require('express');
const router = express.Router();

const Store = require('./models/store')

router.get('/stores', async (req, res) => {
    return Store.find().lean().exec((err, stores) => {
        return res.status(200).end(JSON.stringify(stores));
    });
});

router.post('/stores', async (req, res) => {
    const model = req.body;

    console.log(req.body);

    if (!model) {
        res.status(400).end();
        return;
    }

    const store = new Store({
        name: model.name,
        catalog: model.catalog
    });

    try {
        await store.save();
        res.status(201).end(); 
    } catch (e) {
        res.status(500).json(
            errorResponse('Something happened in db')
        );
    }
});

function errorResponse(text) {
    return {
        'error': text
    };
}

module.exports = router;
