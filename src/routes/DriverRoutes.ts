import {Router} from "express";
import {
    getBalances,
    uploadKyc,
    withdrawBalance
} from "../controllers/DriverController";
import upload from "../configs/Upload";
import {param} from "express-validator";
import validate from "../middleware/validate";


const router: Router = Router();

router.post('/me/kyc/:type',
    [
        param('type', "type is invalid")
            .notEmpty()
            .isIn(["license", "selfie", "interior", "exterior", "pump"])
    ],
    validate,
    upload.single("file"),
    uploadKyc
);

router.get('/me/balance',
    getBalances
);

router.get('/me/withdraw',
    withdrawBalance
);


export default router;