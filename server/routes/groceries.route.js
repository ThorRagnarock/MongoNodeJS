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
		res.status(500).json({error});
	}
});
GroceryRoute.post('/', async (req, res)=> {
	try {
		let { groceryString } = req.body;
		let data = await GroceryModel.PackMaterials(groceryString);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({error});
	}
})
// Grocer
module.exports = GroceryRoute;