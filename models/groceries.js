

const DB = require('../utils/db')
const { ObjectId } = require('mongodb');
const ShoppingList = require('./shoppinglist');


class Groceries {
	userItemStr;	//AKA userString, productName- userItemStr
	tickToggle;
	groceryPoints;
	packaging;		//genralRecycle: 1, glass:1 etc..
	colorCodes;
	feedbackFlag;	//bool
	lastIndex;
	constructor(userItemStr) {
		this.userItemStr = userItemStr;
		this.tickToggle = false;
		this.groceryPoints = {};
		this.packaging = {};
		this.colorCodes = {};
		this.lastIndex = {};
		this.feedbackFlag = false;
		this.userFeedback = "";

		this.init();
	}
	async init() {
		try {//sth to check here too..
			const { packaging, colorCodes, groceryPoints, _id } = await this.PackMaterials(this.userItemStr);
			this.packaging = packaging;
			this.colorCodes = colorCodes;
			this.groceryPoints = groceryPoints;
			this.lastIndex = _id;

		} catch (error) {
			console.log("Error in init: ", error, "\nusing default values.");
			this.packaging = {};
			this.colorCodes = {};
			this.groceryPoints = {};
		}
	}
	//TODO : Create a new grocery document
	static async CreateListItem(collectionName, userItemStr) {
		const headerFileId = collectionName.split('_')[0];

		let listItem = new Groceries(userItemStr);
		let data = await new DB().Insert(collectionName, listItem);
		let listItemId = data.insertedId;

		await new DB().UpdateById(collectionName, listItemId, {
			packaging: listItem.packaging,
			colorCodes: listItem.colorCodes,
			groceryPoints: listItem.groceryPoints //that's the new value
		});
		await ShoppingList.AppendListItem(collectionName, listItemId);
		return { data, listItemId };
		//I need to enter pick the _id out of here and to send it to the array in the list
	}
	//methods etc here
	static async FindAllGroceries() {
		let query = {}
		let project = {}
		return await new DB().FindAll('groceries');
	}
	//that might be useless
	static async FindGroceriesByColor(colorCode) {
		let query = { "colorCode": colorCode }
		return await new DB().FindAll('groceries', query);
	}

	async PackMaterials(userItemStr) {
		// const indexIdCounter = ++Groceries.indexIdCounter;
		const inputWords = userItemStr.split(',').map(str => str.trim().split(' ')).flat();
		const agg = [
			{
				'$match': {
					'exceptions': {
						'$nin': inputWords
					}
				}
			}, {
				'$match': {
					'product': {
						'$in': inputWords
					}
				}
			}, {
				'$group': {
					'_id': new ObjectId(),
					'packaging': {
						'$addToSet': '$descriptor'
					},
					'colorCodes': {
						'$addToSet': '$colorCode'
					},
					'groceryPoints': {
						'$sum': {
							'$cond': [{ '$ne': ['$colorCode', 'brown'] }, 1, 0]
						}
					}
				}
			},
			{
				'$addFields': {
					'groceryPoints': {
						'$cond': [
							{ '$eq': ['$groceryPoints', 0] },
							3, //  If all are brown Then max points
							{
								'$cond': [
									{ '$gte': ['$groceryPoints', 3] },
									1, // Then min points
									'$groceryPoints' // Else, the actual count
								]
							}
						]
					}
				}
			}
		];

		const packagingMaterials = await new DB().Aggregation('groceries', agg);

		//sth to check here...
		if (packagingMaterials && packagingMaterials[0]) {
			const { packaging, colorCodes, groceryPoints, _id } = packagingMaterials[0];
			console.log("PackMaterials is about to return: ", { packaging, colorCodes, groceryPoints, _id });

			return { packaging, colorCodes, groceryPoints, _id };
		}
		else {
			console.log('packagingMaterials is empty or undefined');
		}
		//const [{ packaging, colorCodes, groceryPoints, _id }] = packagingMaterials;
	}
	static async CreateItemFeedback(collectionName, itemId, feedbackText) {
		const query = {
			feedbackFlag: true,
			userFeedback: feedbackText
		}
		return await new DB().UpdateById(collectionName, itemId, query);
	}
	static async DeleteListItem(collectionName, itemId) {
		await ShoppingList.RemoveListItem(collectionName, itemId);
		return await new DB().Delete(collectionName, itemId);
	}
}

module.exports = Groceries;
/////////////////////////////////////////////
/////////////////////////////////////////////
// static async TickToggle(collection, itemId, paramName) {
// 	const filter = { _id: new ObjectId(itemId) };
// 	const doc = await this.FindOne(collection, filter);
// 	const turnedValue = !doc[paramName];

// 	let data = { $set: { [paramName]: turnedValue } };
// 	return await new DB().UpdateById(collection, itemId, data);
// }
