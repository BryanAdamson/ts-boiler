import mongoose, {Document, ObjectId} from "mongoose";
import {isLatitude, isLongitude} from "class-validator";


const Schema = mongoose.Schema;

export type LocationDocument = Document & {
    address?: string;
    city?: string;
    name?: string;
    tankSize?: string;
    longitude?: string
    latitude?: string
};

export type CustomerDocument = Document & {
    user?: ObjectId
    locations?: LocationDocument[];
};

const CustomerSchema = new Schema<CustomerDocument>({
    locations: [
        {
            address: {
                type: String,
                required: true
            },
            city: {
                type: String,
                allowNull: false,
            },
            name: {
                type: String,
                allowNull: true,
                default: null
            },
            tankSize: {
                type: String,
                allowNull: true,
                default: null
            },
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
        }
    ],
    user: {
        type: mongoose.Types.ObjectId,
        unique: true,
        ref: "User"
    }
});

const Customer = mongoose.model<CustomerDocument>("Customer", CustomerSchema);

export default Customer;