
const DB = require('../utils/db')

class Groceries {
	static indexIdCounter = 0; 

	userItemStr;   //AKA userString, productName- userItemStr
	tickToggle;
	groceryPoints;
  
	packaging;   //genralRecycle: 1, glass:1 - what color codes are on the product
	colors;
	feedbackFlag; //bool
	//userFeedback: "" 
	//barCode;      //optional
	constructor(userItemStr) {
	  this.userItemStr = userItemStr;
	  this.tickToggle = false;
	  this.groceryPoints = 1;
	  
	  this.feedbackFlag = false;
	  this.userFeedback = "";
  
	  //Aggregation function comes here
  
	  this.packaging = {}; //do I need to get that later? 
	  this.colors = {};       //do I need to get that later? 
	}
	SetPackage(packageData) { this.packaging = packageData;}
	SetColor(colorData) { this.colors = colorData;}
	//from here I operate the aggregation 
	
	//TODO : Create a new grocery document
	
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
		let query = { "colorCode": colorCode, "conditionFilter": conditionFilter }
		//console.log(query);
		let packagingSection = await new DB().FindAll('groceries', { "colorCode": colorCode });
		packagingSection = packagingSection[0];
		const filteredGroceries = packagingSection.product.filter(product => {
			return conditionFilter ? !product.startsWith('!') : product.startsWith('!');
		})
		return { product: filteredGroceries };//...packagingSection, 
	}

	static async PackMaterials(userItemStr) {
		const indexIdCounter = ++Groceries.indexIdCounter;
		const inputWords = userItemStr.split(',').map(str => str.trim().split(' ')).flat();
		const agg = [
			{
				$match: { descriptor: { $ne: "conjunctions" }, },
			},
			{
				$addFields: {
					exclude: {
						$function: {
							body: `function(product, inputWords) {
										for (const word of product) {
										  if (word.startsWith('!') && inputWords.includes(word.substring(1))) {
											return true;
										  }
										}
										return false;
									  }`,
							args: ["$product", inputWords],
							lang: "js",
						},
					},
				},
			},
			{
				$match: { exclude: false, },
			},
			{
				$group: {
				  _id: indexIdCounter,
				  packaging: {
					$addToSet: "$packaging"
				  },
				  colorCodes: {
					$addToSet: "$colorCode"
				  }
				}
			}
		];
		const packagingMeterials = await new DB().Aggregation('groceries', agg);
		console.log("Aggregation Results:", JSON.stringify(packagingMaterials));

		const [{ packaging, colorCodes}] = packagingMeterials;
		return {packaging, colorCodes};
	}
}

module.exports = Groceries;