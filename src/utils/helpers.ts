import {UserDocument} from "../models/User";
import jwt from "jsonwebtoken";
import {
    jwtSecret,
    secure,
    smtpHost,
    smtpPass,
    smtpPort,
    smtpSender,
    smtpUser,
    twilioAccountSid,
    twilioAuthToken,
    twilioNumber
} from "./constants";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { Twilio } from "twilio";
import {MessageInstance} from "twilio/lib/rest/api/v2010/account/message";


export const generateUserJWT = (user: UserDocument, duration?: string): string => {
    return jwt.sign(
        {
            id: user.id,
            user_type: user.type,
        },
        jwtSecret,
        {
            expiresIn: duration || '1000 days',
        }
    );
}

export const sendMail = async (user: UserDocument, subject: string, body: string) => {
    try {
        const transporter: Mail<SMTPTransport.SentMessageInfo> = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: secure,
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        return await transporter.sendMail({
            from: `"aquayar" ${smtpSender}`,
            to: user.email,
            subject: subject,
            html: body,
        });
    } catch (e) {
        throw e;
    }
}

export const sendSMS = async (user: UserDocument, body: string) => {
    const client: Twilio = new Twilio(twilioAccountSid, twilioAuthToken);

    try {
        const message: MessageInstance = await client.messages
            .create({
                from: twilioNumber,
                to: user.phoneNo as string,
                body: body,
            })

        console.log(message);
        return message;
    } catch (e) {
        throw e;
    }
}


export const generateRandomInt = (min: number, max: number): string => {
    return (Math.floor(Math.random() * (max - min + 1) ) + min) + "";
}

export const addMinutesToDate = (date: Date, minutes: number): Date => {
    return new Date(date.getTime() + minutes * 60000);
}