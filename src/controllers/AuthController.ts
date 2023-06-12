import e, { Request, Response } from "express"
import Controller from "./Controller";
import IRider from "../interfaces/IRider";
import RiderService from "../services/RiderService";
import Rider from "../entities/Rider";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {jwtSecret} from "../utils/constants";
import DriverService from "../services/DriverService";


class AuthController extends Controller {

    public async signUp(req: Request, res: Response): Promise<e.Response> {
        const data: IRider = req.body;
        try {
            const user: Rider | void = data.type == "rider" ? await RiderService.create(data) : DriverService.create(data);

            return super.sendResponse(
                res,
                data.type + ' created.',
                user,
                201
            );
        } catch (e) {
            return super.send500(res, e);
        }
    }

    public async signIn(req: Request, res: Response): Promise<e.Response> {
        const {email, password, type}: IRider = req.body;

        try {
            let user: Rider | Rider[] | null | void = type == "rider" ?
                await RiderService.find({email}, ["email", "type"]) :
                DriverService.find()
            ;
            if (!user) {
                return super.send401(
                    res
                )
            }

            user = user as Rider;
            const passwordsMatch: boolean = bcrypt.compareSync(password as string, user.getPassword());
            if (!passwordsMatch) {
                return super.send401(
                    res
                );
            }

            const token: string = jwt.sign(
                {
                    id: user.id,
                    user_type: user.type,
                },
                jwtSecret,
                {
                    expiresIn: '2 days',
                }
            );

            const success = {
                id: user.id,
                email: user.email,
                token: token
            }

            return super.sendResponse(
                res,
                "login successful.",
                success
            );
        } catch (e) {
            console.log(e)
            return super.send500(res, e);
        }
    }
}

export default new AuthController();