import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();
const dbName = process.env.DATABASE;
const url = process.env.HOST;


export class DataMongoManager{
    private collection: any;

    constructor(collectionName: string) {
        const client = new MongoClient(url);
        client.connect().then(() => {
            const db = client.db(dbName);
            this.collection = db.collection(collectionName);
        });
    }

    async buscar(query : any){
        const data = await this.collection.find(query).toArray();
        return data;
    }
}

export default DataMongoManager;