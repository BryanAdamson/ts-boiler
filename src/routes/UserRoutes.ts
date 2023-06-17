import {Router} from "express";
import {getMe, updateMyInfo, startMobileVerification, endMobileVerification} from "../controllers/UserController";
import validate from "../middleware/validate";
import {body} from "express-validator";

const router: Router = Router();


router.get(
    "/me",
    getMe
);

router.patch(
    "/me",
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

router.post(
    "/me/verify-phone",
    [
        body('phoneNo', "phoneNo is invalid")
            .notEmpty().withMessage("phoneNo is required")
            .isMobilePhone("any"),
    ],
    validate,
    startMobileVerification
);

router.post(
    "/me/check-otp",
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