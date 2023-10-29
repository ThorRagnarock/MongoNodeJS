const cloudinary = require('cloudinary').v2;

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});

//App_Uploads
//o2ja2wqt

function UploadImage(req, res, next) {
	try {
		req.imageData = result;
		console.log('Image Data in Middleware:', req.imageData);



		let { profileImage } = req.body;
		if(!profileImage || profileImage == undefined) next();
		let {id} = req.params;
		cloudinary.uploader.upload(profileImage, {
			public_id: `App_Uploads/${id}`
		},
			(err, result) => {
				if (err)
					throw new Error(err);
				console.log('result from cloudinary', result);
				req.imageData = result;
				next();
			});
	} catch (error) {
		res.status(500).json({ ...error });
	}
}

module.exports = UploadImage;