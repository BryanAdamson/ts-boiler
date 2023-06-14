import {Request, Response, Router} from "express";

const router = Router();

router.get(
    "/401",
    (req: Request, res: Response) => {
        return res.status(401).json({
            success: false,
            message: "unauthorized."
        });
    }
);

export default router;