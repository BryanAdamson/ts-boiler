import {Router} from "express";
import {createOrder} from "../controllers/OrderController";
import {body} from "express-validator";
import mongoose from "mongoose";
import {isLatitude, isLongitude} from "class-validator";


const router: Router = Router();

router.post('',
    [
        body('deliveryLocation', "location is invalid")
            .notEmpty().withMessage("location is required")
            .isArray({min:2, max:2})
            .custom((value) => {
                isLongitude(value[0]) && isLatitude(value[1]);
            }),
        body('driver', "driver is invalid")
            .notEmpty().withMessage("driver is required")
            .custom(value => mongoose.isValidObjectId(value)),
        body('size', "size is invalid")
            .notEmpty().withMessage("size is required")
            .isNumeric(),
        body('price', "price is invalid")
            .notEmpty().withMessage("price is required")
            .isNumeric(),
        body('distance', "distance is invalid")
            .notEmpty().withMessage("distance is required")
            .isNumeric(),
        body('type', "type is invalid")
            .optional()
            .isIn(["personal", "friend"]),
    ],
    createOrder
)

export default router;