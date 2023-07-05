import e, {Request, Response} from "express";
import Driver, {DriverDocument} from "../models/Driver";
import {UserDocument} from "../models/User";
import {send403, send404, send500, sendError, sendResponse} from "./BaseController";
import {aquayarPercentage} from "../utils/constants";
import cloudinary from "../configs/Cloudinary";
import paystack from "../configs/Paystack";
import Paystack from "paystack";

export const getBalances = async (req: Request, res: Response): Promise<e.Response> => {
    const driver: DriverDocument | null = await Driver.findOne({user: (req.user as UserDocument).id});

    const debitBalance: number = (driver?.balance as number) * (aquayarPercentage/100);

    const availableBalance: number = (driver?.balance as number) - debitBalance;

    return sendResponse(
        res,
        'balance fetched',
        {
            debitBalance,
            availableBalance
        }
    )
}

export const uploadKyc = async (req: Request, res: Response): Promise<e.Response> => {
    if (!req.file) {
        return sendError(res);
    }

    const type: string = req.params.type;

    const driver: DriverDocument | null = await Driver.findOne({user: (req.user as UserDocument).id});
    if (!driver) {
        return send403(res);
    }

    try {
        const upload: cloudinary.UploadApiResponse = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: "drivers/"+ driver?.id +"/kyc",
            filename_override: type,
            use_filename: true
        });

        if (type === "license") driver.kyc.license = upload.secure_url;
        if (type === "selfie") driver.kyc.selfie = upload.secure_url;
        if (type === "interior") driver.kyc.interior = upload.secure_url;
        if (type === "exterior") driver.kyc.exterior = upload.secure_url;
        if (type === "pump") driver.kyc.pump = upload.secure_url;

        await driver.save()

        return sendResponse(
            res,
            `${type} uploaded`,
            {
                fileUrl: upload.secure_url
            }
        )
    } catch (e) {
        return sendError(res, e);
    }
}

export const withdrawBalance = async (req: Request, res: Response): Promise<e.Response> => {
    const driver: DriverDocument | null = await Driver.findOne({user: (req.user as UserDocument).id});
    if (!driver) {
        return send404(res);
    }

    try {
        const response: Paystack.Response & { data: any[] } = await paystack.misc.list_banks({
            perPage: 10,
            page: 1
        });


        // driver.balance = 0;
        // await driver.save();

        return sendResponse(
            res,
            "good",
            response
        )
    } catch (e) {
        return send500(res, e);
    }
}