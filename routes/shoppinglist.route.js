
const ShoppinglistRoute = require('express').Router();
const ShoppinglistModel = require('../models/shoppinglist');
const DB = require('../utils/db')

const toggleParam = require('../utils/utils').ToggleParam;


////////////////   GET    ////////////////
// ShoppinglistRoute.get('/', async (req, res) => {
// 	try {
// 		let data = await ShoppinglistModel.FindAllShoppingLists();	//looks like an admin option
// 		res.status(200).json(data);
// 	} catch (error) {
// 		res.status(500).json({ error });
// 	}
// })
ShoppinglistRoute.get('/:userID/lists', async (req, res) => { //better show the aggregation
	try { //I don't know why
		let userID = req.params.userID;
		let data = await ShoppinglistModel.AllUserLists(userID);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error });
	} //I have isHeader 
})//items in specific list - serves both groceries and shoppingList

ShoppinglistRoute.get('/:userID/SearchListings', async(req,res)=>{
	try {
		let userID = req.params.userID;
		let { searchString } = req.body;
		let data = await ShoppinglistModel.SearchUserListings(userID, searchString);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({error});
	}
})

///// that's for use from groceries
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
		const { userID, listingHeader, listColor } = req.body;

		let data = await ShoppinglistModel.CreateNewList( userID, listingHeader, listColor );
		res.status(201).json({ message: "List created successfully", data });
	} catch (error) {
		console.error(error); 
		res.status(500).json({ error: error.message });
	}
})
ShoppinglistRoute.post('/:collectionName/mailListing', async (req, res) => {
	try {
		const { emailAddress } = req.body;
		const collectionName = req.params.collectionName;

		console.log(collectionName, emailAddress);
		let data = await ShoppinglistModel.MailListing(collectionName, emailAddress);
		console.log(data);
		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error });
	}
})
//  DUPLICATION OF A LISTING
ShoppinglistRoute.post('/:collectionName/duplicateList', async (req, res) => {
	try {
		const listNameExtension = req.body;		

		let data = await ShoppinglistModel.DuplicateList(collectionName, listNameExtension);
		console.log("Opp -3-");

		res.status(201).json(data);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error });
	}
})
////////////////   PUT    ////////////////
//toggle boolean parameters


ShoppinglistRoute.put('/:collectionName/toggleParam', async (req, res) => {
	try {
		const { collectionName } = req.body;
		const { docId } = req.body;
		const { paramName } = req.body;

		const pinLogic = async (paramName, turnedValue) => {
			console.log("Parameter: ", paramName);
			if (paramName == 'pinned') {			
				let pinnedQuery = { "pinned": true };				
				let pinnedCount = await new DB().CountDocs(collectionName, pinnedQuery);
				console.log("Pinned count is: ", pinnedCount);  // Debugging line
				if (pinnedCount >= 3 && turnedValue) {
					return { status: 'failed', message: 'ניתן לנעוץ עד 3 רשימות בלבד' };
				}
			}
			let data = { [paramName]: turnedValue };
			return await new DB().UpdateById(collectionName, docId, data);
		};
		
		const result = await toggleParam(
			collectionName, 
			docId, 
			paramName, 
			pinLogic
			);
		res.status(200).json(result);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error });
	}
});

ShoppinglistRoute.put('/:collectionName/renameListing', async (req, res) => {
	try {
		let  collectionName  = req.params.collectionName;
		let { newName } = req.body;
		let result = await ShoppinglistModel.RenameListing(collectionName, newName);
		res.status(200).json(result);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error });
	}

})

//UPDATE info in regular fields
ShoppinglistRoute.put('/:collectionName/:docId', async (req, res) => {
	try {	//the thing will be set to update once before the thing is closed..
		let { docId } = req.params.docId;
		let { collectionName } = req.params.collectionName;

		let { listName, listType, listColor } = req.body;
		let updatedObject = {};
		if (listName) updatedObject.listName = listName
		if (listType) updatedObject.listType = listType
		if (listColor) updatedObject.listColor = listColor;
		let data = await ShoppinglistModel.UpdateListingDetails(collectionName,docId, updatedObject);
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