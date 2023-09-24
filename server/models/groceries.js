const DB = require('../utils/db')

class Groceries {
	// static indexIdCounter = 0;

	userItemStr;   //AKA userString, productName- userItemStr
	tickToggle;
	groceryPoints;
	packaging;   //genralRecycle: 1, glass:1 etc..
	colorCodes;
	feedbackFlag; //bool
	lastIndex;

	//barCode;      //optional
	constructor(userItemStr) {
		this.userItemStr = userItemStr;
		this.tickToggle = false;
		this.groceryPoints = {};
		this.feedbackFlag = false;
		this.userFeedback = "";
		this.packaging = {};
		this.colorCodes = {};
		this.lastIndex = {};

		this.init();
	}
	async init() {
		try {
			const { packaging, colorCodes,groceryPoints, _id } = await this.PackMaterials(this.userItemStr);
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
		let listItem = new Groceries(userItemStr);

		let data = await new DB().Insert(collectionName, listItem);
		let listItemId = data.insertedId;
		await new DB().UpdateById(collectionName, listItemId, {
			 packaging: listItem.packaging, 
			 colorCodes: listItem.colorCodes, 
			 groceryPoints: listItem.groceryPoints //that's the new value
			});

		return { data, listItemId };
		//I need to enter pick the _id out of here and to send it to the array in the list
	}
	//methods etc here
	static async FindAllGroceries() {
		let query = {}
		let project = {}
		return await new DB().FindAll('groceries');
	}

	static async FindGroceriesByColor(colorCode) {
		let query = { "colorCode": colorCode }
		return await new DB().FindAll('groceries', query);
	}

	static async GetRelationGroceries(colorCode, conditionFilter) {
		let query = { 
			"colorCode": colorCode, 
			"conditionFilter": conditionFilter
		 }
		let packagingSection = await new DB().FindAll('groceries', { "colorCode": colorCode });
		packagingSection = packagingSection[0];
		const filteredGroceries = packagingSection.product.filter(product => {
			return conditionFilter ? !product.startsWith('!') : product.startsWith('!');
		})
		return { product: filteredGroceries };//...packagingSection, 
	}

	async PackMaterials(userItemStr) {
		const indexIdCounter = ++Groceries.indexIdCounter;
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
					'_id': indexIdCounter,
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
							{ '$eq': ['$groceryPoints', 0] }, // If all are brown
							3, // Then max points
							{
								'$cond': [
									{ '$gte': ['$groceryPoints', 3] }, // If 3 or more colors
									1, // Then min points
									'$groceryPoints' // Else, the actual count
								]
							}
						]
					}
				}
			}

		];
		// TODO: points - remoember to count the colors in order to return points
		const packagingMaterials = await new DB().Aggregation('groceries', agg);

		const [{ packaging, colorCodes,groceryPoints, _id }] = packagingMaterials;
		console.log({ packaging, colorCodes,groceryPoints, _id });
		return { packaging, colorCodes,groceryPoints, _id };
	}

	static async InitIndexCount() {
		try {
			const fetchLastId = await new DB().FindOne('groceries', {}, { sort: { _id: -1 } });
			if (fetchLastId && fetchLastId._id) { Groceries.indexIdCounter = fetchLastId._id }
			else { Groceries.indexIdCounter = 0; }
		} catch (error) {
			console.error(error);
		}
	}
}

module.exports = Groceries;
