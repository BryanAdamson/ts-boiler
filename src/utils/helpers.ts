import {UserDocument} from "../models/User";
import jwt from "jsonwebtoken";
import {jwtSecret} from "./constants";

export const generateUserJWT = (user: UserDocument): string => {
    return jwt.sign(
        {
            id: user.id,
            user_type: user.type,
        },
        jwtSecret,
        {
            expiresIn: '1000 days',
        }
    );
}