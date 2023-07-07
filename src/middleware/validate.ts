import e, {NextFunction, Request, Response} from "express";
import {Result, validationResult} from "express-validator";
import {sendError} from "../controllers/ResponseController";

const validate = (req: Request, res: Response, next: NextFunction): void | e.Response => {
    const errors: Result = validationResult(req)
    if (!errors.isEmpty()) {
        return sendError(
            res,
            "validation error",
            errors.mapped()
        );
    }

    return next();
}

export default validate;