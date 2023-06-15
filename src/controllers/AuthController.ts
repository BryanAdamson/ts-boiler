import e, { Request, Response } from "express"
import {send401, send404, send500, sendError, sendResponse} from "./BaseController";
import bcrypt from "bcrypt";
import User, {UserDocument} from "../models/User";
import {generateUserJWT, sendMail} from "../utils/helpers";
import jwt, {JwtPayload} from "jsonwebtoken";
import {googleClientId, googleClientSecret, jwtSecret} from "../utils/constants";
import {LoginTicket, OAuth2Client, TokenPayload} from "google-auth-library";
import Customer from "../models/Customer";
import Driver from "../models/Driver";



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

export const signInWithGoogle = async (req: Request, res: Response): Promise<e.Response> => {
    const {profileId} = req.body;

    let user: UserDocument | null = await User.findOne({googleId: profileId});
    if (!user) {
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
    const {profileId, type} = req.body;

    let user: UserDocument | null = await User.findOne({googleId: profileId});
    if (user) {
        return send401(res);
    }

    const google: OAuth2Client = new OAuth2Client(googleClientId, googleClientSecret);

    const googleUser: LoginTicket = await google.verifyIdToken({
        idToken: profileId,
        audience: googleClientId,
    });

    const googleUserPayload: TokenPayload | undefined = googleUser.getPayload();
    if (!googleUserPayload) {
        return send401(res);
    }

    user = await User.findOne({email: googleUserPayload.email}, ["type"]);
    if (user) {
        return send401(res);
    }

    try {
        user = await User.create({
            email: googleUserPayload.email,
            googleId: profileId,
            displayName: googleUserPayload.email,
            type: type || "customer",
        });

        type === "driver" ? await Driver.create({user: user.id}) : await Customer.create({user: user.id});

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
        user = await User.create(data);

        data.type === "driver" ? await Driver.create({user: user.id}) : await Customer.create({user: user.id});

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
    const { email, redirectUrl } = req.body ;

    const user: UserDocument | null = await User.findOne({email});
    if (!user) {
        return send404(res);
    }
    if (user.googleId) {
        return sendError(
            res,
            "user has google authentication",
            null,
            400
        )
    }

    const resetToken: string = generateUserJWT(user, '15 minutes');
    const url: string = redirectUrl + resetToken;


    try {
        await sendMail(user, 'Reset password', `Click <a href = '${url}'>here</a> to reset your password.`)

        return sendResponse(
            res,
            "reset email sent",
            {
                resetToken
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