
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

		let  packagingSection = await new DB().FindAll('groceries', { "colorCode": colorCode });
		
		packagingSection = packagingSection[0];

		const filteredGroceries = packagingSection.product.filter(product => {
			return conditionFilter ? product.startsWith('!') : !product.startsWith('!');
		})
		return { ...packagingSection, product: filteredGroceries };
	}

}

module.exports = Groceries;