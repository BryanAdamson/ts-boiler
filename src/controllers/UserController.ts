import e, {Request, Response} from "express";
import {send404, send500, sendResponse} from "./BaseController";
import User, {UserDocument} from "../models/User";
import {CustomerDocument, LocationDocument} from "../models/Customer";
import Customer from "../models/Customer";

export const getMe = (req: Request, res: Response): e.Response => {
    const user: UserDocument = req.user as UserDocument;

    const success = {
        id: user.id,
        displayName: user.displayName,
        email : user.email,
        gender : user.gender,
        type : user.type,
        phoneNo : user.phoneNo,
    }

    return sendResponse(
        res,
        'user fetched.',
        success
    )
}

export const updateMyInfo = async (req: Request, res: Response): Promise<e.Response> => {
    const data: UserDocument = req.body;

    const user: UserDocument | null = await User.findById((req.user as UserDocument).id);
    if (!user) {
        return send404(res);
    }

    try {
        user.displayName = user.displayName || data.displayName;
        user.gender = user.gender || data.gender;

        await user.save();
        const success = {
            id: user.id,
            type : user.type,
        }

        return sendResponse(
            res,
            'user updated.',
            success
        )
    } catch (e) {
        return send500(res, e);
    }

}

export const addMyLocations = async (req: Request, res: Response): Promise<e.Response> => {
    const data: LocationDocument = req.body;

    const user: UserDocument = req.user as UserDocument;
    const customer: CustomerDocument | null = await Customer.findOne({user: user.id});
    if (!customer) {
        return send404(res);
    }

    try {
        customer.locations?.push(data)
        await customer.save()

        const success = {
            user: {
                id: user.id,
                type: user.type
            },
            locations: customer.locations
        }

        return sendResponse(
            res,
            'locations updated.',
            success
        )
    } catch (e) {
        return send500(res, e);
    }
}

export const getUser = async (req: Request, res: Response): Promise<e.Response> => {
    const user: UserDocument | null = await User.findById(req.params.id);
    if (!user) {
        return send404(res);
    }

    const success = {
        id: user.id,
        displayName: user.displayName,
        email : user.email,
        gender : user.gender,
        type : user.type,
        phoneNo : user.phoneNo,
    }

    return sendResponse(
        res,
        'user fetched.',
        success
    )
}