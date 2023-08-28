const DB = require('../utils/db')

class User {
	profileImage;
	email;
	password;
	passwordResetToken;

	name;
	recycPrefs;
	residence;

	status;
	birthDate;
	points;
	accountCreated;

	shoppingLists;
	achievements;
	badges;

	constructor(profileImage, email, password, passwordResetToken, name, recycPrefs, residence, status, birthDate, points, accountCreated, shoppingLists, achievements, badges) {
		this.profileImage = profileImage;
		this.email = email;
		this.password = password;
		this.passwordResetToken = passwordResetToken;
		this.name = name;
		this.recycPrefs = recycPrefs;
		this.residence = residence;			//object contains city, street and streetnum

		this.status = status;
		this.birthDate = birthDate;
		this.points = points;
		this.accountCreated = accountCreated;

		this.shoppingLists = shoppingLists;	//array of lists, embeded
		this.achievements = achievements;	//array of achievements
		this.badges = badges;				//array of badges
	}

	static async FindAllUsers() {
		let query = {}
		let project = {}
		return await new DB().FindAll('users');
	}
	static async FindByCity(city) {
		let query = { "residence.city" : city }
		return await new DB().FindAll('users', query);
	}
}

// class Admin extends User {
// 	lastLogin;
// 	active;
// 	phone;
// 	clearanceLevel;
// 	constructor(...userArgs,lastLogin, active, phone, clearanceLevel) { //...userArgs, 
// 		super(...userArgs);
// 		this.lastLogin = lastLogin;
// 		this.active = active;
// 		this.phone = phone;
// 		this.clearanceLevel = clearanceLevel;
// 	}
// }
module.exports = User;
// module.exports = Admin;