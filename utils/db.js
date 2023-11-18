const { MongoClient, ObjectId } = require('mongodb');	
// all the details are in the .env
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
	//פעולות שליפה - GETtoggleParam
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
			// console.log("just the tip...",collection,", ", doc,".");
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
			await this.client.db(this.db_name).collection(collection).deleteOne(filter);
			return { status: 'success', message: `Successfully deleted item: ${itemId}` };
		} catch (error) {
			throw (error)
		} finally {
			await this.client.close();
		}
	}
	async Drop(collection) {
		try {
			await this.client.connect();
			await this.client.db(this.db_name).collection(collection).drop();
			return { status: 'success', message: `Successfully dropped collection: ${collection}` };

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
			// console.log(collection);
			return await this.client.db(this.db_name).collection(collection).updateOne(
				{ _id: new ObjectId(id) },
				{ $set: doc });
		} catch (error) {
			throw error;
		} finally {
			await this.client.close();		//DIS-CONNECTING
		}
	}

	//collectionName -> headerId, pushedValue (what about parameter???)
	async PushById(collection, id, field, item) {
		try {
			await this.client.connect();
			return await this.client.db(this.db_name).collection(collection).updateOne(
				{ _id: new ObjectId(id) },
				{ $push: { [field]: item } }
			);
		} catch (error) {
			throw error;
		} finally {
			await this.client.close();
		}
	}

	async PullById(collection, id, field, item) {
		try {
			await this.client.connect(); 
			return await this.client.db(this.db_name).collection(collection).updateOne(
				{ _id: new ObjectId(id) },
				{ $pull: { [field]: item } }
			);
		} catch (error) {
			throw error;
		} finally {
			await this.client.close();
		}
	}

	async CreateCollection(collection) {
		//no need to open conenction since the func calling it already opened.. I think
		try {
			await this.client.connect();

			console.log(`Creating collection ${collection}`);
			const db = this.client.db(this.db_name);
			if (!await db.listCollections({ name: collection }).hasNext()) {
				await db.createCollection(collection);
			}
			// const result = await this.client.db(this.db_name).createCollection(collection,);
			// return result;
		} catch (error) {
			if (error.code === 48) { // 48 is NamespaceExists
				console.log(`Collection ${collection} already exists. Proceeding...`);
			}
			else throw(error);
		}
	}
	async CountDocs(collection, query = {}) {
		try {
			await this.client.connect();
			console.log("countDocs is connected");
			const result = await this.client.db(this.db_name).collection(collection).countDocuments(query);
			console.log("result: ", result);
			return result;
		} catch (error) {
			console.log(error);
			throw (error);
		} finally {
			await this.client.close();
		}
	}

	async CountListings(userID) {
		try {
			await this.client.connect();
			let count = 0;
			// console.log("CountListings... tra lala");
			const listings = await this.client.db(this.db_name).collections();
			// console.log("here listings: ", listings);
			for (let listing of listings) {
				let headerFiles = await listing.countDocuments({ isHeader: true, userID: userID });
				// console.log("in for loop..");
				if (headerFiles > 0) { count++ }
				else return 0;
			} 
			return count;
		} catch (error) {
			throw (error);
		}finally {
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
	async AggregateUserSearchListings(userID, searchString) {
		console.log("DB's aggregate for search...");
		const agg = [
			{ $match: { _id: ObjectId(userID) } },
			{ $unwind: "$shoppingLists" },
			{
				$lookup: {
					from: "shoppingList",
					localField: "shoppingLists",
					foreignField: "_id",
					as: "listDetails"
				}
			},
		];
		if (searchString && searchString !== '*') {
			agg.push({
				$match: { "listDetails.listName": { $regex: searchString, $options: 'i' } }
			});
		}
		agg.push({ $project: { "listDetails": 1 } });
		// { $match: { "listDetails.listName": { $regex: searchString, $options: 'i' } } },
		// { $project: { "listDetails": 1 } }
		try {
			await this.client.connect();
			return await this.client.db(this.db_name).collection('users').aggregate(agg).toArray();

		} catch (error) {
			throw (error);
		} finally {
			await this.client.close();
		}
	}
	async RenameCollection(oldCollectionName, newCollectionName) {
		try {
			console.log("old col. name:", oldCollectionName, ", new col name:", newCollectionName);

			await this.client.connect();
			await this.client.db(this.db_name).collection(oldCollectionName).rename(newCollectionName);

		} catch (error) {
			throw (error);
		} finally {
			await this.client.close();
		}
	}
	async DuplicateCollection(originCollectionName, newExt) {
		let userID;
		console.log("\n\nNow inside the DB()");
		console.log("originCollectionName: ",originCollectionName);

		const docs = await this.FindAll(originCollectionName);
		const newColName = new ObjectId().toString(); //(new id)

		const headerDoc = await this.FindOne(originCollectionName, { isHeader: true });
		

		if (headerDoc) {
			userID = headerDoc.userID;
			headerDoc.listName = `${headerDoc.listName}${newExt.listNameExtension}`;
			docs[0] = headerDoc;

		}
		console.log("NEW headerDoc is: ",headerDoc);

		const duplicatedCollectionName = `${newColName}_${newExt.listNameExtension}`;
		const duplicateCollection = this.client.db(this.db_name).collection(duplicatedCollectionName);

		await this.client.connect();	//CONNECTING 
		await duplicateCollection.insertMany(docs);
		await this.client.close();

		console.log(`Duplicated ${originCollectionName} to ${duplicatedCollectionName} with new listName`);
		return duplicateCollection;
	}
}
module.exports = DB;

