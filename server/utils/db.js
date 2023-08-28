const { MongoClient, ObjectId } = require('mongodb');		//rList1_user  //ouzQZL4j8sZrdUJT

class DB {
	db_uri;
	db_name;
	client;

	constructor() {
		this.db_uri = "mongodb+srv://rList1_user:ouzQZL4j8sZrdUJT@cluster0.aykx1sy.mongodb.net/?retryWrites=true&w=majority";
		this.db_name = "_recycliST";
		this.client = new MongoClient(this.db_uri)
	}


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

}

module.exports = DB;


//"mongodb://localhost:27017"; //





db.users.updateMany(
	{}, 
	{ $rename: { "residence.add1": "residence.street" } }
  );
  