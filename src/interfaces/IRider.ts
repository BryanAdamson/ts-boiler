import UserType from "../enums/UserTypes";

export default interface IRider {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    type?: UserType
}