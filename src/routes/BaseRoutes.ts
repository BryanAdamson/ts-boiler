import {Router} from "express";
import {verifyOrderPayment} from "../controllers/OrderController";

const router: Router = Router();

router.get('/orders/verify',
    verifyOrderPayment
);

export default router;