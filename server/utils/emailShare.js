const fs = require('fs');
const nodemailer = require('nodemailer');
// TO BE COPIED TO THE DB FILE


async function fetchAndMailListing(collectionName, receiverEmailAddress) {
	const fetchedFields = { //include all those:1
		tickToggle: 1,
		userItemStr: 1,
		colorCodes: 1
	}
	//const collection = this.client.db(this.db_name).collection(collectionName);

	const listName = await new DB().FindOne(collectionName, {}, { listName: 1 });
	const data = await new DB().collection.FindAll({}, fetchedFields);

	let table = `<h3>${listName}</h3><table border='1'><tr>`;
	for (let header of Object.keys(fetchedFields)) {
		table += `<th>${header}</th>`;
	}
	table += `</tr>`;
	for (let eachRow of data) {
		table += `<tr>`;
		for (let field of Object.keys(fetchedFields)) {
			table += `<td>${row[field]}</td>`
		}
		table += `</tr>`;
	}
	table += `</table>`;
	sendMail(table, listName, receiverEmailAddress);
}

async function sendMail(document, listName, receiverEmailAddress) {
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		}
	});
	let info = await transporter.sendMail({
		from: '"עמוס מ- recycliST" <recyclist.sprt@gmail.com>',
		to: receiverEmailAddress,
		subject: `שלך \"${listName}\" הרשימה`,
		html: document,
	});
	console.log("email sent " + info.response);
}



