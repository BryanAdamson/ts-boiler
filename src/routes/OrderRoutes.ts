import {Router} from "express";
import {
    acceptOrder,
    cancelOrder,
    completeOrder,
    createOrder,
    getOrder, payForOrder,
    rejectOrder
} from "../controllers/OrderController";
import {body, param} from "express-validator";
import mongoose from "mongoose";
import {isLatitude, isLongitude} from "class-validator";
import customers from "../middleware/customers";
import validate from "../middleware/validate";
import drivers from "../middleware/drivers";


const router: Router = Router();

router.post('/',
    customers,
    [
        body('driver', "driver is invalid")
            .notEmpty().withMessage("driver is required")
            .custom(value => mongoose.isValidObjectId(value)),
        body('latitude', "latitude is invalid")
            .notEmpty().withMessage("latitude is required")
            .custom(value => isLatitude(value)),
        body('longitude', "longitude is invalid")
            .notEmpty().withMessage("longitude is required")
            .custom(value => isLongitude(value)),
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
    validate,
    createOrder
)

router.get('/:orderId',
    [
        param('orderId', "orderId is invalid")
            .notEmpty().withMessage("orderId is required")
            .custom(value => mongoose.isValidObjectId(value)),
    ],
    validate,
    getOrder
)

router.post('/:orderId/accept',
    drivers,
    [
        param('orderId', "orderId is invalid")
            .notEmpty().withMessage("orderId is required")
            .custom(value => mongoose.isValidObjectId(value)),
    ],
    validate,
    acceptOrder
)

router.post('/:orderId/reject',
    drivers,
    [
        param('orderId', "orderId is invalid")
            .notEmpty().withMessage("orderId is required")
            .custom(value => mongoose.isValidObjectId(value)),
    ],
    validate,
    rejectOrder
)

router.post('/:orderId/cancel',
    customers,
    [
        param('orderId', "orderId is invalid")
            .notEmpty().withMessage("orderId is required")
            .custom(value => mongoose.isValidObjectId(value)),
    ],
    validate,
    cancelOrder
)

router.post('/:orderId/complete',
    drivers,
    [
        param('orderId', "orderId is invalid")
            .notEmpty().withMessage("orderId is required")
            .custom(value => mongoose.isValidObjectId(value)),
    ],
    validate,
    completeOrder
)

router.post('/:orderId/pay',
    customers,
    [
        param('orderId', "orderId is invalid")
            .notEmpty().withMessage("orderId is required")
            .custom(value => mongoose.isValidObjectId(value)),
    ],
    validate,
    payForOrder
)

export default router;