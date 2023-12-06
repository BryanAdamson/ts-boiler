import app from "./configs/App";
import {mongoURI, port} from "./utils/constants";
import mongoose from "mongoose";

mongoose.connect(mongoURI, {})
    .then(() => console.log("mongodb is running."))
    .catch(e => console.error(e));

app.listen(port, () => {
    console.log("app is running on port: " + port);
});
