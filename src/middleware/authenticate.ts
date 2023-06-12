import jwt, {JwtPayload} from 'jsonwebtoken';
import e, { Request, Response, NextFunction } from 'express';
import Controller from "../controllers/Controller";
import {jwtSecret} from "../utils/constants";


const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<e.Response|void> => {
    const controller: Controller = new Controller();

    const token: string|undefined = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return controller.send401(res);
    }

    const payload: JwtPayload | string = jwt.verify(token, jwtSecret);
    if (!payload) {
        return controller.send401(res);
    }

    return next();
};

export default authenticate;