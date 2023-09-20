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

	async Drop(collection) {
		try {
			await this.client.connect();
			return this.client.db(this.db_name).collection(collection).drop();
		} catch (error) {
			throw(error);
		}
		finally {
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
		}
		finally {
			await this.client.close();		//DIS-CONNECTING
		}
	}
	async CountDocs(collection, query = {}) {
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

	async Aggregation(collection, agg) {
		try {
			await this.client.connect();
			return await this.client.db(this.db_name).collection(collection).aggregate(agg).toArray();
		} catch (error) {
			throw(error);
		}
		finally{
			await this.client.close();
		}
	}

	async AddCollection(listingHeader) {	//to be used with listings
		try {
			await this.client.connect();
			const tempName = `temporaryListing`;
			const tempColName = await this.client.db(this.db_name).createCollection(tempName);
			// const tempCollection =  this.client.db.collection(tempName);
			const result = await tempColName.insertOne(listingHeader);
			const headerID = result.insertedId;
			const updatedColName = `listing_${headerID}`;
			await this.client.db(this.db_name).renameCollection(tempColName, updatedColName);
		} catch (error) {
			throw (error);
		} finally {
			await this.client.close();
		}
	}

	//async AppendListItem()


	//TODO: create a function that concatenate object to form a list // I am not sure if I have a need for that anymore...
	//TODO: create a function that removes objects from a list
	//DONE? create an function that is cross-referncing from 6 different (I am pretty sure I got that one with agg)

	//TODO: Create a listing header
}
module.exports = DB;

//"mongodb://localhost:27017"; //
