const DB = require('../utils/db')


class ShoppingList {
	listName;
	listOrder;
	items;			//referenced list of items
	listType;
	archivedStatus; //archived, strikedthrough       
	pinned;
	userID;
	listItems;

	constructor(listName, listOrder, items, listType, archivedStatus, pinned, userID, listItems) {
		this.listName = listName;
		this.listOrder = listOrder;
		this.items = items;
		this.listType = listType;
		this.archivedStatus = archivedStatus;
		this.pinned = pinned;
		this.userID = userID;
		this.listItems = listItems;
	}

	//פעולות שליפה
	static async FindAllShoppingLists() {
		return await new DB().FindAll('shoppingList');
	}

	static async AllUserLists(userID) {
		let query = { "userID" : userID }
		return await new DB().FindAll('shoppingList', query);
	}


	// static async CreateList(

	//הוספה
	//עריכה
	// מחיקה
	//שליפה
}

module.exports = ShoppingList;