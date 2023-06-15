import {Router} from "express";
import authenticate from "../middleware/authenticate";
import {getMe, updateMyInfo, startMobileVerification, endMobileVerification} from "../controllers/UserController";
import validate from "../middleware/validate";
import {body} from "express-validator";

const router: Router = Router();


router.get(
    "/me",
    authenticate,
    getMe
);

router.patch(
    "/me",
    authenticate,
    [
        body('displayName', "invalid displayName")
            .optional()
            .isString(),
        body('gender', "invalid gender")
            .optional()
            .isIn(["male", "female"]),
    ],
    validate,
    updateMyInfo
);

router.get(
    "/me/verify-phone",
    authenticate,
    [
        body('phoneNo', "phoneNo is invalid")
            .notEmpty().withMessage("phoneNo is required")
            .isMobilePhone("any"),
    ],
    validate,
    startMobileVerification
);

router.get(
    "/me/check-otp",
    authenticate,
    [
        body('otp', "otp is invalid")
            .notEmpty().withMessage("otp is required")
            .isNumeric()
            .isLength({
                min: 4,
                max: 4
            })
    ],
    validate,
    endMobileVerification
);


export default router;