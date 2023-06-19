import e, {NextFunction, Request, Response} from "express";
import {send403} from "../controllers/BaseController";
import {UserDocument} from "../models/User";
import UserType from "../enums/UserType";

const admins = async (req: Request, res: Response, next: NextFunction): Promise<e.Response|void> => {
    const user: UserDocument = req.user as UserDocument;
    if (user.type !== UserType.A) {
        return send403(res);
    }

    return next();
};

export default admins;