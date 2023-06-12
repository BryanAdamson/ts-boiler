import User from "./User";
import {Entity} from "typeorm";

@Entity("riders")
export default class Rider extends User {
}