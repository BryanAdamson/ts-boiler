import e, {Request, Response} from "express";
import Driver, {DriverDocument} from "../models/Driver";
import {UserDocument} from "../models/User";
import {sendResponse} from "./BaseController";
import {aquayarPercentage} from "../utils/constants";

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