import e, {NextFunction, Request, Response} from "express";
import {send403} from "../controllers/BaseController";
import {UserDocument} from "../models/User";
import UserType from "../enums/UserType";
import Driver, {DriverDocument} from "../models/Driver";

const drivers = async (req: Request, res: Response, next: NextFunction): Promise<e.Response|void> => {
    const user: UserDocument = req.user as UserDocument;
    if (user.type !== UserType.D) {
        return send403(res);
    }

    const driver: DriverDocument | null = await Driver.findOne({user: user.id});
    if (!driver) {
        return send403(res);
    }

    return next();
};

export default drivers;