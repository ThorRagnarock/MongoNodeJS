const { MongoClient, ObjectId } = require('mongodb');	//rList1_user  //ouzQZL4j8sZrdUJT
const nodemailer = require('nodemailer');

class DB {
	db_uri;
	db_name;
	client;
	constructor() {
		this.db_uri = process.env.DB_URI;
		//
		this.db_name = process.env.DB_NAME;
		//
		this.client = new MongoClient(this.db_uri, {
			poolSize: 6,
			useNewUrlParser: true,
			useUnifiedTopology: true,			
		});
	}
	async connect() {
		if (!this.client.isConnected()) {
		  await this.connect();
		}
	  }
	
	  async disconnect() {
		if (this.client.isConnected()) {
		  await this.client.close();
		}
	  }

	//פעולות שליפה - GET
	async FindAll(collection, query = {}, project = {}) {
		try {
			await this.connect();	//CONNECTING 
			return await this.client.db(this.db_name).collection(collection).find(query, project).toArray();
		}
		catch (error) {
			throw error;
		}
		//DIS-CONNECTING

	}
	async FindOne(collection, query = {}, project = {}) {
		try {
			await this.connect();	//CONNECTING 
			return await this.client.db(this.db_name).collection(collection).findOne(query, project);
		} catch (error) {
			throw error;
		} 
		//DIS-CONNECTING

	}
	//פעולות יצירה - POST
	async Insert(collection, doc) {
		try {
			await this.connect();	//CONNECTING 
			return await this.client.db(this.db_name).collection(collection).insertOne(doc);
		} catch (error) {
			throw error;
		} 
	}

	async Delete(collection, itemId) { //delete a single item
		try {
			await this.connect();
			let filter = { _id: new ObjectId(itemId) };
			return this.client.db(this.db_name).collection(collection).deleteOne(filter);
		} catch (error) {
			throw (error)
		} 
	}
	async Drop(collection) {
		try {
			await this.connect();
			return this.client.db(this.db_name).collection(collection).drop();
		} catch (error) {
			throw (error);
		} 
	}
	//פעוולות עדכון - PUT
	async UpdateById(collection, id, doc) {  //updating USER fields 
		try {
			await this.connect();	//CONNECTING 
			console.log(collection);
			return await this.client.db(this.db_name).collection(collection).updateOne(
				{ _id: new ObjectId(id) },
				{ $set: doc });
		} catch (error) {
			throw error;
		} finally {
					//DIS-CONNECTING
		}
	}

	async CreateCollection(collection) {
		try {
			await this.connect();
			return await this.client.db(this.db_name).createCollection(collection, { capped: true, max: 64 });
		} catch (error) {
			throw (error);
		} 
	}
	async CountDocs(collection, query = {}) {
		try {
			await this.connect();
			return await this.client.db(this.db_name).collection(collection).countDocuments(query);
		} catch (error) {
			throw (error);
		} 
	}

	async Aggregation(collection, agg) {
		try {
			await this.connect();
			return await this.client.db(this.db_name).collection(collection).aggregate(agg).toArray();
		} catch (error) {
			throw (error);
		} 
	}
	async RenameCollection(oldCollectionName, newCollectionName) {
		try {
			await this.connect();
			const db = this.client.db(this.db_name);
			const collection = db.collection(oldCollectionName)
			await collection.renameCollection(newCollectionName);
		} catch (error) {
			throw (error);
		} 
	}
	async DuplicateCollection(originCollectionName, newExt) {
		let userId;
		const originCollection = this.client.db(this.db_name).collection(originCollectionName);
		const docs = await this.FindAll(originCollectionName);
		const newColName = new ObjectId().toString(); //(new id)

		const headerDoc = await this.FindOne(originCollection, { isHeader: true });
		if (headerDoc) {
			userId = headerDoc.userId;
			headerDoc.listName = `${headerDoc.listName}(${newExt})`;
		}

		const duplicatedCollectionName = `${newColName}_${userId}`;
		const duplicateCollection = this.client.db(this.db_name).collection(duplicatedCollectionName);

		await duplicateCollection.insertMany(docs);

		console.log(`Duplicated ${originCollectionName} to ${duplicatedCollectionName} with new listName`);
		return duplicateCollection;
	}
	////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////
	async fetchAndMailListing(collectionName, receiverEmailAddress) {
		const fetchedFields = { //include all those:1
			tickToggle: 1,
			userItemStr: 1,
			colorCodes: 1
		}
		const headerDoc = await this.FindOne(collectionName, {}, { listName: 1 });
		const listName = headerDoc ? headerDoc.listName : 'error, Not a header file';
		const data = await this.FindAll(collectionName, {}, fetchedFields);

		let table = `<h3>${listName}</h3><table border='1'><tr>`;
		for (let header of Object.keys(fetchedFields)) {
			table += `<th>${header}</th>`;
		}
		table += `</tr>`;
		for (let eachRow of data) {
			table += `<tr>`;
			for (let field of Object.keys(fetchedFields)) {
				table += `<td>${eachRow[field]}</td>`
			}
			table += `</tr>`;
		}
		table += `</table>`;
		await this.sendMail(table, listName, receiverEmailAddress);
	}

	async sendMail(table, listName, receiverEmailAddress) {
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
}

const dbInstance = new DB();

process.on('SIGINT', async () => {
	console.log("Received SIGINT. Gracefully shutting down...");
	await dbInstance.disconnect();
	process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
	console.log("Received SIGTERM. Gracefully shutting down...");
	await dbInstance.disconnect();
	process.exit(0);
  });
  
module.exports = DB;

//"mongodb://localhost:27017"; //
	//async AppendListItem()
	//DONE : create a function that concatenate object to form a list // I am not sure if I have a need for that anymore... (both in the list and both in the item level)
	//DONE: create a function that removes objects from a list (both in the list and both in the item level)
	//DONE? create an function that is cross-referncing from 6 different (I am pretty sure I got that one with agg)
	//DONE: Create a listing header
