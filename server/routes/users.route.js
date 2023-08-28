const UserModel = require('../models/user');
const UsersRoute = require('express').Router();


UsersRoute.get('/', async (req, res) => {
	try {
		let data = await UserModel.FindAllUsers();
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error });
	}
})

UsersRoute.get('/:city', async (req, res) => {
	try {
		let city = req.params;
		let data = await UserModel.FindByCity(city);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error });
	}
})
module.exports = UsersRoute; 