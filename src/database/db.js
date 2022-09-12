import { MongoClient } from "mongodb";

const mongoClient = new MongoClient ('mongodb://localhost:27017');

try {
    await mongoClient.connect();
} catch (error) {
    console.log(error.message);
}

const db = mongoClient.db('myWallet');

export default db;