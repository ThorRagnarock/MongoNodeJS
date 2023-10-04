const UploadRoute = require('express').Router();
const cloudinary = require('../utils/upload.js')

UploadRoute.post('/', async (req, res) => {
	try {
		let { image } = req.body;
		let imageStr = `data:image/jpg;base64,${image}`;
		cloudinary.uploader.upload_large(imageStr, {
			quality: "auto",
			fetch_format: "auto"
		}, (err, result) => {
			if (err) throw new Error(err)
			res.status(200).json(result)
		})
	} catch (error) {
		res.status(500).json({ error });
	}
});

module.exports = UploadRoute;
