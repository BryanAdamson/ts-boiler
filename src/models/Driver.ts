import mongoose, {Document, ObjectId} from "mongoose";
import {isLatitude, isLongitude} from "class-validator";


const Schema = mongoose.Schema;

export type DLocationDocument = Document & {
    address?: string;
    city?: string;
    name?: string;
    tankSize?: string;
    longitude?: string
    latitude?: string
};

export type DriverDocument = Document & {
    user?: ObjectId
    location?: DLocationDocument;
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
    user: {
        type: mongoose.Types.ObjectId,
        unique: true,
        ref: "User"
    }
});

const Driver = mongoose.model<DriverDocument>("Driver", DriverSchema);

export default Driver;