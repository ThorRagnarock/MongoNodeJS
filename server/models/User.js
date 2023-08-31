const DB = require('../utils/db')
const bcrypt = require('bcrypt');


class User {
	_id; name; email; password; passwordResetToken;
	recycPrefs; residence;
	status; DateOfBirth; profileImage; points; accountCreated;
	shoppingLists; achievements; badges;

	constructor(name, email, password, passwordResetToken, recycPrefs, residence, status, DateOfBirth, profileImage, points, accountCreated, shoppingLists, achievements, badges) {
		// this._id = _id;
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
	////////////////////////////////////////////////
	/////////////////// REGISTER ///////////////////
	static async Register(name, email, password, passwordResetToken, recycPrefs, residence, status, DateOfBirth, profileImage, points, accountCreated) {
		let hashedPassword = await bcrypt.hash(password, 10);
		let user = new User(name, email, hashedPassword, passwordResetToken, recycPrefs, residence, status, DateOfBirth, profileImage, points, accountCreated);

		// console.log(password, hashedPassword);
		console.log(user);
		return await new DB().Insert('users', user);
	}
	////////////////////////////////////////////////
	///////////////////   LOGIN   //////////////////

	static async Login(email, password) {
		try {
			let query = { email: email }
			//let user = this.FindByEmail(u => u.email == email) //will work?
			let user = await new DB().FindOne('users', query);

			console.log({ user });
			if (!user || !(await bcrypt.compare(password, user.password)))
				return null;
			
			//res.status(200).json({ msg: "login succesful" })
			//return {...user}
			return user;
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
	}

	static async UpdateUserDetails(id, doc) {
		return await new DB().UpdateById('users', id, doc)
	}
}


module.exports = User;

// module.exports = Admin;