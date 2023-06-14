import dotenv from "dotenv";
dotenv.config()

export const jwtSecret: string = "HiReMeInCiiCNiwxnowd8*83eu*8239U#*(#*d" +
    "yw155393nn2moo9qncow8jjd88wdnb dix7727&Ddui2&&@DUH8&8whdxO88@SVB&@*" +
    "&&^@!I&&eibd7@bdId87bx@Eiu(@H82ICDUHiq7chwuhHireMeIsAmazing}dU@Iu78" +
    "lipd]63882$@*(@&*W)BryanRocksJ*#*DJ#(#(jsiiwoqhoxUDHHDW@**DId2q0c9j"

export const cookieSecret: string = "HiReMeInCiiCNiwxnowd8*83eu*8239U#*(#*d" +
    "yw155393nn2moo9qncow8jjd88wdnb dix7727&Ddui2&&@DUH8&8whdxO88@SVB&@*" +
    "&&^@!I&&eibd7@bdId87bx@Eiu(@H82ICDUHiq7chwuhHireMeIsAmazing}dU@Iu78" +
    "lipd]63882$@*(@&*W)BryanRocksJ*#*DJ#(#(jsiiwoqhoxUDHHDW@**DId2q0c9j"

export const env: string|undefined = process.env.NODE_ENV;
export const port: number = (process.env.PORT || 3000) as number;
export const mongoURI: string = process.env.MONGO_URI as string;

export const googleClientId: string = process.env.GOOGLE_CLIENT_ID as string;
export const googleClientSecret: string  = process.env.GOOGLE_CLIENT_SECRET as string;
