import {Request, Response} from "express";
import Order, {OrderDocument} from "../models/Order";
import {send500, sendError, sendResponse} from "./BaseController";
import Driver, {DriverDocument} from "../models/Driver";

export const createOrder = async (req: Request, res: Response) => {
    const data: OrderDocument = req.body;

    const driver: DriverDocument | null = await Driver.findById(data.driver);
    if (!driver) {
        return sendError(
            res,
            "validation error",
            {
                otp: {
                    type: "field",
                    value: data.driver,
                    msg: "driver is invalid",
                    path: "driver",
                    location: "body"
                }
            }
        );
    }

    try {
        const order: OrderDocument = await Order.create(data);

        return sendResponse(
            res,
            "order created",
            {
                id: order.id,
                customer: order.customer?.id,
                driver: order.driver,
                size: order.size,
                price: order.price + "KM",
                distance: order.distance + "KM",
            }
        )

    } catch (e) {
        return send500(res, e);
    }
}