import express, {Express} from "express";
import {cookieSecret} from "../utils/constants";
import cors from "cors";
import "./Passport";
import passport from "passport";
import session from "express-session";
import createMemoryStore from "memorystore";
import upload from "./Multer";
import routes from "../routes";

const app: Express = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors({origin: "*"}));

const MemoryStore = createMemoryStore(session)

app.use(session({
    secret: cookieSecret,
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
        checkPeriod: 86400000
    })
}));


app.use(passport.initialize());
app.use(passport.session());

app.use("/api", upload.any(), routes);

export default app;