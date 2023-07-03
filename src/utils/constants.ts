import dotenv from "dotenv";
import * as process from "process";
dotenv.config()

export const jwtSecret: string = "HiReMeInCiiCNiwxnowd8*83eu*8239U#*(#*d" +
    "yw155393nn2moo9qncow8jjd88wdnb dix7727&Ddui2&&@DUH8&8whdxO88@SVB&@*" +
    "&&^@!I&&eibd7@bdId87bx@Eiu(@H82ICDUHiq7chwuhHireMeIsAmazing}dU@Iu78" +
    "lipd]63882$@*(@&*W)BryanRocksJ*#*DJ#(#(jsiiwoqhoxUDHHDW@**DId2q0c9j"


export const cookieSecret: string = "HiReMeInCiiCNiwxnowd8*83eu*8239U#*(#*d" +
    "yw155393nn2moo9qncow8jjd88wdnb dix7727&Ddui2&&@DUH8&8whdxO88@SVB&@*" +
    "&&^@!I&&eibd7@bdId87bx@Eiu(@H82ICDUHiq7chwuhHireMeIsAmazing}dU@Iu78" +
    "lipd]63882$@*(@&*W)BryanRocksJ*#*DJ#(#(jsiiwoqhoxUDHHDW@**DId2q0c9j"


export const port: number = (process.env.PORT || 3000) as number;


export const mongoURI: string = process.env.MIGRATE_MONGO_URI as string;


export const smtpHost: any = process.env.SMTP_HOST;
export const smtpPort: any =  process.env.SMTP_PORT;
export const secure: any =  process.env.SMTP_TLS === 'yes';
export const smtpUser: string | undefined = process.env.SMTP_USERNAME;
export const smtpPass: string | undefined = process.env.SMTP_PASSWORD;
export const smtpSender: string | undefined = process.env.SMTP_SENDER;


export const twilioAccountSid: string | undefined = process.env.TWILIO_ACCOUNT_SID;
export const twilioAuthToken: string | undefined = process.env.TWILIO_AUTH_TOKEN;
export const twilioNumber: string | undefined = process.env.TWILIO_PHONE_NUMBER;


export const aquayarPercentage: number = process.env.AQUAYAR_PERCENTAGE as unknown as number


export const cloudinaryCloudName: string | undefined = process.env.CLOUDINARY_CLOUD_NAME;
export const cloudinaryApiKey: string | undefined = process.env.CLOUDINARY_API_KEY;
export const cloudinaryApiSecret: string | undefined = process.env.CLOUDINARY_API_SECRET;


export const paystackSecretKey: string | undefined = process.env.PAYSTACK_SECRET_KEY
export const paystackPublicKey: string | undefined = process.env.PAYSTACK_PUBLIC_KEY