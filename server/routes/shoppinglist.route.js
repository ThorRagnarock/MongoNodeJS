
const ShoppinglistRoute = require('express').Router();
const ShoppinglistModel = require('../models/shoppinglist');

ShoppinglistRoute.get('/', async (req, res) => {
	try {
		let data = await ShoppinglistModel.FindAllShoppingLists();
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error });
	}
})
ShoppinglistRoute.get('/:userID', async (req, res) => {
	try {
		let { userID } = req.params;
		let data = await ShoppinglistModel.AllUserLists(userID);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error });
	}
})

//FindAllShoppingLists, AllUserLists


//TODO: create a function that concatenate object to form a list
//TODO: create a function that removes objects from a list

//AS I AM WORKING ON THIS I AM NOT SURE IF IT's ANY RELEVANT AT THIS POINT IN TIME BECAUSE THIS IS NESTED AS AN OBJECT IN AN ARRAY OF OBJECTS within the user
module.exports = ShoppinglistRoute;