import express, {Express} from "express";
import {cookieSecret, mongoURI, port} from "./utils/constants";
import cors from "cors";
import mongoose from "mongoose";
import "./configs/Passport";
import passport from "passport";
import session from "express-session";
import createMemoryStore from "memorystore";
import upload from "./configs/Multer";
import routes from "./routes";

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

mongoose.connect(mongoURI, {})
    .then(() => console.log("mongodb is running."))
    .catch(e => console.error(e));

app.use("/", upload.any(), routes);

app.listen(port, () => {
    console.log("app is running on port: " + port);
});
