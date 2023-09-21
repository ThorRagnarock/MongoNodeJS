
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
	}
})

ShoppinglistRoute.put('/', async (req, res) => {
	try {
		let { itemId } = req.body;//that's not true.. the list item get itself from the document itself.. but how can I do that?


		//Like I did earlier I need first to CREATE the listItem itself, 
		// and then: work out it's id
		// and THEN - put that id in the 'listItems' array here.
		

	} catch (error) {
		res.status(500).json({error})
	}
})
// TODO : add listItems in a "put" method

ShoppinglistRoute.put('/', async (req, res) => {
	try {	//the thing will be set to update once before the thing is closed..
		let { id } = req.params;
		let { listName, listType, archivedStatus, pinned, listColor } = req.body;

		let updatedObject = {};
		if (listName) updatedObject.listName = listName
		if (listType) updatedObject.listType = listType
		if (archivedStatus) updatedObject.archivedStatus = archivedStatus;
		if (pinned) updatedObject.pinned = pinned;
		if (listColor) updatedObject.listColor = listColor;

		let data = await ShoppinglistModel.UpdateListingDetails(id, updatedObject);
		res.status(200).json(data);

	} catch (error) {
		res.status(500).json({ error });
	}
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
//FindAllShoppingLists, AllUserLists
ShoppinglistRoute.post('/', async (req, res)=> { //CRUD DELETER
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