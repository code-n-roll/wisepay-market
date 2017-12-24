require('dotenv').config();

const express = require('express');
const router = express.Router();

const Store = require('./models/store');
const ItemCategory = require('./models/itemCategory');
const Item = require('./models/item');

router.get('/stores', async (req, res) => {
    const stores = await Store.find();
    return res.status(200).end(JSON.stringify(stores));
});

router.post('/stores', async (req, res) => {
    const model = req.body;

    console.log(req.body);

    if (!model) {
        res.status(400).end();
        return;
    }

    const store = new Store({
        name: model.name
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

router.post('/categories', async(req, res) => {
    const model = req.body;

    if (!model) {
        res.status(400).end();
        return;
    }

    const categories = model.categories;

    categories.forEach(async category => {
        try {
            console.log(category);
            await new ItemCategory({
                name: category.name
            }).save();
        } catch (e) {
            res.status(500).json(
                errorResponse('Something happened in db')
            );
        }
    });
        
    res.status(201).end()    
});

router.get('/categories', async(req, res) => {
    const itemCategories = await ItemCategory.find();
    res.status(200).end(JSON.stringify(itemCategories));
});

router.post('/items', async(req, res) => {
    const model = req.body;

    if (!model) {
        res.status(400).end();
        return;
    }

    const catalog = model.catalog;

    catalog.forEach(async catalogItem => {
        try {    
            let itemCategory = await ItemCategory.findOne({ name: catalogItem.name});
        } catch (e) {
            res.status(500).json(
                errorResponse('Something happened in db')
            );
        }

        catalogItem.items.forEach(async item => {
            new Item({
                name: item.name,
                price: item.price,
                description: item.description,
                imageUrl: item.imageUrl,
                categoryId: itemCategory.id
            }).save();
        })
    });

    res.status(201).end();
});

router.get('/items', async(req, res) => {
    const categoryId = req.query.categoryId;

    if (!categoryId) {
        const items = await Item.find();

        res.status(200).end(JSON.stringify(items));
    } else {
        const items = await Item.find({categoryId: req.query.categoryId });
        
        res.status(200).end(JSON.stringify(items));
    }
});

function errorResponse(text) {
    return {
        'error': text
    };
}

module.exports = router;
