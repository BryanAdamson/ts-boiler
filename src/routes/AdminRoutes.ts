import {Router} from "express";
import {getUsers, reinstateUser, suspendUser} from "../controllers/AdminController";
import validate from "../middleware/validate";
import {param} from "express-validator";
import mongoose from "mongoose";

const router: Router = Router();


router.get('/users/:id?',
    [
        param('id', "invalid id")
            .optional()
            .custom(value => mongoose.isValidObjectId(value)),
    ],
    validate,
    getUsers
)

router.post('/users/:id/suspend',
    [
        param('id', "invalid id")
            .custom(value => mongoose.isValidObjectId(value)),
    ],
    validate,
    suspendUser
)

router.post('/users/:id/reinstate',
    [
        param('id', "invalid id")
            .custom(value => mongoose.isValidObjectId(value)),
    ],
    validate,
    reinstateUser
)

export default router;