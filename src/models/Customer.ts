import mongoose, {Document, ObjectId} from "mongoose";


const Schema = mongoose.Schema;

export type LocationDocument = Document & {
    address?: string;
    city?: string;
    name?: string;
    tankSize?: string;
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
            }
        }
    ],
    user: {
        type: mongoose.Types.ObjectId,
        unique: true,
        ref: "User"
    }
},
{
    _id: false
});

const Customer = mongoose.model<CustomerDocument>("Customer", CustomerSchema);

export default Customer;