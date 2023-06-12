import {Router} from "express";
import AuthController from "../controllers/AuthController";
import {body} from "express-validator";
import validate from "../middleware/validate";

export class AuthRoutes {
    public route: Router;

    constructor(route: Router) {
        this.route = route;
        this.route.use("/auth", this.routes());
    }

    public routes (): Router
    {
        const route: Router = this.route;

        route.post('/sign-up',
            [
                body('firstName', "invalid firstName")
                    .exists().withMessage("firstName is required"),
                body('lastName', "invalid lastName")
                    .exists().withMessage("lastName is required"),
                body('email', "invalid email")
                    .exists().withMessage("email is required")
                    .isEmail(),
                body('password', "invalid password")
                    .exists().withMessage("password is required")
                    .isStrongPassword(),
                body('type', "invalid type")
                    .exists().withMessage("type is required")
                    .isIn(["rider", "driver"])
            ],
            validate,
            AuthController.signUp
        );
        route.post('/sign-in',
            [
                body('email', "invalid email")
                    .exists().withMessage("email is required")
                    .isEmail(),
                body('password', "invalid password")
                    .exists().withMessage("password is required")
                    .isStrongPassword()
            ],
            validate,
            AuthController.signIn
        );

        return route;

    }
}