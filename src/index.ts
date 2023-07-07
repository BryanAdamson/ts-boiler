import express, {Express} from "express";
import {cookieSecret, mongoURI, port} from "./utils/constants";
import mongoose from "mongoose";
import AuthRoutes from "./routes/AuthRoutes";
import "./configs/Passport";
import passport from "passport";
import ErrorRoutes from "./routes/ErrorRoutes";
import UserRoutes from "./routes/UserRoutes";
import authenticate from "./middleware/authenticate";
import session from "express-session";
import createMemoryStore from "memorystore";

const app: Express = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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


app.use("/api/errors", ErrorRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/users", authenticate, UserRoutes);


app.listen(port, () => {
    console.log("app is running on port: " + port);
});
