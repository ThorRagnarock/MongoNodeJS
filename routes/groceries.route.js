const GroceryRoute = require('express').Router();
const GroceryModel = require('../models/groceries');
const Utils = require('../utils/utils');
////////////////   GET    ////////////////
GroceryRoute.get('/', async (req, res) => {
	try {
		let data = await GroceryModel.FindAllGroceries();
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error });
	}
})
GroceryRoute.get('/:colorCode', async (req, res) => {
	try {
		let { colorCode } = req.params;
		let data = await GroceryModel.FindGroceriesByColor(colorCode);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error });
	}
})
GroceryRoute.get('/:colorCode/:conditionFilter', async (req, res) => {
	try {
		let { colorCode, conditionFilter } = req.params;
		const isTrue = (conditionFilter === 'true');

		let data = await GroceryModel.GetRelationGroceries(colorCode, isTrue);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error });
	}
});

////////////////   POST    ////////////////
GroceryRoute.post('/', async (req, res) => { //working just with new list?
	try {
		let { groceryString } = req.body;
		let data = await GroceryModel.PackMaterials(groceryString);
		res.status(200).json(data);
	} catch (error) {
		console.log("Error in Route: ", error);
		res.status(500).json({ error });
	}
});
GroceryRoute.post('/:collectionName/addItem', async (req, res) => {
	try {
		let collectionName = req.params.collectionName;
		let { userItemStr } = req.body;
		let data = await GroceryModel.CreateListItem(collectionName, userItemStr);
		res.status(201).json(data);
	} catch (error) {
		console.log("Error in Route: ", error);
		res.status(500).json({ error });
	}
});
////////////////   PUT    ////////////////
GroceryRoute.put('/:itemId', async(req,res)=>{ //
	try {
		const { itemId } = req.params;
		const { collectionName } = req.body;
		console.log("itemId", itemId);
		const result = await Utils.ToggleParam(collectionName, itemId, 'tickToggle');
		res.status(200).json(result);
	} catch (error) {
		console.log("toggleParam err: ",error);
		res.status(500).json({ error });
	}
})

GroceryRoute.put('/:collectionName/:itemId/feedback', async (req, res) => {
	try {
		let collectionName = req.params.collectionName;
		let itemId = req.params.itemId;
		let { feedbackText } = req.body;
		let data = await GroceryModel.CreateItemFeedback(collectionName, itemId, feedbackText);
		res.status(201).json(data);
	} catch (error) {
		res.status(500).json({ error })
	}
});
////////////////   DEL    ////////////////

GroceryRoute.delete('/:collectionName/:itemId', async(req, res)=>{
	try {
		let collectionName = req.params.collectionName;
		let itemId = req.params.itemId;
		console.log(collectionName, itemId);
		await GroceryModel.DeleteListItem(collectionName, itemId);
		res.status(204).end();
	} catch (error) {
		// console.log(error);
		res.status(500).json({ error })
	}
});

// Grocer
module.exports = GroceryRoute;