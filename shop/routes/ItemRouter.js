const express = require('express');
const Item = require('../model/item');
const verify = require('../middleware/AuthenticationMiddleware');
const authorize = require('../middleware/AuthorizeMiddleware');

const router = express.Router();

router.get('/', verify,authorize("admin"), async (req, res) => {
    var items = await Item.find();
    res.status(200).json(items);
});

router.get('/:id', verify, authorize("admin","customer"), async (req, res) => {
    var item = await Item.findOne({ id: req.params.id });
    if (item) {
        return res.status(200).json(item);
    }
    res.status(404).send("Item Not Found");
})

router.post('/', verify, authorize("admin"), async (req, res) => {

    let item = req.body;
    let lastItem = await Item.findOne().sort({ id: -1 }).limit(1);
    let newId = lastUser ? lastItem.id + 1 : 1;
    var newItem = new Item({
        id: newId,
        itemName: item.itemName,
        mrp: item.mrp,
        quantity: item.quantity
    });
    var addedItem = await newItem.save();
    if (addedItem) {
        return res.status(201).json(addedItem);
    }
    res.status(400).send("Item Not added");
});

router.put('/:id', verify, authorize("admin"), async (req, res) => {
    let item1 = await Item.findOne({ id: req.params.id });
    if (item1) {
        let item = req.body;
        let updatedItem = await Item.findOneAndUpdate(
            { id: req.params.id },
            { $set: { itemName: item.itemName, mrp: item.mrp, quantity: item.quantity } },
            { returnDocument: 'after' });
        if (updatedItem) {
            return res.status(200).json(updatedItem);
        }
        return res.status(500).send("Item updating error");
    }
    res.status(400).send("Item Not Found");
});

router.delete('/:id', verify, authorize("admin"), async (req, res) => {
    let item1 = await Item.findOne({ id: req.params.id });
    if (item1) {
        await Item.deleteOne({ id: req.params.id });
        let item = await Item.findOne({ id: req.params.id });
        if (item) {
            console.log(item);
            return res.status(500).send("Item Not deleted");
        }
        return res.status(204).send("Item deleted successfully");
    }
    res.status(404).send("Item Not Found");
});

module.exports = router;