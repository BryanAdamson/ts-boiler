import {Router} from "express";
import authenticate from "../middleware/authenticate";
import {getMe} from "../controllers/UserController";

const router = Router();

router.get(
    "/me",
    authenticate,
    getMe
);