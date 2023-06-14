import express, {Express} from "express";
import {cookieSecret, mongoURI, port} from "./utils/constants";
import mongoose from "mongoose";
import AuthRoutes from "./routes/AuthRoutes";
import "./configs/Passport";
import passport from "passport";
import ErrorRoutes from "./routes/ErrorRoutes";
import session from "express-session";

const app: Express = express();

app.use(session({
    secret: cookieSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(mongoURI, {})
    .then(() => console.log("mongodb is running."))
    .catch(e => console.error(e));


app.use("/", ErrorRoutes);
app.use("/api/auth", AuthRoutes);


app.listen(port, () => {
    console.log("app listening on port: " + port);
});
