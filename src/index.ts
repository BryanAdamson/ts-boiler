import express, {Express} from "express";
import {cookieSecret, mongoURI, port} from "./utils/constants";
import mongoose from "mongoose";
import AuthRoutes from "./routes/AuthRoutes";
import "./configs/Passport";
import passport from "passport";
import ErrorRoutes from "./routes/ErrorRoutes";
import session from "express-session";
import UserRoutes from "./routes/UserRoutes";
import CustomerRoutes from "./routes/CustomerRoutes";
import OrderRoutes from "./routes/OrderRoutes";
import customers from "./middleware/customers";
import authenticate from "./middleware/authenticate";
import MongoStore from "connect-mongo";


const app: Express = express();

app.use(session({
    secret: cookieSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
    store: new MongoStore({
        mongoUrl: mongoURI
    })
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(mongoURI, {})
    .then(() => console.log("mongodb is running."))
    .catch(e => console.error(e));


app.use("/api/errors", ErrorRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/users", authenticate, UserRoutes);
app.use("/api/customers", authenticate, customers, CustomerRoutes);
app.use("/api/orders", authenticate, customers, OrderRoutes);



app.listen(port, () => {
    console.log("app listening on port: " + port);
});
