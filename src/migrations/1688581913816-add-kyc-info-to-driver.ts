// Import your models here

import mongoose from "mongoose";
import {mongoURI} from "../utils/constants";
import {UpdateResult} from "mongodb";
import Driver from "../models/Driver";

mongoose.connect(mongoURI, {});

export async function up (): Promise<UpdateResult<Document>>{
    return Driver.updateMany(
        {
            "licenseNumber": {$exists: false},
            "tankerSize": {$exists: false},
            "kyc.selfie": {$exists: false},
            "kyc.interior": {$exists: false},
            "kyc.exterior": {$exists: false},
            "kyc.pump": {$exists: false},
        },
        [
            {
                $set: {
                    "licenseNumber": "test.license.number",
                    "tankerSize": 2500,
                    "kyc.selfie": "test.link",
                    "kyc.interior": "test.link",
                    "kyc.exterior": "test.link",
                    "kyc.pump": "test.link",
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
            "licenseNumber": {$exists: true},
            "tankerSize": {$exists: true},
            "kyc.selfie": {$exists: true},
            "kyc.interior": {$exists: true},
            "kyc.exterior": {$exists: true},
            "kyc.pump": {$exists: true},
        },
        [
            {
               $unset: "licenseNumber"
            },
            {
                $unset: "tankerSize"
            },
            {
                $unset: "kyc.selfie"
            },
            {
                $unset: "kyc.interior"
            },
            {
                $unset: "kyc.exterior"
            }
        ],
        {
            multi: true
        }
    );
}
