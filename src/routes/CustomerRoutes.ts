import {Router} from "express";
import authenticate from "../middleware/authenticate";
import customers from "../middleware/customers";
import {addMyLocations, getMyLocations, updateMyLocation} from "../controllers/CustomerController";
import validate from "../middleware/validate";
import {body, param} from "express-validator";
import mongoose from "mongoose";

const router: Router = Router();


router.post('/me/locations',
    authenticate,
    customers,
    [
        body('address', "address is invalid")
            .notEmpty().withMessage("address is required")
            .isString(),
        body('city', "city is invalid")
            .notEmpty().withMessage("city is required")
            .isString(),
        body('name', "name is invalid")
            .notEmpty().withMessage("name is required")
            .isString(),
        body('tankSize', "tankSize is invalid")
            .notEmpty().withMessage("tankSize is required")
            .isNumeric(),
        body('latitude', "latitude is invalid")
            .notEmpty().withMessage("latitude is required")
            .isFloat(),
        body('longitude', "longitude is invalid")
            .notEmpty().withMessage("longitude is required")
            .isFloat(),
    ],
    validate,
    addMyLocations
)

router.get('/me/locations',
    authenticate,
    customers,
    getMyLocations
)

router.get('/me/locations/:locationId',
    authenticate,
    customers,
    [
        param('locationId', "locationId is invalid")
            .custom(value => mongoose.isValidObjectId(value)),
        body('address', "address is invalid")
            .optional()
            .isString(),
        body('city', "city is invalid")
            .optional()
            .isString(),
        body('name', "name is invalid")
            .optional()
            .isString(),
        body('tankSize', "tankSize is invalid")
            .optional()
            .isNumeric(),
        body('latitude', "latitude is invalid")
            .optional()
            .isFloat(),
        body('longitude', "longitude is invalid")
            .optional()
            .isFloat(),
    ],
    validate,
    updateMyLocation
)


export default router;