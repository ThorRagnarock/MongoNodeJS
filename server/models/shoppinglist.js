const DB = require('../utils/db')

class ShoppingList {
	userID;	//TODO: find/make a way to grab that
	listName;
	listType;
	archivedStatus; //archived, strikedthrough       
	pinned;
	listItems;	//referenced list of items
	listColor;
	static count = 1;

	constructor(userID, listName) {
		this.userID = userID;
		if (!listName || listName.trim() === '') {
			this.listName = `רשימה ${ShoppingList.count}`;
			ShoppingList.count++;
		} else { this.listName = listName; }
		this.listType = "shopping list ";
		this.archivedStatus = false;
		this.pinned = false;
		this.listItems = [];
		if (!listColor || listColor.trim() === '') { this.listColor = "#D9D9D9"; }
		else { this.listColor = this.listColor; }
	}
	//פעולות שליפה
	static async FindAllShoppingLists() {
		return await new DB().FindAll('shoppingList');
	}

	static async AllUserLists(userID) {
		let query = { "userID": userID }
		return await new DB().FindAll('shoppingList', query);
	}

	static async RegNewListing(listName, userID) {
		let listing = new ShoppingList(userID, listName);
		console.log(listing);
		return await new DB().AddCollection(listing);
	}

	static async DeleteList(listName){
		return await new DB().Drop(listName);
	}

	static async AppendListItem(listItem) {
		//this used to attach new list???
	}

	static async UpdateListingDetails(id, doc) {

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