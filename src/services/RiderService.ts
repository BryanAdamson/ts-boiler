import IRider from "../interfaces/IRider";
import Rider from "../entities/Rider";
import {DeepPartial, FindOptionsSelect, FindOptionsWhere, ObjectId} from "typeorm";
import User from "../entities/User";
import {isArray, isObject} from "class-validator";

class RiderService {
    public async create(data: IRider): Promise<Rider> {
        try {
            await User.create(data as DeepPartial<User>).save();

            return await Rider.create(data as DeepPartial<Rider>).save();
        } catch (e) {
            throw new Error(e);
        }
    }

    public async find(query?: object | object[] | ObjectId, fields?: string[] | undefined): Promise<Rider | Rider[] | null> {
        fields?.push("id");

        let rider: Rider | Rider[] | null = await Rider.find({
            select: fields as FindOptionsSelect<Rider> || ["id"]
        });
        if (query) {
            if (isObject(query)){
                rider = await Rider.findOne({
                    where: [
                        query as FindOptionsWhere<Rider>
                    ],
                    select: fields as FindOptionsSelect<Rider> || ["id"]
                });
            }
            if (isArray(query)){
                rider = await Rider.find({
                    where: query as FindOptionsWhere<Rider>,
                    select: fields as FindOptionsSelect<Rider> || ["id"]
                });
            }
            else {
                rider = await Rider.findOne({
                    where: {
                        id: query as ObjectId
                    },
                    select: fields as FindOptionsSelect<Rider> || ["id"]
                });
            }
        }

        return rider;
    }
}


export default new RiderService();