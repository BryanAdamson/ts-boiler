// Import your models here

import mongoose from "mongoose";
import {mongoURI} from "../utils/constants";
import {UpdateResult} from "mongodb";
import Driver from "../models/Driver";

mongoose.connect(mongoURI, {});

export async function up (): Promise<UpdateResult<Document>>{
    return Driver.updateMany(
        {
            balance: {$exists: false},
        },
        [
            {
                $set: {
                    balance: 0.00
                }
            }
        ],
        {
            multi: true
        }
    );
}

export async function down (): Promise<UpdateResult<Document>> {
    return Driver.updateMany(
        {
            balance: {$exists: true},
        },
        [
            {
                $unset: "balance"
            }
        ],
        {
            multi: true
        }
    );
}
