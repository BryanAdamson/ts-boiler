import {Router} from "express";
import {getBalances} from "../controllers/DriverController";

const router: Router = Router();


router.get('/me/balance',
    getBalances);


export default router;