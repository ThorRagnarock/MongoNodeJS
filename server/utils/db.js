const { MongoClient, ObjectId } = require('mongodb');		//rList1_user  //ouzQZL4j8sZrdUJT
const { ObjectId } = require('mongodb');

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
		} finally {
			await this.client.close();		//DIS-CONNECTING
		}
	}
	async FindOne(collection, query = {}, project = {}) {
		try {
			await this.client.connect();	//CONNECTING 
			return await this.client.db(this.db_name).collection(collection).findOne(query, project);
		} catch (error) {
			throw error;
		} finally {
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
		} finally {
			await this.client.close();
		}
	}

	async Delete(collection, itemId) { //delete a single item
		try {
			await this.client.connect();
			let filter = { _id: new ObjectId(itemId) };
			return this.client.db(this.db_name).collection(collection).deleteOne(filter);
		} catch (error) {
			throw(error)
		} finally {
			await this.client.close();
		}
	}
	async Drop(collection) {
		try {
			await this.client.connect();
			return this.client.db(this.db_name).collection(collection).drop();
		} catch (error) {
			throw (error);
		} finally {
			await this.client.close();
		}
	}
	//פעוולות עדכון - PUT
	async UpdateById(collection, id, doc) {  //updating USER fields 
		try {
			await this.client.connect();	//CONNECTING 
			console.log(collection);
			return await this.client.db(this.db_name).collection(collection).updateOne(
				{ _id: new ObjectId(id) },
				{ $set: doc });
		} catch (error) {
			throw error;
		} finally {
			await this.client.close();		//DIS-CONNECTING
		}
	}

	async CreateCollection(collection) {
		try {
			await this.client.connect();
			return await this.client.db(this.db_name).createCollection(collection, { capped: true, max: 64 });
		} catch (error) {
			throw (error);
		} finally {
			await this.client.close();
		}
	}
	async CountDocs(collection, query = {}) {
		try {
			await this.client.connect();
			return await this.client.db(this.db_name).collection(collection).countDocuments(query);
		} catch (error) {
			throw (error);
		} finally {
			await this.client.close();
		}
	}

	async Aggregation(collection, agg) {
		try {
			await this.client.connect();
			return await this.client.db(this.db_name).collection(collection).aggregate(agg).toArray();
		} catch (error) {
			throw (error);
		} finally {
			await this.client.close();
		}
	}
	async RenameCollection(oldCollectionName, newCollectionName) {
		try {
			await this.client.connect();
			const db = this.client.db(this.db_name);
			const collection = db.collection(oldCollectionName)
			await collection.renameCollection(newCollectionName);
		} catch (error) {
			throw (error);
		} finally {
			await this.client.close();
		}
	}
	async DuplicateCollection(originCollectionName, newExt) {
		let userId;
		const originCollection = this.client.db(this.db_name).collection(originCollectionName);
		const docs = await this.FindAll(originCollectionName);

		const newColName = new ObjectId().toString(); //(new id)

		const headerDoc = await this.FindOne(originCollection,{ isHeader: true });
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


	//async AppendListItem()


	//DONE : create a function that concatenate object to form a list // I am not sure if I have a need for that anymore... (both in the list and both in the item level)
	//DONE: create a function that removes objects from a list (both in the list and both in the item level)
	//DONE? create an function that is cross-referncing from 6 different (I am pretty sure I got that one with agg)

	//DONE: Create a listing header
}
module.exports = DB;

//"mongodb://localhost:27017"; //