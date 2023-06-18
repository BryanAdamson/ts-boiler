import mongoose, { Document } from "mongoose";
import UserType from "../enums/UserType";
import bcrypt from "bcrypt";
import {isEmail, isMobilePhone} from "class-validator";


const Schema = mongoose.Schema;

export type LocationDocument = Document & {
    address?: string;
    city?: string;
    name?: string;
    tankSize?: string;
    longitude?: string
    latitude?: string
};

export type UserDocument = Document & {
    displayName?: string;
    gender?: string;
    email?: string;
    phoneNo?: string;
    password?: string;
    googleId?: string;
    type?: UserType;
    token?: string;
    otp?: {
        code: string;
        expiration: Date;
        isValid: boolean;
    };
};

const UserSchema = new Schema<UserDocument>({
    displayName: {
        type: String,
        allowNull: true,
        default: null
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: [
            (v: string) => {
                return isEmail(v);
            },
            "invalid email"
        ],
        set: (v: string) => v.toLowerCase()
    },
    phoneNo: {
        type: String,
        allowNull: true,
        default: null,
        validate: [
            (v: string|null) => {
                return isMobilePhone(v, undefined, {strictMode: true}) || !v;
            },
            "invalid phoneNo"
        ],
    },
    password: {
        type: String,
        set: (v: string) => bcrypt.hashSync(v, 13)
    },
    googleId: {
        type: String,
        select: false
    },
    type: {
        type: String,
        enum: UserType,
        default: UserType.C
    },
    gender: {
        type: String,
        enum: ["male", "female", null],
        allowNull: true,
        default: null
    },
    otp: {
        code: {
            type: String,
            default: "****",
            minLength: 4,
            maxLength: 4,
            required: true
        },
        expiration: {
            type: Date,
            default: new Date().getTime(),
            allowNull: false,
        },
        isValid: {
            type: Boolean,
            allowNull: false,
            default: false
        }
    }
});

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;