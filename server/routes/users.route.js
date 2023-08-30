
const UsersRoute = require('express').Router();
const UserModel = require('../models/user');


UsersRoute.post('/register', async (req, res) => {
	try {
		let { name, email, password, passwordResetToken, recycPrefs, residence, status, DateOfBirth, profileImage } = req.body;
		const now = new Date();
		//default values conditioned, mandatory values kept
		let updatedObject = {		
			name: name,
			email: email,
			password: password,
			passwordResetToken: "",
			recycPrefs: recycPrefs,
			residence: residence,
			status: status || 'מעדיף/ה לא לענות',
			DateOfBirth: DateOfBirth,
			profileImage: profileImage || "https://cdn.iconscout.com/icon/free/png-512/free-profile-3484746-2917913.png",
			points: 0,
			accountCreated: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,

		};
		let { name: uname, email: umail, password: upassword, recycPrefs: urecycPrefs, residence: uresidence, status: ustatus, DateOfBirth: udob, profileImage: uImage, accountCreated: uaccountCreated, points: upoints } = updatedObject;

		let data = await UserModel.Register(uname, umail, upassword, passwordResetToken, urecycPrefs, uresidence, ustatus, udob, uImage, upoints, uaccountCreated);
		//Also: user.push({username, email, password, etc...})
		res.status(201).json({msg: "Registration Completed"});// data
		//res.end();

	} catch (error) {
		res.status(500).json({ error })
	}
})

UsersRoute.post('/login', async (req, res) => {
	try {
		//TODO: Login actions
	} catch (error) {
		res.status(500).json({ error })
	}
})

/////////////////////////////////////////

UsersRoute.get('/', async (req, res) => {
	try {
		let data = await UserModel.FindAllUsers();
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error });
	}
})
UsersRoute.get('/:email', async (req, res) => {
	try {
		let { email } = req.params;

		let data = await UserModel.FindByEmail(email);
		res.status(200).json(data);

	} catch (error) {
		res.status(500).json({ error });
	}
})

UsersRoute.put('/:id', async (req, res) => {
	try {
		let { id } = req.params;
		let { profileImage, password, name, residence, status } = req.body;

		let updatedObject = {};
		if (profileImage) updatedObject.profileImage = profileImage;
		if (password) updatedObject.password = password;
		if (name) updatedObject.name = name;
		if (residence) updatedObject.residence = residence;
		if (status) updatedObject.status = status;

		let data = await UserModel.UpdateUserDetails(id, updatedObject);
		res.status(200).json(data);

	} catch (error) {
		res.status(500).json({ error });
	}
})




module.exports = UsersRoute; 