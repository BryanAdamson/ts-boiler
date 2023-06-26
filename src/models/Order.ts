import mongoose, {Document, ObjectId} from "mongoose";
import OrderStatus from "../enums/OrderStatus";
import {isLatitude, isLongitude} from "class-validator";

const Schema = mongoose.Schema;

export type OrderDocument = Document & {
    customer?: {
        id: ObjectId;
        longitude: string;
        latitude: string;
    };
    driver?: ObjectId;
    size?: string;
    price?: number;
    distance?: string;
    status?: OrderStatus;
};

const OrderSchema = new Schema<OrderDocument>({
    customer: {
        id: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "User"
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
        },
    },
    driver: {
        type: mongoose.Types.ObjectId,
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
});

OrderSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   delete ret._id  }
});

const Order = mongoose.model<OrderDocument>("Order", OrderSchema);

export default Order;