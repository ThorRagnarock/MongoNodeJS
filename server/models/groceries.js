
const DB = require('../utils/db')

class Groceries {
	descriptor;
	product;			//current category products' keywords
	packaging;			//"packn" (n=number) obj of product materials
	segregateGuideline;	//side information
	colorCode;
	constructor(descriptor, product, packaging, segregateGuideline, colorCode) {
		this.descriptor = descriptor;
		this.product = product;
		this.packaging = packaging;
		this.segregateGuideline = segregateGuideline;
		this.colorCode = colorCode;
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
		let query = { "colorCode": colorCode, "conditionFilter": conditionFilter }
		//console.log(query);
		let packagingSection = await new DB().FindAll('groceries', { "colorCode": colorCode });
		packagingSection = packagingSection[0];
		const filteredGroceries = packagingSection.product.filter(product => {
			return conditionFilter ? !product.startsWith('!') : product.startsWith('!');
		})
		return { product: filteredGroceries };//...packagingSection, 
	}

	static async PackMaterials(groceryString) {
		const inputWords = groceryString.split(',').map(str => str.trim().split(' ')).flat();
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
		];
		const packagingMeterials = await new DB().Aggregation('groceries', agg)
		console.log(JSON.stringify(packagingMeterials));
	}

}

module.exports = Groceries;