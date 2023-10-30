
const UsersRoute = require('express').Router();
const UserModel = require('../models/user');
const UploadImage = require('../utils/upload.js');



UsersRoute.post('/register', UploadImage, async (req, res) => {
	try {
		console.log("Inside the register router");
		let { name, email, password, recycPrefs, residence, status, birthDate, profileImage } = req.body;
		status = status || 'מעדיף/ה לא לענות';

		console.log('Image Data in Route:', req.imageData);

		profileImage = req?.imageData?.secure_url || "https://cdn.iconscout.com/icon/free/png-512/free-profile-3484746-2917913.png";
		//
		let data = await UserModel.Register(name, email, password, "", recycPrefs, residence, status, birthDate, profileImage);
		//
		res.status(201).json({ msg: "Registration Completed" });
	} catch (error) {
		res.status(500).json({ error });
	}
});
////////////////////////////////////////////////
///////////////////   LOGIN   //////////////////
UsersRoute.post('/login', async (req, res) => {
	try {
		//TODO: Login actions
		let { email } = req.body;
		let { password } = req.body;

		let user = await UserModel.Login(email, password);
		if (!user)
			res.status(401).json({ msg: "incorrect login details" });
		else {
			console.log("Login Succesful!");
			res.status(200).json(user);
		}
	} catch (error) {
		res.status(500).json({ error })
	}
})

UsersRoute.post('/checkMail', async (req, res) => {
	try {
		let { email } = req.body;
		let data = await UserModel.FindByEmail(email);


		if (data && data.length > 0) 
		{ res.status(200).json({ exists: true }) }
		else 
		{ res.status(200).json({ exists: false }) }

	} catch (error) {
		res.status(500).json({ error });
	}
})
UsersRoute.post('/returnId', async (req, res)=>{
	try {
		let {email}= req.body;
		let data = await UserModel.EmailToId(email);
		res.status(200).json({data});

	} catch (error) {
		res.status(500).json({error});
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
/////////////////////////////////////////

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
UsersRoute.put('/:id/upload', UploadImage, async (req, res) => {
	try {
		console.log("inside the upload image thing");
		// update the document
		let updatedObject = { profileImage: req.imageData.secure_url };		
		//return response
		let data = await UserModel.UpdateUserDetails(id, updatedObject);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error });
	}
})

module.exports = UsersRoute; 



// const now = new Date(); // const accountCreated = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
		// //		// maybe it should be each one in different line?
// if (req?.imageData?.secure_url) {
		// 	profileImage = req.imageData.secure_url;
		// }
		// else { profileImag = "https://cdn.iconscout.com/icon/free/png-512/free-profile-3484746-2917913.png"; }