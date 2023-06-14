import {Router} from "express";
import authenticate from "../middleware/authenticate";
import {getMe, updateMyInfo} from "../controllers/UserController";
import validate from "../middleware/validate";
import {body} from "express-validator";
import {startMobileVerification} from "../controllers/AuthController";

const router = Router();

router.get(
    "/me",
    authenticate,
    getMe
);

router.patch(
    "/me/info",
    authenticate,
    [
        body('displayName', "invalid displayName")
            .optional()
            .isString(),
        body('gender', "invalid gender")
            .optional()
            .isIn(["male", "female", null]),
    ],
    validate,
    updateMyInfo
);

router.post(
    "/me/locations",
    authenticate,
    [
        body('address', "address is invalid")
            .exists().withMessage("address is required")
            .isString(),
        body('city', "city is invalid")
            .exists().withMessage("city is required")
            .isIn(["male", "female", null]),
        body('name', "name is invalid")
            .optional()
            .isString(),
        body('tankSize', "tankSize is invalid")
            .optional()
            .isString(),
    ],
    validate,
    updateMyInfo
);

router.post(
    "/me/verify-phone",
    authenticate,
    [
        body('phoneNo', "phoneNo is invalid")
            .exists().withMessage("phoneNo is required")
            .isMobilePhone("any"),
    ],
    validate,
    startMobileVerification
);

export default router;