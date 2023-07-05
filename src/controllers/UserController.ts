import e, {Request, Response} from "express";
import {send404, send500, sendError, sendResponse} from "./BaseController";
import User, {UserDocument} from "../models/User";
import {addMinutesToDate, generateRandomInt, sendSMS} from "../utils/helpers";
import UserType from "../enums/UserType";
import Driver, {DriverDocument} from "../models/Driver";

export const getMe = (req: Request, res: Response): e.Response => {
    const user: UserDocument = req.user as UserDocument;

    const success = {
        id: user.id,
        displayName: user.displayName,
        email : user.email,
        gender : user.gender,
        type : user.type,
        phoneNo : !user.otp?.isValid ? user.phoneNo : null,
    }

    return sendResponse(
        res,
        'user fetched',
        success
    )
}

export const updateMyInfo = async (req: Request, res: Response): Promise<e.Response> => {
    const data: UserDocument | DriverDocument = req.body;

    const user: UserDocument | null = await User.findById((req.user as UserDocument).id);
    if (!user) {
        return send404(res);
    }

    try {
        const uDoc: UserDocument = data as UserDocument;
        user.displayName = user.displayName || uDoc.displayName;
        user.gender = user.gender || uDoc.gender;
        if (uDoc.password) user.password = uDoc.password;

        await user.save();

        if (user.type === UserType.D) {
            const dDoc: DriverDocument = data as DriverDocument;
            const driver: DriverDocument | null = await Driver.findOne({user: user.id});
            if (driver){
                driver.tankerSize = dDoc.tankerSize || driver.tankerSize;
                driver.licenseNumber = dDoc.licenseNumber || driver.licenseNumber;
            }
        }

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

export const startMobileVerification = async (req: Request, res: Response): Promise<e.Response> => {
    const user: UserDocument = req.user as UserDocument;
    const { phoneNo } = req.body;

    const code: string = generateRandomInt(1000, 9999);
    const expiration: Date = addMinutesToDate(new Date(), 5);

    try {
        user.otp = {
            code,
            expiration,
            isValid: true
        };
        user.phoneNo = phoneNo as string;
        await user.save();

        await sendSMS(user, "Your OTP is " + code);

        return sendResponse(
            res,
            "sent OTP to user",
        );
    } catch (e) {
        return send500(res, e);
    }
}

export const endMobileVerification = async (req: Request, res: Response): Promise<e.Response> => {
    const {otp} = req.body;

    const user: UserDocument | null = await User.findById((req.user as UserDocument).id);

    if (!user?.otp?.isValid) {
        return sendError(res);
    }
    if (user?.otp?.code != otp || user?.otp?.expiration.getTime() < new Date().getTime()) {
        return sendError(
            res,
            "validation error",
            {
                otp: {
                    type: "field",
                    value: otp,
                    msg: "otp is invalid or expired",
                    path: "otp",
                    location: "body"
                }
            }
        );
    }

    try {
        user.otp = {
            code: "****",
            expiration: new Date(),
            isValid: false
        };
        await user.save();

        return sendResponse(
            res,
            "user updated.",
            {
                id: user.id,
                type: user.type
            }
        );
    } catch (e) {
        return send500(res, e);
    }
}