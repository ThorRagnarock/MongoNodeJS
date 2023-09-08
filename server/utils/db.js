const { MongoClient, ObjectId } = require('mongodb');		//rList1_user  //ouzQZL4j8sZrdUJT

class DB {
	db_uri;
	db_name;
	client;
	constructor() {
		this.db_uri = process.env.DB_URI;
		//
		this.db_name = process.env.DB_NAME;
		//
		this.client = new MongoClient(this.db_uri)
	}
	//פעולות שליפה - GET
	async FindAll(collection, query = {}, project = {}) {
		try {
			await this.client.connect();	//CONNECTING 
			return await this.client.db(this.db_name).collection(collection).find(query, project).toArray();
		}
		catch (error) {
			throw error;
		}
		finally {
			await this.client.close();		//DIS-CONNECTING
		}
	}
	async FindOne(collection, query = {}, project = {}) {
		try {
			await this.client.connect();	//CONNECTING 
			return await this.client.db(this.db_name).collection(collection).findOne(query, project);
		} catch (error) {
			throw error;
		}
		finally {
			await this.client.close();		//DIS-CONNECTING
		}
	}
	//פעולות יצירה - POST
	async Insert(collection, doc) {
		try {
			await this.client.connect();	//CONNECTING 
			return await this.client.db(this.db_name).collection(collection).insertOne(doc);
		} catch (error) {
			throw error;
		}
		finally {
			await this.client.close();		//DIS-CONNECTING
		}
	}
	//פעוולות עדכון - PUT
	async UpdateById(collection, id, doc) {
		try {
			await this.client.connect();	//CONNECTING 
			console.log(collection);
			return await this.client.db(this.db_name).collection(collection).updateOne(
				{ _id: new ObjectId(id) },
				{ $set: doc });

		} catch (error) {
			throw error;
		}
		finally {
			await this.client.close();		//DIS-CONNECTING
		}
	}
	async CountDocs(collection, query={}) {
		try {
			await this.client.connect();
			return await this.client.db(this.db_name).collection(collection).countDocuments(query);

		} catch (error) {
			throw (error);
		}
		finally {
			await this.client.close();
		}
	}
	//TODO: create a function that concatenate object to form a list
	//TODO: create a function that removes objects from a list
	//TODO: create an function that is cross-referncing from 6 different
}

module.exports = DB;

//"mongodb://localhost:27017"; //
