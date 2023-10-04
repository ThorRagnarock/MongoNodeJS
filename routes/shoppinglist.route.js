
const ShoppinglistRoute = require('express').Router();
const ShoppinglistModel = require('../models/shoppinglist');

const toggleParam = require('../utils/utils').toggleParam;


////////////////   GET    ////////////////
ShoppinglistRoute.get('/', async (req, res) => {
	try {
		let data = await ShoppinglistModel.FindAllShoppingLists();
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error });
	}
})
ShoppinglistRoute.get('/:userID/lists', async (req, res) => {
	try { //I don't know why
		let userID = req.params.userID;
		let data = await ShoppinglistModel.AllUserLists(userID);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error });
	} //I need to get inside each collection and from there look if they have a header document, and if they do I am checking the userID inside of them  
})//items in specific list - serves both groceries and shoppingList
ShoppinglistRoute.get('/:collectionName/allListItems/', async (req, res) => {v
	try {
		let { collectionName } = req.params.collectionName;
		let data = await ShoppinglistModel.AggHeaderList(collectionName);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error });
	}
})
////////////////   POST    ////////////////
//create a new listing (+creating a header file etc.)
ShoppinglistRoute.post('/createList', async (req, res) => {
	try {
		console.log("\n\n Route Action 1 \n\n");
		const { userID, listingHeader, listColor } = req.body;
		console.log("\n\n Route Action 2 \n\n");

		let data = await ShoppinglistModel.CreateNewList(userID, listingHeader, listColor);
		res.status(201).json(data);
	} catch (error) {
		res.status(500).json({ error });
	}
})
ShoppinglistRoute.post('/mailListing', async (req, res) => {
	try {
		const { collectionName, emailAddress } = req.body;
		let data = await ShoppinglistModel.MailListing(collectionName, emailAddress);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error });
	}
})
//  DUPLICATION OF A LISTING
ShoppinglistRoute.post('/duplicateList', async (req, res) => {
	try {
		const { collectionName, listNameExtension } = req.body;
		let data = await ShoppinglistModel.DuplicateList(collectionName, listNameExtension);
		res.status(201).json(data);
	} catch (error) {
		res.status(500).json({ error });
	}
})
////////////////   PUT    ////////////////
//toggle boolean parameters
ShoppinglistRoute.put('/toggleParam/:itemId', async (req, res) => {
	try {
		const { itemId } = req.params;
		const { paramName, collectionName } = req.body;

		const pinLogic = async (paramName, turnedValue)=> {
			if (paramName === 'pinned') {
				let pinnedQuery = { "pinned": true, "userID": userID };
				let pinnedCount = await new DB().CountDocs(collection, pinnedQuery);
				if (pinnedCount >= 3 && turnedValue) {
					return { status: 'failed', message: 'ניתן לנעוץ עד 3 רשימות בלבד' };
				}
			}
			return null;
		};
		const result = await toggleParam(collectionName, itemId, paramName, pinLogic);
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ error });
	}
});

//UPDATE info in regular fields
ShoppinglistRoute.put('/:id', async (req, res) => {
	try {	//the thing will be set to update once before the thing is closed..
		let { id } = req.params.id;
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
////////////////   DELETE    ////////////////
//delete a single document
ShoppinglistRoute.delete('/', async (req, res) => { //CRUD DELETER
	try {
		let { listName } = req.body;
		await ShoppinglistModel.DeleteList(listName);
		res.status(204).end();
	} catch (error) {
		res.status(500).json({ error })
	}
})
module.exports = ShoppinglistRoute;