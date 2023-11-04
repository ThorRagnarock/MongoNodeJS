const DB = require('../utils/db')
const bcrypt = require('bcrypt');

class User {
	// _id; 
	name;
	email;
	password;
	recycPrefs;
	residence;
	status;
	birthDate;
	profileImage;
	
//subscribeDate
	constructor(name, email, password, recycPrefs, residence, status, birthDate, profileImage) {
		const now = new Date();
		// this._id = _id;
		this.name = name;
		this.email = email;
		this.password = password;
		this.recycPrefs = recycPrefs;
		this.residence = residence;		//object contains city, street and streetnum
		this.status = status;
		this.birthDate = birthDate;
		this.profileImage = profileImage;
		///////////////////////////////////////////////////////////
		this.passwordResetToken = null;
		this.points = 0;
		this.subscribeDate = now;		//`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

		this.shoppingLists = [];		//array of lists, embeded
		this.achievements = [];			//array of achievements
		this.badges = [];				//array of badges
	}
	////////////////////////////////////////////////
	/////////////////// REGISTER ///////////////////
	static async Register(name, email, password, recycPrefs, residence, status, birthDate, profileImage) {
		let hashedPassword = await bcrypt.hash(password, 10);
		// let user = new User(name, email, hashedPassword, passwordResetToken, recycPrefs, residence, status, birthDate, profileImage, points, subscribeDate);

		let user = new User(name, email, hashedPassword, recycPrefs, residence, status, birthDate, profileImage);
		console.log(user);
		return await new DB().Insert('users', user);
	}
	////////////////////////////////////////////////
	///////////////////   LOGIN   //////////////////

	static async Login(email, password) {
		try {
			let query = { email: email }
			let user = await new DB().FindOne('users', query);
			console.log({ user });
			if (!user || !(await bcrypt.compare(password, user.password)))
				return null;

			return {
				_id: user._id,
				name: user.name,
				email: user.email,
				password: user.password,
				passwordResetToken: user.passwordResetToken,
				recycPrefs: user.recycPrefs,
				residence: user.residence,
				status: user.status,
				birthDate: user.birthDate,
				profileImage: user.profileImage,
				points: user.points,
				subscribeDate: user.subscribeDate,
				shoppingLists: user.shoppingLists,
				achievements: user.achievements,
				badges: user.badges,
			};
		} catch (error) {
			res.status(500).json({ error });
		}
	}
	////////////////////////////////////////////////
	static async FindAllUsers() {
		let query = {}
		let project = {}
		return await new DB().FindAll('users');
	}
	static async FindByEmail(email) {
		let query = { "email": { $regex: new RegExp(`^${email}$`, 'i') } }
		return await new DB().FindAll('users', query);
	}// to be used by IsExistingUser.js

	static async UpdateUserDetails(id, doc) {
		return await new DB().UpdateById('users', id, doc)
	}

	static async EmailToId(email) {
		let query = { email: email };
		let currentUser = await DB().FindOne('users', query );

		if (currentUser ===null) { throw new Error ("User not found"); }
		return currentUser._id["$oid"];
	}
}
module.exports = User;

// module.exports = Admin;