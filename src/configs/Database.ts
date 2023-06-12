import {DataSource} from "typeorm";

class Database {
    public async init(): Promise<DataSource>
    {
        try{
            const connection: DataSource = await new DataSource({
                type: "mongodb",
                database: "aquayar",
                synchronize: true,
                logging: false,
                entities: [
                    "src/entities/**/*ts"
                ],
                migrations: [
                    "src/migrations/**/*ts"
                ],
                subscribers: [],
            }).initialize();

            console.log("mongodb is running.");

            return connection;
        } catch (e) {
            console.error(e);
            throw new Error("error during mongodb initialization");
        }
    }
}

export default new Database();