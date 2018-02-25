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
                    price: Number(String(item.price).replace(/[а-яa-z]*/ig, "").trim()),
                    description: item.description,
                    imageUrl: item.image_url,
                    categoryId: category.id,
                    currency: "BYN"
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

    try { 
        const stores = await Store.find();
    
        let storesResponse = [];

        stores.forEach(store => {

            storesResponse.push({
                id: store._id,
                name: store.name,
                imageUrl: store.imageUrl
            });
        });

        res.status(200).json(storesResponse);        

    } catch (e) {
        res.status(500).json(
            errorResponse('Something happened in db')
        );
    }
});

router.get('/stores/:storeId', async (req, res) => {
    const storeId = req.params.storeId;
    
    if (!storeId) {
        res.status(400).end();
        return;
    }

    try {

        const store = await Store.findOne({_id: storeId});
        const categories = await Category.find({storeId: storeId});

        let storeResponse = {
            id: store._id,
            name: store.name,
            categories: []
        }  

        filteredCategoryId = [];
        categories.forEach(category => {
            filteredCategoryId.push(category.id);
        });
        
        const items = await Item.find({categoryId: { $in: filteredCategoryId}});

        categories.forEach(category => {
        
            const filteredItems = items.filter(item => item.categoryId === category.id);

            let itemsResponse = [];

            filteredItems.forEach(item => {
                itemsResponse.push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    description: item.description,
                    imageUrl: item.imageUrl,
                    currency: item.currency
                });
            });

            storeResponse.categories.push({
                id: category.id,
                name: category.name,
                items: itemsResponse
            });
        });

        res.status(200).json(storeResponse);        
        
    } catch (e) {
        res.status(500).json(
            errorResponse('Something happened in db')
        );
    }
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
    
    let itemsResponse = [];    

    if (categoryId) {
        items = await Item.find({ categoryId: req.query.categoryId });

        items.forEach(item => {
            itemsResponse.push({
                id: item._id,
                name: item.name,
                price: Number(item.price),
                description: item.description,
                imageUrl: item.imageUrl,
                currency: "BYN"
            });
        });

    } else if (itemIds) {
        items = await Item.find();

        items = items.filter((item) => {return itemIds.includes(item.id)});

        items.forEach(item => {
            itemsResponse.push({
                id: item._id,
                name: item.name,
                price: Number(item.price),
                description: item.description,
                imageUrl: item.imageUrl,
                categoryId: item.categoryId,
                currency: "BYN"
            });
        });
    } else {
        items = await Item.find();

        items.forEach(item => {
            itemsResponse.push({
                id: item._id,
                name: item.name,
                price: Number(item.price),
                description: item.description,
                imageUrl: item.imageUrl,
                categoryId: item.categoryId,
                currency: "BYN"
            });
        });
    }

    res.status(200).json(itemsResponse);
});

function errorResponse(text) {
    return {
        'error': text
    };
}

module.exports = router;
