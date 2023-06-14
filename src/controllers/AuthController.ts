import e, { Request, Response } from "express"
import {send401, send404, send500, sendError, sendResponse} from "./BaseController";
import bcrypt from "bcrypt";
import User, {UserDocument} from "../models/User";
import {addMinutesToDate, generateRandomInt, generateUserJWT, sendMail, sendSMS} from "../utils/helpers";
import jwt, {JwtPayload} from "jsonwebtoken";
import {jwtSecret} from "../utils/constants";



export const getToken = (req: Request, res: Response): e.Response => {
    const user: Express.User | undefined = req.user;
    if (!user) {
        return send401(res);
    }

    return sendResponse(
        res,
        'login successful',
        {
            user:{
                id: (user as UserDocument).id,
                type: (user as UserDocument).type,
            },
            token: generateUserJWT(user as UserDocument)
        },
        200
    );
}

export const signIn = async (req: Request, res: Response): Promise<e.Response> => {
    const {email, password}: UserDocument = req.body;

    const user: UserDocument | null = await User.findOne({email});
    if (!user) {
        return send401(res);
    }

    const passwordsMatch: boolean = bcrypt.compareSync(password as string, user.password as string);
    if (!passwordsMatch) {
        return send401(res);
    }

    return sendResponse(
        res,
        'login successful',
        {
            user:{
                id: user.id,
                type: user.type,
            },
            token: generateUserJWT(user)
        },
        200
    );
}

export const signUp = async (req: Request, res: Response): Promise<e.Response> => {
    const data: UserDocument = req.body;

    try {
        let user: UserDocument | null = await User.findOne({
                email: data.email
            },
            ["email"]
        );

        if (user) {
            return sendError(
                res,
                "validation error",
                ["email already exists"],
                400
            )
        }

        user = await User.create(data);

        return sendResponse(
            res,
            "signup successful",
            {
                user:{
                    id: user.id,
                    type: user.type,
                },
                token: generateUserJWT(user)
            },
            201
        );
    } catch (e) {
        return send500(res, e);
    }
}

export const forgotPassword = async (req: Request, res: Response): Promise<e.Response> => {
    const { email, redirectUrl } = req.query ;

    const user: UserDocument | null = await User.findOne({email});
    if (!user) {
        return send404(res);
    }

    const token: string = generateUserJWT(user, '15 minutes');
    const url: string = redirectUrl + token;


    try {
        await sendMail(user, 'Reset password', `Click <a href = '${url}'>here</a> to reset your password.`)

        return sendResponse(
            res,
            "reset email sent",
            {
                token
            }
        );
    } catch (e) {
        return send500(res, e);
    }
}

export const resetPassword = async (req: Request, res: Response): Promise<e.Response> => {
    const { password } = req.body;
    const { token } = req.params;

    const payload: JwtPayload | string = jwt.verify(token, jwtSecret);
    if (!payload) {
        return send401(res);
    }

    const user: UserDocument | null = await User.findById((payload as UserDocument).id);
    if (!user) {
        return send401(res);
    }

    try {
        user.password = password;
        await user.save()

        return sendResponse(
            res,
            "password updated",
            {
                user:{
                    id: user.id,
                    type: user.type,
                },
                token: generateUserJWT(user)
            },
        );
    } catch (e) {
        return send500(res, e);
    }
}

export const startMobileVerification = async (req: Request, res: Response): Promise<e.Response> => {
    const user: UserDocument = req.user as UserDocument;
    const { phoneNo } = req.body;

    const code: number = generateRandomInt(1000, 9999);
    const expiration: Date = addMinutesToDate(new Date(), 5);

    try {
        user.otp = {
            code,
            expiration,
            isValid: true
        };
        user.phoneNo = phoneNo;
        await user.save();

        await sendSMS(user, "Your otp is " + code);

        return sendResponse(
            res,
            "sent OTP to user",
        );
    } catch (e) {
        return send500(res, e);
    }
}