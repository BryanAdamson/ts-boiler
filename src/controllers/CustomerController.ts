import e, {Request, Response} from "express";
import Customer, {CustomerDocument} from "../models/Customer";
import {UserDocument, LocationDocument} from "../models/User";
import {send404, send500, sendResponse} from "./BaseController";

export const addMyLocations = async (req: Request, res: Response): Promise<e.Response> => {
    const data: LocationDocument = req.body;

    const user: UserDocument = req.user as UserDocument;

    const customer: CustomerDocument | null = await Customer.findOne({user: user.id});
    if (!customer) {
        return send404(res);
    }

    try {
        customer.locations?.push(data)
        await customer.save()

        return sendResponse(
            res,
            'location added',
            {
                id: user.id,
                type: user.type,
                locations: customer.locations
            },
            201
        )
    } catch (e) {
        return send500(res, e);
    }
}

export const getMyLocations = async (req: Request, res: Response): Promise<e.Response> => {
    const user: UserDocument = req.user as UserDocument;

    const customer: CustomerDocument | null = await Customer.findOne({user: user.id});
    if (!customer) {
        return send404(res);
    }

    return sendResponse(
        res,
        'locations fetched',
        {
            id: user.id,
            type: user.type,
            locations: customer.locations
        }
    );
}

export const updateMyLocation = async (req: Request, res: Response): Promise<e.Response> => {
    const data: LocationDocument = req.body;

    const {locationId} = req.params;

    const user: UserDocument = req.user as UserDocument;

    const customer: CustomerDocument | null = await Customer.findOne({user: user.id, "locations._id": locationId});
    if (!customer || !customer.locations) {
        return send404(res);
    }

    const index: number | undefined = customer.locations.findIndex((obj: LocationDocument) => obj._id == locationId);
    if (index === -1) {
        return send404(res);
    }

    const location: LocationDocument = customer.locations[index];

    const temp = {
        _id: location._id,
        address: data.address || location.address,
        city: data.city || location.city,
        name: data.name || location.name,
        tankSize: data.tankSize || location.tankSize,
        latitude: data.latitude || location.latitude,
        longitude: data.longitude || location.longitude
    }

    try {
        customer.locations[index] = temp as LocationDocument;
        await customer.save();

        return sendResponse(
            res,
            'location updated',
            {
                id: user.id,
                type: user.type,
                locations: customer.locations
            }
        )
    } catch (e) {
        return send500(res, e);
    }
}