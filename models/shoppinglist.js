const DB = require('../utils/db')
const { ObjectId } = require('mongodb');
const { mail: SendMail } = require('../utils/utils');

class ShoppingList {
	isHeader;
	userID;	//make a way to grab that (done, through the frontend)
	listName; //not a must
	listColor;
	listType; //not a must
	archivedStatus; //archived, (strikedthrough in the frontend)
	pinned;
	listItems;	//referenced list of items

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
	static async CreateNewList(userID, listingHeader, listColor) {

		console.log("\n\n-= brace yourself, it will take seconds =-\n\n");
		const listCount = await new DB().CountListings(userID);
		let listing = new ShoppingList(userID, listingHeader, listColor, listCount);

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
		return { headerID: result.insertedId, collectionName };
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
		console.log("Now inside the dl function: ", collectionName);
		await new DB().DuplicateCollection(collectionName, listNameExtention);
	}
	////

	static async MailListing(collectionName, receiverEmailAddress) {
		console.log("email to send to: ", receiverEmailAddress);
		const fetchedFields = { tickToggle: 1, userItemStr: 1, colorCodes: 1 }
		const headerDoc = await new DB().FindOne(collectionName, {}, { listName: 1 }); console.log("shoppinglist -> headerDoc: ", headerDoc);

		const listName = headerDoc ? headerDoc.listName : 'error, Not a header file';
		const data = await new DB().FindAll(collectionName, {}, fetchedFields);
		/////  build the HTML TABLE  /////
		let renderedTable = this.BuildTable(fetchedFields, data, listName);
		console.log("Now sending mail using the utils>sendMail...");
		await SendMail(renderedTable, listName, receiverEmailAddress);
	}
	//auxaliry function to work with fetchAndMail
	static BuildTable(fetchedFields, data, listName) {
		let table = `<h3>${listName}</h3><table border='1'><tr>`;
		for (let header of Object.keys(fetchedFields)) {
			table += `<th>${header}</th>`;
		}
		table += `</tr>`;

		for (let i = 1; i < data.length; i++) {
			const row = data[i];
			console.log("this is row", row);
			table += '<tr>';
			for (const key in fetchedFields) {
				if (key === 'tickToggle') {
					const symbol = row[key] ? '-' : 'X';
					table += `<td>${symbol}</td>`;
				} else if (key === 'colorCodes') {
					let colors = row[key];  // No need to split, it's already an array
					let coloredBlocks = colors.map(color => `<span style="color:${color};">&#9608;</span>`).join('');
					table += `<td>${coloredBlocks}</td>`;
				}
				else {
					table += `<td>${row[key]}</td>`;
				}
			}
			table += '</tr>';
		}
		table += `</table>`;
		return table;
	}

	static async SearchUserListings(userID, searchListings) {
		return await new DB().AggregateUserSearchListings(userID, searchListings);
	}

	static async RenameListing(collectionName, newName) {

		const filter = { isHeader: true };
		const doc = await new DB().FindOne(collectionName, filter);
		if (doc && doc._id) {
			let data = { "listName": newName };
			return await new DB().UpdateById(collectionName, doc._id, data);
		} else {
			// Handle the error - item not found
			throw new Error("Header not found");
		}
	}

	static async retrieveListings(userId, rawHeaderIds) {
		const headerArr = [];
		const filter = { isHeader: true };

		const listingsIds = rawHeaderIds.map(list=>list.$oid);
		for(listingHeader of listingsIds) {
			const collectionName = `${listingHeader}_${userId}`;
			const headerDoc = await new DB().FindOne(collectionName, filter);
			if (headerDoc) headerArr.push(headerDoc);
		}
		return headerDoc;
	}
}

module.exports = ShoppingList;
