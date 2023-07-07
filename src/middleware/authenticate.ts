import jwt, {JwtPayload} from 'jsonwebtoken';
import e, { Request, Response, NextFunction } from 'express';
import {send401} from "../controllers/ResponseController";
import {jwtSecret} from "../utils/constants";
import User, {UserDocument} from "../models/User";


const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<e.Response|void> => {
    const token: string | undefined = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return send401(res);
    }

    let payload: JwtPayload | string;
    try {
        payload = jwt.verify(token, jwtSecret);
        if (!payload || (payload as JwtPayload).iss !== "AquayarAuthDev") {
            return send401(res);
        }
    } catch (e) {
        return send401(res);
    }

    const user: UserDocument | null = await User.findById((payload as UserDocument).id);
    if (!user) {
        return send401(res);
    }

    req.user = user;
    return next();
};

export default authenticate;