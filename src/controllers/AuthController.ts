import e, { Request, Response } from "express"
import {send401, send403, send404, send500, sendError, sendResponse} from "./ResponseController";
import bcrypt from "bcrypt";
import User, {UserDocument} from "../models/User";
import {addMinutesToDate, generateRandomInt, generateUserJWT, sendSMS} from "../utils/helpers";
import jwt, {JwtPayload} from "jsonwebtoken";
import {jwtSecret} from "../utils/constants";


export const signInWithGoogle = async (req: Request, res: Response): Promise<e.Response> => {
    const {profileId} = req.body;

    let user: UserDocument | null = await User.findOne({googleId: profileId});
    if (!user) {
        return send401(res);
    }
    if (user.isSuspended) {
        return send403(res)
    }

    return sendResponse(
        res,
        'signin successful',
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

export const signIn = async (req: Request, res: Response): Promise<e.Response> => {
    const {email, password}: UserDocument = req.body;

    const user: UserDocument | null = await User.findOne({email});
    if (!user) {
        return send401(res);
    }
    if (user.isSuspended) {
        return send403(res)
    }

    const passwordsMatch: boolean = bcrypt.compareSync(password as string, user.password as string);
    if (!passwordsMatch) {
        return send401(res);
    }

    return sendResponse(
        res,
        'signin successful',
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

export const signUpWithGoogle = async (req: Request, res: Response): Promise<e.Response> => {
    const {email, displayName, profileId, type} = req.body;

    let user: UserDocument | null = await User.findOne({googleId: profileId});
    if (user) {
        return send401(res);
    }

    user = await User.findOne({email}, ["type"]);
    if (user) {
        return send401(res);
    }

    try {
        user = await User.create({
            email: email,
            googleId: profileId,
            displayName: displayName,
            type: type || "customer",
        });

        return sendResponse(
            res,
            'signup successful',
            {
                user:{
                    id: user.id,
                    type: user.type,
                },
                token: generateUserJWT(user)
            },
            200
        );
    } catch (e) {
        return send500(res, e);
    }


}

export const signUp = async (req: Request, res: Response): Promise<e.Response> => {
    const data: UserDocument = req.body;

    let user: UserDocument | null = await User.findOne({
            email: data.email
        },
        ["email"]
    );

    if (user) {
        return sendError(
            res,
            undefined,
            {
                email: {
                    type: "field",
                    msg: "email is taken",
                    path: "email",
                    location: "body"
                }
            }
        )
    }

    try {
        user = await User.create({
            ...data
        });

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
    const { email } = req.body;

    const user: UserDocument | null = await User.findOne({email}, ["phoneNo", "otp"]);
    if (!user || !user.phoneNo) {
        return send404(res);
    }
    if (user.isSuspended) {
        return send403(res)
    }
    if (user.googleId) {
        return sendError(
            res,
            "user has google authentication",
            null,
            400
        )
    }

    const code: string = generateRandomInt(1000, 9999);
    const expiration: Date = addMinutesToDate(new Date(), 15);

    try {
        user.otp = {
            code,
            expiration,
            isValid: true
        };
        await user.save();

        await sendSMS(user, "Your OTP is " + code);

        return sendResponse(
            res,
            "sent OTP to user"
        );
    } catch (e) {
        return send500(res, e);
    }
}

export const verifyOTP = async (req: Request, res: Response): Promise<e.Response> => {
    const {otp} = req.body;

    const user: UserDocument | null = await User.findOne({"otp.code": otp});

    if (!user?.otp?.isValid || !user) {
        return sendError(res);
    }
    if (user?.otp?.expiration.getTime() < new Date().getTime()) {
        return sendError(
            res,
            "validation error",
            {
                otp: {
                    type: "field",
                    value: otp,
                    msg: "expired",
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
            "verified OTP",
            {
                resetToken: generateUserJWT(user)
            }
        );
    } catch (e) {
        return send500(res, e);
    }
}

export const resetPassword = async (req: Request, res: Response): Promise<e.Response> => {
    const { password } = req.body;
    const { token } = req.params;

    let payload: JwtPayload | string;
    try {
        payload= jwt.verify(token, jwtSecret);
        if (!payload) {
            return send401(res);
        }
    } catch (e) {
        return sendError(
            res,
            undefined,
            {
                resetToken: {
                    type: "parameter",
                    msg: "resetToken is invalid",
                    path: "resetToken",
                    location: "path"
                }
            }
        );
    }

    const user: UserDocument | null = await User.findById((payload as UserDocument).id);
    if (!user) {
        return send401(res);
    }
    if (user.isSuspended) {
        return send403(res)
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