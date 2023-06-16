import mongoose, {Document, ObjectId} from "mongoose";
import OrderStatus from "../enums/OrderStatus";
import OrderType from "../enums/OrderType";
import {isLatitude, isLongitude, isMobilePhone} from "class-validator";

const Schema = mongoose.Schema;

export type OrderDocument = Document & {
    customer?: {
        id: ObjectId;
        deliveryLocation: string[];
    };
    driver?: ObjectId;
    size?: string;
    price?: string;
    distance?: string;
    status?: OrderStatus;
    type?: OrderType;
};

const OrderSchema = new Schema<OrderDocument>({
    customer: {
        id: {
            type: mongoose.Types.ObjectId,
            unique: true,
            required: true,
            ref: "User"
        },
        deliveryLocation: {
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
        },
        friendPhone: {
            type: String,
            allowNull: true,
            default: null,
            validate: [
                (v: string) => {
                    return isMobilePhone(v, undefined, {strictMode: true});
                },
                "invalid phoneNo"
            ],
        }
    },
    driver: {
        type: mongoose.Types.ObjectId,
        unique: true,
        required: true,
        ref: "User"
    },
    size: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    distance: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: OrderStatus,
        default: OrderStatus.PE
    },
    type: {
        type: String,
        enum: OrderType,
        default: OrderType.P
    }
});

const Order = mongoose.model<OrderDocument>("Order", OrderSchema);

export default Order;