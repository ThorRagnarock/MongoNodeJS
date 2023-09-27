const DB = require('../utils/db')
const { ObjectId } = require('mongodb');

class ShoppingList {
	isHeader;
	userID;	//make a way to grab that (done, through the frontend)
	listName; //not a must
	listType; //not a must
	archivedStatus; //archived, (strikedthrough in the frontend)
	pinned;
	listItems;	//referenced list of items
	listColor;
	static count = 1;
	
	//header document constructor
	constructor(userID, listName, listColor = "#D9D9D9") {
		this.isHeader = true;//not to be touched under any circumstances
		this.userID = userID;
		if (!listName || listName.trim() === '') {
			this.listName = `רשימה ${ShoppingList.count}`;
			ShoppingList.count++;
		} else { this.listName = listName; }
		this.listType = "shopping list ";
		this.archivedStatus = false;
		this.pinned = false;
		this.listItems = [];
		this.listColor = listColor;
	}
	static async CreateNewList(listingHeader, userID) {
		//creating an object
		let listing = new ShoppingList(userID, listingHeader);
		//
		//creating a temporary named collection
		const tempName = `temporaryListing`;
		let tempColName = await new DB().CreateCollection(tempName);
		//
		//inserting the object into that temp. named collection
		let result = await new DB().Insert(tempColName, listing);
		//
		//creating the new collection name
		const headerID = result.insertedId;
		const collectionName = `${headerID}_${userID}`;
		//renaming the collection
		await new DB().RenameCollection(tempName, collectionName);
	}

	//פעולות שליפה
	//those two below are wrong
	static async FindAllShoppingLists() {
		return await new DB().FindAll('shoppingList');
	}
	// that's more like for the admin, I think
	static async AllUserLists(userID) {
		let query = { "userID": userID }
		return await new DB().FindAll('shoppingList', query);
	}
/////////////////////////////////////////
	static async DeleteList(collectionName) {
		return await new DB().Drop(collectionName);
	}

//update name, type and color (in that order)
	static async UpdateListingDetails(collection, userID, doc) {
		return await new DB().UpdateById(collection, userId, doc);
	}

	static async paramToggle(collection, itemId, paramName, userID) { //pinned/archivedStatus toggle
		const filter = { _id: new ObjectId(itemId) };
		const doc = await this.FindOne(collection, filter);
		const paramValue = doc[paramName]

		const turnedValue = !paramValue;
		let data = { $set: { [paramName]: turnedValue } };
		if (paramName == "pinned") {
			let pinnedQuery = { "pinned": true, "userID": userID };
			let pinnedCount = await new DB().CountDocs(collection, pinnedQuery);
			if (pinnedCount < 3 && !paramValue) {
				return await new DB().UpdateById(collection, itemId, data)
			} else {
				return { status: 'failed', message: 'ניתן לנעוץ עד 3 צ׳אטים בלבד' }
			}
		}
		return await new DB().UpdateById(collection, itemId, data);
	}


}

module.exports = ShoppingList;


// static async CreateList(

//הוספה
//עריכה
// מחיקה
//שליפה


//first go into the listing itself and grab it's _id
//than go back to the listing document(header doc)
//than remnove that id off of the array inside the listing heading
//than remove the
// NO NO NO wait, that's just the list.. so you just need to remove the list itself..
// that means the entire collection



// create a new list (NOT WORKING!!!)
// static async RegNewListing(listName, userID) {
// 	let listing = new ShoppingList(userID, listName);
// 	console.log(listing);
// 	return await new DB().AddCollection(listing);// that's not going to work
// }