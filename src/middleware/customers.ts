import e, {NextFunction, Request, Response} from "express";
import {send403} from "../controllers/BaseController";
import {UserDocument} from "../models/User";
import UserType from "../enums/UserType";
import Customer, {CustomerDocument} from "../models/Customer";

const customers = async (req: Request, res: Response, next: NextFunction): Promise<e.Response|void> => {
    const user: UserDocument = req.user as UserDocument;
    if (user.type !== UserType.C) {
        return send403(res);
    }

    const customer: CustomerDocument | null = await Customer.findOne({user: user.id});
    if (!customer) {
        return send403(res);
    }

    return next();
};

export default customers;