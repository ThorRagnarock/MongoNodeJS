
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
	try { //I don't know why
		let { userID } = req.params;
		let data = await ShoppinglistModel.AllUserLists(userID);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error });
	} //I need to get inside each collection and from there look if they have a header document, and if they do I am checking the userID inside of them  
})

ShoppinglistRoute.post('/', async (req, res) => {
	try {
		let { id } = req.params;
		let { listName } = req.body; //where do I grab the userID from... 
		let data = await ShoppinglistModel.RegNewListing(listName, id);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error });
	}
});
ShoppinglistRoute.post('/createList', async (req, res) => {
	try {
		const { userID, listingHeader, listColor } = req.body;
		let data = await ShoppinglistModel.CreateNewList(userID, listingHeader, listColor);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({error});
	}
})
//toggle boolean parameters
ShoppinglistRoute.put('/toggleParam/:itemId', async (req, res) => {
	try {
		let { itemId } = req.params;
		let {paramName, userID, collectionName} = req.body;
		let data = await ShoppinglistModel.paramToggle(collectionName, itemId, paramName, userID);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({error})
	}
})
//update info in regular fields
ShoppinglistRoute.put('/', async (req, res) => {
	try {	//the thing will be set to update once before the thing is closed..
		let { id } = req.params;
		let { listName, listType, listColor } = req.body;
		let updatedObject = {};
		if (listName) updatedObject.listName = listName
		if (listType) updatedObject.listType = listType
		if (listColor) updatedObject.listColor = listColor;

		let data = await ShoppinglistModel.UpdateListingDetails(id, updatedObject);
		res.status(200).json(data);

	} catch (error) {
		res.status(500).json({ error });
	}
})

//delete a single document
ShoppinglistRoute.delete('/', async (req, res)=> { //CRUD DELETER
	try {
		let { listName } = req.body;
		let data = await ShoppinglistModel.DeleteList(listName);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({error})
	}
})

//TODO: create a function that concatenate object to form a list
//TODO: create a function that removes objects from a list

//AS I AM WORKING ON THIS I AM NOT SURE IF IT's ANY RELEVANT AT THIS POINT IN TIME BECAUSE THIS IS NESTED AS AN OBJECT IN AN ARRAY OF OBJECTS within the user
module.exports = ShoppinglistRoute;