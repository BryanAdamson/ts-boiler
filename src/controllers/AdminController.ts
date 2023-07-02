import e, {Request, Response} from "express";
import User, {UserDocument} from "../models/User";
import UserType from "../enums/UserType";
import {send404, send500, sendResponse} from "./BaseController";
import Customer, {CustomerDocument} from "../models/Customer";
import Driver, {DriverDocument} from "../models/Driver";
import Order, {OrderDocument} from "../models/Order";
import {sendMail} from "../utils/helpers";
import {aquayarPercentage} from "../utils/constants";

export const getUsers = async (req: Request, res: Response) => {
    const fields: string[] = ["displayName", "email", "gender", "type", "phoneNo", "isSuspended"];

    const users: UserDocument[] | UserDocument | null = req.params.id ?
        await User.findOne({
            $and: [
                {_id: req.params.id},
                {
                    $nor: [
                        {type: UserType.A},
                    ]
                }
            ]
        }, fields) :
        await User.find({
            $nor: [
                {type: UserType.A},
            ]
        }, fields);

    if (!users) {
        return send404(res);
    }

    let user: any;
    if (!(users instanceof Array)) {
        const orders: OrderDocument[] | null = await Order.find({
            $or: [
                {"customer.id": users.id},
                {driver: users.id}
            ]
        });

        user = {
            id: users.id,
            displayName: users.displayName,
            email: users.email,
            gender: users.gender,
            type: users.type,
            phoneNo: !users.otp?.isValid ? users.phoneNo : null,
            isSuspended: users.isSuspended,
            orders: orders,
            auxInfo: {}
        }

        let temp: CustomerDocument | DriverDocument | null = null;
        if (users.type === UserType.C) {
            temp = await Customer.findOne({user: users.id}, ["locations"]);
            user.auxInfo = {
                locations: (temp as CustomerDocument).locations
            };
        }

        if (users.type === UserType.D) {
            temp = await Driver.findOne({user: users.id}, ["location", "balance", "kyc"]);

            const debitBalance: number = ((temp as DriverDocument).balance as number) * (aquayarPercentage/100);

            user.auxInfo = {
                kyc: (temp as DriverDocument).kyc,
                debitBalance: debitBalance,
                availableBalance: ((temp as DriverDocument).balance as number) - debitBalance
            };
        }
    }

    return sendResponse(
        res,
        "user(s) fetched",
        user || users
    );
}

export const suspendUser = async (req: Request, res: Response): Promise<e.Response> => {
    const user: UserDocument | null = await User.findById(req.params.id,["type", "isSuspended"]);
    if (!user || user.type === UserType.A) {
        return send404(res);
    }

    try {
        user.isSuspended = true;
        await user.save();

        return sendResponse(
            res,
            'user suspended'
        )
    } catch (e) {
        return send500(res, e);
    }
}

export const reinstateUser = async (req: Request, res: Response): Promise<e.Response> => {
    const user: UserDocument | null = await User.findById(req.params.id,["type", "isSuspended"]);
    if (!user || user.type === UserType.A) {
        return send404(res);
    }

    try {
        user.isSuspended = false;
        await user.save();

        return sendResponse(
            res,
            'user reinstated'
        )
    } catch (e) {
        return send500(res, e);
    }
}

export const sendUserEmail = async (req: Request, res: Response): Promise<e.Response> => {
    const {id} = req.params;

    const user: UserDocument | null = await User.findById(id);
    if (!user || user.type === UserType.A) {
        return send404(res);
    }

    const {subject, body} = req.body;

    try {
        await sendMail(user, subject, body);

        return sendResponse(
            res,
            "sent email to user"
        );
    } catch (e) {
        return send500(res, e);
    }
}

export const updateUser = async (req: Request, res: Response): Promise<e.Response> => {
    const {id} = req.params;

    const user: UserDocument | null = await User.findById(id);
    if (!user) {
        return send404(res);
    }

    const data: UserDocument = req.body;

    try {
        user.displayName = user.displayName || data.displayName;
        user.gender = user.gender || data.gender;
        user.email = user.email || data.email;
        user.phoneNo = user.phoneNo || data.phoneNo;
        user.password = user.password || data.password;

        await user.save();

        const success = {
            id: user.id,
            type : user.type,
        }

        return sendResponse(
            res,
            'user updated',
            success
        )
    } catch (e) {
        return send500(res, e);
    }

}