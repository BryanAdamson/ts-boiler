import mongoose, {Document, ObjectId} from "mongoose";
import {isLatitude, isLongitude} from "class-validator";
import {LocationDocument} from "./User";


const Schema = mongoose.Schema;

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
                required: true,
                validate: [
                    (v: string) => {
                        return isLongitude(v);
                    },
                    "invalid longitude"
                ],
            },
            latitude: {
                type: String,
                required: true,
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
        required: true,
        ref: "User"
    }
});

const Customer = mongoose.model<CustomerDocument>("Customer", CustomerSchema);

export default Customer;