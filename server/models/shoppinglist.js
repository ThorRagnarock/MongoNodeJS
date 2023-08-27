class ShoppingLists {
	listName;
	listOrder;
	items;			//referenced list of items
	listType;
	archivedStatus; //archived, strikedthrough       
	pinned;

	constructor(listName, listOrder, items, listType, archivedStatus, pinned) {
		this.listName = listName;
		this.listOrder = listOrder;
		this.items = items;
		this.listType = listType;
		this.archivedStatus = archivedStatus;
		this.pinned = pinned;
	}

	//הוספה
	//עריכה
	// מחיקה
	//שליפה
}

module.exports = ShoppingLists;