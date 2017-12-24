require('dotenv').config();

const express = require('express');
const router = express.Router();

const Store = require('./models/store');
const Category = require('./models/category');
const Item = require('./models/item');

router.post('/stores', async (req, res) => {
    const model = req.body;

    console.log(req.body);

    if (!model) {
        res.status(400).end();
        return;
    }

    try {
        await new Store({
            name: model.name,
            imageUrl: model.imageUrl
        }).save();
    } catch (e) {
        res.status(500).json(
            errorResponse('Something happened in db')
        );
    }

    model.categories.forEach(async categoryItem => {
        try {
            const store = await Store.findOne({name: model.name});
            console.log(store.id);
            
            const category = await new Category({
                name: categoryItem.name,
                storeId: store.id
            }).save();
            
            categoryItem.items.forEach(async item => {
                await new Item({
                    name: item.name,
                    price: item.price,
                    description: item.description,
                    imageUrl: item.image_url,
                    categoryId: category.id
                }).save();
            });
        } catch (e) {
            res.status(500).json(
                errorResponse('Something happened in db')
            );
        }
    });

    res.status(201).end(); 
});

router.get('/stores', async (req, res) => {
    const stores = await Store.find();
    
    let storesResponse = [];

    stores.forEach(store => {

        storesResponse.push({
            id: store._id,
            name: store.name,
            imageUrl: store.imageUrl
        });
    });
    return res.status(200).json(storesResponse);
});

router.get('/categories', async(req, res) => {
    const storeId = req.query.storeId;
    let categories;

    if (storeId) {
        categories = await Category.find({storeId: storeId});
    } else {
        categories = await Category.find();
    }

    let categoriesResponse = [];

    categories.forEach(Category => {
        categoriesResponse.push({
            id: Category._id,
            name: Category.name,
            storeId: Category.storeId
        });
    });

    res.status(200).json(categoriesResponse);
});

router.get('/items', async(req, res) => {
    const categoryId = req.query.categoryId;
    let itemIds;
    if (req.query.ids) {
        itemIds = req.query.ids.split(',');
    }

    let items = [];
    
    if (categoryId) {
        items = await Item.find({ categoryId: req.query.categoryId });
    } else if (itemIds) {
        items = await Item.find();

        items = items.filter((item) => {return itemIds.includes(item.id)});
    } else {
        items = await Item.find();
    }

    let itemsResponse = [];

    items.forEach(item => {
        itemsResponse.push({
            id: item._id,
            name: item.name,
            price: item.price,
            description: item.description,
            imageUrl: item.imageUrl,
            categoryId: item.categoryId
        });
    });
    
    res.status(200).json(itemsResponse);
});

function errorResponse(text) {
    return {
        'error': text
    };
}

module.exports = router;
