import e, {Request, Response} from "express";
import User, {UserDocument} from "../models/User";
import UserType from "../enums/UserType";
import {send404, send500, sendResponse} from "./BaseController";
import Customer, {CustomerDocument} from "../models/Customer";
import {DriverDocument} from "../models/Driver";
import Order, {OrderDocument} from "../models/Order";

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

    let user;
    if (!(users instanceof Array)) {
        let temp: CustomerDocument | DriverDocument | null = null;
        if (users.type === UserType.C) {
            temp = await Customer.findOne({user: users.id}, ["locations"]);
        }

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
            locations: (temp as CustomerDocument).locations,
            orders: orders
        }
    }

    return sendResponse(
        res,
        "user(s) fetched",
        user || users
    );
}

export const suspendUser = async (req: Request, res: Response): Promise<e.Response> => {
    const user: UserDocument | null = await User.findById(req.params.id,["displayName", "email", "gender", "type", "phoneNo", "isSuspended"]);
    if (!user) {
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
    const user: UserDocument | null = await User.findById(req.params.id,["displayName", "email", "gender", "type", "phoneNo", "isSuspended"]);
    if (!user) {
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