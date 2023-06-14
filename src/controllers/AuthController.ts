import e, { Request, Response } from "express"
import {send401, send500, sendError, sendResponse} from "./BaseController";
import bcrypt from "bcrypt";
import User, {UserDocument} from "../models/User";
import {generateUserJWT} from "../utils/helpers";



export const getToken = (req: Request, res: Response) => {
    const user: Express.User | undefined = req.user;
    console.log(user)

    if (!user) {
        return send401(res);
    }

    const token: string = generateUserJWT(user as UserDocument);

    return sendResponse(
        res,
        'login successful.',
        {
            user:{
                id: (user as UserDocument).id,
                type: (user as UserDocument).type,
            },
            token
        },
        200
    );
}

export const signIn = async (req: Request, res: Response) => {
    const {email, password}: UserDocument = req.body;

    const user: UserDocument | null = await User.findOne({email});
    if (!user) {
        return send401(res);
    }

    const passwordsMatch: boolean = bcrypt.compareSync(password as string, user.password as string);
    if (!passwordsMatch) {
        return send401(res);
    }

    const token: string = generateUserJWT(user);

    return sendResponse(
        res,
        'login successful.',
        {
            user:{
                id: user.id,
                type: user.type,
            },
            token
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
                "validation error.",
                ["email already exists."],
                400
            )
        }

        user = await User.create(data);

        const token: string = generateUserJWT(user);

        return sendResponse(
            res,
            data.type + ' created.',
            {
                user:{
                    id: user.id,
                    type: user.type,
                },
                token
            },
            201
        );
    } catch (e) {
        return send500(res, e);
    }
}