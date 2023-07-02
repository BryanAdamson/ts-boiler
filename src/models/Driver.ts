import mongoose, {Document, ObjectId} from "mongoose";
import {isLatitude, isLongitude} from "class-validator";
import {LocationDocument} from "./User";


const Schema = mongoose.Schema;

export type DriverDocument = Document & {
    user?: ObjectId
    location?: LocationDocument;
    balance?: number;
    kyc: {
        license?: string;
        identification?: string;
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
        }
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