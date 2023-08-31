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


UsersRoute.post('/register', async (req, res) => {
    try {
        const now = new Date();
        const accountCreated = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
		//
        const { name, email, password, recycPrefs, residence, status = 'מעדיף/ה לא לענות', DateOfBirth, profileImage = "https://cdn.iconscout.com/icon/free/png-512/free-profile-3484746-2917913.png" } = req.body;
        //
        let data = await UserModel.Register(name, email, password, "", recycPrefs, residence, status, DateOfBirth, profileImage, 0, accountCreated);
        //
        res.status(201).json({msg: "Registration Completed"});
    } catch (error) {
        res.status(500).json({ error });
    }
});
