//const fs = require('fs');
const nodemailer = require('nodemailer');
const DB = require('../utils/db')
const { ObjectId } = require('mongodb'); // Import ObjectId

async function SendMail(table, listName, receiverEmailAddress) {
	const emailUser = process.env.EMAIL_USER;
	const emailPass = process.env.EMAIL_PASS;
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: emailUser,
			pass: emailPass,
		}
	});
	let info = await transporter.sendMail({
		from: `"עמוס מ- recycliST" <${emailUser}>`,
		to: receiverEmailAddress,
		subject: `שלך "${listName}" הרשימה`,
		html: table,
	});
	console.log("email sent " + info.response);
}




async function ToggleParam(collection, itemId, paramName, pinLogic = null) {
	const filter = { _id: new ObjectId(itemId) };
	const doc = await new DB().FindOne(collection, filter);
	console.log("\\root\\utils\\utils\\toggleParam...");

	console.log("util\\tp filter, doc: ",filter, doc);
	const turnedValue = !doc[paramName];


	let data =  { [paramName]: turnedValue } ;


	if (pinLogic && typeof pinLogic === 'function') {
		console.log("call back pinLogic from shoppinglist.route");
		return await pinLogic(paramName, turnedValue);
	}

    return await new DB().UpdateById(collection, itemId, data);
}

module.exports = { mail: SendMail, ToggleParam: ToggleParam };
