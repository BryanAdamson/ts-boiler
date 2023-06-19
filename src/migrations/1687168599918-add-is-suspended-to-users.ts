// Import your models here

import User from "../models/User";
import {UpdateResult} from "mongodb";
import mongoose from "mongoose";
import {mongoURI} from "../utils/constants";


mongoose.connect(mongoURI, {});

export async function up (): Promise<UpdateResult<Document>>{
    return User.updateMany(
        {
            isSuspended: {$exists: false},
        },
        [
            {
                $set: {
                    isSuspended: false
                }
            }
        ],
        {
            multi: true
        }
    );
}

export async function down (): Promise<UpdateResult<Document>> {
    return User.updateMany(
        {
            isSuspended: {$exists: true},
        },
        [
            {
                $unset: "isSuspended"
            }
        ],
        {
            multi: true
        }
    );
}
