import e, {NextFunction, Request, Response} from "express";
import {Result, ResultFactory, validationResult} from "express-validator";

const validate = (req: Request, res: Response, next: NextFunction): void | e.Response => {
    const hmValidationResult: ResultFactory<string> = validationResult.withDefaults({
        formatter: error => error.msg
    });

    const errors: Result = hmValidationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "validation error.",
            error: errors.array()
        });
    }

    return next();
}

export default validate;