import {Router} from "express";
import {getBalances, uploadKycIdentification, uploadKycLicense, withdrawBalance} from "../controllers/DriverController";
import upload from "../configs/Upload";


const router: Router = Router();

router.post('/me/kyc/license',
    upload.single("license"),
    uploadKycLicense
)

router.post('/me/kyc/identification',
    upload.single("identification"),
    uploadKycIdentification
)

router.get('/me/balance',
    getBalances
);

router.get('/me/withdraw',
    withdrawBalance
);


export default router;