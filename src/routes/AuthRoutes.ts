import {Router} from "express";
import {body, param} from "express-validator";
import validate from "../middleware/validate";
import {
    forgotPassword,
    resetPassword,
    signIn,
    signInWithGoogle,
    signUp,
    signUpWithGoogle,
    verifyOTP
} from "../controllers/AuthController";


const router: Router = Router();

router.post('/sign-up/google',
    [
        body('profileId', "profileId is invalid")
            .notEmpty().withMessage("profileId is required")
            .trim(),
        body('email', "email is invalid")
            .notEmpty().withMessage("email is required")
            .isEmail()
            .trim()
            .toLowerCase(),
        body('displayName', "displayName is invalid")
            .notEmpty().withMessage("displayName is required")
            .trim(),
        body('type', "type is invalid")
            .optional()
            .isIn(["customer", "driver"])
    ],
    validate,
    signUpWithGoogle
);

router.post('/sign-up',
    [
        body('email', "email is invalid")
            .notEmpty().withMessage("email is required")
            .isEmail()
            .trim()
            .toLowerCase(),
        body('password', "password is invalid")
            .notEmpty().withMessage("password is required")
            .isStrongPassword()
            .trim(),
        body('type', "type is invalid")
            .optional()
            .isIn(["basic", "admin"])
    ],
    validate,
    signUp
);

router.post('/sign-in/google',
    [
        body('profileId', "profileId is invalid")
            .notEmpty().withMessage("profileId is required")
            .isString()
            .trim()
    ],
    validate,
    signInWithGoogle
);

router.post(
    '/sign-in',
    [
        body('email', "email is invalid")
            .notEmpty().withMessage("email is required")
            .isEmail()
            .trim()
            .toLowerCase(),
        body('password', "password is invalid")
            .notEmpty().withMessage("password is required")
            .isStrongPassword()
            .trim()
    ],
    validate,
    signIn
);

router.post(
    '/forgot-password',
    [
        body('email', "email is invalid")
            .notEmpty().withMessage("email is required")
            .isEmail()
            .trim()
            .toLowerCase(),
    ],
    validate,
    forgotPassword
);

router.post(
    "/verify-otp",
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
    verifyOTP
);

router.post(
    '/reset-password/:token',
    [
        param('token', "token is invalid")
            .notEmpty().withMessage("token is required")
            .isJWT(),
        body('password', "password is invalid")
            .notEmpty().withMessage("password is required")
            .isStrongPassword()
            .trim(),
        body('passwordConfirmation', "passwordConfirmation is invalid.")
            .notEmpty().withMessage("passwordConfirmation is required.")
            .isStrongPassword()
            .custom((value, { req}): boolean => {
                return value === req.body.password;
            })
            .trim(),
    ],
    validate,
    resetPassword
)


export default router;