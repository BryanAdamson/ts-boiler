import {Router} from "express";
import {AuthRoutes} from "./AuthRoutes";

class index {
    public route (routes: Router): Router {

        new AuthRoutes(routes);

        return routes;
    }
}

const Routes = new index().route;
export default Routes;