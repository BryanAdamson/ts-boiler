import {Router} from "express";
import {body, param, query} from "express-validator";
import validate from "../middleware/validate";
import passport from "passport";
import {forgotPassword, getToken, resetPassword, signIn, signUp} from "../controllers/AuthController";

const router = Router();

router.get(
    "/google/token",
    passport.authenticate("google-oauth-token"),
    getToken
);


// router.get("/google/callback",
//     passport.authenticate("google"),
//     (req: Request, res: Response) => {
//         res.redirect("/api/auth/user");
//     }
// );

router.post('/sign-up',
    [
        body('email', "email is invalid")
            .exists().withMessage("email is required")
            .isEmail()
            .trim()
            .toLowerCase(),
        body('password', "password is invalid")
            .exists().withMessage("password is required")
            .isStrongPassword()
            .trim(),
        body('passwordConfirmation', "passwordConfirmation is invalid.")
            .exists().withMessage("passwordConfirmation is required.")
            .isStrongPassword()
            .custom((value, { req}): boolean => {
                return value === req.body.password;
            })
            .trim(),
        body('type', "type is invalid")
            .exists().withMessage("type is required")
            .isIn(["customer", "driver"])
    ],
    validate,
    signUp
);

router.post(
    '/sign-in',
    [
        body('email', "email is invalid")
            .exists().withMessage("email is required")
            .isEmail()
            .trim()
            .toLowerCase(),
        body('password', "password is invalid")
            .exists().withMessage("password is required")
            .isStrongPassword()
            .trim()
    ],
    validate,
    signIn
);

router.get(
    '/forgot-password',
    [
        query('email', "email is invalid")
            .exists().withMessage("email is required")
            .isEmail()
            .trim()
            .toLowerCase(),
        query('redirectUrl', "redirectUrl is invalid")
            .exists().withMessage("redirectUrl is required")
            .isString()
            .trim()
            .toLowerCase()
    ],
    validate,
    forgotPassword
);

router.post(
    '/reset-password/:token',
    [
        param('token', "token is invalid")
            .exists().withMessage("token is required")
            .isJWT(),
        body('password', "password is invalid")
            .exists().withMessage("password is required")
            .isStrongPassword()
            .trim(),
        body('passwordConfirmation', "passwordConfirmation is invalid.")
            .exists().withMessage("passwordConfirmation is required.")
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