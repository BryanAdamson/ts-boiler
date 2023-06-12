import {Entity, ObjectIdColumn, ObjectId, Column, BaseEntity, BeforeInsert, AfterInsert} from "typeorm"
import UserType from "../enums/UserTypes";
import bcrypt from "bcrypt";

@Entity("users")
export default class User extends BaseEntity {
    @ObjectIdColumn()
    id: ObjectId

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({
        default: UserType.R,
        type: "enum",
        enum: UserType,
    })
    type: UserType

    @BeforeInsert()
    setPassword(): void {
        this.password = bcrypt.hashSync(this.password, 13)
    }

    @AfterInsert()
    getPassword(): string {
        return this.password as string
    }
}
