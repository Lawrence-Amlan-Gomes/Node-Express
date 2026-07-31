// This is the db.js file for the "MongoConnectionAndDocuments" mini-project.
// What this file does: it opens ONE real, shared connection to the real
// MongoDB Atlas cluster, and remembers this mini-project's own dedicated
// collection name. Every other file (the controller) asks THIS file for
// the collection, instead of opening their own separate connection.
const { MongoClient } = require("mongodb"); // Load the "mongodb" library, the tool we use to talk to MongoDB directly

const client = new MongoClient(process.env.MONGODB_DATABASE_URL); // Open one real, reusable client pointed at the real Atlas cluster address saved in .env
const COLLECTION_NAME = process.env.MONGO_COLLECTION; // Read this mini-project's own dedicated collection name from .env

function getCollection() { // A small helper other files call to get the one real, dedicated collection
  return client.db().collection(COLLECTION_NAME); // Ask the client for the database named in the connection string, then this one real collection inside it
}

module.exports = { client, getCollection }; // Share the client and the getCollection helper so other files in this folder can use them
