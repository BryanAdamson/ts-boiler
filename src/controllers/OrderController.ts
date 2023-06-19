import e, {Request, Response} from "express";
import Order, {OrderDocument} from "../models/Order";
import {send404, send500, sendError, sendResponse} from "./BaseController";
import Driver, {DriverDocument} from "../models/Driver";
import {UserDocument} from "../models/User";
import OrderStatus from "../enums/OrderStatus";

export const createOrder = async (req: Request, res: Response): Promise<e.Response> => {
    const data: OrderDocument = req.body;

    const driver: DriverDocument | null = await Driver.findOne({user: data.driver});
    if (!driver) {
        return sendError(
            res,
            "validation error",
            {
                driver: {
                    type: "fields",
                    value: data.driver,
                    msg: "driver is invalid",
                    path: "driver",
                    location: "body"
                }
            }
        );
    }

    try {
        const order: OrderDocument = await Order.create({
            customer: {
                id: (req.user as UserDocument).id,
                longitude: (data as any).longitude,
                latitude: (data as any).latitude,
                friendPhone: (data as any).friendPhone
            },
            driver: data.driver,
            size: data.size,
            price: data.price,
            distance: data.distance,
            type: data.type || "personal",
        });

        return sendResponse(
            res,
            "order created",
            {
                id: order.id,
                customer: order.customer?.id,
                driver: order.driver,
                size: order.size,
                price: order.price + "NGN",
                distance: order.distance + "KM",
            }
        )

    } catch (e) {
        return send500(res, e);
    }
}

export const getOrder = async (req: Request, res: Response): Promise<e.Response> => {
    const order: OrderDocument | null = await Order.findById(req.params.orderId);
    if (!order) {
        return send404(res);
    }

    try {
        return sendResponse(
            res,
            "order fetched",
            order
        )
    } catch (e) {
        return send500(res, e);
    }
}

export const acceptOrder = async (req: Request, res: Response): Promise<e.Response> => {
    const order: OrderDocument | null = await Order.findById(req.params.orderId);
    if (!order || order.status !== OrderStatus.PE) {
        return send404(res);
    }

    try {
        order.status = OrderStatus.ON;
        await order.save();

        return sendResponse(
            res,
            "order accepted"
        )
    } catch (e) {
        return send500(res, e);
    }
}

export const rejectOrder = async (req: Request, res: Response): Promise<e.Response> => {
    const order: OrderDocument | null = await Order.findById(req.params.orderId);
    if (!order || order.status !== OrderStatus.PE) {
        return send404(res);
    }

    try {
        order.status = OrderStatus.RE;
        await order.save();

        return sendResponse(
            res,
            "order rejected"
        )
    } catch (e) {
        return send500(res, e);
    }
}

export const cancelOrder = async (req: Request, res: Response): Promise<e.Response> => {
    const order: OrderDocument | null = await Order.findById(req.params.orderId);
    if (!order || order.status === OrderStatus.CO || order.status === OrderStatus.RE) {
        return send404(res);
    }

    try {
        order.status = OrderStatus.CA;
        await order.save();

        return sendResponse(
            res,
            "order canceled"
        )
    } catch (e) {
        return send500(res, e);
    }
}

export const completeOrder = async (req: Request, res: Response): Promise<e.Response> => {
    const order: OrderDocument | null = await Order.findById(req.params.orderId);
    if (!order || order.status !== OrderStatus.ON) {
        return send404(res);
    }

    try {
        order.status = OrderStatus.CO;
        await order.save();

        return sendResponse(
            res,
            "order canceled"
        )
    } catch (e) {
        return send500(res, e);
    }
}