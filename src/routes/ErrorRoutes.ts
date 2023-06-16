import {Request, Response, Router} from "express";
import {send401, send403, send404, send500, sendError} from "../controllers/BaseController";

const router = Router();


router.get(
    '/400',
    (req: Request, res: Response) => {
        return sendError(
            res,
            "validation error",
            {
                fieldName1: {
                    type: "someType",
                    value: "someValue",
                    msg: "fieldName1 is invalid",
                    path: "fieldName1",
                    location: "someLocation"
                },
                fieldName2: {
                    type: "someType",
                    value: "someValue",
                    msg: "fieldName2 is invalid",
                    path: "fieldName2",
                    location: "someLocation"
                }
            }
        );
    }
);

router.get(
    "/401",
    (req: Request, res: Response) => {
        return send401(res);
    }
);

router.get(
    '/403',
    (req: Request, res: Response) => {
        return send403(res);
    }
);

router.get(
    '/404',
    (req: Request, res: Response) => {
        return send404(res);
    }
);

router.get(
    '/500',
    (req: Request, res: Response) => {
        return send500(res, {});
    }
);


export default router;