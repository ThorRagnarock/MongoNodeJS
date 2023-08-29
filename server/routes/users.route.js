
const UsersRoute = require('express').Router();
const UserModel = require('../models/user');


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

		console.log(updatedObject); //working

		let data = await UserModel.UpdateUserDetails(id, updatedObject);
		res.status(200).json(data);

	} catch (error) {
		res.status(500).json({ error });
	}
})




// UsersRoute.get('/:city', async (req, res) => {
// 	try {
// 		let { city } = req.params; //that's an object....
// 		// console.log(city);

// 		let data = await UserModel.FindByCity(city);
// 		res.status(200).json(data);

// 	} catch (error) {
// 		res.status(500).json({ error });
// 	}
// })
module.exports = UsersRoute; 