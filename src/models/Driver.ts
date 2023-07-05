import mongoose, {Document, ObjectId} from "mongoose";
import {isLatitude, isLongitude} from "class-validator";
import {LocationDocument} from "./User";


const Schema = mongoose.Schema;

export type DriverDocument = Document & {
    user?: ObjectId
    location?: LocationDocument;
    balance?: number;
    tankerSize?: number;
    licenseNumber?: string;
    kyc: {
        license?: string;
        identification?: string;
        selfie?: string;
        interior?: string;
        exterior?: string;
        pump?: string;
    }
};

const DriverSchema = new Schema<DriverDocument>({
    location: {
        longitude: {
            type: String,
            required: false,
            validate: [
                (v: string) => {
                    return isLongitude(v);
                },
                "invalid longitude"
            ],
        },
        latitude: {
            type: String,
            required: false,
            validate: [
                (v: string) => {
                    return isLatitude(v);
                },
                "invalid latitude"
            ],
        }
    },
    balance: {
        type: Number,
        required: false,
        default: 0.00
    },
    kyc: {
        license: {
            type: String,
            required: false,
        },
        identification: {
            type: String,
            required: false,
        },
        selfie: {
            type: String,
            required: false,
        },
        interior: {
            type: String,
            required: false,
        },
        exterior: {
            type: String,
            required: false,
        },
        pump: {
            type: String,
            required: false,
        },
    },
    licenseNumber: {
        type: String,
        allowNull: true,
        default: null
    },
    tankerSize: {
        type: String,
        allowNull: true,
        default: null
    },
    user: {
        type: mongoose.Types.ObjectId,
        unique: true,
        required: true,
        ref: "User"
    },
});

const Driver = mongoose.model<DriverDocument>("Driver", DriverSchema);

export default Driver;