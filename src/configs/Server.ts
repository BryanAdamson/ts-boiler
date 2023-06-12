import express, {Express, Router} from "express";
import cors from "cors";
import Database from "./Database";
import Routes from "../routes";

class Server {
    public express: Express;

    constructor() {
        this.express = express();
        this.initializeDatabase();
        this.initializeRoutes()
    }

    private initializeDatabase(): void
    {
        Database.init().then(():null => null);
    }

    private initializeRoutes(): void
    {
        const corsOptions: {
            credentials: boolean;
            origin: string;
            optionSuccessStatus: number
        } = {
            origin: '*',
            credentials: true,
            optionSuccessStatus: 200,
        }

        const router: Router = express.Router();

        this.express.use(cors(corsOptions));
        this.express.use(express.urlencoded({
            extended: false
        }));
        this.express.use(express.json());
        this.express.use("/api/", cors(), Routes(router));

    }
}

export default new Server();