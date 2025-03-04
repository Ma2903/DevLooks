import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();
const dbName = process.env.DATABASE;
const url = process.env.HOST;
const client = new MongoClient(url);

async function main() {
    await client.connect();
    console.log('Banco Conectado');
    const db = client.db(dbName);
    const collection = db.collection(process.env.COLLECTION);
    const data = await collection.find({}).toArray();
    return data;
}

export default  main 