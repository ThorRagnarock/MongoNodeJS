const DB = require('../utils/db')
const bcrypt = require('bcrypt');

class User {
	name; email; password; passwordResetToken;
	recycPrefs; residence;
	status; DateOfBirth; profileImage; points; accountCreated;
	shoppingLists; achievements; badges;

	constructor(name, email, password, passwordResetToken, recycPrefs, residence, status, DateOfBirth,profileImage, points, accountCreated, shoppingLists, achievements, badges) {
		this.profileImage = profileImage;
		this.email = email;
		this.password = password;
		this.passwordResetToken = passwordResetToken;
		this.name = name;
		this.recycPrefs = recycPrefs;
		this.residence = residence;			//object contains city, street and streetnum

		this.status = status;
		this.DateOfBirth = DateOfBirth;
		this.points = points;
		this.accountCreated = accountCreated;

		this.shoppingLists = shoppingLists;	//array of lists, embeded
		this.achievements = achievements;	//array of achievements
		this.badges = badges;				//array of badges
	}
	static async Register(name, email, password, passwordResetToken, recycPrefs, residence, status, DateOfBirth, profileImage, points, accountCreated) {
		let hashedPassword = await bcrypt.hash(password, 10);
		let user = new User(name, email, hashedPassword, passwordResetToken, recycPrefs, residence, status, DateOfBirth, profileImage, points, accountCreated);

		// console.log(password, hashedPassword);
		console.log(user);
		return await new DB().Insert('users', user);
	}

	static async login(email, password) {
		this.email = email;
		this.password = await bcrypt.hash(password, 10);
		console.log(password, this.password);
	}
	static async FindAllUsers() {
		let query = {}
		let project = {}
		return await new DB().FindAll('users');
	}

	static async FindByEmail(email) {
		let query = { "email": { $regex: new RegExp(`^${email}$`, 'i') } }
		return await new DB().FindAll('users', query);
	}

	static async UpdateUserDetails(id, doc) {
		return await new DB().UpdateById('users', id, doc)
	}
}


module.exports = User;

// module.exports = Admin;
/*
		this.profileImage = profileImage;
		this.email = email;
		this.name = name;
		this.recycPrefs = recycPrefs;
		this.residence = residence;
		this.status = status;
		this.DateOfBirth = DateOfBirth;
		this.points = points;
		this.accountCreated = accountCreated;
		*/