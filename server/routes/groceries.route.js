const GroceryRoute = require('express').Router();
const GroceryModel = require('../models/groceries');

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
GroceryRoute.post('/', async (req, res) => { //working just with new list?
	try {
		let { groceryString } = req.body;
		let data = await GroceryModel.PackMaterials(groceryString);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error });
	}
});

GroceryRoute.post('/add-item/:collectionName', async (req, res) => {
	try {
		let collectionName = req.params.collectionName;
		let { userItemStr } = req.body;
		let data = await GroceryModel.CreateListItem(collectionName, userItemStr);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error });
	}
});

GroceryRoute.put('/:itemId', async(req,res)=>{ //
	let itemId = req.params.itemId;

})
GroceryRoute.put('/feedback/:collectionName/:itemId', async (req, res) => {
	try {
		let collectionName = req.params.collectionName;
		let itemId = req.params.itemId;
		let { feedbackText } = req.body;
		let data = await GroceryModel.CreateItemFeedback(collectionName, itemId, feedbackText);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error })
	}
});
GroceryRoute.delete('/remove/:collectionName/:itemId', async(req, res)=>{
	try {
		let collectionName = req.params.collectionName;
		let itemId = req.params.itemId;
		let data = await GroceryModel.DeleteListItem(collectionName, itemId);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error })
	}
});

// Grocer
module.exports = GroceryRoute;