import mongoose from "mongoose";
import {MongoMemoryServer} from "mongodb-memory-server";

let mongo: MongoMemoryServer;

export const connectDatabase = async () => {
    mongo = await MongoMemoryServer.create();
    const url = mongo.getUri();

    await mongoose.connect(url);
};

export const dropDatabase = async () => {
    if (mongo) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongo.stop();
    }
};

export const clearDatabase = async () => {
    if (mongo) {
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany();
        }
    }
};