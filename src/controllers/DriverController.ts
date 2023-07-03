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

export const uploadKycLicense = async (req: Request, res: Response): Promise<e.Response> => {
    if (!req.file) {
        return sendError(res);
    }

    const driver: DriverDocument | null = await Driver.findOne({user: (req.user as UserDocument).id});
    if (!driver) {
        return send403(res);
    }

    try {
        const upload: cloudinary.UploadApiResponse = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: "drivers/"+ driver?.id +"/kyc",
            filename_override: "license",
            use_filename: true
        });

        driver.kyc.license = upload.secure_url;
        await driver.save()

        return sendResponse(
            res,
            'license uploaded',
            {
                licenseUrl: upload.secure_url
            }
        )
    } catch (e) {
        return sendError(res, e);
    }
}

export const uploadKycIdentification = async (req: Request, res: Response): Promise<e.Response> => {
    if (!req.file) {
        return sendError(res);
    }

    const driver: DriverDocument | null = await Driver.findOne({user: (req.user as UserDocument).id});
    if (!driver) {
        return send403(res);
    }

    try {
        const upload: cloudinary.UploadApiResponse = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: "drivers/"+ driver?.id,
            filename_override: "identification",
            use_filename: true
        });

        driver.kyc.identification = upload.secure_url;
        await driver.save()

        return sendResponse(
            res,
            'identification uploaded',
            {
                identificationUrl: upload.secure_url
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