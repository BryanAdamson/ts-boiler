import Server from "./configs/Server";

Server.express.listen(5000, (): void => {
    console.log("server started successfully.");
});
