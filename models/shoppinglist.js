const DB = require('../utils/db')
const { ObjectId } = require('mongodb');
const { mail: SendMail } = require('../utils/utils');

class ShoppingList {
	isHeader;
	userID;	//make a way to grab that (done, through the frontend)
	listName; //not a must
	listType; //not a must
	archivedStatus; //archived, (strikedthrough in the frontend)
	pinned;
	listItems;	//referenced list of items
	listColor;

	//header document constructor
	constructor(userID, listName, listColor = "#D9D9D9", listCount) {
		console.log("Constructor Params:", userID, listName, listColor, listCount);

		this.isHeader = true;//not to be touched under any circumstances
		this.userID = userID;

		if (!listName || listName.trim() === '') {
			this.listName = `רשימה ${listCount}`;
		} else { this.listName = listName; }

		this.listType = "shopping list ";
		this.archivedStatus = false;
		this.pinned = false;
		this.listItems = [];
		this.listColor = listColor || "#D9D9D9";
	}
	static async CreateNewList(listingHeader, userID, listColor) {
		console.log("\n\n-= brace yourself, it will take seconds =-\n\n");
		const listCount = await new DB().CountListings(userID);
		console.log(listCount);
		//creating an object
		let listing = new ShoppingList(listingHeader, userID, listColor, listCount);

		//creating a temporary named collection
		const tempName = `temporaryListing`;
		await new DB().CreateCollection(tempName);

		//inserting the object into that temp. named collection
		let result = await new DB().Insert(tempName, listing);

		//creating the new collection name
		const headerID = result.insertedId;
		const collectionName = `${headerID}_${userID}`;
		console.log(collectionName);

		//renaming the collection
		await new DB().RenameCollection(tempName, collectionName);
		console.log(".\n\nCreation of list Done..\n\n");

		let queryUser = await new DB().FindOne('users', { _id: new ObjectId(userID) });
		if (queryUser) {
			await new DB().PushById('users', userID, 'shoppingLists', headerID);
		}
	}
	//ROUTED
	static async AggHeaderList(collectionName) {
		const headerFileId = collectionName.split('_')[0];
		const agg = [
			{
				$match: {
					_id: new ObjectId(headerFileId),
					isHeader: true
				}
			},
			{
				$lookup: {
					from: "Groceries",
					localFieldId: "listItems",
					foreignFieldId: "_id",
					as: "listItems",
				}
			}
		];
		return await new DB().Aggregation(collectionName, agg);
	}
	//  ROUTED FROM GROCERIES.js   //
	static async AppendListItem(collectionName, listItemId) {
		const headerFileId = collectionName.split('_')[0];
		console.log("headerFileID: ", headerFileId, ", listItemID:  ", listItemId, "\nFull collectionName: ", collectionName);

        await new DB().PushById(collectionName, headerFileId, 'listItems', listItemId);
	}
	//  ROUTED FROM GROCERIES.js   //
	static async RemoveListItem(collectionName, listItemId) {
		const headerFileId = collectionName.split('_')[0];
        await new DB().PullById(collectionName, headerFileId, 'listItems', listItemId);
	}
	//
	static async DeleteList(collectionName) {
		return await new DB().Drop(collectionName);
	}
	//update name, type and color (in that order)
	static async UpdateListingDetails(collection, userID, doc) {
		return await new DB().UpdateById(collection, userID, doc);
	}
	//
	static async DuplicateList(collectionName, listNameExtention) {
		return await new DB().DuplicateCollection(collectionName, listNameExtention);
	}
	/////////////////////////////////////////////
	/////////////////////////////////////////////
	//PinLogic used to be here, but now it's nested inside the route file itself

	//this is how it called: "await toggleParam(collectionName, itemId, 'pinned', pinLogic);""

	static async MailListing(collectionName, receiverEmailAddress) {
		const fetchedFields = { tickToggle: 1, userItemStr: 1, colorCodes: 1 }
		const headerDoc = await new DB().FindOne(collectionName, {}, { listName: 1 });
		const listName = headerDoc ? headerDoc.listName : 'error, Not a header file';
		const data = await new DB().FindAll(collectionName, {}, fetchedFields);
		/////  build the HTML TABLE  /////
		let renderedTable = this.BuildTable(fetchedFields, data, listName);
		await SendMail(renderedTable, listName, receiverEmailAddress);
	}
	//auxaliry function to work with fetchAndMail
	static BuildTable(fetchedFields, data, listName) {
		let table = `<h3>${listName}</h3><table border='1'><tr>`;
		for (let header of Object.keys(fetchedFields)) {
			table += `<th>${header}</th>`;
		}
		table += `</tr>`;
		for (let eachRow of data) {
			table += `<tr>`;
			for (let field of Object.keys(fetchedFields)) {
				table += `<td>${eachRow[field]}</td>`;
			}
			table += `</tr>`;
		}
		table += `</table>`;
		return table;
	}

	static async SearchUserListings(userID, searchString) {
		return await new DB().AggregateUserSearchListings(userID, searchString);
	}
}

module.exports = ShoppingList;
