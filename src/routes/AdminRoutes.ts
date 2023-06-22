import {Router} from "express";
import {getUsers, reinstateUser, sendUserEmail, suspendUser, updateUser} from "../controllers/AdminController";
import validate from "../middleware/validate";
import {body, param} from "express-validator";
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

router.post('/users/:id/mails',
    [
        param('id', "invalid id")
            .custom(value => mongoose.isValidObjectId(value)),
        body('subject', "subject is invalid")
            .notEmpty().withMessage("subject is required")
            .isString(),
        body('body', "body is invalid")
            .notEmpty().withMessage("body is required")
            .isString(),
    ],
    validate,
    sendUserEmail
)

router.patch(
    "/users/:id",
    [
        body('displayName', "invalid displayName")
            .optional()
            .isString(),
        body('gender', "invalid gender")
            .optional()
            .isIn(["male", "female"]),
        body('email', "invalid email")
            .optional()
            .isEmail(),
        body('phoneNo', "invalid phoneNo")
            .optional()
            .isMobilePhone("any"),
        body('password', "invalid password")
            .optional()
            .isStrongPassword(),
    ],
    validate,
    updateUser
);

export default router;