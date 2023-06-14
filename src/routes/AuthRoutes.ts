import {Router} from "express";
import {body} from "express-validator";
import validate from "../middleware/validate";
import passport from "passport";
import {getToken, signIn, signUp} from "../controllers/AuthController";

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
        body('displayName', "invalid firstName")
            .exists().withMessage("displayName is required"),
        body('email', "invalid email")
            .exists().withMessage("email is required")
            .isEmail(),
        body('password', "invalid password")
            .exists().withMessage("password is required")
            .isStrongPassword(),
        body('type', "invalid type")
            .exists().withMessage("type is required")
            .isIn(["customer", "driver"])
    ],
    validate,
    signUp
);

router.post(
    '/sign-in',
    [
        body('email', "invalid email")
            .exists().withMessage("email is required")
            .isEmail(),
        body('password', "invalid password")
            .exists().withMessage("password is required")
            .isStrongPassword()
    ],
    validate,
    signIn
);


export default router;